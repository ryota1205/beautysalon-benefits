"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  Scissors,
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Calendar,
  DollarSign,
  UserCircle,
  Building2,
  CheckSquare,
  Settings,
  LogOut,
  Search,
  BookOpen,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: Record<string, NavItem[]> = {
  COMPANY_ADMIN: [
    { label: "ダッシュボード", href: "/company", icon: LayoutDashboard },
    { label: "社員管理", href: "/company/employees", icon: Users },
    { label: "契約管理", href: "/company/contract", icon: FileText },
    { label: "利用レポート", href: "/company/reports", icon: BarChart3 },
    { label: "設定", href: "/company/settings", icon: Settings },
  ],
  EMPLOYEE: [
    { label: "ホーム", href: "/employee", icon: LayoutDashboard },
    { label: "美容師を探す", href: "/employee/search", icon: Search },
    { label: "予約一覧", href: "/employee/booking", icon: Calendar },
    { label: "プロフィール", href: "/employee/profile", icon: UserCircle },
  ],
  BEAUTICIAN: [
    { label: "ダッシュボード", href: "/beautician", icon: LayoutDashboard },
    { label: "スケジュール", href: "/beautician/schedule", icon: Calendar },
    { label: "予約管理", href: "/beautician/bookings", icon: BookOpen },
    { label: "売上管理", href: "/beautician/revenue", icon: DollarSign },
    { label: "プロフィール", href: "/beautician/profile", icon: UserCircle },
  ],
  PLATFORM_ADMIN: [
    { label: "ダッシュボード", href: "/admin", icon: LayoutDashboard },
    { label: "企業管理", href: "/admin/companies", icon: Building2 },
    { label: "美容師管理", href: "/admin/beauticians", icon: Scissors },
    { label: "予約管理", href: "/admin/bookings", icon: CheckSquare },
    { label: "手数料設定", href: "/admin/fees", icon: DollarSign },
  ],
};

const roleLabels: Record<string, string> = {
  COMPANY_ADMIN: "企業管理者",
  EMPLOYEE: "社員",
  BEAUTICIAN: "美容師",
  PLATFORM_ADMIN: "プラットフォーム管理者",
};

const roleGradients: Record<string, string> = {
  COMPANY_ADMIN: "from-blue-500 to-indigo-600",
  EMPLOYEE: "from-emerald-500 to-teal-600",
  BEAUTICIAN: "from-rose-500 to-pink-600",
  PLATFORM_ADMIN: "from-purple-500 to-indigo-600",
};

export function Sidebar({
  role,
  userName,
}: {
  role: string;
  userName: string;
}) {
  const pathname = usePathname();
  const items = navItems[role] || [];

  return (
    <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-cream-200/80 min-h-screen flex flex-col relative">
      {/* Subtle gradient at top */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gold-50/50 to-transparent pointer-events-none" />

      {/* Logo */}
      <div className="relative p-6 pb-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-700 rounded-xl flex items-center justify-center shadow-gold group-hover:scale-105 transition-transform">
            <Scissors className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-charcoal-800 tracking-tight block leading-tight">
              Beauty Benefits
            </span>
            <span className="text-[10px] text-charcoal-400 tracking-wider uppercase">
              Platform
            </span>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="relative mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-br from-cream-50 to-cream-100/50 border border-cream-200/60">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleGradients[role] || "from-gold-500 to-gold-600"} flex items-center justify-center shadow-sm`}>
            <span className="text-white font-bold text-sm">
              {userName?.charAt(0) || "U"}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-charcoal-800 truncate">{userName}</p>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-gold-500" />
              <p className="text-xs text-charcoal-400">{roleLabels[role]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 px-3 space-y-0.5">
        <p className="text-[10px] font-semibold text-charcoal-300 uppercase tracking-widest px-3 mb-2">
          メニュー
        </p>
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" + role.toLowerCase().replace("_admin", "") &&
              pathname.startsWith(item.href + "/"));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-gradient-to-r from-gold-50 to-gold-100/50 text-gold-800 shadow-sm border border-gold-200/50"
                  : "text-charcoal-500 hover:bg-cream-50 hover:text-charcoal-700"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-gold-400 to-gold-600 rounded-r-full" />
              )}
              <item.icon className={cn(
                "w-[18px] h-[18px] transition-colors",
                isActive ? "text-gold-600" : "text-charcoal-400 group-hover:text-charcoal-600"
              )} />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="relative p-4 border-t border-cream-200/60">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-charcoal-400 hover:bg-rose-50 hover:text-rose-600 transition-all w-full group"
        >
          <LogOut className="w-[18px] h-[18px] group-hover:text-rose-500 transition-colors" />
          ログアウト
        </button>
      </div>
    </aside>
  );
}
