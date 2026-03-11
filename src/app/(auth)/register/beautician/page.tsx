"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Scissors, Loader2, ArrowLeft, Check, Mail, Lock, MapPin, Clock, User, FileText } from "lucide-react";

export default function BeauticianRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    displayName: "",
    email: "",
    password: "",
    serviceArea: "",
    yearsExperience: "",
    bio: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register/beautician", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          yearsExperience: form.yearsExperience ? parseInt(form.yearsExperience) : 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "登録に失敗しました");
      }

      router.push("/login?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "登録に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-12 pr-4 py-3.5 bg-white/60 border border-cream-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white text-charcoal-800 placeholder-charcoal-300 transition-all";

  return (
    <div className="min-h-screen relative overflow-hidden bg-cream-50">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-rose-200/20 via-pink-100/20 to-transparent rounded-full blur-3xl -translate-y-1/3 -translate-x-1/3" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-gold-200/20 via-cream-200/20 to-transparent rounded-full blur-3xl translate-y-1/3 translate-x-1/3" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Back link */}
          <Link href="/register" className="inline-flex items-center gap-2 text-sm text-charcoal-400 hover:text-charcoal-700 transition-colors mb-6 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            登録タイプ選択に戻る
          </Link>

          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl shadow-lg shadow-rose-500/20 mb-5">
              <Scissors className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-charcoal-900 mb-2">
              美容師登録
            </h1>
            <p className="text-charcoal-400">
              空き時間を活用して収入アップ
            </p>
          </div>

          {/* Registration Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {["プロフィール", "審査", "利用開始"].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 0
                    ? "bg-gradient-to-br from-gold-500 to-gold-600 text-white shadow-gold"
                    : "bg-cream-200 text-charcoal-400"
                }`}>
                  {i === 0 ? "1" : i === 1 ? "2" : <Check className="w-3 h-3" />}
                </div>
                <span className={`text-xs font-medium ${i === 0 ? "text-charcoal-700" : "text-charcoal-400"}`}>
                  {step}
                </span>
                {i < 2 && <div className="w-6 h-px bg-cream-300 mx-1" />}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className="glass rounded-3xl p-8 shadow-soft-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-rose-50 text-rose-600 text-sm p-4 rounded-2xl border border-rose-100 animate-scale-in">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-charcoal-700 pl-1">
                    お名前 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-300 group-focus-within:text-gold-500 transition-colors" />
                    <input type="text" name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="山田 花子" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-charcoal-700 pl-1">
                    表示名 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-300 group-focus-within:text-gold-500 transition-colors" />
                    <input type="text" name="displayName" value={form.displayName} onChange={handleChange} required className={inputClass} placeholder="Hanako" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-charcoal-700 pl-1">
                  メールアドレス <span className="text-rose-500">*</span>
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-300 group-focus-within:text-gold-500 transition-colors" />
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} placeholder="hanako@beauty.jp" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-charcoal-700 pl-1">
                  パスワード <span className="text-rose-500">*</span>
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-300 group-focus-within:text-gold-500 transition-colors" />
                  <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} className={inputClass} placeholder="8文字以上" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-charcoal-700 pl-1">
                    対応エリア <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-300 group-focus-within:text-gold-500 transition-colors" />
                    <input type="text" name="serviceArea" value={form.serviceArea} onChange={handleChange} required className={inputClass} placeholder="渋谷区" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-charcoal-700 pl-1">
                    経験年数
                  </label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-300 group-focus-within:text-gold-500 transition-colors" />
                    <input type="number" name="yearsExperience" value={form.yearsExperience} onChange={handleChange} min={0} className={inputClass} placeholder="5" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-charcoal-700 pl-1">
                  自己紹介
                </label>
                <div className="relative group">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-charcoal-300 group-focus-within:text-gold-500 transition-colors" />
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/60 border border-cream-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white text-charcoal-800 placeholder-charcoal-300 transition-all resize-none"
                    placeholder="得意な施術やアピールポイント"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 rounded-2xl font-medium disabled:opacity-50 flex items-center justify-center gap-2 text-base mt-3"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "美容師登録する"
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center text-sm text-charcoal-400">
            すでにアカウントをお持ちの方は{" "}
            <Link href="/login" className="text-gold-600 hover:text-gold-700 font-medium transition-colors">
              ログイン
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
