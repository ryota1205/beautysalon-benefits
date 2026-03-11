import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { BOOKING_STATUSES } from "@/lib/constants";
import Link from "next/link";
import { Calendar, DollarSign, Star, Clock, ArrowUpRight, Sparkles } from "lucide-react";

export default async function BeauticianDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const beautician = await prisma.beautician.findFirst({
    where: { userId: session.user.id },
    include: {
      bookings: {
        include: {
          payment: true,
          employee: { include: { user: true } },
          company: true,
          service: true,
        },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!beautician) redirect("/login");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayBookings = beautician.bookings.filter(
    (b) => new Date(b.date).toDateString() === today.toDateString() && b.status !== "CANCELLED"
  );
  const monthRevenue = beautician.bookings
    .filter((b) => b.payment?.status === "COMPLETED")
    .reduce((sum, b) => sum + (b.payment?.beauticianPayout || 0), 0);
  const totalCompleted = beautician.bookings.filter((b) => b.status === "COMPLETED").length;

  const upcomingBookings = beautician.bookings
    .filter((b) => new Date(b.date) >= today && b.status !== "CANCELLED" && b.status !== "COMPLETED")
    .slice(0, 5);

  const stats = [
    { label: "本日の予約", value: todayBookings.length.toString(), suffix: "件", icon: Calendar, gradient: "from-blue-500 to-indigo-600" },
    { label: "今月の売上", value: formatCurrency(monthRevenue), suffix: "", icon: DollarSign, gradient: "from-emerald-500 to-teal-600" },
    { label: "完了施術数", value: totalCompleted.toString(), suffix: "件", icon: Clock, gradient: "from-gold-500 to-gold-700" },
    { label: "評価", value: beautician.rating.toFixed(1), suffix: "", icon: Star, gradient: "from-amber-500 to-orange-600" },
  ];

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-charcoal-400 mb-1">
          <Sparkles className="w-4 h-4 text-gold-500" />
          美容師ダッシュボード
        </div>
        <h1 className="text-3xl font-bold text-charcoal-900">
          こんにちは、{beautician.displayName}さん
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-cream-200/80 p-5 card-hover shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-charcoal-400">{stat.label}</span>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-sm`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold text-charcoal-900">{stat.value}</p>
              {stat.suffix && <span className="text-lg text-charcoal-400 font-medium">{stat.suffix}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-2xl border border-cream-200/80 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-cream-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-charcoal-800">直近の予約</h2>
          <Link href="/beautician/bookings" className="text-sm text-gold-600 hover:text-gold-700 font-medium flex items-center gap-1 transition-colors">
            すべて見る <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-cream-100/80">
          {upcomingBookings.map((booking) => (
            <div key={booking.id} className="p-5 hover:bg-cream-50/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-bold">
                      {booking.employee.user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal-800">
                      {booking.employee.user.name}
                      <span className="text-charcoal-300 font-normal ml-2 text-sm">
                        {booking.company.name}
                      </span>
                    </p>
                    <div className="flex items-center gap-3 text-sm text-charcoal-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(booking.date).toLocaleDateString("ja-JP")} {booking.startTime}〜{booking.endTime}
                      </span>
                      <span className="text-gold-600 font-medium">
                        {booking.service.name} - {formatCurrency(booking.service.price)}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                  booking.status === "CONFIRMED" ? "bg-blue-50 text-blue-700 border-blue-200" :
                  booking.status === "PENDING" ? "bg-amber-50 text-amber-700 border-amber-200" :
                  "bg-charcoal-50 text-charcoal-500 border-charcoal-200"
                }`}>
                  {BOOKING_STATUSES[booking.status as keyof typeof BOOKING_STATUSES] || booking.status}
                </span>
              </div>
            </div>
          ))}
          {upcomingBookings.length === 0 && (
            <div className="p-12 text-center">
              <Calendar className="w-10 h-10 mx-auto mb-3 text-charcoal-200" />
              <p className="text-charcoal-400">直近の予約はありません</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
