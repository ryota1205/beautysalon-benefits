import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Building2, Scissors, Calendar, DollarSign, Users, TrendingUp, ArrowUpRight, AlertTriangle, Sparkles } from "lucide-react";

export default async function AdminDashboard() {
  const [companiesCount, beauticiansCount, bookingsCount, employeesCount, payments, pendingCompanies, pendingBeauticians] =
    await Promise.all([
      prisma.company.count(),
      prisma.beautician.count(),
      prisma.booking.count(),
      prisma.employee.count(),
      prisma.payment.findMany({ where: { status: "COMPLETED" } }),
      prisma.company.count({ where: { status: "PENDING" } }),
      prisma.beautician.count({ where: { status: "PENDING" } }),
    ]);

  const totalRevenue = payments.reduce((sum, p) => sum + p.platformFee, 0);
  const totalGMV = payments.reduce((sum, p) => sum + p.totalAmount, 0);

  const recentBookings = await prisma.booking.findMany({
    include: {
      employee: { include: { user: true } },
      beautician: true,
      company: true,
      service: true,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const stats = [
    { label: "登録企業数", value: companiesCount.toString(), icon: Building2, gradient: "from-blue-500 to-indigo-600" },
    { label: "登録美容師数", value: beauticiansCount.toString(), icon: Scissors, gradient: "from-rose-500 to-pink-600" },
    { label: "登録社員数", value: employeesCount.toString(), icon: Users, gradient: "from-emerald-500 to-teal-600" },
    { label: "総予約数", value: bookingsCount.toString(), icon: Calendar, gradient: "from-gold-500 to-gold-700" },
    { label: "総流通額 (GMV)", value: formatCurrency(totalGMV), icon: TrendingUp, gradient: "from-purple-500 to-indigo-600" },
    { label: "プラットフォーム収益", value: formatCurrency(totalRevenue), icon: DollarSign, gradient: "from-amber-500 to-orange-600" },
  ];

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-charcoal-400 mb-1">
          <Sparkles className="w-4 h-4 text-gold-500" />
          管理ダッシュボード
        </div>
        <h1 className="text-3xl font-bold text-charcoal-900">プラットフォーム管理</h1>
      </div>

      {/* Alert for pending approvals */}
      {(pendingCompanies > 0 || pendingBeauticians > 0) && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 p-4 rounded-2xl mb-6 flex items-center gap-3 shadow-soft animate-scale-in">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-800">承認待ちがあります</p>
            <p className="text-xs text-amber-600 mt-0.5">
              {pendingCompanies > 0 && `企業 ${pendingCompanies}件`}
              {pendingCompanies > 0 && pendingBeauticians > 0 && " · "}
              {pendingBeauticians > 0 && `美容師 ${pendingBeauticians}件`}
            </p>
          </div>
          <Link href="/admin/companies" className="text-sm text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1">
            確認する <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 stagger-children">
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

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-cream-200/80 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-cream-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-charcoal-800">最近の予約</h2>
          <Link href="/admin/bookings" className="text-sm text-gold-600 hover:text-gold-700 font-medium flex items-center gap-1 transition-colors">
            すべて見る <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-100 bg-cream-50/50">
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">日付</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">企業</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">社員</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">美容師</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">サービス</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">料金</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} className="border-b border-cream-50 hover:bg-cream-50/50 transition-colors">
                  <td className="py-3.5 px-5 text-sm text-charcoal-400">
                    {new Date(b.date).toLocaleDateString("ja-JP")}
                  </td>
                  <td className="py-3.5 px-5 text-sm text-charcoal-600">{b.company.name}</td>
                  <td className="py-3.5 px-5 text-sm text-charcoal-600">{b.employee.user.name}</td>
                  <td className="py-3.5 px-5 text-sm text-charcoal-600">{b.beautician.displayName}</td>
                  <td className="py-3.5 px-5 text-sm text-charcoal-600">{b.service.name}</td>
                  <td className="py-3.5 px-5 text-sm font-medium text-charcoal-700">{formatCurrency(b.service.price)}</td>
                  <td className="py-3.5 px-5">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                      b.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      b.status === "CONFIRMED" ? "bg-blue-50 text-blue-700 border-blue-200" :
                      b.status === "PENDING" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-charcoal-50 text-charcoal-500 border-charcoal-200"
                    }`}>
                      {b.status === "COMPLETED" ? "完了" : b.status === "CONFIRMED" ? "確定" : b.status === "PENDING" ? "待ち" : "キャンセル"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
