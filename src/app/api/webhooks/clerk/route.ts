import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, data } = body;

  if (type === "user.created" || type === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = data;
    const email = email_addresses?.[0]?.email_address;

    await db.user.upsert({
      where: { clerkId: id },
      update: {
        email,
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
      },
      create: {
        clerkId: id,
        email: email ?? "",
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
        roles: ["BUYER"],
        activeRole: "BUYER",
      },
    });
  }

  if (type === "user.deleted") {
    const { id } = data;
    await db.user.deleteMany({ where: { clerkId: id } });
  }

  return NextResponse.json({ success: true });
}
