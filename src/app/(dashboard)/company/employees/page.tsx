import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { EmployeeManager } from "@/components/company/employee-manager";
import { Users, Sparkles } from "lucide-react";

export default async function EmployeesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const company = await prisma.company.findFirst({
    where: { adminUserId: session.user.id },
    include: {
      employees: {
        include: {
          user: true,
          bookings: { where: { status: "COMPLETED" }, include: { payment: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!company) redirect("/login");

  const employeesData = company.employees.map((emp) => ({
    id: emp.id,
    name: emp.user.name,
    email: emp.user.email,
    department: emp.department,
    position: emp.position,
    status: emp.status,
    totalBookings: emp.bookings.length,
    totalSubsidy: emp.bookings.reduce((sum, b) => sum + (b.payment?.companySubsidy || 0), 0),
  }));

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-charcoal-400 mb-1">
            <Sparkles className="w-4 h-4 text-gold-500" />
            社員管理
          </div>
          <h1 className="text-3xl font-bold text-charcoal-900">社員一覧</h1>
          <p className="text-charcoal-400 mt-1 flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            {company.employees.length}名の社員が登録されています
          </p>
        </div>
      </div>
      <EmployeeManager employees={employeesData} companyId={company.id} />
    </div>
  );
}
