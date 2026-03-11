import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "PLATFORM_ADMIN") {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const { id, type } = await request.json();

    if (type === "company") {
      await prisma.company.update({
        where: { id },
        data: { status: "APPROVED" },
      });
    } else if (type === "beautician") {
      await prisma.beautician.update({
        where: { id },
        data: { status: "APPROVED" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Approval error:", error);
    return NextResponse.json({ error: "承認に失敗しました" }, { status: 500 });
  }
}
