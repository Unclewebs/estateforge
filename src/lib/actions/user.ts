"use server";

import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(data: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  licenseNumber?: string;
  agency?: string;
}) {
  const user = await requireUser();
  const updated = await db.user.update({
    where: { id: user.id },
    data,
  });
  revalidatePath("/dashboard");
  return updated;
}

export async function switchRole(role: "BUYER" | "SELLER" | "AGENT") {
  const user = await requireUser();

  const roles = [...user.roles];
  if (!roles.includes(role)) {
    roles.push(role);
  }

  const updated = await db.user.update({
    where: { id: user.id },
    data: { activeRole: role, roles },
  });

  revalidatePath("/dashboard");
  return updated;
}

export async function addRole(role: "BUYER" | "SELLER" | "AGENT") {
  const user = await requireUser();
  if (user.roles.includes(role)) return user;

  const updated = await db.user.update({
    where: { id: user.id },
    data: { roles: { push: role } },
  });

  revalidatePath("/dashboard");
  return updated;
}
