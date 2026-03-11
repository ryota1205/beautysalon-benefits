import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "PLATFORM_ADMIN") {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const { id, defaultFeePercent, minFeePercent, maxFeePercent } = await request.json();

    if (id) {
      await prisma.platformConfig.update({
        where: { id },
        data: { defaultFeePercent, minFeePercent, maxFeePercent },
      });
    } else {
      await prisma.platformConfig.create({
        data: { defaultFeePercent, minFeePercent, maxFeePercent },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Fee config update error:", error);
    return NextResponse.json({ error: "設定の保存に失敗しました" }, { status: 500 });
  }
}
