"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, CheckCircle2 } from "lucide-react";

interface FeeConfig {
  id: string;
  defaultFeePercent: number;
  minFeePercent: number;
  maxFeePercent: number;
}

export function FeeConfigForm({ config }: { config: FeeConfig | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    defaultFeePercent: config?.defaultFeePercent || 20,
    minFeePercent: config?.minFeePercent || 15,
    maxFeePercent: config?.maxFeePercent || 25,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await fetch("/api/admin/fees", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: config?.id }),
      });
      setSuccess(true);
      router.refresh();
    } catch {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-cream-50/50 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white text-charcoal-800 transition-all";

  return (
    <div className="bg-white p-6 rounded-2xl border border-cream-200/80 shadow-soft">
      <h2 className="text-lg font-bold text-charcoal-800 mb-6">手数料率の設定</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
            デフォルト手数料率 (%)
          </label>
          <input
            type="number"
            value={form.defaultFeePercent}
            onChange={(e) => setForm({ ...form, defaultFeePercent: parseFloat(e.target.value) })}
            min={0}
            max={100}
            step={0.5}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
              最低手数料率 (%)
            </label>
            <input
              type="number"
              value={form.minFeePercent}
              onChange={(e) => setForm({ ...form, minFeePercent: parseFloat(e.target.value) })}
              min={0}
              max={100}
              step={0.5}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
              最高手数料率 (%)
            </label>
            <input
              type="number"
              value={form.maxFeePercent}
              onChange={(e) => setForm({ ...form, maxFeePercent: parseFloat(e.target.value) })}
              min={0}
              max={100}
              step={0.5}
              className={inputClass}
            />
          </div>
        </div>

        {success && (
          <div className="bg-emerald-50 text-emerald-700 text-sm p-4 rounded-xl border border-emerald-200 flex items-center gap-2 animate-scale-in">
            <CheckCircle2 className="w-4 h-4" />
            設定を保存しました
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-6 py-3 rounded-xl font-medium text-sm disabled:opacity-50 inline-flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          設定を保存
        </button>
      </form>
    </div>
  );
}
