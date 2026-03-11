import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const {
      employeeId,
      beauticianId,
      companyId,
      serviceId,
      date,
      startTime,
      endTime,
      locationType,
      locationDetail,
      notes,
    } = body;

    if (!employeeId || !beauticianId || !companyId || !serviceId || !date || !startTime) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        employeeId,
        beauticianId,
        companyId,
        serviceId,
        date: new Date(date),
        startTime,
        endTime: endTime || startTime,
        locationType: locationType || "ON_SITE",
        locationDetail: locationDetail || null,
        status: "PENDING",
        notes: notes || null,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json({ error: "予約の作成に失敗しました" }, { status: 500 });
  }
}
