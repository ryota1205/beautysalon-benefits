import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { companyRegistrationSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = companyRegistrationSchema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "このメールアドレスは既に登録されています" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(validated.password, 10);

    const user = await prisma.user.create({
      data: {
        email: validated.email,
        name: validated.adminName,
        passwordHash,
        role: "COMPANY_ADMIN",
      },
    });

    await prisma.company.create({
      data: {
        name: validated.companyName,
        email: validated.email,
        phone: validated.phone || null,
        industry: validated.industry || null,
        status: "APPROVED",
        adminUserId: user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Company registration error:", error);
    return NextResponse.json(
      { error: "登録に失敗しました" },
      { status: 500 }
    );
  }
}
