import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-black uppercase tracking-[0.15em] text-[#d4af37] mb-4 pb-2 border-b border-slate-100" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
    {children}
  </h3>
);

const ParentFeesPanel = () => {
  const { parentStudentId } = useAuth();
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!parentStudentId) return;
    supabase.from("fees").select("*").eq("student_id", parentStudentId).order("due_date", { ascending: false }).then(({ data }) => {
      if (data) setFees(data);
      setLoading(false);
    });
  }, [parentStudentId]);

  if (loading) return <div className="p-6 text-slate-500">Loading fees...</div>;

  const totalFees = fees.reduce((acc, f) => acc + Number(f.amount), 0);
  const paidFees = fees.filter(f => f.status === "Paid").reduce((acc, f) => acc + Number(f.amount), 0);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <SectionTitle>Fee Details</SectionTitle>
      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
          <p className="text-xs font-bold text-slate-500 uppercase">Total Fees</p>
          <p className="text-xl font-black text-slate-900">₹{totalFees.toLocaleString()}</p>
        </div>
        <div className="flex-1 bg-gold-50 border border-gold-100 p-4 rounded-xl text-center">
          <p className="text-xs font-bold text-gold-600 uppercase">Pending Due</p>
          <p className="text-xl font-black text-gold-700">₹{(totalFees - paidFees).toLocaleString()}</p>
        </div>
      </div>
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead><tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold"><th className="pb-3">Fee Type</th><th className="pb-3">Amount</th><th className="pb-3">Due Date</th><th className="pb-3">Status</th></tr></thead>
        <tbody className="divide-y divide-slate-100">
          {fees.map((f: any) => (
            <tr key={f.id} className="hover:bg-slate-50/50">
              <td className="py-3 font-medium text-slate-800">{f.type} - {f.term}</td>
              <td className="py-3 font-bold">₹{Number(f.amount).toLocaleString()}</td>
              <td className="py-3">{new Date(f.due_date).toLocaleDateString("en-GB")}</td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${f.status === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-gold-100 text-gold-700"}`}>
                  {f.status}
                </span>
              </td>
            </tr>
          ))}
          {fees.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-slate-400">No fee records.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default ParentFeesPanel;
