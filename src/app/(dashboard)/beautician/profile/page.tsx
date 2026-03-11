import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { SERVICE_CATEGORIES, LOCATION_TYPES } from "@/lib/constants";
import { Star, MapPin, Clock, Award, Sparkles, Scissors } from "lucide-react";

export default async function BeauticianProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const beautician = await prisma.beautician.findFirst({
    where: { userId: session.user.id },
    include: {
      user: true,
      services: true,
    },
  });

  if (!beautician) redirect("/login");

  const specialties: string[] = beautician.specialties ? JSON.parse(beautician.specialties) : [];
  const serviceTypes: string[] = beautician.serviceTypes ? JSON.parse(beautician.serviceTypes) : [];

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-charcoal-400 mb-1">
          <Sparkles className="w-4 h-4 text-gold-500" />
          プロフィール
        </div>
        <h1 className="text-3xl font-bold text-charcoal-900">マイプロフィール</h1>
        <p className="text-charcoal-400 mt-1">お客様に表示される情報</p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-cream-200/80 shadow-soft overflow-hidden">
          {/* Profile Header Gradient */}
          <div className="h-24 bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>

          <div className="px-6 pb-6 -mt-10 relative">
            <div className="flex items-end gap-5">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg border-4 border-white">
                {beautician.displayName.charAt(0)}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-charcoal-900">{beautician.displayName}</h2>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                    beautician.status === "APPROVED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    beautician.status === "PENDING" ? "bg-amber-50 text-amber-700 border-amber-200" :
                    "bg-charcoal-50 text-charcoal-500 border-charcoal-200"
                  }`}>
                    {beautician.status === "APPROVED" ? "承認済み" : beautician.status === "PENDING" ? "審査中" : "停止中"}
                  </span>
                </div>
                <p className="text-charcoal-400 text-sm">{beautician.user.name} · {beautician.user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-5 mt-4 text-sm text-charcoal-500">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-charcoal-700">{beautician.rating.toFixed(1)}</span>
                <span className="text-charcoal-300">({beautician.reviewCount}件)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-charcoal-400" />
                {beautician.serviceArea || "未設定"}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-charcoal-400" />
                経験{beautician.yearsExperience}年
              </span>
            </div>

            {beautician.bio && (
              <div className="mt-4 pt-4 border-t border-cream-100">
                <p className="text-sm text-charcoal-600 leading-relaxed">{beautician.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Specialties & Service Types */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-cream-200/80 shadow-soft">
            <h3 className="font-bold text-charcoal-800 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-gold-500" />
              専門分野
            </h3>
            <div className="flex flex-wrap gap-2">
              {specialties.map((s) => (
                <span key={s} className="bg-gold-50 text-gold-700 px-3 py-1.5 rounded-xl text-sm font-semibold border border-gold-200/50">
                  {s}
                </span>
              ))}
              {specialties.length === 0 && (
                <p className="text-sm text-charcoal-400">未設定</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-cream-200/80 shadow-soft">
            <h3 className="font-bold text-charcoal-800 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gold-500" />
              対応形態
            </h3>
            <div className="flex flex-wrap gap-2">
              {serviceTypes.map((t) => (
                <span key={t} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl text-sm font-semibold border border-blue-200/50">
                  {LOCATION_TYPES[t as keyof typeof LOCATION_TYPES] || t}
                </span>
              ))}
              {serviceTypes.length === 0 && (
                <p className="text-sm text-charcoal-400">未設定</p>
              )}
            </div>
          </div>
        </div>

        {/* Services Menu */}
        <div className="bg-white rounded-2xl border border-cream-200/80 shadow-soft overflow-hidden">
          <div className="p-6 border-b border-cream-100">
            <h3 className="font-bold text-charcoal-800 flex items-center gap-2">
              <Scissors className="w-5 h-5 text-gold-500" />
              サービスメニュー
            </h3>
          </div>
          <div className="divide-y divide-cream-100/80">
            {beautician.services.map((service) => (
              <div key={service.id} className="p-5 flex items-center justify-between hover:bg-cream-50/50 transition-colors">
                <div>
                  <p className="font-semibold text-charcoal-800">{service.name}</p>
                  <div className="flex items-center gap-2 text-sm text-charcoal-400 mt-0.5">
                    <span>{SERVICE_CATEGORIES[service.category as keyof typeof SERVICE_CATEGORIES] || service.category}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {service.durationMin}分
                    </span>
                  </div>
                  {service.description && (
                    <p className="text-xs text-charcoal-400 mt-1">{service.description}</p>
                  )}
                </div>
                <span className="text-xl font-bold text-gradient">
                  {formatCurrency(service.price)}
                </span>
              </div>
            ))}
            {beautician.services.length === 0 && (
              <div className="p-8 text-center text-charcoal-400">
                サービスが登録されていません
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
