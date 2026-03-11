import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { BOOKING_STATUSES, LOCATION_TYPES } from "@/lib/constants";
import Link from "next/link";
import { Search } from "lucide-react";

export default async function BookingListPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const employee = await prisma.employee.findFirst({
    where: { userId: session.user.id },
    include: {
      bookings: {
        include: {
          beautician: true,
          service: true,
          payment: true,
        },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!employee) redirect("/login");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingBookings = employee.bookings.filter(
    (b) => new Date(b.date) >= today && b.status !== "CANCELLED" && b.status !== "COMPLETED"
  );
  const pastBookings = employee.bookings.filter(
    (b) => new Date(b.date) < today || b.status === "COMPLETED" || b.status === "CANCELLED"
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">予約一覧</h1>
          <p className="text-charcoal-500 mt-1">予約の確認と管理</p>
        </div>
        <Link
          href="/employee/search"
          className="inline-flex items-center gap-2 bg-gold-600 text-white px-4 py-2.5 rounded-lg hover:bg-gold-700 transition-colors font-medium text-sm"
        >
          <Search className="w-4 h-4" />
          新しい予約
        </Link>
      </div>

      {/* Upcoming Bookings */}
      {upcomingBookings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-charcoal-800 mb-4">
            今後の予約 ({upcomingBookings.length}件)
          </h2>
          <div className="grid gap-3">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="bg-white p-5 rounded-xl border-2 border-gold-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center text-lg font-bold text-gold-600">
                      {booking.beautician.displayName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal-800">{booking.beautician.displayName}</p>
                      <p className="text-sm text-charcoal-500 mt-0.5">{booking.service.name}</p>
                      <p className="text-sm text-charcoal-500">
                        {new Date(booking.date).toLocaleDateString("ja-JP", {
                          year: "numeric", month: "long", day: "numeric", weekday: "short",
                        })}{" "}
                        {booking.startTime}〜{booking.endTime}
                      </p>
                      <p className="text-xs text-charcoal-400 mt-1">
                        {LOCATION_TYPES[booking.locationType as keyof typeof LOCATION_TYPES]}
                        {booking.locationDetail && ` - ${booking.locationDetail}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      booking.status === "CONFIRMED" ? "bg-blue-50 text-blue-700" :
                      "bg-yellow-50 text-yellow-700"
                    }`}>
                      {BOOKING_STATUSES[booking.status as keyof typeof BOOKING_STATUSES]}
                    </span>
                    <p className="text-lg font-bold text-charcoal-800 mt-2">
                      {booking.payment
                        ? formatCurrency(booking.payment.employeePayment)
                        : formatCurrency(booking.service.price)}
                    </p>
                    <p className="text-xs text-charcoal-400">自己負担</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Bookings */}
      <div>
        <h2 className="text-lg font-semibold text-charcoal-800 mb-4">過去の予約</h2>
        <div className="bg-white rounded-xl border border-cream-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cream-100 bg-cream-50">
                  <th className="text-left py-3 px-5 text-sm font-medium text-charcoal-500">日付</th>
                  <th className="text-left py-3 px-5 text-sm font-medium text-charcoal-500">美容師</th>
                  <th className="text-left py-3 px-5 text-sm font-medium text-charcoal-500">サービス</th>
                  <th className="text-left py-3 px-5 text-sm font-medium text-charcoal-500">料金</th>
                  <th className="text-left py-3 px-5 text-sm font-medium text-charcoal-500">会社補助</th>
                  <th className="text-left py-3 px-5 text-sm font-medium text-charcoal-500">自己負担</th>
                  <th className="text-left py-3 px-5 text-sm font-medium text-charcoal-500">ステータス</th>
                </tr>
              </thead>
              <tbody>
                {pastBookings.map((b) => (
                  <tr key={b.id} className="border-b border-cream-50 hover:bg-cream-50">
                    <td className="py-3 px-5 text-sm text-charcoal-500">
                      {new Date(b.date).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="py-3 px-5 text-sm text-charcoal-700">{b.beautician.displayName}</td>
                    <td className="py-3 px-5 text-sm text-charcoal-700">{b.service.name}</td>
                    <td className="py-3 px-5 text-sm text-charcoal-700">{formatCurrency(b.service.price)}</td>
                    <td className="py-3 px-5 text-sm text-green-700">
                      {b.payment ? `-${formatCurrency(b.payment.companySubsidy)}` : "—"}
                    </td>
                    <td className="py-3 px-5 text-sm font-medium text-charcoal-800">
                      {b.payment ? formatCurrency(b.payment.employeePayment) : "—"}
                    </td>
                    <td className="py-3 px-5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        b.status === "COMPLETED" ? "bg-green-50 text-green-700" :
                        b.status === "CANCELLED" ? "bg-charcoal-50 text-charcoal-500" :
                        "bg-blue-50 text-blue-700"
                      }`}>
                        {BOOKING_STATUSES[b.status as keyof typeof BOOKING_STATUSES] || b.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {pastBookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-charcoal-400">
                      過去の予約はありません
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
