import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const hash = (pw: string) => bcrypt.hashSync(pw, 10);

  // ============================
  // Platform Admin
  // ============================
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@beauty-benefits.jp",
      name: "管理者",
      passwordHash: hash("password123"),
      role: "PLATFORM_ADMIN",
    },
  });

  await prisma.platformConfig.create({
    data: { defaultFeePercent: 20.0, minFeePercent: 15.0, maxFeePercent: 25.0 },
  });

  // ============================
  // Companies
  // ============================
  const companyData = [
    { name: "テックスタート株式会社", industry: "IT", email: "admin@techstart.jp", adminName: "田中太郎", phone: "03-1234-5678", address: "東京都渋谷区神宮前1-1-1", employeeCount: 25, plan: "STANDARD" as const, budget: 50000 },
    { name: "クリエイティブラボ合同会社", industry: "デザイン", email: "admin@creativelab.jp", adminName: "佐藤花子", phone: "03-2345-6789", address: "東京都港区南青山2-2-2", employeeCount: 15, plan: "BASIC" as const, budget: 30000 },
    { name: "グローバルテック株式会社", industry: "IT", email: "admin@globaltech.jp", adminName: "鈴木一郎", phone: "03-3456-7890", address: "東京都千代田区丸の内3-3-3", employeeCount: 80, plan: "PREMIUM" as const, budget: 100000 },
  ];

  const companies = [];
  for (const cd of companyData) {
    const user = await prisma.user.create({
      data: {
        email: cd.email,
        name: cd.adminName,
        passwordHash: hash("password123"),
        role: "COMPANY_ADMIN",
      },
    });

    const company = await prisma.company.create({
      data: {
        name: cd.name,
        email: cd.email,
        phone: cd.phone,
        address: cd.address,
        industry: cd.industry,
        employeeCount: cd.employeeCount,
        status: "APPROVED",
        adminUserId: user.id,
      },
    });

    await prisma.contract.create({
      data: {
        companyId: company.id,
        planName: cd.plan,
        monthlyBudget: cd.budget,
        subsidyPercentage: cd.plan === "PREMIUM" ? 70 : cd.plan === "STANDARD" ? 50 : 30,
        maxSubsidyPerUse: cd.plan === "PREMIUM" ? 3000 : cd.plan === "STANDARD" ? 2000 : 1500,
        startDate: new Date("2025-01-01"),
        status: "ACTIVE",
      },
    });

    companies.push(company);
  }

  // ============================
  // Employees
  // ============================
  const employeeData = [
    { name: "山田健", email: "yamada@techstart.jp", dept: "エンジニアリング", pos: "シニアエンジニア", companyIdx: 0 },
    { name: "中村美咲", email: "nakamura@techstart.jp", dept: "プロダクト", pos: "プロダクトマネージャー", companyIdx: 0 },
    { name: "小林雄太", email: "kobayashi@techstart.jp", dept: "エンジニアリング", pos: "フロントエンドエンジニア", companyIdx: 0 },
    { name: "高橋理恵", email: "takahashi@techstart.jp", dept: "デザイン", pos: "UIデザイナー", companyIdx: 0 },
    { name: "伊藤翔", email: "ito@techstart.jp", dept: "営業", pos: "アカウントマネージャー", companyIdx: 0 },
    { name: "渡辺麻衣", email: "watanabe@creativelab.jp", dept: "デザイン", pos: "アートディレクター", companyIdx: 1 },
    { name: "加藤龍之介", email: "kato@creativelab.jp", dept: "開発", pos: "Webデベロッパー", companyIdx: 1 },
    { name: "松本さくら", email: "matsumoto@creativelab.jp", dept: "デザイン", pos: "グラフィックデザイナー", companyIdx: 1 },
    { name: "木村大輝", email: "kimura@globaltech.jp", dept: "エンジニアリング", pos: "テックリード", companyIdx: 2 },
    { name: "林彩香", email: "hayashi@globaltech.jp", dept: "人事", pos: "人事マネージャー", companyIdx: 2 },
    { name: "清水拓海", email: "shimizu@globaltech.jp", dept: "マーケティング", pos: "マーケター", companyIdx: 2 },
    { name: "森田絵理", email: "morita@globaltech.jp", dept: "経営企画", pos: "事業企画", companyIdx: 2 },
  ];

  const employees = [];
  for (const ed of employeeData) {
    const user = await prisma.user.create({
      data: {
        email: ed.email,
        name: ed.name,
        passwordHash: hash("password123"),
        role: "EMPLOYEE",
      },
    });

    const employee = await prisma.employee.create({
      data: {
        userId: user.id,
        companyId: companies[ed.companyIdx].id,
        department: ed.dept,
        position: ed.pos,
      },
    });

    employees.push(employee);
  }

  // ============================
  // Beauticians
  // ============================
  const beauticianData = [
    { name: "西田美優", display: "Miyu", email: "miyu@beauty.jp", bio: "10年以上のサロン経験を活かし、お客様一人ひとりに似合うスタイルをご提案します。", years: 12, specialties: ["カット", "カラー", "パーマ"], area: "東京都渋谷区", types: ["ON_SITE", "PARTNER_SALON"], rating: 4.8, reviews: 156 },
    { name: "安藤翔太", display: "Shota", email: "shota@beauty.jp", bio: "メンズカットが得意です。ビジネスマンのスタイリングならお任せください。", years: 8, specialties: ["カット", "ヘッドスパ"], area: "東京都港区", types: ["ON_SITE", "RENTAL_SALON"], rating: 4.6, reviews: 89 },
    { name: "岡田真理", display: "Mari", email: "mari@beauty.jp", bio: "カラーリングのスペシャリスト。トレンドカラーからナチュラルカラーまで幅広く対応。", years: 15, specialties: ["カラー", "トリートメント", "カット"], area: "東京都渋谷区", types: ["PARTNER_SALON"], rating: 4.9, reviews: 234 },
    { name: "藤井健太", display: "Kenta", email: "kenta@beauty.jp", bio: "フリーランス美容師として活動中。出張カットで忙しいビジネスパーソンをサポート。", years: 6, specialties: ["カット", "カラー"], area: "東京都千代田区", types: ["ON_SITE"], rating: 4.5, reviews: 67 },
    { name: "石井莉子", display: "Riko", email: "riko@beauty.jp", bio: "髪質改善トリートメントが得意。ダメージヘアのケアならお気軽にご相談ください。", years: 10, specialties: ["トリートメント", "カット", "ヘッドスパ"], area: "東京都港区", types: ["PARTNER_SALON", "RENTAL_SALON"], rating: 4.7, reviews: 178 },
    { name: "村上大地", display: "Daichi", email: "daichi@beauty.jp", bio: "パーマスタイルが得意。ニュアンスパーマからしっかりパーマまで対応します。", years: 9, specialties: ["パーマ", "カット", "カラー"], area: "東京都新宿区", types: ["ON_SITE", "PARTNER_SALON"], rating: 4.4, reviews: 92 },
  ];

  const beauticians = [];
  for (const bd of beauticianData) {
    const user = await prisma.user.create({
      data: {
        email: bd.email,
        name: bd.name,
        passwordHash: hash("password123"),
        role: "BEAUTICIAN",
      },
    });

    const beautician = await prisma.beautician.create({
      data: {
        userId: user.id,
        displayName: bd.display,
        bio: bd.bio,
        yearsExperience: bd.years,
        specialties: JSON.stringify(bd.specialties),
        serviceArea: bd.area,
        serviceTypes: JSON.stringify(bd.types),
        rating: bd.rating,
        reviewCount: bd.reviews,
        status: "APPROVED",
      },
    });

    beauticians.push(beautician);
  }

  // ============================
  // Beautician Services
  // ============================
  const serviceTemplates = [
    { name: "カット", desc: "シャンプー・ブロー込み", duration: 60, price: 4000, category: "CUT" },
    { name: "カラー", desc: "リタッチまたはフルカラー", duration: 90, price: 6000, category: "COLOR" },
    { name: "カット+カラー", desc: "カットとカラーのセット", duration: 120, price: 9000, category: "COLOR" },
    { name: "パーマ", desc: "カット込み", duration: 120, price: 8000, category: "PERM" },
    { name: "トリートメント", desc: "髪質改善トリートメント", duration: 45, price: 3500, category: "TREATMENT" },
    { name: "ヘッドスパ", desc: "リラクゼーションヘッドスパ", duration: 30, price: 3000, category: "OTHER" },
  ];

  const allServices = [];
  for (let i = 0; i < beauticians.length; i++) {
    const b = beauticians[i];
    const specs = beauticianData[i].specialties;

    const servicesToAdd = serviceTemplates.filter((st) => {
      if (st.name === "カット") return specs.includes("カット");
      if (st.name === "カラー" || st.name === "カット+カラー") return specs.includes("カラー");
      if (st.name === "パーマ") return specs.includes("パーマ");
      if (st.name === "トリートメント") return specs.includes("トリートメント");
      if (st.name === "ヘッドスパ") return specs.includes("ヘッドスパ");
      return false;
    });

    for (const st of servicesToAdd) {
      const priceVariation = Math.round((0.9 + Math.random() * 0.2) * st.price / 100) * 100;
      const service = await prisma.beauticianService.create({
        data: {
          beauticianId: b.id,
          name: st.name,
          description: st.desc,
          durationMin: st.duration,
          price: priceVariation,
          category: st.category,
        },
      });
      allServices.push(service);
    }
  }

  // ============================
  // Schedules (next 14 days)
  // ============================
  const now = new Date();
  for (const b of beauticians) {
    for (let day = 0; day < 14; day++) {
      const date = new Date(now);
      date.setDate(date.getDate() + day);
      const dayOfWeek = date.getDay();

      // Skip some days randomly (weekends for some)
      if (dayOfWeek === 0) continue;
      if (dayOfWeek === 6 && Math.random() > 0.5) continue;

      const bd = beauticianData[beauticians.indexOf(b)];
      const locType = bd.types[Math.floor(Math.random() * bd.types.length)];

      await prisma.schedule.create({
        data: {
          beauticianId: b.id,
          date: new Date(date.toISOString().split("T")[0]),
          startTime: "10:00",
          endTime: "18:00",
          isAvailable: true,
          locationType: locType,
          locationName: locType === "ON_SITE" ? "オフィス訪問" : locType === "PARTNER_SALON" ? "Beauty Salon GRACE" : "シェアサロン BLOOM",
        },
      });
    }
  }

  // ============================
  // Bookings
  // ============================
  const bookingStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "COMPLETED", "COMPLETED", "CANCELLED"];

  for (let i = 0; i < 20; i++) {
    const emp = employees[i % employees.length];
    const bIdx = i % beauticians.length;
    const b = beauticians[bIdx];

    const bServices = allServices.filter((s) => s.beauticianId === b.id);
    if (bServices.length === 0) continue;
    const service = bServices[i % bServices.length];

    const date = new Date(now);
    date.setDate(date.getDate() + (i < 10 ? -(i * 3) : i - 10 + 1));

    const status = i < 10 ? bookingStatuses[i % bookingStatuses.length] : "CONFIRMED";
    const startHour = 10 + (i % 7);
    const endHour = startHour + Math.ceil(service.durationMin / 60);

    const company = companies.find((c) => c.id === emp.companyId)!;
    const contract = await prisma.contract.findUnique({
      where: { companyId: company.id },
    });

    const bd = beauticianData[bIdx];
    const locType = bd.types[0];

    const booking = await prisma.booking.create({
      data: {
        employeeId: emp.id,
        beauticianId: b.id,
        companyId: company.id,
        serviceId: service.id,
        date: new Date(date.toISOString().split("T")[0]),
        startTime: `${startHour}:00`,
        endTime: `${endHour}:00`,
        locationType: locType,
        locationDetail: locType === "ON_SITE" ? company.address : "Beauty Salon GRACE",
        status,
      },
    });

    // Create payment for completed bookings
    if (status === "COMPLETED" && contract) {
      const totalAmount = service.price;
      const rawSubsidy = totalAmount * (contract.subsidyPercentage / 100);
      const companySubsidy = Math.min(rawSubsidy, contract.maxSubsidyPerUse);
      const platformFeePercent = 20;
      const platformFee = totalAmount * (platformFeePercent / 100);

      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          totalAmount,
          companySubsidy,
          employeePayment: totalAmount - companySubsidy,
          beauticianPayout: totalAmount - platformFee,
          platformFee,
          platformFeePercent,
          status: "COMPLETED",
          paidAt: date,
        },
      });
    }
  }

  console.log("Seeding completed!");
  console.log("===========================================");
  console.log("Login credentials (all passwords: password123):");
  console.log("-------------------------------------------");
  console.log("Admin:      admin@beauty-benefits.jp");
  console.log("Company:    admin@techstart.jp");
  console.log("Employee:   yamada@techstart.jp");
  console.log("Beautician: miyu@beauty.jp");
  console.log("===========================================");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
