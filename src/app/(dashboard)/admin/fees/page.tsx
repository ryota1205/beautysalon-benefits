import { prisma } from "@/lib/prisma";
import { FeeConfigForm } from "@/components/admin/fee-config-form";
import { Sparkles, Info } from "lucide-react";

export default async function AdminFeesPage() {
  const config = await prisma.platformConfig.findFirst();

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-charcoal-400 mb-1">
          <Sparkles className="w-4 h-4 text-gold-500" />
          手数料設定
        </div>
        <h1 className="text-3xl font-bold text-charcoal-900">手数料管理</h1>
        <p className="text-charcoal-400 mt-1">プラットフォーム手数料の管理</p>
      </div>

      <FeeConfigForm
        config={config ? {
          id: config.id,
          defaultFeePercent: config.defaultFeePercent,
          minFeePercent: config.minFeePercent,
          maxFeePercent: config.maxFeePercent,
        } : null}
      />

      {/* Fee Explanation */}
      <div className="mt-8 bg-gradient-to-br from-cream-50 to-gold-50/30 p-6 rounded-2xl border border-cream-200/50 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-gold-500" />
          <h3 className="font-bold text-charcoal-800">手数料の仕組み</h3>
        </div>
        <div className="space-y-3 text-sm text-charcoal-600">
          <p>
            プラットフォーム手数料は、各施術料金から差し引かれます。
          </p>
          <div className="bg-white p-5 rounded-xl border border-cream-200/80 shadow-soft">
            <p className="font-bold text-charcoal-800 mb-3">例: カット ¥4,000 / 手数料 20% の場合</p>
            <div className="space-y-2">
              <div className="flex justify-between py-1.5">
                <span className="text-charcoal-500">サービス料金</span>
                <span className="font-semibold text-charcoal-800">¥4,000</span>
              </div>
              <div className="flex justify-between py-1.5 text-gold-700">
                <span>プラットフォーム手数料 (20%)</span>
                <span className="font-semibold">¥800</span>
              </div>
              <div className="flex justify-between py-1.5 text-emerald-700 border-t border-cream-200 pt-2.5">
                <span className="font-semibold">美容師受取額 (80%)</span>
                <span className="font-bold text-lg">¥3,200</span>
              </div>
            </div>
          </div>
          <p className="text-charcoal-400 text-xs mt-2">
            ※ 美容業界のマージン耐性は低いため、15〜20%が現実的な範囲です。
          </p>
        </div>
      </div>
    </div>
  );
}
