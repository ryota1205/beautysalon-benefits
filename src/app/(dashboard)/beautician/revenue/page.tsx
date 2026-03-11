import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, TrendingUp, Percent, CreditCard, Sparkles } from "lucide-react";

export default async function RevenuePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const beautician = await prisma.beautician.findFirst({
    where: { userId: session.user.id },
    include: {
      bookings: {
        where: { status: "COMPLETED" },
        include: {
          payment: true,
          service: true,
          employee: { include: { user: true } },
          company: true,
        },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!beautician) redirect("/login");

  const payments = beautician.bookings
    .filter((b) => b.payment)
    .map((b) => b.payment!);

  const totalRevenue = payments.reduce((sum, p) => sum + p.beauticianPayout, 0);
  const totalServices = payments.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalFees = payments.reduce((sum, p) => sum + p.platformFee, 0);
  const avgPayout = payments.length > 0 ? totalRevenue / payments.length : 0;

  const stats = [
    { label: "総収益", value: formatCurrency(totalRevenue), icon: DollarSign, gradient: "from-emerald-500 to-teal-600" },
    { label: "総サービス額", value: formatCurrency(totalServices), icon: TrendingUp, gradient: "from-blue-500 to-indigo-600" },
    { label: "手数料合計", value: formatCurrency(totalFees), icon: Percent, gradient: "from-rose-500 to-pink-600" },
    { label: "平均受取額/回", value: formatCurrency(Math.round(avgPayout)), icon: CreditCard, gradient: "from-gold-500 to-gold-700" },
  ];

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-charcoal-400 mb-1">
          <Sparkles className="w-4 h-4 text-gold-500" />
          売上管理
        </div>
        <h1 className="text-3xl font-bold text-charcoal-900">収益レポート</h1>
        <p className="text-charcoal-400 mt-1">収益と支払い履歴</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-cream-200/80 p-5 card-hover shadow-soft">
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

      {/* Payment History */}
      <div className="bg-white rounded-2xl border border-cream-200/80 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-cream-100">
          <h2 className="text-lg font-bold text-charcoal-800">支払い履歴</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-100 bg-cream-50/50">
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">日付</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">お客様</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">サービス</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">サービス料金</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">手数料</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">受取額</th>
              </tr>
            </thead>
            <tbody>
              {beautician.bookings.map((b) => (
                <tr key={b.id} className="border-b border-cream-50 hover:bg-cream-50/50 transition-colors">
                  <td className="py-3.5 px-5 text-sm text-charcoal-400">
                    {new Date(b.date).toLocaleDateString("ja-JP")}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{b.employee.user.name.charAt(0)}</span>
                      </div>
                      <span className="text-sm text-charcoal-600">{b.employee.user.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-sm text-charcoal-600">{b.service.name}</td>
                  <td className="py-3.5 px-5 text-sm font-medium text-charcoal-700">
                    {b.payment ? formatCurrency(b.payment.totalAmount) : "—"}
                  </td>
                  <td className="py-3.5 px-5 text-sm font-medium text-rose-500">
                    {b.payment ? `-${formatCurrency(b.payment.platformFee)}` : "—"}
                  </td>
                  <td className="py-3.5 px-5 text-sm font-bold text-emerald-600">
                    {b.payment ? formatCurrency(b.payment.beauticianPayout) : "—"}
                  </td>
                </tr>
              ))}
              {beautician.bookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <DollarSign className="w-10 h-10 text-charcoal-200 mx-auto mb-3" />
                    <p className="text-charcoal-400">まだ完了した施術はありません</p>
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
