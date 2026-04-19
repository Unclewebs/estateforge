import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ activeRole: null }, { status: 401 });
    return NextResponse.json({ activeRole: user.activeRole, roles: user.roles });
  } catch {
    return NextResponse.json({ activeRole: null }, { status: 500 });
  }
}
