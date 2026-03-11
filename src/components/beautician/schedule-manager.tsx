"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LOCATION_TYPES } from "@/lib/constants";
import { Plus, Loader2, MapPin, Clock, Calendar, CheckCircle2, X } from "lucide-react";

interface ScheduleData {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  locationType: string;
  locationName: string | null;
}

export function ScheduleManager({
  schedules,
  beauticianId,
}: {
  schedules: ScheduleData[];
  beauticianId: string;
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    date: "",
    startTime: "10:00",
    endTime: "18:00",
    locationType: "ON_SITE",
    locationName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, beauticianId }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ date: "", startTime: "10:00", endTime: "18:00", locationType: "ON_SITE", locationName: "" });
        router.refresh();
      }
    } catch {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  const futureSchedules = schedules.filter(
    (s) => new Date(s.date) >= new Date(today.toISOString().split("T")[0])
  );

  const inputClass = "w-full px-4 py-3 bg-cream-50/50 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white text-charcoal-800 transition-all";

  return (
    <div>
      {/* Add Schedule */}
      <div className="mb-6">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary px-5 py-3 rounded-xl font-medium text-sm inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            スケジュールを追加
          </button>
        ) : (
          <div className="bg-white p-6 rounded-2xl border border-cream-200/80 shadow-soft animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-charcoal-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold-500" />
                新しいスケジュール
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-lg hover:bg-cream-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-charcoal-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">日付</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                  min={today.toISOString().split("T")[0]}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">場所タイプ</label>
                <select
                  value={form.locationType}
                  onChange={(e) => setForm({ ...form, locationType: e.target.value })}
                  className={inputClass}
                >
                  {Object.entries(LOCATION_TYPES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">開始時間</label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">終了時間</label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  required
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">場所名（任意）</label>
                <input
                  type="text"
                  value={form.locationName}
                  onChange={(e) => setForm({ ...form, locationName: e.target.value })}
                  placeholder="例: Beauty Salon GRACE"
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2 flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-6 py-3 rounded-xl font-medium text-sm disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  追加する
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="border border-cream-200 text-charcoal-600 px-6 py-3 rounded-xl hover:bg-cream-50 text-sm font-medium transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Schedule List */}
      <div className="grid gap-3 stagger-children">
        {futureSchedules.map((schedule) => (
          <div key={schedule.id} className="bg-white p-5 rounded-2xl border border-cream-200/80 shadow-soft flex items-center justify-between card-hover">
            <div className="flex items-center gap-5">
              {/* Date Badge */}
              <div className="w-16 h-16 bg-gradient-to-br from-gold-50 to-cream-50 rounded-xl border border-gold-200/50 flex flex-col items-center justify-center">
                <p className="text-xl font-bold text-charcoal-800 leading-none">
                  {new Date(schedule.date).getDate()}
                </p>
                <p className="text-xs text-charcoal-400 mt-0.5">
                  {new Date(schedule.date).toLocaleDateString("ja-JP", { month: "short" })}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-charcoal-700">
                    {schedule.startTime} 〜 {schedule.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm text-charcoal-500">
                    {LOCATION_TYPES[schedule.locationType as keyof typeof LOCATION_TYPES]}
                    {schedule.locationName && ` - ${schedule.locationName}`}
                  </span>
                </div>
              </div>
            </div>
            <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
              schedule.isAvailable
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-charcoal-50 text-charcoal-500 border-charcoal-200"
            }`}>
              {schedule.isAvailable ? "空き" : "埋まり"}
            </span>
          </div>
        ))}
        {futureSchedules.length === 0 && (
          <div className="bg-white p-12 rounded-2xl border border-cream-200/80 shadow-soft text-center">
            <Calendar className="w-12 h-12 text-charcoal-200 mx-auto mb-3" />
            <p className="text-charcoal-400 font-medium">スケジュールが設定されていません</p>
            <p className="text-charcoal-300 text-sm mt-1">上のボタンから追加してください</p>
          </div>
        )}
      </div>
    </div>
  );
}
