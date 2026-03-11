import { prisma } from "@/lib/prisma";
import { ApprovalButton } from "@/components/admin/approval-button";
import { Star, MapPin, Sparkles, AlertCircle, Scissors } from "lucide-react";

export default async function AdminBeauticiansPage() {
  const beauticians = await prisma.beautician.findMany({
    include: {
      user: true,
      _count: { select: { bookings: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const pending = beauticians.filter((b) => b.status === "PENDING");
  const others = beauticians.filter((b) => b.status !== "PENDING");

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-charcoal-400 mb-1">
          <Sparkles className="w-4 h-4 text-gold-500" />
          美容師管理
        </div>
        <h1 className="text-3xl font-bold text-charcoal-900">美容師一覧</h1>
        <p className="text-charcoal-400 mt-1">{beauticians.length}名の美容師が登録されています</p>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-charcoal-800">
              承認待ち ({pending.length}件)
            </h2>
          </div>
          <div className="grid gap-3 stagger-children">
            {pending.map((b) => (
              <div key={b.id} className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-200/50 shadow-soft card-hover">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-sm">
                      <span className="text-white text-lg font-bold">{b.displayName.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-bold text-charcoal-800">{b.displayName} <span className="text-charcoal-400 font-normal text-sm">({b.user.name})</span></p>
                      <p className="text-sm text-charcoal-500">{b.user.email}</p>
                      <div className="flex items-center gap-3 text-xs text-charcoal-400 mt-0.5">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{b.serviceArea}</span>
                        <span>経験{b.yearsExperience}年</span>
                      </div>
                    </div>
                  </div>
                  <ApprovalButton id={b.id} type="beautician" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Beauticians */}
      <div className="bg-white rounded-2xl border border-cream-200/80 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-cream-100">
          <h2 className="text-lg font-bold text-charcoal-800">すべての美容師</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-100 bg-cream-50/50">
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">美容師</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">エリア</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">経験</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">評価</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">予約数</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {others.map((b) => (
                <tr key={b.id} className="border-b border-cream-50 hover:bg-cream-50/50 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{b.displayName.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-charcoal-800">{b.displayName}</p>
                        <p className="text-xs text-charcoal-400">{b.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-sm text-charcoal-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{b.serviceArea || "—"}</span>
                  </td>
                  <td className="py-3.5 px-5 text-sm font-medium text-charcoal-700">{b.yearsExperience}年</td>
                  <td className="py-3.5 px-5 text-sm">
                    <span className="flex items-center gap-1 font-semibold text-charcoal-700">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {b.rating.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-sm font-medium text-charcoal-700">{b._count.bookings}件</td>
                  <td className="py-3.5 px-5">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                      b.status === "APPROVED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      b.status === "SUSPENDED" ? "bg-rose-50 text-rose-700 border-rose-200" :
                      "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {b.status === "APPROVED" ? "承認済み" : b.status === "PENDING" ? "審査中" : "停止中"}
                    </span>
                  </td>
                </tr>
              ))}
              {others.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Scissors className="w-10 h-10 text-charcoal-200 mx-auto mb-3" />
                    <p className="text-charcoal-400">美容師が登録されていません</p>
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
