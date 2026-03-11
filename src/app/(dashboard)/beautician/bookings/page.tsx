import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { BOOKING_STATUSES, LOCATION_TYPES } from "@/lib/constants";
import { BookingActions } from "@/components/beautician/booking-actions";
import { Sparkles, AlertCircle, Calendar, MapPin } from "lucide-react";

export default async function BeauticianBookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const beautician = await prisma.beautician.findFirst({
    where: { userId: session.user.id },
    include: {
      bookings: {
        include: {
          employee: { include: { user: true } },
          company: true,
          service: true,
        },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!beautician) redirect("/login");

  const pendingBookings = beautician.bookings.filter((b) => b.status === "PENDING");
  const otherBookings = beautician.bookings.filter((b) => b.status !== "PENDING");

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-charcoal-400 mb-1">
          <Sparkles className="w-4 h-4 text-gold-500" />
          予約管理
        </div>
        <h1 className="text-3xl font-bold text-charcoal-900">予約リクエスト</h1>
        <p className="text-charcoal-400 mt-1">予約リクエストの確認・管理</p>
      </div>

      {/* Pending Requests */}
      {pendingBookings.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-charcoal-800">
              承認待ち ({pendingBookings.length}件)
            </h2>
          </div>
          <div className="grid gap-3 stagger-children">
            {pendingBookings.map((booking) => (
              <div key={booking.id} className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-200/50 shadow-soft card-hover">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                      <span className="text-white font-bold">{booking.employee.user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-bold text-charcoal-800">
                        {booking.employee.user.name}
                        <span className="text-charcoal-400 font-normal ml-2 text-sm">
                          {booking.company.name}
                        </span>
                      </p>
                      <div className="flex items-center gap-3 text-sm text-charcoal-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(booking.date).toLocaleDateString("ja-JP")} {booking.startTime}〜{booking.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm font-semibold text-gold-600">{booking.service.name}</span>
                        <span className="text-sm text-charcoal-400">{formatCurrency(booking.service.price)}</span>
                        <span className="text-xs text-charcoal-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {LOCATION_TYPES[booking.locationType as keyof typeof LOCATION_TYPES]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <BookingActions bookingId={booking.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Bookings */}
      <div className="bg-white rounded-2xl border border-cream-200/80 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-cream-100">
          <h2 className="text-lg font-bold text-charcoal-800">すべての予約</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-100 bg-cream-50/50">
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">日付</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">お客様</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">企業</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">サービス</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">時間</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">料金</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {otherBookings.map((b) => (
                <tr key={b.id} className="border-b border-cream-50 hover:bg-cream-50/50 transition-colors">
                  <td className="py-3.5 px-5 text-sm text-charcoal-400">{new Date(b.date).toLocaleDateString("ja-JP")}</td>
                  <td className="py-3.5 px-5 text-sm text-charcoal-600">{b.employee.user.name}</td>
                  <td className="py-3.5 px-5 text-sm text-charcoal-400">{b.company.name}</td>
                  <td className="py-3.5 px-5 text-sm text-charcoal-600">{b.service.name}</td>
                  <td className="py-3.5 px-5 text-sm text-charcoal-400">{b.startTime}〜{b.endTime}</td>
                  <td className="py-3.5 px-5 text-sm font-medium text-charcoal-700">{formatCurrency(b.service.price)}</td>
                  <td className="py-3.5 px-5">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                      b.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      b.status === "CONFIRMED" ? "bg-blue-50 text-blue-700 border-blue-200" :
                      "bg-charcoal-50 text-charcoal-500 border-charcoal-200"
                    }`}>
                      {BOOKING_STATUSES[b.status as keyof typeof BOOKING_STATUSES] || b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {otherBookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Calendar className="w-10 h-10 text-charcoal-200 mx-auto mb-3" />
                    <p className="text-charcoal-400">予約履歴がありません</p>
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
