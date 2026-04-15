import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-black uppercase tracking-[0.15em] text-[#d4af37] mb-4 pb-2 border-b border-slate-100" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
    {children}
  </h3>
);

const ParentMarksPanel = () => {
  const { parentStudentId } = useAuth();
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!parentStudentId) return;
    supabase.from("marks").select("*").eq("student_id", parentStudentId).order("date", { ascending: false }).then(({ data }) => {
      if (data) setMarks(data);
      setLoading(false);
    });
  }, [parentStudentId]);

  if (loading) return <div className="p-6 text-slate-500">Loading marks...</div>;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <SectionTitle>Marks & Grades</SectionTitle>
      <table className="w-full text-left text-sm whitespace-nowrap portal-table">
        <thead><tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold"><th className="pb-3">Date</th><th className="pb-3">Exam Type</th><th className="pb-3">Subject</th><th className="pb-3">Marks</th><th className="pb-3">Grade</th><th className="pb-3">Faculty</th></tr></thead>
        <tbody className="divide-y divide-slate-100">
          {marks.map((m: any) => (
            <tr key={m.id} className="hover:bg-slate-50/50">
              <td className="py-3">{new Date(m.date).toLocaleDateString("en-GB")}</td>
              <td className="py-3 font-medium text-slate-800">{m.exam_type}</td>
              <td className="py-3">{m.subject}</td>
              <td className="py-3"><span className="font-bold">{m.marks_obtained}</span> <span className="text-slate-400 text-[10px]">/ {m.max_marks}</span></td>
              <td className="py-3">{m.grade || "—"}</td>
              <td className="py-3">{m.faculty_name || "—"}</td>
            </tr>
          ))}
          {marks.length === 0 && <tr><td colSpan={6} className="text-center py-4 text-slate-400">No marks recorded.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default ParentMarksPanel;
