import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  return user;
}

export async function syncUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const existingUser = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (existingUser) {
    return db.user.update({
      where: { clerkId: clerkUser.id },
      data: {
        email: clerkUser.emailAddresses[0]?.emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
      },
    });
  }

  return db.user.create({
    data: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
      roles: ["BUYER"],
      activeRole: "BUYER",
    },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireRole(role: string) {
  const user = await requireUser();
  if (!user.roles.includes(role as never)) throw new Error("Forbidden");
  return user;
}
