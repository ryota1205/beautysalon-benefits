import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { BOOKING_STATUSES, LOCATION_TYPES } from "@/lib/constants";
import { Sparkles, Calendar } from "lucide-react";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      employee: { include: { user: true } },
      beautician: true,
      company: true,
      service: true,
      payment: true,
    },
    orderBy: { date: "desc" },
  });

  const totalCount = bookings.length;
  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const cancelledCount = bookings.filter((b) => b.status === "CANCELLED").length;

  const quickStats = [
    { label: "全体", value: totalCount, gradient: "from-charcoal-600 to-charcoal-800" },
    { label: "待ち", value: pendingCount, gradient: "from-amber-500 to-orange-600" },
    { label: "完了", value: completedCount, gradient: "from-emerald-500 to-teal-600" },
    { label: "キャンセル", value: cancelledCount, gradient: "from-charcoal-400 to-charcoal-500" },
  ];

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-charcoal-400 mb-1">
          <Sparkles className="w-4 h-4 text-gold-500" />
          予約管理
        </div>
        <h1 className="text-3xl font-bold text-charcoal-900">全予約一覧</h1>
        <p className="text-charcoal-400 mt-1">プラットフォーム全体の予約状況</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8 stagger-children">
        {quickStats.map((s) => (
          <div key={s.label} className="bg-white p-5 rounded-2xl border border-cream-200/80 shadow-soft text-center card-hover">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center mx-auto mb-2 shadow-sm`}>
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-bold text-charcoal-900">{s.value}</p>
            <p className="text-xs font-medium text-charcoal-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-cream-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-100 bg-cream-50/50">
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">日付</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">企業</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">社員</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">美容師</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">サービス</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">形態</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">料金</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">手数料</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-cream-50 hover:bg-cream-50/50 transition-colors">
                  <td className="py-3.5 px-4 text-sm text-charcoal-400">
                    {new Date(b.date).toLocaleDateString("ja-JP")}
                  </td>
                  <td className="py-3.5 px-4 text-sm text-charcoal-600">{b.company.name}</td>
                  <td className="py-3.5 px-4 text-sm text-charcoal-600">{b.employee.user.name}</td>
                  <td className="py-3.5 px-4 text-sm text-charcoal-600">{b.beautician.displayName}</td>
                  <td className="py-3.5 px-4 text-sm text-charcoal-600">{b.service.name}</td>
                  <td className="py-3.5 px-4 text-sm text-charcoal-400">
                    {LOCATION_TYPES[b.locationType as keyof typeof LOCATION_TYPES] || b.locationType}
                  </td>
                  <td className="py-3.5 px-4 text-sm font-medium text-charcoal-700">{formatCurrency(b.service.price)}</td>
                  <td className="py-3.5 px-4 text-sm font-bold text-gold-700">
                    {b.payment ? formatCurrency(b.payment.platformFee) : "—"}
                  </td>
                  <td className="py-3.5 px-4">
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
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <Calendar className="w-10 h-10 text-charcoal-200 mx-auto mb-3" />
                    <p className="text-charcoal-400">予約データがありません</p>
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
