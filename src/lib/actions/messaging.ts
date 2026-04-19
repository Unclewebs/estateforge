"use server";

import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { revalidatePath } from "next/cache";

export async function sendMessage(receiverId: string, content: string) {
  const user = await requireUser();

  const message = await db.message.create({
    data: {
      content,
      senderId: user.id,
      receiverId,
    },
    include: { sender: true },
  });

  await pusherServer.trigger(`user-${receiverId}`, "new-message", message);

  revalidatePath("/dashboard/messages");
  return message;
}

export async function getConversations() {
  const user = await requireUser();

  const messages = await db.message.findMany({
    where: {
      OR: [{ senderId: user.id }, { receiverId: user.id }],
    },
    include: { sender: true, receiver: true },
    orderBy: { createdAt: "desc" },
  });

  // Group by conversation partner
  const conversationMap = new Map<string, typeof messages>();
  for (const msg of messages) {
    const partnerId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
    if (!conversationMap.has(partnerId)) {
      conversationMap.set(partnerId, []);
    }
    conversationMap.get(partnerId)!.push(msg);
  }

  return Array.from(conversationMap.entries()).map(([partnerId, msgs]) => ({
    partnerId,
    partner: msgs[0].senderId === user.id ? msgs[0].receiver : msgs[0].sender,
    lastMessage: msgs[0],
    unreadCount: msgs.filter((m: { receiverId: string; read: boolean }) => m.receiverId === user.id && !m.read).length,
  }));
}

export async function getMessagesWith(partnerId: string) {
  const user = await requireUser();

  // Mark as read
  await db.message.updateMany({
    where: { senderId: partnerId, receiverId: user.id, read: false },
    data: { read: true },
  });

  return db.message.findMany({
    where: {
      OR: [
        { senderId: user.id, receiverId: partnerId },
        { senderId: partnerId, receiverId: user.id },
      ],
    },
    include: { sender: true, receiver: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function sendInquiry(propertyId: string, toUserId: string, message: string) {
  const user = await requireUser();

  const inquiry = await db.inquiry.create({
    data: {
      message,
      propertyId,
      fromUserId: user.id,
      toUserId,
    },
  });

  // Also create a notification
  await db.notification.create({
    data: {
      userId: toUserId,
      title: "New Inquiry",
      message: `You received a new inquiry about a property`,
      type: "INQUIRY",
      link: `/dashboard/inquiries`,
    },
  });

  await pusherServer.trigger(`user-${toUserId}`, "new-inquiry", inquiry);

  revalidatePath("/dashboard");
  return inquiry;
}

export async function getInquiries() {
  const user = await requireUser();

  return db.inquiry.findMany({
    where: {
      OR: [{ fromUserId: user.id }, { toUserId: user.id }],
    },
    include: {
      property: true,
      fromUser: true,
      toUser: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getNotifications() {
  const user = await requireUser();
  return db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function markNotificationRead(id: string) {
  await db.notification.update({
    where: { id },
    data: { read: true },
  });
  revalidatePath("/dashboard");
}
