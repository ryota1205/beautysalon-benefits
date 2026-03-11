"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Building2, ArrowLeft, Check, Mail, Lock, Phone, Briefcase, User } from "lucide-react";

export default function CompanyRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    companyName: "",
    adminName: "",
    email: "",
    password: "",
    phone: "",
    industry: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-200/20 via-gold-100/20 to-transparent rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-200/20 via-cream-200/20 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20 mb-5">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-charcoal-900 mb-2">
              企業登録
            </h1>
            <p className="text-charcoal-400">
              福利厚生として美容サービスを導入
            </p>
          </div>

          {/* Registration Steps Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {["基本情報", "審査", "利用開始"].map((step, i) => (
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

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-charcoal-700 pl-1">
                  会社名 <span className="text-rose-500">*</span>
                </label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-300 group-focus-within:text-gold-500 transition-colors" />
                  <input type="text" name="companyName" value={form.companyName} onChange={handleChange} required className={inputClass} placeholder="株式会社〇〇" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-charcoal-700 pl-1">
                  担当者名 <span className="text-rose-500">*</span>
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-300 group-focus-within:text-gold-500 transition-colors" />
                  <input type="text" name="adminName" value={form.adminName} onChange={handleChange} required className={inputClass} placeholder="山田 太郎" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-charcoal-700 pl-1">
                  メールアドレス <span className="text-rose-500">*</span>
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-300 group-focus-within:text-gold-500 transition-colors" />
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} placeholder="admin@company.jp" />
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
                    電話番号
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-300 group-focus-within:text-gold-500 transition-colors" />
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputClass} placeholder="03-1234-5678" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-charcoal-700 pl-1">
                    業種
                  </label>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-300 group-focus-within:text-gold-500 transition-colors pointer-events-none" />
                    <select name="industry" value={form.industry} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="">選択</option>
                      <option value="IT">IT</option>
                      <option value="デザイン">デザイン</option>
                      <option value="金融">金融</option>
                      <option value="コンサルティング">コンサル</option>
                      <option value="メーカー">製造業</option>
                      <option value="その他">その他</option>
                    </select>
                  </div>
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
                  "企業登録する"
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
