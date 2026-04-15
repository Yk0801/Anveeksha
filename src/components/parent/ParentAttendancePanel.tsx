import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-black uppercase tracking-[0.15em] text-[#d4af37] mb-4 pb-2 border-b border-slate-100" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
    {children}
  </h3>
);

const ParentAttendancePanel = () => {
  const { parentStudentId } = useAuth();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!parentStudentId) return;
    supabase.from("attendance").select("*").eq("student_id", parentStudentId).order("date", { ascending: false }).then(({ data }) => {
      if (data) setAttendance(data);
      setLoading(false);
    });
  }, [parentStudentId]);

  if (loading) return <div className="p-6 text-slate-500">Loading attendance...</div>;

  const validDays = attendance.filter(a => a.status !== "Holiday");
  const presents = validDays.filter(a => a.status === "P").length;
  const attendancePercentage = validDays.length > 0 ? Math.round((presents / validDays.length) * 100) : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <SectionTitle>Attendance Records</SectionTitle>
      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
          <p className="text-xs font-bold text-slate-500 uppercase">Working Days</p>
          <p className="text-2xl font-black text-slate-900">{validDays.length}</p>
        </div>
        <div className="flex-1 bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center">
          <p className="text-xs font-bold text-emerald-600 uppercase">Present</p>
          <p className="text-2xl font-black text-emerald-700">{presents}</p>
        </div>
        <div className="flex-1 bg-gold-50 border border-gold-100 p-4 rounded-xl text-center">
          <p className="text-xs font-bold text-gold-600 uppercase">Percentage</p>
          <p className="text-2xl font-black text-gold-700">{attendancePercentage}%</p>
        </div>
      </div>
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead><tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold"><th className="pb-3">Date</th><th className="pb-3">Status</th></tr></thead>
        <tbody className="divide-y divide-slate-100">
          {attendance.map((a: any) => (
            <tr key={a.id} className="hover:bg-slate-50/50">
              <td className="py-3 font-medium text-slate-800">{new Date(a.date).toLocaleDateString("en-GB", { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${a.status === "P" ? "bg-emerald-100 text-emerald-700" : a.status === "A" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"}`}>
                  {a.status === "P" ? "Present" : a.status === "A" ? "Absent" : a.status}
                </span>
              </td>
            </tr>
          ))}
          {attendance.length === 0 && <tr><td colSpan={2} className="py-4 text-center text-slate-400">No attendance records.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default ParentAttendancePanel;
