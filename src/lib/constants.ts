export const SERVICE_CATEGORIES = {
  CUT: "カット",
  COLOR: "カラー",
  PERM: "パーマ",
  TREATMENT: "トリートメント",
  OTHER: "その他",
} as const;

export const LOCATION_TYPES = {
  ON_SITE: "出張美容",
  PARTNER_SALON: "提携サロン",
  RENTAL_SALON: "面貸しサロン",
} as const;

export const BOOKING_STATUSES = {
  PENDING: "予約待ち",
  CONFIRMED: "確定",
  COMPLETED: "完了",
  CANCELLED: "キャンセル",
} as const;

export const USER_ROLES = {
  COMPANY_ADMIN: "企業管理者",
  EMPLOYEE: "社員",
  BEAUTICIAN: "美容師",
  PLATFORM_ADMIN: "プラットフォーム管理者",
} as const;

export const COMPANY_STATUSES = {
  PENDING: "審査中",
  APPROVED: "承認済み",
  SUSPENDED: "停止中",
} as const;

export const PLAN_NAMES = {
  BASIC: "ベーシック",
  STANDARD: "スタンダード",
  PREMIUM: "プレミアム",
} as const;

export const ROLE_PATHS: Record<string, string> = {
  COMPANY_ADMIN: "/company",
  EMPLOYEE: "/employee",
  BEAUTICIAN: "/beautician",
  PLATFORM_ADMIN: "/admin",
};
