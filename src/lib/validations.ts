import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

export const companyRegistrationSchema = z.object({
  companyName: z.string().min(1, "会社名を入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(8, "パスワードは8文字以上で入力してください"),
  adminName: z.string().min(1, "担当者名を入力してください"),
  phone: z.string().optional(),
  industry: z.string().optional(),
});

export const beauticianRegistrationSchema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  displayName: z.string().min(1, "表示名を入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(8, "パスワードは8文字以上で入力してください"),
  serviceArea: z.string().min(1, "対応エリアを入力してください"),
  yearsExperience: z.number().min(0).optional(),
  bio: z.string().optional(),
});

export const employeeSchema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  department: z.string().optional(),
  position: z.string().optional(),
});

export const bookingSchema = z.object({
  beauticianId: z.string(),
  serviceId: z.string(),
  date: z.string(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  locationType: z.enum(["ON_SITE", "PARTNER_SALON", "RENTAL_SALON"]),
  notes: z.string().optional(),
});

export const contractSchema = z.object({
  planName: z.enum(["BASIC", "STANDARD", "PREMIUM"]),
  monthlyBudget: z.number().min(10000),
  subsidyPercentage: z.number().min(0).max(100),
  maxSubsidyPerUse: z.number().min(0),
});

export const scheduleSchema = z.object({
  date: z.string(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  locationType: z.enum(["ON_SITE", "PARTNER_SALON", "RENTAL_SALON"]),
  locationName: z.string().optional(),
});
