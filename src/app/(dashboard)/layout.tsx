import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-cream-50 bg-noise">
      <Sidebar role={session.user.role} userName={session.user.name} />
      <main className="flex-1 overflow-auto">
        {/* Top gradient accent */}
        <div className="h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600" />
        <div className="p-6 lg:p-8 xl:p-10 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
