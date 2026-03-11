"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { calculatePayment } from "@/lib/payment";
import { LOCATION_TYPES, SERVICE_CATEGORIES } from "@/lib/constants";
import { CheckCircle2, Loader2, ArrowLeft, ArrowRight, Calendar, MapPin, Clock, Sparkles } from "lucide-react";

interface Service {
  id: string;
  name: string;
  price: number;
  durationMin: number;
  category: string;
}

interface Schedule {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  locationType: string;
  locationName: string | null;
}

interface Props {
  beautician: {
    id: string;
    displayName: string;
    services: Service[];
    schedules: Schedule[];
  };
  employeeId: string;
  companyId: string;
  contract: { subsidyPercentage: number; maxSubsidyPerUse: number } | null;
  platformFeePercent: number;
}

export function BookingForm({ beautician, employeeId, companyId, contract, platformFeePercent }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const payment = selectedService && contract
    ? calculatePayment(selectedService.price, contract, platformFeePercent)
    : null;

  const generateTimeSlots = (schedule: Schedule, duration: number) => {
    const slots: string[] = [];
    const [startH, startM] = schedule.startTime.split(":").map(Number);
    const [endH, endM] = schedule.endTime.split(":").map(Number);
    const startMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;

    for (let min = startMin; min + duration <= endMin; min += 30) {
      const h = Math.floor(min / 60);
      const m = min % 60;
      slots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    }
    return slots;
  };

  const handleSubmit = async () => {
    if (!selectedService || !selectedSchedule || !selectedTime) return;
    setLoading(true);

    try {
      const endMinutes =
        parseInt(selectedTime.split(":")[0]) * 60 +
        parseInt(selectedTime.split(":")[1]) +
        selectedService.durationMin;
      const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, "0")}:${(endMinutes % 60).toString().padStart(2, "0")}`;

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          beauticianId: beautician.id,
          companyId,
          serviceId: selectedService.id,
          date: selectedSchedule.date.split("T")[0],
          startTime: selectedTime,
          endTime,
          locationType: selectedSchedule.locationType,
          locationDetail: selectedSchedule.locationName,
          notes,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      }
    } catch {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto bg-white p-10 rounded-3xl border border-cream-200 text-center shadow-soft-lg animate-scale-in">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-charcoal-900 mb-2">予約が完了しました！</h2>
        <p className="text-charcoal-400 mb-8">
          {beautician.displayName}さんからの承認をお待ちください。
        </p>
        <button
          onClick={() => router.push("/employee/booking")}
          className="btn-primary px-8 py-3 rounded-xl font-medium"
        >
          予約一覧へ
        </button>
      </div>
    );
  }

  const uniqueDates = [...new Set(beautician.schedules.map((s) => s.date.split("T")[0]))];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-10 px-4">
        {["サービス選択", "日時選択", "確認・予約"].map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
              step > i + 1 ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm" :
              step === i + 1 ? "bg-gradient-to-br from-gold-500 to-gold-600 text-white shadow-gold" :
              "bg-cream-200 text-charcoal-400"
            }`}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span className={`text-sm hidden sm:block font-medium ${step === i + 1 ? "text-charcoal-800" : "text-charcoal-400"}`}>
              {label}
            </span>
            {i < 2 && <div className={`flex-1 h-0.5 rounded-full ${step > i + 1 ? "bg-emerald-400" : "bg-cream-200"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Select Service */}
      {step === 1 && (
        <div className="space-y-3 animate-fade-in">
          <h2 className="text-xl font-bold text-charcoal-800 mb-5">サービスを選択</h2>
          {beautician.services.map((service) => (
            <button
              key={service.id}
              onClick={() => { setSelectedService(service); setStep(2); }}
              className={`group w-full text-left p-5 rounded-2xl border-2 transition-all card-hover ${
                selectedService?.id === service.id
                  ? "border-gold-400 bg-gold-50 shadow-gold"
                  : "border-cream-200 bg-white hover:border-gold-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-charcoal-800">{service.name}</p>
                  <div className="flex items-center gap-3 text-sm text-charcoal-400 mt-1">
                    <span>{SERVICE_CATEGORIES[service.category as keyof typeof SERVICE_CATEGORIES]}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {service.durationMin}分
                    </span>
                  </div>
                </div>
                <span className="text-xl font-bold text-gradient">{formatCurrency(service.price)}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Select Date & Time */}
      {step === 2 && selectedService && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-charcoal-800 mb-5">日時を選択</h2>

          {/* Date Selection */}
          <div className="mb-6">
            <p className="text-sm font-medium text-charcoal-600 mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gold-500" />
              日付を選択
            </p>
            <div className="flex flex-wrap gap-2">
              {uniqueDates.map((date) => {
                const d = new Date(date);
                const isSelected = selectedSchedule?.date.startsWith(date);
                return (
                  <button
                    key={date}
                    onClick={() => {
                      const schedule = beautician.schedules.find((s) => s.date.startsWith(date));
                      if (schedule) {
                        setSelectedSchedule(schedule);
                        setSelectedTime("");
                      }
                    }}
                    className={`px-4 py-3 rounded-xl border-2 text-center min-w-[85px] transition-all ${
                      isSelected ? "border-gold-400 bg-gold-50 shadow-gold" : "border-cream-200 bg-white hover:border-gold-200 card-hover"
                    }`}
                  >
                    <p className="text-xs text-charcoal-400">
                      {d.toLocaleDateString("ja-JP", { weekday: "short" })}
                    </p>
                    <p className="text-xl font-bold text-charcoal-800">{d.getDate()}</p>
                    <p className="text-xs text-charcoal-400">
                      {d.toLocaleDateString("ja-JP", { month: "short" })}
                    </p>
                  </button>
                );
              })}
            </div>
            {uniqueDates.length === 0 && (
              <p className="text-charcoal-400 text-sm bg-cream-50 p-4 rounded-xl">利用可能な日程がありません</p>
            )}
          </div>

          {/* Time Selection */}
          {selectedSchedule && (
            <div className="mb-6">
              <p className="text-sm font-medium text-charcoal-600 mb-3 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gold-500" />
                時間を選択
                <span className="text-charcoal-300 font-normal ml-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {LOCATION_TYPES[selectedSchedule.locationType as keyof typeof LOCATION_TYPES]}
                  {selectedSchedule.locationName && ` - ${selectedSchedule.locationName}`}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {generateTimeSlots(selectedSchedule, selectedService.durationMin).map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                      selectedTime === time
                        ? "border-gold-400 bg-gold-50 text-gold-700 shadow-gold"
                        : "border-cream-200 bg-white hover:border-gold-200 text-charcoal-700"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 border border-cream-200 text-charcoal-500 px-5 py-3 rounded-xl hover:bg-cream-50 text-sm font-medium transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> 戻る
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!selectedTime}
              className="flex items-center gap-1.5 btn-primary px-6 py-3 rounded-xl text-sm font-medium disabled:opacity-50"
            >
              確認へ <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && selectedService && selectedSchedule && selectedTime && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-xl font-bold text-charcoal-800 mb-5">予約内容の確認</h2>

          <div className="bg-white p-6 rounded-2xl border border-cream-200/80 shadow-soft space-y-0">
            {[
              { label: "美容師", value: beautician.displayName },
              { label: "サービス", value: selectedService.name },
              { label: "日時", value: `${new Date(selectedSchedule.date).toLocaleDateString("ja-JP")} ${selectedTime}〜` },
              { label: "場所", value: LOCATION_TYPES[selectedSchedule.locationType as keyof typeof LOCATION_TYPES] },
            ].map((item, i) => (
              <div key={item.label} className={`flex justify-between py-3.5 ${i < 3 ? "border-b border-cream-100" : ""}`}>
                <span className="text-sm text-charcoal-400">{item.label}</span>
                <span className="text-sm font-semibold text-charcoal-800">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Payment Breakdown */}
          {payment && (
            <div className="bg-gradient-to-br from-gold-50 to-cream-50 p-6 rounded-2xl border border-gold-200/50 shadow-soft">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-gold-500" />
                <h3 className="font-bold text-charcoal-800">料金内訳</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-500">サービス料金</span>
                  <span className="font-medium text-charcoal-800">{formatCurrency(payment.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-600">会社補助</span>
                  <span className="font-semibold text-emerald-600">-{formatCurrency(payment.companySubsidy)}</span>
                </div>
                <div className="border-t border-gold-200 pt-3 flex justify-between items-baseline">
                  <span className="font-bold text-charcoal-900">あなたのお支払い</span>
                  <span className="text-2xl font-bold text-gradient">
                    {formatCurrency(payment.employeePayment)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-charcoal-600 mb-1.5">備考（任意）</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 bg-cream-50/50 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white text-sm text-charcoal-800 placeholder-charcoal-300 transition-all resize-none"
              placeholder="美容師へのメッセージがあればお書きください"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 border border-cream-200 text-charcoal-500 px-5 py-3 rounded-xl hover:bg-cream-50 text-sm font-medium transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> 戻る
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 btn-primary py-3.5 rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "予約を確定する"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
