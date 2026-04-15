import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-black uppercase tracking-[0.15em] text-[#d4af37] mb-4 pb-2 border-b border-slate-100" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
    {children}
  </h3>
);

const ParentRemarksPanel = () => {
  const { parentStudentId } = useAuth();
  const [remarks, setRemarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!parentStudentId) return;
    supabase.from("remarks").select("*").eq("student_id", parentStudentId).order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setRemarks(data);
      setLoading(false);
    });
  }, [parentStudentId]);

  if (loading) return <div className="p-6 text-slate-500">Loading remarks...</div>;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <SectionTitle>Academic Remarks</SectionTitle>
      <div className="space-y-4">
        {remarks.map((r: any) => (
          <div key={r.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50">
            <div className="flex justify-between items-start mb-2">
              <p className="font-bold text-slate-900 text-sm">{r.subject}</p>
              <div className="text-right">
                <p className="text-xs text-slate-500">{new Date(r.created_at).toLocaleDateString("en-GB")}</p>
                <p className="text-[10px] uppercase font-bold text-[#d4af37]">{r.given_by}</p>
              </div>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">{r.remark}</p>
          </div>
        ))}
        {remarks.length === 0 && <p className="text-slate-400 text-sm text-center py-4">No remarks found.</p>}
      </div>
    </div>
  );
};

export default ParentRemarksPanel;
