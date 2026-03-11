import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "COMPANY_ADMIN") {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, department, position, companyId } = body;

    if (!name || !email || !companyId) {
      return NextResponse.json({ error: "必須項目を入力してください" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "このメールアドレスは既に登録されています" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash("password123", 10);

    const user = await prisma.user.create({
      data: { email, name, passwordHash, role: "EMPLOYEE" },
    });

    await prisma.employee.create({
      data: {
        userId: user.id,
        companyId,
        department: department || null,
        position: position || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Employee creation error:", error);
    return NextResponse.json({ error: "社員の追加に失敗しました" }, { status: 500 });
  }
}
