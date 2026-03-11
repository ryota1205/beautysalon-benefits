import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "BEAUTICIAN") {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const body = await request.json();
    const { date, startTime, endTime, locationType, locationName, beauticianId } = body;

    await prisma.schedule.create({
      data: {
        beauticianId,
        date: new Date(date),
        startTime,
        endTime,
        isAvailable: true,
        locationType,
        locationName: locationName || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Schedule creation error:", error);
    return NextResponse.json({ error: "スケジュールの追加に失敗しました" }, { status: 500 });
  }
}
