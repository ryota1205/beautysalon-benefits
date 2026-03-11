import Link from "next/link";
import {
  Scissors,
  Building2,
  Users,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Star,
  Clock,
  Shield,
  Sparkles,
  ChevronRight,
  MapPin,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream-50 overflow-hidden">
      {/* ===== Header ===== */}
      <header className="fixed top-0 w-full glass z-50 border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-gold-500 to-gold-700 rounded-lg flex items-center justify-center shadow-gold">
              <Scissors className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-charcoal-800">
              Beauty<span className="text-gold-600">Benefits</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: "#how-it-works", label: "使い方" },
              { href: "#features", label: "特徴" },
              { href: "#pricing", label: "料金" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-charcoal-400 hover:text-charcoal-800 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-gold-500 after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-charcoal-500 hover:text-charcoal-800 font-medium transition-colors px-3 py-2"
            >
              ログイン
            </Link>
            <Link
              href="/register"
              className="btn-primary px-5 py-2 rounded-full text-sm inline-flex items-center gap-1.5"
            >
              無料で始める
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative pt-28 pb-24 px-4 bg-noise">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -right-32 w-96 h-96 bg-gold-200/30 rounded-full blur-3xl" />
          <div className="absolute -top-16 -left-24 w-72 h-72 bg-gold-100/40 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-gold-300/50 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative">
          <div className="animate-fade-in inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm text-gold-700 px-5 py-2 rounded-full text-sm font-medium mb-8 border border-gold-200/50 shadow-soft">
            <Sparkles className="w-4 h-4" />
            <span>企業の福利厚生を、もっと美しく</span>
          </div>

          <h1 className="animate-fade-in-up text-5xl md:text-7xl lg:text-8xl font-bold text-charcoal-900 mb-6 leading-[1.1] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            社員の<span className="text-gradient">美</span>を、
            <br />
            会社の<span className="text-gradient">力</span>に。
          </h1>

          <p className="animate-fade-in-up text-base md:text-lg text-charcoal-400 max-w-xl mx-auto mb-12 leading-relaxed" style={{ animationDelay: '150ms' }}>
            美容サービスを福利厚生に。
            <br className="hidden md:block" />
            採用力・満足度・生産性を、ひとつのプラットフォームで向上。
          </p>

          <div className="animate-fade-in-up flex flex-col sm:flex-row gap-3 justify-center" style={{ animationDelay: '300ms' }}>
            <Link
              href="/register/company"
              className="btn-primary px-8 py-3.5 rounded-full text-base inline-flex items-center justify-center gap-2 group"
            >
              企業として導入する
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/register/beautician"
              className="bg-white text-charcoal-700 px-8 py-3.5 rounded-full text-base inline-flex items-center justify-center gap-2 border border-charcoal-200/60 shadow-soft hover:shadow-soft-md hover:border-gold-300 transition-all duration-300"
            >
              美容師として登録する
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="animate-fade-in-up mt-20 stagger-children" style={{ animationDelay: '450ms' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { value: "500+", label: "導入企業" },
                { value: "15,000+", label: "利用社員" },
                { value: "800+", label: "登録美容師" },
                { value: "4.8", label: "平均評価", star: true },
              ].map((stat) => (
                <div key={stat.label} className="group">
                  <div className="text-2xl md:text-3xl font-bold text-charcoal-800 flex items-center justify-center gap-1 tabular-nums">
                    {stat.value}
                    {stat.star && <Star className="w-4 h-4 text-gold-500 fill-gold-500" />}
                  </div>
                  <div className="text-xs text-charcoal-300 mt-0.5 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Logos / Social Proof ===== */}
      <section className="py-10 border-y border-cream-200/50 bg-white/40">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-xs text-charcoal-300 uppercase tracking-[0.2em] mb-6">導入企業の声</p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 items-center opacity-30">
            {["TechStart Inc.", "Creative Lab", "GlobalTech", "InnoVenture", "DigitalForce"].map((name) => (
              <span key={name} className="text-lg font-semibold text-charcoal-800 tracking-tight">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section id="how-it-works" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-xs text-gold-600 uppercase tracking-[0.2em] font-medium mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 tracking-tight">
              かんたん<span className="text-gradient">3</span>ステップ
            </h2>
            <div className="ornament mx-auto mt-4" />
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-10 stagger-children">
            {[
              {
                step: "01",
                icon: Building2,
                title: "企業が契約",
                desc: "プランを選択して月額予算と補助率を設定。最短即日で導入が完了します。",
                accent: "from-blue-500/10 to-blue-600/5",
              },
              {
                step: "02",
                icon: Users,
                title: "社員が予約",
                desc: "厳選された美容師を検索・予約。会社補助で通常よりお得にサービスを受けられます。",
                accent: "from-gold-500/10 to-gold-600/5",
              },
              {
                step: "03",
                icon: Scissors,
                title: "美容師が施術",
                desc: "出張美容や提携サロンで施術。料金は会社補助と自己負担の透明な内訳を表示。",
                accent: "from-sage-500/10 to-sage-600/5",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="card-hover relative bg-white p-8 rounded-2xl border border-charcoal-100/60 shadow-soft group"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-bold text-charcoal-200 tracking-[0.3em] uppercase">
                      Step {item.step}
                    </span>
                    <div className="w-12 h-12 bg-cream-50 rounded-xl flex items-center justify-center border border-cream-200/50 group-hover:border-gold-200 group-hover:bg-gold-50 transition-all duration-300">
                      <item.icon className="w-5 h-5 text-charcoal-400 group-hover:text-gold-600 transition-colors duration-300" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-charcoal-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-charcoal-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Benefits ===== */}
      <section id="features" className="py-24 bg-cream-50 bg-noise relative">
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <p className="text-xs text-gold-600 uppercase tracking-[0.2em] font-medium mb-3">Benefits</p>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 tracking-tight">
              三者すべてに、メリットを
            </h2>
            <div className="ornament mx-auto mt-4" />
          </div>

          {/* Company Benefits - Hero Card */}
          <div className="mb-10 bg-white rounded-3xl border border-charcoal-100/50 shadow-soft-md overflow-hidden">
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-700 rounded-xl flex items-center justify-center shadow-gold">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-charcoal-800">企業のメリット</h3>
                  <p className="text-xs text-charcoal-400">ここが一番重要です</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6 stagger-children">
                {[
                  { icon: TrendingUp, title: "採用力アップ", desc: "美容福利厚生は珍しく、IT・ベンチャー企業で差別化に。優秀な人材の獲得を後押しします。", tag: "採用" },
                  { icon: Star, title: "社員満足度UP", desc: "美容は定期消費・必須支出。福利厚生として提供することで高い満足度とリテンションを実現。", tag: "定着" },
                  { icon: Zap, title: "生産性向上", desc: "清潔感と自信がパフォーマンスを向上。見た目への投資が仕事の質を高めます。", tag: "成果" },
                ].map((item) => (
                  <div key={item.title} className="card-hover bg-cream-50/50 p-6 rounded-2xl border border-cream-200/50">
                    <div className="flex items-center gap-2 mb-3">
                      <item.icon className="w-5 h-5 text-gold-500" />
                      <span className="text-[10px] font-semibold text-gold-600 uppercase tracking-wider bg-gold-50 px-2 py-0.5 rounded-full">{item.tag}</span>
                    </div>
                    <h4 className="font-semibold text-charcoal-800 mb-2">{item.title}</h4>
                    <p className="text-sm text-charcoal-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Employee & Beautician */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Users,
                iconColor: "from-blue-500 to-blue-600",
                title: "社員のメリット",
                items: [
                  "美容代が会社補助でお得に",
                  "福利厚生として経費処理",
                  "職場近くで手軽にカット",
                  "厳選された美容師のみ登録",
                ],
              },
              {
                icon: Scissors,
                iconColor: "from-sage-500 to-sage-600",
                title: "美容師のメリット",
                items: [
                  "新規の法人顧客を安定獲得",
                  "平日昼間の空き時間を収入に",
                  "企業契約で安定的な売上",
                  "手数料は業界最低水準",
                ],
              },
            ].map((section) => (
              <div key={section.title} className="card-hover bg-white p-8 rounded-2xl border border-charcoal-100/50 shadow-soft">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 bg-gradient-to-br ${section.iconColor} rounded-xl flex items-center justify-center`}>
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-charcoal-800">{section.title}</h3>
                </div>
                <ul className="space-y-3.5">
                  {section.items.map((text) => (
                    <li key={text} className="flex items-start gap-3">
                      <CheckCircle2 className="w-[18px] h-[18px] text-gold-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-charcoal-600 leading-relaxed">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Service Types ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-xs text-gold-600 uppercase tracking-[0.2em] font-medium mb-3">Service Types</p>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 tracking-tight">
              3つのサービス形態
            </h2>
            <div className="ornament mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {[
              {
                icon: MapPin,
                title: "出張美容",
                desc: "美容師がオフィスに訪問。会議室や空きスペースで施術を行います。移動時間ゼロで忙しいビジネスパーソンに最適。",
                badge: "Most Popular",
                gradient: "from-gold-500/5 to-gold-600/10",
              },
              {
                icon: Shield,
                title: "提携サロン",
                desc: "厳選された提携美容院を福利厚生価格で利用。いつものサロン体験をお得に。",
                badge: null,
                gradient: "from-blue-500/5 to-blue-600/10",
              },
              {
                icon: Clock,
                title: "面貸しサロン",
                desc: "フリー美容師がシェアサロンを利用して施術。柔軟な時間帯と場所で対応します。",
                badge: null,
                gradient: "from-sage-500/5 to-sage-600/10",
              },
            ].map((item) => (
              <div key={item.title} className={`card-hover relative bg-gradient-to-br ${item.gradient} p-8 rounded-2xl border border-charcoal-100/40`}>
                {item.badge && (
                  <span className="absolute top-4 right-4 bg-gold-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-gold">
                    {item.badge}
                  </span>
                )}
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-5 shadow-soft border border-cream-200/30">
                  <item.icon className="w-6 h-6 text-charcoal-600" />
                </div>
                <h3 className="text-lg font-semibold text-charcoal-800 mb-2">{item.title}</h3>
                <p className="text-sm text-charcoal-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Pricing ===== */}
      <section id="pricing" className="py-24 bg-cream-50 bg-noise relative">
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <p className="text-xs text-gold-600 uppercase tracking-[0.2em] font-medium mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 tracking-tight">
              企業規模に合わせた料金プラン
            </h2>
            <div className="ornament mx-auto mt-4" />
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto stagger-children">
            {[
              {
                name: "Basic",
                nameJa: "ベーシック",
                price: "30,000",
                subsidy: "30%",
                maxPer: "1,500",
                features: ["社員50名まで", "月額予算管理", "基本レポート", "メールサポート"],
                popular: false,
              },
              {
                name: "Standard",
                nameJa: "スタンダード",
                price: "50,000",
                subsidy: "50%",
                maxPer: "2,000",
                features: ["社員200名まで", "月額予算管理", "詳細レポート", "優先サポート", "出張美容対応"],
                popular: true,
              },
              {
                name: "Premium",
                nameJa: "プレミアム",
                price: "100,000",
                subsidy: "70%",
                maxPer: "3,000",
                features: ["社員数無制限", "月額予算管理", "高度な分析", "専任担当者", "出張美容対応", "カスタマイズ"],
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`card-hover relative rounded-2xl p-8 ${
                  plan.popular
                    ? "bg-charcoal-900 text-white border-2 border-charcoal-800 shadow-soft-lg scale-[1.02]"
                    : "bg-white border border-charcoal-100/60 shadow-soft"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold-500 text-white text-[10px] font-bold px-5 py-1.5 rounded-full uppercase tracking-wider shadow-gold">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <p className={`text-xs uppercase tracking-[0.15em] font-medium mb-1 ${plan.popular ? "text-gold-400" : "text-charcoal-300"}`}>
                    {plan.name}
                  </p>
                  <h3 className={`text-lg font-semibold ${plan.popular ? "text-white" : "text-charcoal-800"}`}>
                    {plan.nameJa}
                  </h3>
                </div>
                <div className="mb-1">
                  <span className={`text-4xl font-bold tracking-tight ${plan.popular ? "text-white" : "text-charcoal-900"}`}>
                    ¥{plan.price}
                  </span>
                  <span className={`text-sm ${plan.popular ? "text-charcoal-400" : "text-charcoal-300"}`}>/月</span>
                </div>
                <p className={`text-xs mb-8 ${plan.popular ? "text-charcoal-400" : "text-charcoal-400"}`}>
                  補助率{plan.subsidy} · 1回上限¥{plan.maxPer}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${plan.popular ? "text-gold-400" : "text-gold-500"}`} />
                      <span className={plan.popular ? "text-charcoal-200" : "text-charcoal-500"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register/company"
                  className={`block text-center py-3 rounded-full font-medium text-sm transition-all duration-200 ${
                    plan.popular
                      ? "bg-gold-500 text-white hover:bg-gold-400 shadow-gold"
                      : "bg-charcoal-900 text-white hover:bg-charcoal-800"
                  }`}
                >
                  このプランで始める
                  <ChevronRight className="w-4 h-4 inline-block ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-28 bg-charcoal-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            美容を、福利厚生に。
          </h2>
          <p className="text-charcoal-400 mb-10 text-base max-w-md mx-auto leading-relaxed">
            採用力・社員満足度・生産性。
            <br />
            3つの課題をひとつのサービスで解決します。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register/company"
              className="btn-primary px-8 py-3.5 rounded-full text-base inline-flex items-center justify-center gap-2 group"
            >
              無料で始める
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/register/beautician"
              className="glass-dark text-white px-8 py-3.5 rounded-full text-base inline-flex items-center justify-center border border-charcoal-600 hover:border-charcoal-500 transition-colors"
            >
              美容師として参加
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-charcoal-900 border-t border-charcoal-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gradient-to-br from-gold-500 to-gold-700 rounded-lg flex items-center justify-center">
                <Scissors className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm text-white font-medium tracking-tight">
                Beauty<span className="text-gold-400">Benefits</span>
              </span>
            </div>
            <div className="flex gap-8 text-xs text-charcoal-500">
              <a href="#" className="hover:text-charcoal-300 transition-colors">利用規約</a>
              <a href="#" className="hover:text-charcoal-300 transition-colors">プライバシーポリシー</a>
              <a href="#" className="hover:text-charcoal-300 transition-colors">お問い合わせ</a>
            </div>
            <p className="text-xs text-charcoal-600">
              &copy; 2026 Beauty Benefits
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
