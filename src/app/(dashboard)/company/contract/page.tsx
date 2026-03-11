import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { FileText, CheckCircle2, Sparkles, Crown } from "lucide-react";

export default async function ContractPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const company = await prisma.company.findFirst({
    where: { adminUserId: session.user.id },
    include: { contract: true },
  });

  if (!company) redirect("/login");

  const contract = company.contract;

  const planDetails: Record<string, { features: string[]; gradient: string; icon: string }> = {
    BASIC: {
      features: ["社員50名まで", "月額予算管理", "基本レポート", "メールサポート"],
      gradient: "from-charcoal-600 to-charcoal-800",
      icon: "B",
    },
    STANDARD: {
      features: ["社員200名まで", "月額予算管理", "詳細レポート", "優先サポート", "出張美容対応"],
      gradient: "from-gold-500 to-gold-700",
      icon: "S",
    },
    PREMIUM: {
      features: ["社員数無制限", "月額予算管理", "高度な分析", "専任担当者", "出張美容対応", "カスタマイズ対応"],
      gradient: "from-purple-500 to-indigo-600",
      icon: "P",
    },
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-charcoal-400 mb-1">
          <Sparkles className="w-4 h-4 text-gold-500" />
          契約管理
        </div>
        <h1 className="text-3xl font-bold text-charcoal-900">契約プラン</h1>
        <p className="text-charcoal-400 mt-1">福利厚生プランの確認・管理</p>
      </div>

      {contract ? (
        <div className="space-y-6">
          {/* Current Plan */}
          <div className="bg-white rounded-2xl border border-cream-200/80 shadow-soft overflow-hidden">
            {/* Plan Header */}
            <div className={`bg-gradient-to-r ${planDetails[contract.planName]?.gradient || "from-gold-500 to-gold-700"} p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Crown className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm font-medium">現在のプラン</p>
                    <h2 className="text-2xl font-bold">{contract.planName}プラン</h2>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{formatCurrency(contract.monthlyBudget)}</p>
                  <p className="text-white/70 text-sm">/ 月</p>
                </div>
              </div>
            </div>

            {/* Plan Details */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${
                  contract.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-charcoal-50 text-charcoal-500 border-charcoal-200"
                }`}>
                  {contract.status === "ACTIVE" ? "有効" : contract.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "補助率", value: `${contract.subsidyPercentage}%` },
                  { label: "1回あたり上限", value: formatCurrency(contract.maxSubsidyPerUse) },
                  { label: "契約開始日", value: new Date(contract.startDate).toLocaleDateString("ja-JP") },
                  { label: "契約終了日", value: contract.endDate ? new Date(contract.endDate).toLocaleDateString("ja-JP") : "自動更新" },
                ].map((item) => (
                  <div key={item.label} className="bg-cream-50/50 rounded-xl p-4 border border-cream-200/50">
                    <p className="text-xs text-charcoal-400 mb-1">{item.label}</p>
                    <p className="text-lg font-bold text-charcoal-800">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="pt-4 border-t border-cream-100">
                <p className="text-sm font-bold text-charcoal-700 mb-3">プラン機能</p>
                <ul className="grid grid-cols-2 gap-2.5">
                  {planDetails[contract.planName]?.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-charcoal-600">
                      <CheckCircle2 className="w-4.5 h-4.5 text-gold-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Example */}
          <div className="bg-white rounded-2xl border border-cream-200/80 p-6 shadow-soft">
            <h2 className="text-lg font-bold text-charcoal-800 mb-2">料金シミュレーション</h2>
            <p className="text-sm text-charcoal-400 mb-5">カット料金 ¥4,000 の場合</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "サービス料金", value: "¥4,000", gradient: "from-charcoal-50 to-charcoal-100", text: "text-charcoal-800" },
                { label: "会社補助", value: formatCurrency(Math.min(4000 * contract.subsidyPercentage / 100, contract.maxSubsidyPerUse)), gradient: "from-gold-50 to-gold-100", text: "text-gold-700" },
                { label: "社員負担", value: formatCurrency(4000 - Math.min(4000 * contract.subsidyPercentage / 100, contract.maxSubsidyPerUse)), gradient: "from-blue-50 to-blue-100", text: "text-blue-700" },
                { label: "美容師受取", value: "¥3,200", gradient: "from-emerald-50 to-emerald-100", text: "text-emerald-700" },
              ].map((item) => (
                <div key={item.label} className={`bg-gradient-to-br ${item.gradient} p-4 rounded-xl text-center border border-white`}>
                  <p className="text-xs text-charcoal-400 mb-1">{item.label}</p>
                  <p className={`text-xl font-bold ${item.text}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-cream-200 text-center shadow-soft">
          <FileText className="w-14 h-14 text-charcoal-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-charcoal-800 mb-2">契約がありません</h2>
          <p className="text-charcoal-400">プランを選択して契約を開始してください。</p>
        </div>
      )}
    </div>
  );
}
