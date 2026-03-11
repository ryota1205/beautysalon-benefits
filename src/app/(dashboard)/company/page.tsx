import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Users, Calendar, DollarSign, TrendingUp, ArrowUpRight, Sparkles } from "lucide-react";

export default async function CompanyDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const company = await prisma.company.findFirst({
    where: { adminUserId: session.user.id },
    include: {
      contract: true,
      employees: true,
      bookings: {
        include: { payment: true, beautician: true, service: true, employee: { include: { user: true } } },
        orderBy: { date: "desc" },
        take: 5,
      },
    },
  });

  if (!company) redirect("/login");

  const totalEmployees = company.employees.length;
  const monthBookings = company.bookings.filter(
    (b) => b.status !== "CANCELLED"
  ).length;
  const totalSpent = company.bookings
    .filter((b) => b.payment?.status === "COMPLETED")
    .reduce((sum, b) => sum + (b.payment?.companySubsidy || 0), 0);
  const budgetUsage = company.contract
    ? Math.round((totalSpent / company.contract.monthlyBudget) * 100)
    : 0;

  const stats = [
    { label: "登録社員数", value: totalEmployees.toString(), suffix: "名", icon: Users, gradient: "from-blue-500 to-indigo-600", bg: "bg-blue-50" },
    { label: "今月の予約数", value: monthBookings.toString(), suffix: "件", icon: Calendar, gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-50" },
    { label: "今月の補助額", value: formatCurrency(totalSpent), suffix: "", icon: DollarSign, gradient: "from-gold-500 to-gold-700", bg: "bg-gold-50" },
    { label: "予算消化率", value: `${budgetUsage}`, suffix: "%", icon: TrendingUp, gradient: "from-rose-500 to-pink-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-charcoal-400 mb-1">
          <Sparkles className="w-4 h-4 text-gold-500" />
          企業ダッシュボード
        </div>
        <h1 className="text-3xl font-bold text-charcoal-900">{company.name}</h1>
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

      {/* Contract Info */}
      {company.contract && (
        <div className="bg-gradient-to-br from-white to-gold-50/30 rounded-2xl border border-gold-200/50 p-6 mb-8 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-charcoal-800">契約プラン</h2>
            <Link href="/company/contract" className="text-sm text-gold-600 hover:text-gold-700 font-medium flex items-center gap-1 transition-colors">
              詳細 <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "プラン", value: company.contract.planName },
              { label: "月額予算", value: formatCurrency(company.contract.monthlyBudget) },
              { label: "補助率", value: `${company.contract.subsidyPercentage}%` },
              { label: "1回上限", value: formatCurrency(company.contract.maxSubsidyPerUse) },
            ].map((item) => (
              <div key={item.label} className="bg-white/60 rounded-xl p-3 border border-cream-200/50">
                <p className="text-xs text-charcoal-400 mb-0.5">{item.label}</p>
                <p className="font-bold text-charcoal-800">{item.value}</p>
              </div>
            ))}
          </div>
          {/* Budget Progress Bar */}
          <div className="mt-4 pt-4 border-t border-cream-200/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-charcoal-400">予算消化率</span>
              <span className="text-xs font-bold text-charcoal-600">{budgetUsage}%</span>
            </div>
            <div className="w-full bg-cream-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-500"
                style={{ width: `${Math.min(100, budgetUsage)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl border border-cream-200/80 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-cream-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-charcoal-800">最近の予約</h2>
          <Link href="/company/reports" className="text-sm text-gold-600 hover:text-gold-700 font-medium flex items-center gap-1 transition-colors">
            すべて見る <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-100 bg-cream-50/50">
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">社員</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">美容師</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">サービス</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">日付</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {company.bookings.map((booking, i) => (
                <tr key={booking.id} className="border-b border-cream-50 hover:bg-cream-50/50 transition-colors" style={{ animationDelay: `${i * 50}ms` }}>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{booking.employee.user.name.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-medium text-charcoal-700">{booking.employee.user.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-sm text-charcoal-600">{booking.beautician.displayName}</td>
                  <td className="py-3.5 px-5 text-sm text-charcoal-600">{booking.service.name}</td>
                  <td className="py-3.5 px-5 text-sm text-charcoal-400">{new Date(booking.date).toLocaleDateString("ja-JP")}</td>
                  <td className="py-3.5 px-5">
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))}
              {company.bookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-charcoal-400">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-charcoal-300" />
                    予約はまだありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    PENDING: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", label: "予約待ち" },
    CONFIRMED: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", label: "確定" },
    COMPLETED: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", label: "完了" },
    CANCELLED: { bg: "bg-charcoal-50 border-charcoal-200", text: "text-charcoal-500", label: "キャンセル" },
  };
  const c = config[status] || config.PENDING;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}
