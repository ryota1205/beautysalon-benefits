import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ScheduleManager } from "@/components/beautician/schedule-manager";
import { Sparkles } from "lucide-react";

export default async function SchedulePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const beautician = await prisma.beautician.findFirst({
    where: { userId: session.user.id },
    include: {
      schedules: { orderBy: { date: "asc" } },
    },
  });

  if (!beautician) redirect("/login");

  const schedules = beautician.schedules.map((s) => ({
    id: s.id,
    date: s.date.toISOString(),
    startTime: s.startTime,
    endTime: s.endTime,
    isAvailable: s.isAvailable,
    locationType: s.locationType,
    locationName: s.locationName,
  }));

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-charcoal-400 mb-1">
          <Sparkles className="w-4 h-4 text-gold-500" />
          スケジュール
        </div>
        <h1 className="text-3xl font-bold text-charcoal-900">スケジュール管理</h1>
        <p className="text-charcoal-400 mt-1">空き時間を設定して予約を受け付けましょう</p>
      </div>
      <ScheduleManager schedules={schedules} beauticianId={beautician.id} />
    </div>
  );
}
