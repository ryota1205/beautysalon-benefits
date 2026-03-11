import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { BOOKING_STATUSES } from "@/lib/constants";
import Link from "next/link";
import { Calendar, DollarSign, Search, Scissors, ArrowRight, Sparkles, Heart } from "lucide-react";

export default async function EmployeeDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const employee = await prisma.employee.findFirst({
    where: { userId: session.user.id },
    include: {
      company: { include: { contract: true } },
      bookings: {
        include: {
          beautician: true,
          service: true,
          payment: true,
        },
        orderBy: { date: "desc" },
        take: 5,
      },
    },
  });

  if (!employee) redirect("/login");

  const totalUsed = employee.bookings
    .filter((b) => b.payment?.status === "COMPLETED")
    .reduce((sum, b) => sum + (b.payment?.employeePayment || 0), 0);
  const totalSubsidy = employee.bookings
    .filter((b) => b.payment?.status === "COMPLETED")
    .reduce((sum, b) => sum + (b.payment?.companySubsidy || 0), 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingBookings = employee.bookings.filter(
    (b) => new Date(b.date) >= today && b.status !== "CANCELLED" && b.status !== "COMPLETED"
  );

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-charcoal-400 mb-1">
          <Heart className="w-4 h-4 text-rose-400" />
          {employee.company.name}
        </div>
        <h1 className="text-3xl font-bold text-charcoal-900">
          ようこそ、{session.user.name}さん
        </h1>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link
          href="/employee/search"
          className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-gold-500 to-gold-700 text-white shadow-gold card-hover"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-8 translate-x-8" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Search className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg">美容師を探す</p>
              <p className="text-gold-100 text-sm">近くの美容師を検索して予約</p>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
        <Link
          href="/employee/booking"
          className="group relative overflow-hidden rounded-2xl p-6 bg-white border border-cream-200 shadow-soft card-hover"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-50 rounded-full blur-2xl -translate-y-8 translate-x-8" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-gold-100 to-gold-200 rounded-2xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-gold-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg text-charcoal-800">予約一覧</p>
              <p className="text-charcoal-400 text-sm">予約の確認・管理</p>
            </div>
            <ArrowRight className="w-5 h-5 text-charcoal-300 group-hover:translate-x-1 group-hover:text-gold-500 transition-all" />
          </div>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 stagger-children">
        {[
          { label: "直近の予約", value: upcomingBookings.length + "件", icon: Calendar, gradient: "from-blue-500 to-indigo-600" },
          { label: "会社補助合計", value: formatCurrency(totalSubsidy), icon: Sparkles, gradient: "from-emerald-500 to-teal-600" },
          { label: "自己負担合計", value: formatCurrency(totalUsed), icon: DollarSign, gradient: "from-gold-500 to-gold-700" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-5 rounded-2xl border border-cream-200/80 shadow-soft card-hover">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-charcoal-400">{stat.label}</span>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-sm`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-charcoal-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Company Subsidy Info */}
      {employee.company.contract && (
        <div className="bg-gradient-to-r from-gold-50 to-cream-50 p-5 rounded-2xl border border-gold-200/50 mb-8 shadow-soft">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-gold-500" />
            <p className="text-sm font-bold text-gold-800">あなたの福利厚生プラン</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-charcoal-600">
            <span>
              会社補助率: <span className="font-bold text-charcoal-800">{employee.company.contract.subsidyPercentage}%</span>
            </span>
            <span className="text-cream-400">|</span>
            <span>
              1回上限: <span className="font-bold text-charcoal-800">{formatCurrency(employee.company.contract.maxSubsidyPerUse)}</span>
            </span>
          </div>
        </div>
      )}

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl border border-cream-200/80 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-cream-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-charcoal-800">最近の予約</h2>
          <Link href="/employee/booking" className="text-sm text-gold-600 hover:text-gold-700 font-medium transition-colors">
            すべて見る →
          </Link>
        </div>
        <div className="divide-y divide-cream-100/80">
          {employee.bookings.slice(0, 5).map((booking) => (
            <div key={booking.id} className="p-4 hover:bg-cream-50/50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm font-bold">
                    {booking.beautician.displayName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-charcoal-800">{booking.beautician.displayName}</p>
                  <p className="text-sm text-charcoal-400">
                    {booking.service.name} · {new Date(booking.date).toLocaleDateString("ja-JP")}
                  </p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                booking.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                booking.status === "CONFIRMED" ? "bg-blue-50 text-blue-700 border-blue-200" :
                booking.status === "PENDING" ? "bg-amber-50 text-amber-700 border-amber-200" :
                "bg-charcoal-50 text-charcoal-500 border-charcoal-200"
              }`}>
                {BOOKING_STATUSES[booking.status as keyof typeof BOOKING_STATUSES] || booking.status}
              </span>
            </div>
          ))}
          {employee.bookings.length === 0 && (
            <div className="p-12 text-center">
              <Scissors className="w-10 h-10 mx-auto mb-3 text-charcoal-200" />
              <p className="text-charcoal-400 mb-2">まだ予約はありません</p>
              <Link href="/employee/search" className="text-gold-600 hover:text-gold-700 text-sm font-medium">
                美容師を探してみましょう →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
