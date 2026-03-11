import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { COMPANY_STATUSES } from "@/lib/constants";
import { Sparkles, Building2, Mail, Phone, MapPin, Briefcase, Shield } from "lucide-react";

export default async function CompanySettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const company = await prisma.company.findFirst({
    where: { adminUserId: session.user.id },
  });

  if (!company) redirect("/login");

  const infoItems = [
    { icon: Building2, label: "会社名", value: company.name, gradient: "from-blue-500 to-indigo-600" },
    { icon: Mail, label: "メールアドレス", value: company.email, gradient: "from-emerald-500 to-teal-600" },
    { icon: Phone, label: "電話番号", value: company.phone || "未設定", gradient: "from-gold-500 to-gold-700" },
    { icon: MapPin, label: "住所", value: company.address || "未設定", gradient: "from-rose-500 to-pink-600" },
    { icon: Briefcase, label: "業種", value: company.industry || "未設定", gradient: "from-purple-500 to-violet-600" },
    { icon: Shield, label: "ステータス", value: COMPANY_STATUSES[company.status as keyof typeof COMPANY_STATUSES] || company.status, gradient: "from-amber-500 to-orange-600" },
  ];

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-charcoal-400 mb-1">
          <Sparkles className="w-4 h-4 text-gold-500" />
          設定
        </div>
        <h1 className="text-3xl font-bold text-charcoal-900">企業設定</h1>
        <p className="text-charcoal-400 mt-1">企業情報の確認・管理</p>
      </div>

      <div className="bg-white rounded-2xl border border-cream-200/80 shadow-soft overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 p-6 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-xl font-bold text-white border border-white/30">
              {company.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{company.name}</h2>
              <p className="text-white/70 text-sm">{company.email}</p>
            </div>
          </div>
        </div>

        {/* Info List */}
        <div className="p-6">
          <h3 className="font-bold text-charcoal-800 mb-4">企業情報</h3>
          <div className="space-y-1">
            {infoItems.map((item) => (
              <div key={item.label} className="flex items-center py-3.5 border-b border-cream-100/80 last:border-0 group">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center mr-4 shadow-sm`}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <span className="w-36 text-sm text-charcoal-400 font-medium">{item.label}</span>
                <span className="text-sm font-semibold text-charcoal-800 flex-1">
                  {item.label === "ステータス" ? (
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                      company.status === "APPROVED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      company.status === "PENDING" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-charcoal-50 text-charcoal-500 border-charcoal-200"
                    }`}>
                      {item.value}
                    </span>
                  ) : item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="mt-6 bg-gradient-to-br from-cream-50 to-gold-50/30 p-5 rounded-2xl border border-cream-200/50 shadow-soft">
        <p className="text-sm text-charcoal-500">
          企業情報の変更が必要な場合は、プラットフォーム管理者にお問い合わせください。
        </p>
      </div>
    </div>
  );
}
