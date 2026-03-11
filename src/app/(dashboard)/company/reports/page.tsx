import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { BOOKING_STATUSES, LOCATION_TYPES } from "@/lib/constants";
import { Sparkles, BarChart3 } from "lucide-react";

export default async function ReportsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const company = await prisma.company.findFirst({
    where: { adminUserId: session.user.id },
    include: {
      bookings: {
        include: {
          payment: true,
          employee: { include: { user: true } },
          beautician: true,
          service: true,
        },
        orderBy: { date: "desc" },
      },
      contract: true,
    },
  });

  if (!company) redirect("/login");

  const completedBookings = company.bookings.filter((b) => b.status === "COMPLETED");
  const totalSubsidy = completedBookings.reduce(
    (sum, b) => sum + (b.payment?.companySubsidy || 0), 0
  );
  const totalBookings = company.bookings.filter((b) => b.status !== "CANCELLED").length;
  const avgCost = completedBookings.length > 0
    ? totalSubsidy / completedBookings.length
    : 0;

  const summaryStats = [
    { label: "総予約数", value: totalBookings.toString() + "件", gradient: "from-blue-500 to-indigo-600" },
    { label: "完了予約数", value: completedBookings.length.toString() + "件", gradient: "from-emerald-500 to-teal-600" },
    { label: "総補助額", value: formatCurrency(totalSubsidy), gradient: "from-gold-500 to-gold-700" },
    { label: "平均補助額/回", value: formatCurrency(Math.round(avgCost)), gradient: "from-purple-500 to-indigo-600" },
  ];

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-charcoal-400 mb-1">
          <Sparkles className="w-4 h-4 text-gold-500" />
          利用レポート
        </div>
        <h1 className="text-3xl font-bold text-charcoal-900">利用状況レポート</h1>
        <p className="text-charcoal-400 mt-1">福利厚生の利用状況を確認</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 stagger-children">
        {summaryStats.map((s) => (
          <div key={s.label} className="bg-white p-5 rounded-2xl border border-cream-200/80 shadow-soft card-hover">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-charcoal-400">{s.label}</p>
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${s.gradient}`} />
            </div>
            <p className="text-2xl font-bold text-charcoal-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Budget Progress */}
      {company.contract && (
        <div className="bg-gradient-to-br from-white to-gold-50/30 rounded-2xl border border-gold-200/50 p-6 mb-8 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-gold-600" />
            <h2 className="text-lg font-bold text-charcoal-800">予算消化率</h2>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-charcoal-500">
              {formatCurrency(totalSubsidy)} / {formatCurrency(company.contract.monthlyBudget)}
            </span>
            <span className="text-sm font-bold text-charcoal-700">
              {Math.min(100, Math.round((totalSubsidy / company.contract.monthlyBudget) * 100))}%
            </span>
          </div>
          <div className="w-full bg-cream-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-1000"
              style={{
                width: `${Math.min(100, (totalSubsidy / company.contract.monthlyBudget) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* All Bookings Table */}
      <div className="bg-white rounded-2xl border border-cream-200/80 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-cream-100">
          <h2 className="text-lg font-bold text-charcoal-800">予約履歴</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-100 bg-cream-50/50">
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">日付</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">社員</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">美容師</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">サービス</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">形態</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">料金</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">補助額</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {company.bookings.map((b) => (
                <tr key={b.id} className="border-b border-cream-50 hover:bg-cream-50/50 transition-colors">
                  <td className="py-3.5 px-5 text-sm text-charcoal-400">
                    {new Date(b.date).toLocaleDateString("ja-JP")}
                  </td>
                  <td className="py-3.5 px-5 text-sm text-charcoal-600">{b.employee.user.name}</td>
                  <td className="py-3.5 px-5 text-sm text-charcoal-600">{b.beautician.displayName}</td>
                  <td className="py-3.5 px-5 text-sm text-charcoal-600">{b.service.name}</td>
                  <td className="py-3.5 px-5 text-sm text-charcoal-400">
                    {LOCATION_TYPES[b.locationType as keyof typeof LOCATION_TYPES] || b.locationType}
                  </td>
                  <td className="py-3.5 px-5 text-sm font-medium text-charcoal-700">{formatCurrency(b.service.price)}</td>
                  <td className="py-3.5 px-5 text-sm font-bold text-gold-700">
                    {b.payment ? formatCurrency(b.payment.companySubsidy) : "—"}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                      b.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      b.status === "CONFIRMED" ? "bg-blue-50 text-blue-700 border-blue-200" :
                      b.status === "PENDING" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-charcoal-50 text-charcoal-500 border-charcoal-200"
                    }`}>
                      {BOOKING_STATUSES[b.status as keyof typeof BOOKING_STATUSES] || b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {company.bookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-charcoal-400">
                    予約データはまだありません
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
