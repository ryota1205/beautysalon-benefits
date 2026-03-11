import { prisma } from "@/lib/prisma";
import { COMPANY_STATUSES } from "@/lib/constants";
import { ApprovalButton } from "@/components/admin/approval-button";
import { Sparkles, Building2, AlertCircle } from "lucide-react";

export default async function AdminCompaniesPage() {
  const companies = await prisma.company.findMany({
    include: {
      employees: true,
      contract: true,
      _count: { select: { bookings: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const pending = companies.filter((c) => c.status === "PENDING");
  const approved = companies.filter((c) => c.status !== "PENDING");

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-charcoal-400 mb-1">
          <Sparkles className="w-4 h-4 text-gold-500" />
          企業管理
        </div>
        <h1 className="text-3xl font-bold text-charcoal-900">企業一覧</h1>
        <p className="text-charcoal-400 mt-1">{companies.length}社の企業が登録されています</p>
      </div>

      {/* Pending Approvals */}
      {pending.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-charcoal-800">
              承認待ち ({pending.length}件)
            </h2>
          </div>
          <div className="grid gap-3 stagger-children">
            {pending.map((company) => (
              <div key={company.id} className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-200/50 shadow-soft card-hover">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-charcoal-800">{company.name}</p>
                      <p className="text-sm text-charcoal-500">{company.email}</p>
                      <p className="text-xs text-charcoal-400 mt-0.5">
                        {company.industry || "業種未設定"} · 登録日: {new Date(company.createdAt).toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                  </div>
                  <ApprovalButton id={company.id} type="company" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Companies Table */}
      <div className="bg-white rounded-2xl border border-cream-200/80 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-cream-100">
          <h2 className="text-lg font-bold text-charcoal-800">すべての企業</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-100 bg-cream-50/50">
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">企業名</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">業種</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">社員数</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">予約数</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">プラン</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {approved.map((c) => (
                <tr key={c.id} className="border-b border-cream-50 hover:bg-cream-50/50 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{c.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-charcoal-800">{c.name}</p>
                        <p className="text-xs text-charcoal-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-sm text-charcoal-400">{c.industry || "—"}</td>
                  <td className="py-3.5 px-5 text-sm font-medium text-charcoal-700">{c.employees.length}名</td>
                  <td className="py-3.5 px-5 text-sm font-medium text-charcoal-700">{c._count.bookings}件</td>
                  <td className="py-3.5 px-5">
                    <span className="text-sm font-medium text-charcoal-700">{c.contract?.planName || "未契約"}</span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                      c.status === "APPROVED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      c.status === "SUSPENDED" ? "bg-rose-50 text-rose-700 border-rose-200" :
                      "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {COMPANY_STATUSES[c.status as keyof typeof COMPANY_STATUSES] || c.status}
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
