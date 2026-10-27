import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const role = request.cookies.get("cospace_user_role")?.value;
  return NextResponse.json({ isAuthenticated: role === "USER" || role === "ADMIN" });
}
