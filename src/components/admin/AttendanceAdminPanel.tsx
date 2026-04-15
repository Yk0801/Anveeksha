import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronRight, ChevronLeft, Users, CheckSquare, List, DollarSign, MessageSquare, Clipboard, Calendar, Settings, FileText, Bus, UserCircle, Bell, X, Moon, LogOut, ChevronsLeft, ChevronsRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { hashPassword } from "@/lib/utils";
import { Student, AdminUserRow } from "./types";
import { SectionTitle, Inp, Sel, PaginationControls, EntriesDropdown } from "./SharedUI";

// ─── ATTENDANCE (Admin + Faculty) ─────────────────────────────────────────────
const AttendanceAdminPanel = () => {
  const [selClass, setSelClass] = useState("Pre-KG");
  const [selDate, setSelDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [existing, setExisting] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: stData } = await supabase.from("students").select("id,name,roll_no,class,section").eq("class", selClass).order("roll_no");
    const { data: attData } = await supabase.from("attendance").select("student_id,status").eq("date", selDate);
    const stList = (stData as Student[]) || [];
    const attMap: Record<string, string> = {};
    (attData || []).forEach(a => { attMap[a.student_id] = a.status; });
    setStudents(stList);
    setExisting(attMap);
    setMarks(attMap);
    setLoading(false);
  }, [selClass, selDate]);

  useEffect(() => { load(); }, [load]);

  const markAll = (status: string) => {
    const m: Record<string, string> = {};
    students.forEach(s => { m[s.id] = status; });
    setMarks(m);
  };

  const save = async () => {
    setSaving(true);
    const upserts = students.filter(s => marks[s.id]).map(s => ({
      student_id: s.id, date: selDate, status: marks[s.id],
    }));
    if (upserts.length === 0) { toast.error("No attendance marked."); setSaving(false); return; }
    const { error } = await supabase.from("attendance").upsert(upserts, { onConflict: "student_id,date" });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`Attendance saved for ${selDate}`);
    setExisting({ ...marks });
  };

  const statusColors: Record<string, string> = { P: "text-emerald-600", A: "text-red-500", Holiday: "text-slate-400" };

  return (
    <div>
      <SectionTitle>Attendance</SectionTitle>
      <div className="flex flex-wrap gap-3 mb-5">
        <input type="date" value={selDate} onChange={e => setSelDate(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30" style={{ fontFamily: "Inter,sans-serif" }} />
        <select value={selClass} onChange={e => setSelClass(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ fontFamily: "Inter,sans-serif" }}>
          {["Pre-KG", "LKG", "UKG"].map(c => <option key={c}>{c}</option>)}
        </select>
        <button onClick={() => markAll("P")} className="text-emerald-600 text-sm font-medium hover:underline">Mark All Present</button>
        <button onClick={() => markAll("A")} className="text-red-500 text-sm font-medium hover:underline">Mark All Absent</button>
      </div>
      {loading ? <p className="text-slate-400 text-sm">Loading…</p> : (
        <>
          <table className="portal-table mb-5">
            <thead><tr><th>#</th><th>Name</th><th>Roll No.</th><th>Mark (P / A / Holiday)</th><th>Saved</th></tr></thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s.id}>
                  <td>{i + 1}</td>
                  <td className="font-medium">{s.name}</td>
                  <td>{s.roll_no}</td>
                  <td>
                    <div className="flex gap-4 items-center">
                      {["P", "A", "Holiday"].map(st => (
                        <label key={st} className={`flex items-center gap-1 cursor-pointer text-xs font-bold ${statusColors[st]}`}>
                          <input type="radio" name={`att-${s.id}`} value={st} checked={marks[s.id] === st} onChange={() => setMarks({ ...marks, [s.id]: st })} className="accent-current" />
                          {st}
                        </label>
                      ))}
                    </div>
                  </td>
                  <td>{existing[s.id] ? <span className={`text-xs font-bold ${statusColors[existing[s.id]]}`}>{existing[s.id]}</span> : <span className="text-slate-300 text-xs">—</span>}</td>
                </tr>
              ))}
              {students.length === 0 && <tr><td colSpan={5} className="text-center py-4 text-slate-400">No students in this class.</td></tr>}
            </tbody>
          </table>
          <button onClick={save} disabled={saving} className="bg-[#d4af37] text-white font-bold text-xs px-6 py-2.5 rounded-lg hover:bg-[#c49e29] disabled:opacity-60">{saving ? "Saving…" : "Save Attendance"}</button>
        </>
      )}
    </div>
  );
};


export default AttendanceAdminPanel;
