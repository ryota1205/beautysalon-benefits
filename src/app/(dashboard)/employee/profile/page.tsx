import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { User, Building2, Mail, Briefcase, Sparkles, Crown, Gift, Calculator } from "lucide-react";

export default async function EmployeeProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const employee = await prisma.employee.findFirst({
    where: { userId: session.user.id },
    include: {
      user: true,
      company: { include: { contract: true } },
    },
  });

  if (!employee) redirect("/login");

  const contract = employee.company.contract;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-charcoal-400 mb-1">
          <Sparkles className="w-4 h-4 text-gold-500" />
          プロフィール
        </div>
        <h1 className="text-3xl font-bold text-charcoal-900">マイプロフィール</h1>
        <p className="text-charcoal-400 mt-1">あなたの情報と福利厚生プラン</p>
      </div>

      <div className="space-y-6 stagger-children">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-cream-200/80 shadow-soft overflow-hidden">
          {/* Profile Header Gradient */}
          <div className="h-24 bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-500 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>

          <div className="px-6 pb-6 -mt-10 relative">
            <div className="flex items-end gap-5">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg border-4 border-white">
                {employee.user.name.charAt(0)}
              </div>
              <div className="flex-1 pb-1">
                <h2 className="text-xl font-bold text-charcoal-900">{employee.user.name}</h2>
                <p className="text-charcoal-400 text-sm">{employee.company.name}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                employee.status === "ACTIVE"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-charcoal-50 text-charcoal-500 border-charcoal-200"
              }`}>
                {employee.status === "ACTIVE" ? "有効" : "無効"}
              </span>
            </div>

            {/* Info Items */}
            <div className="mt-6 space-y-1">
              {[
                { icon: Mail, label: "メールアドレス", value: employee.user.email, gradient: "from-emerald-500 to-teal-600" },
                { icon: Building2, label: "部署", value: employee.department || "未設定", gradient: "from-blue-500 to-indigo-600" },
                { icon: Briefcase, label: "役職", value: employee.position || "未設定", gradient: "from-purple-500 to-violet-600" },
                { icon: User, label: "社員ID", value: employee.id.slice(0, 8) + "...", gradient: "from-gold-500 to-gold-700" },
              ].map((item) => (
                <div key={item.label} className="flex items-center py-3 border-b border-cream-100/80 last:border-0">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center mr-4 shadow-sm`}>
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="w-32 text-sm text-charcoal-400 font-medium">{item.label}</span>
                  <span className="text-sm font-semibold text-charcoal-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Welfare Plan Info */}
        {contract && (
          <div className="bg-gradient-to-br from-gold-50 to-cream-50 rounded-2xl border border-gold-200/50 shadow-soft overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center shadow-sm">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal-800">あなたの福利厚生プラン</h3>
                  <p className="text-xs text-charcoal-400">{employee.company.name}の福利厚生</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-cream-200/80 shadow-soft">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-4 h-4 text-gold-500" />
                    <p className="text-xs text-charcoal-400 font-medium">プラン名</p>
                  </div>
                  <p className="font-bold text-charcoal-800 text-lg">{contract.planName}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-cream-200/80 shadow-soft">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-gold-500" />
                    <p className="text-xs text-charcoal-400 font-medium">補助率</p>
                  </div>
                  <p className="font-bold text-gradient text-lg">{contract.subsidyPercentage}%</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-cream-200/80 shadow-soft">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-4 h-4 text-gold-500" />
                    <p className="text-xs text-charcoal-400 font-medium">1回の上限額</p>
                  </div>
                  <p className="font-bold text-charcoal-800 text-lg">¥{contract.maxSubsidyPerUse.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-cream-200/80 shadow-soft">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-4 h-4 text-emerald-500" />
                    <p className="text-xs text-charcoal-400 font-medium">利用例 (¥4,000)</p>
                  </div>
                  <p className="font-bold text-emerald-600 text-lg">
                    自己負担 ¥{(4000 - Math.min(4000 * contract.subsidyPercentage / 100, contract.maxSubsidyPerUse)).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
