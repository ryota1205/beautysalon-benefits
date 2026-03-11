"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";

export function BookingActions({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: "confirm" | "cancel") => {
    setLoading(action);
    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action === "confirm" ? "CONFIRMED" : "CANCELLED" }),
      });
      router.refresh();
    } catch {
      // Error handling
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleAction("confirm")}
        disabled={!!loading}
        className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-xl hover:from-emerald-600 hover:to-teal-700 text-sm font-semibold disabled:opacity-50 transition-all shadow-sm"
      >
        {loading === "confirm" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        承認
      </button>
      <button
        onClick={() => handleAction("cancel")}
        disabled={!!loading}
        className="inline-flex items-center gap-1.5 border border-charcoal-200 text-charcoal-500 px-4 py-2 rounded-xl hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-sm font-semibold disabled:opacity-50 transition-all"
      >
        {loading === "cancel" ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
        拒否
      </button>
    </div>
  );
}
