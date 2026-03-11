import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BookingForm } from "@/components/employee/booking-form";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ beauticianId: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { beauticianId } = await params;

  const employee = await prisma.employee.findFirst({
    where: { userId: session.user.id },
    include: { company: { include: { contract: true } } },
  });

  if (!employee) redirect("/login");

  const beautician = await prisma.beautician.findUnique({
    where: { id: beauticianId },
    include: {
      services: true,
      schedules: {
        where: {
          isAvailable: true,
          date: { gte: new Date() },
        },
        orderBy: { date: "asc" },
      },
    },
  });

  if (!beautician) redirect("/employee/search");

  const contract = employee.company.contract;
  const platformFeePercent = 20;

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link
          href="/employee/search"
          className="inline-flex items-center gap-1.5 text-sm text-charcoal-400 hover:text-gold-600 transition-colors mb-3 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          美容師一覧に戻る
        </Link>
        <div className="flex items-center gap-2 text-sm text-charcoal-400 mb-1">
          <Sparkles className="w-4 h-4 text-gold-500" />
          予約
        </div>
        <h1 className="text-3xl font-bold text-charcoal-900">予約する</h1>
        <p className="text-charcoal-400 mt-1">
          <span className="font-semibold text-charcoal-600">{beautician.displayName}</span>さんに予約
        </p>
      </div>
      <BookingForm
        beautician={{
          id: beautician.id,
          displayName: beautician.displayName,
          services: beautician.services.map((s) => ({
            id: s.id,
            name: s.name,
            price: s.price,
            durationMin: s.durationMin,
            category: s.category,
          })),
          schedules: beautician.schedules.map((s) => ({
            id: s.id,
            date: s.date.toISOString(),
            startTime: s.startTime,
            endTime: s.endTime,
            locationType: s.locationType,
            locationName: s.locationName,
          })),
        }}
        employeeId={employee.id}
        companyId={employee.companyId}
        contract={contract ? {
          subsidyPercentage: contract.subsidyPercentage,
          maxSubsidyPerUse: contract.maxSubsidyPerUse,
        } : null}
        platformFeePercent={platformFeePercent}
      />
    </div>
  );
}
