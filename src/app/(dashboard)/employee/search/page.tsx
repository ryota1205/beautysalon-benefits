import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { LOCATION_TYPES } from "@/lib/constants";
import Link from "next/link";
import { Star, MapPin, Clock, Search, Sparkles, ArrowRight } from "lucide-react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; service?: string }>;
}) {
  const params = await searchParams;

  const beauticians = await prisma.beautician.findMany({
    where: {
      status: "APPROVED",
      ...(params.area ? { serviceArea: { contains: params.area } } : {}),
    },
    include: {
      services: true,
      user: true,
    },
    orderBy: { rating: "desc" },
  });

  const filtered = params.service
    ? beauticians.filter((b) =>
        b.services.some((s) =>
          s.name.includes(params.service!) || s.category === params.service
        )
      )
    : beauticians;

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-charcoal-400 mb-1">
          <Sparkles className="w-4 h-4 text-gold-500" />
          美容師を探す
        </div>
        <h1 className="text-3xl font-bold text-charcoal-900">美容師検索</h1>
        <p className="text-charcoal-400 mt-1">{filtered.length}名の美容師が見つかりました</p>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-2xl border border-cream-200/80 p-5 mb-8 shadow-soft">
        <form className="flex flex-wrap gap-3" method="GET">
          <div className="relative flex-1 min-w-[200px]">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" />
            <input
              type="text"
              name="area"
              defaultValue={params.area || ""}
              placeholder="エリアで検索..."
              className="w-full pl-11 pr-4 py-3 bg-cream-50/50 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white text-sm text-charcoal-800 placeholder-charcoal-300 transition-all"
            />
          </div>
          <div className="relative">
            <select
              name="service"
              defaultValue={params.service || ""}
              className="pl-4 pr-10 py-3 bg-cream-50/50 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white text-sm text-charcoal-800 appearance-none cursor-pointer transition-all"
            >
              <option value="">すべてのサービス</option>
              <option value="CUT">カット</option>
              <option value="COLOR">カラー</option>
              <option value="PERM">パーマ</option>
              <option value="TREATMENT">トリートメント</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn-primary px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            検索
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="space-y-4 stagger-children">
        {filtered.map((beautician) => {
          const specialties: string[] = beautician.specialties
            ? JSON.parse(beautician.specialties)
            : [];
          const serviceTypes: string[] = beautician.serviceTypes
            ? JSON.parse(beautician.serviceTypes)
            : [];
          const lowestPrice = beautician.services.length > 0
            ? Math.min(...beautician.services.map((s) => s.price))
            : 0;

          return (
            <Link
              key={beautician.id}
              href={`/employee/booking/${beautician.id}`}
              className="group block bg-white rounded-2xl border border-cream-200/80 shadow-soft card-hover overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start gap-5">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    {beautician.displayName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-charcoal-800 text-lg">
                            {beautician.displayName}
                          </h3>
                          <ArrowRight className="w-4 h-4 text-charcoal-300 group-hover:text-gold-500 group-hover:translate-x-1 transition-all" />
                        </div>
                        <div className="flex items-center gap-4 mt-1.5 text-sm text-charcoal-400">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="font-semibold text-charcoal-700">{beautician.rating.toFixed(1)}</span>
                            <span className="text-charcoal-300">({beautician.reviewCount})</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {beautician.serviceArea}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            経験{beautician.yearsExperience}年
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xl font-bold text-gradient">
                          {formatCurrency(lowestPrice)}〜
                        </p>
                      </div>
                    </div>

                    {beautician.bio && (
                      <p className="text-sm text-charcoal-400 mt-3 line-clamp-2 leading-relaxed">
                        {beautician.bio}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mt-3">
                      {specialties.map((s) => (
                        <span key={s} className="bg-gold-50 text-gold-700 px-3 py-1 rounded-lg text-xs font-semibold border border-gold-200/50">
                          {s}
                        </span>
                      ))}
                      {serviceTypes.map((t) => (
                        <span key={t} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-semibold border border-blue-200/50">
                          {LOCATION_TYPES[t as keyof typeof LOCATION_TYPES] || t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <div className="bg-white p-12 rounded-2xl border border-cream-200 text-center shadow-soft">
            <Search className="w-12 h-12 text-charcoal-200 mx-auto mb-3" />
            <p className="text-charcoal-400 text-lg">条件に一致する美容師が見つかりませんでした</p>
            <p className="text-charcoal-300 text-sm mt-1">検索条件を変更してお試しください</p>
          </div>
        )}
      </div>
    </div>
  );
}
