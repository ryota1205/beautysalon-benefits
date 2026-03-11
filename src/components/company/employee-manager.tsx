"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { UserPlus, Loader2, X, User, Mail, Building2, Briefcase, Users } from "lucide-react";

interface EmployeeData {
  id: string;
  name: string;
  email: string;
  department: string | null;
  position: string | null;
  status: string;
  totalBookings: number;
  totalSubsidy: number;
}

export function EmployeeManager({
  employees,
  companyId,
}: {
  employees: EmployeeData[];
  companyId: string;
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, companyId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "追加に失敗しました");
      }

      setForm({ name: "", email: "", department: "", position: "" });
      setShowForm(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-11 pr-4 py-3 bg-cream-50/50 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 focus:bg-white text-sm text-charcoal-800 placeholder-charcoal-300 transition-all";

  return (
    <div>
      {/* Add Employee Button & Form */}
      <div className="mb-6">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary px-5 py-3 rounded-xl text-sm font-medium inline-flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            社員を追加
          </button>
        ) : (
          <div className="bg-white p-6 rounded-2xl border border-cream-200/80 shadow-soft animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-charcoal-800 text-lg">新しい社員を追加</h3>
              <button onClick={() => setShowForm(false)} className="text-charcoal-400 hover:text-charcoal-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            {error && (
              <div className="bg-rose-50 text-rose-600 text-sm p-3 rounded-xl border border-rose-100 mb-4 animate-scale-in">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300 group-focus-within:text-gold-500 transition-colors" />
                <input type="text" placeholder="名前 *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputClass} />
              </div>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300 group-focus-within:text-gold-500 transition-colors" />
                <input type="email" placeholder="メールアドレス *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className={inputClass} />
              </div>
              <div className="relative group">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300 group-focus-within:text-gold-500 transition-colors" />
                <input type="text" placeholder="部署" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className={inputClass} />
              </div>
              <div className="relative group">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300 group-focus-within:text-gold-500 transition-colors" />
                <input type="text" placeholder="役職" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className={inputClass} />
              </div>
              <div className="md:col-span-2 flex gap-3 pt-1">
                <button type="submit" disabled={loading} className="btn-primary px-6 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 flex items-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  追加する
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="border border-cream-200 text-charcoal-500 px-5 py-2.5 rounded-xl hover:bg-cream-50 transition-colors text-sm">
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-2xl border border-cream-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-100 bg-cream-50/50">
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">名前</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">メール</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">部署</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">役職</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">利用回数</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">補助合計</th>
                <th className="text-left py-3.5 px-5 text-xs font-semibold text-charcoal-400 uppercase tracking-wider">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b border-cream-50 hover:bg-cream-50/50 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{emp.name.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-medium text-charcoal-800">{emp.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-sm text-charcoal-400">{emp.email}</td>
                  <td className="py-3.5 px-5 text-sm text-charcoal-400">{emp.department || "—"}</td>
                  <td className="py-3.5 px-5 text-sm text-charcoal-400">{emp.position || "—"}</td>
                  <td className="py-3.5 px-5 text-sm font-medium text-charcoal-700">{emp.totalBookings}回</td>
                  <td className="py-3.5 px-5 text-sm font-bold text-gold-700">{formatCurrency(emp.totalSubsidy)}</td>
                  <td className="py-3.5 px-5">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                      emp.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-charcoal-50 text-charcoal-500 border-charcoal-200"
                    }`}>
                      {emp.status === "ACTIVE" ? "有効" : "無効"}
                    </span>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Users className="w-10 h-10 text-charcoal-200 mx-auto mb-3" />
                    <p className="text-charcoal-400">社員が登録されていません</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
