"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Scissors, Mail, Lock, Loader2, Sparkles, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("メールアドレスまたはパスワードが正しくありません");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { label: "管理者", email: "admin@beauty-benefits.jp", role: "Platform Admin", gradient: "from-purple-500 to-indigo-600" },
    { label: "企業", email: "admin@techstart.jp", role: "Company Admin", gradient: "from-blue-500 to-cyan-600" },
    { label: "社員", email: "yamada@techstart.jp", role: "Employee", gradient: "from-emerald-500 to-teal-600" },
    { label: "美容師", email: "miyu@beauty.jp", role: "Beautician", gradient: "from-rose-500 to-pink-600" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-cream-50">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-gold-200/30 via-gold-100/20 to-transparent rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-rose-200/20 via-cream-200/30 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-gradient-to-r from-gold-100/20 to-cream-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-700 rounded-2xl flex items-center justify-center shadow-gold group-hover:scale-105 transition-transform">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-semibold text-charcoal-800 tracking-tight">
                Beauty Benefits
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-charcoal-900 mb-2">
              おかえりなさい
            </h1>
            <p className="text-charcoal-400">
              アカウントにサインインしてください
            </p>
          </div>

          {/* Login Form Card */}
          <div className="glass rounded-3xl p-8 shadow-soft-lg">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-rose-50 text-rose-600 text-sm p-4 rounded-2xl border border-rose-100 flex items-center gap-2 animate-scale-in">
                  <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-rose-500 text-xs font-bold">!</span>
                  </div>
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-charcoal-700 pl-1">
                  メールアドレス
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors">
                    <Mail className="w-5 h-5 text-charcoal-300 group-focus-within:text-gold-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mail@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white/60 border border-cream-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white text-charcoal-800 placeholder-charcoal-300 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-charcoal-700 pl-1">
                  パスワード
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors">
                    <Lock className="w-5 h-5 text-charcoal-300 group-focus-within:text-gold-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white/60 border border-cream-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white text-charcoal-800 placeholder-charcoal-300 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 rounded-2xl font-medium disabled:opacity-50 flex items-center justify-center gap-2 text-base mt-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    ログイン
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-charcoal-400">
              アカウントをお持ちでない方は{" "}
              <Link href="/register" className="text-gold-600 hover:text-gold-700 font-medium transition-colors">
                新規登録
              </Link>
            </div>
          </div>

          {/* Demo Accounts */}
          <div className="mt-6 glass rounded-3xl p-6 shadow-soft animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-gold-500" />
              <p className="text-sm font-medium text-charcoal-700">
                デモアカウント
              </p>
              <span className="text-xs text-charcoal-400 ml-auto">
                PW: password123
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => {
                    setEmail(account.email);
                    setPassword("password123");
                  }}
                  className="group relative p-3 rounded-2xl border border-cream-200 bg-white/40 hover:bg-white hover:shadow-soft-md hover:border-gold-200 transition-all text-left"
                >
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${account.gradient} flex items-center justify-center mb-2 group-hover:scale-105 transition-transform`}>
                    <span className="text-white text-xs font-bold">
                      {account.label.charAt(0)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-charcoal-700">{account.label}</p>
                  <p className="text-xs text-charcoal-400 truncate">{account.email}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
