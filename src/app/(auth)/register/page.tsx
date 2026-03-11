import Link from "next/link";
import { Scissors, Building2, UserCheck, ArrowRight, Sparkles } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-cream-50">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-gold-200/30 via-cream-200/20 to-transparent rounded-full blur-3xl -translate-y-1/3 -translate-x-1/3" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-rose-200/20 via-gold-100/20 to-transparent rounded-full blur-3xl translate-y-1/3 translate-x-1/3" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg animate-fade-in">
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
              新規登録
            </h1>
            <p className="text-charcoal-400">
              登録タイプを選択してください
            </p>
          </div>

          {/* Registration Options */}
          <div className="space-y-4 stagger-children">
            {/* Company Registration */}
            <Link
              href="/register/company"
              className="group block glass rounded-3xl p-7 shadow-soft hover:shadow-soft-lg transition-all card-hover"
            >
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-lg shadow-blue-500/20">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h2 className="text-lg font-bold text-charcoal-800">
                      企業として登録
                    </h2>
                    <ArrowRight className="w-4 h-4 text-charcoal-300 group-hover:text-gold-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-charcoal-500 leading-relaxed">
                    福利厚生として美容サービスを社員に提供したい企業・人事担当者の方はこちら
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-charcoal-400">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-gold-500" />
                      社員満足度UP
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-gold-500" />
                      採用力強化
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Beautician Registration */}
            <Link
              href="/register/beautician"
              className="group block glass rounded-3xl p-7 shadow-soft hover:shadow-soft-lg transition-all card-hover"
            >
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-lg shadow-rose-500/20">
                  <UserCheck className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h2 className="text-lg font-bold text-charcoal-800">
                      美容師として登録
                    </h2>
                    <ArrowRight className="w-4 h-4 text-charcoal-300 group-hover:text-gold-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-charcoal-500 leading-relaxed">
                    空き時間を活用して企業向けに美容サービスを提供したい美容師の方はこちら
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-charcoal-400">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-gold-500" />
                      柔軟な働き方
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-gold-500" />
                      安定した収入
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-8 text-center text-sm text-charcoal-400">
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
