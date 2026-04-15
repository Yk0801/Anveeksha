import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronRight, ChevronLeft, Users, CheckSquare, List, DollarSign, MessageSquare, Clipboard, Calendar, Settings, FileText, Bus, UserCircle, Bell, X, Moon, LogOut, ChevronsLeft, ChevronsRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { hashPassword } from "@/lib/utils";
import { Student, AdminUserRow } from "./types";
import { SectionTitle, Inp, Sel, PaginationControls, EntriesDropdown } from "./SharedUI";

// ─── MARKS (Admin + Faculty) ──────────────────────────────────────────────────
const MarksAdminPanel = () => {
  const [search, setSearch] = useState("");
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [marksData, setMarksData] = useState<any[]>([]);
  const [form, setForm] = useState({ subject: "", exam_type: "", max_marks: "100", marks_obtained: "", grade: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const { adminUser } = useAuth();

  // Load all students on mount
  useEffect(() => {
    const loadAllStudents = async () => {
      setLoadingList(true);
      const { data } = await supabase.from("students").select("*").eq("status", "Active").order("name");
      setAllStudents((data as Student[]) || []);
      setLoadingList(false);
    };
    loadAllStudents();
  }, []);

  // Filter students based on search
  const filteredStudents = useMemo(() => {
    if (!search.trim()) return allStudents;
    const q = search.toLowerCase();
    return allStudents.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.admission_no?.toLowerCase().includes(q) ||
      s.class?.toLowerCase().includes(q)
    );
  }, [allStudents, search]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / entriesPerPage));
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  // Reset to page 1 when search or entries changes
  useEffect(() => { setCurrentPage(1); }, [search, entriesPerPage]);

  const selectStudent = async (s: Student) => {
    setStudent(s);
    setLoading(true);
    const { data: mData } = await supabase.from("marks").select("*").eq("student_id", s.id).order("created_at", { ascending: false });
    setMarksData(mData || []);
    setLoading(false);
  };

  const editMark = (m: any) => {
    setEditingId(m.id);
    setForm({
      subject: m.subject,
      exam_type: m.exam_type,
      max_marks: String(m.max_marks),
      marks_obtained: String(m.marks_obtained),
      grade: m.grade || ""
    });
  };

  const addMark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !form.subject || !form.exam_type || !form.marks_obtained) return;
    setSaving(true);
    if (editingId) {
      const { error } = await supabase.from("marks").update({
        subject: form.subject, exam_type: form.exam_type, max_marks: Number(form.max_marks),
        marks_obtained: Number(form.marks_obtained), grade: form.grade,
      }).eq("id", editingId);
      setSaving(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Marks updated!");
      setEditingId(null);
    } else {
      const { error } = await supabase.from("marks").insert([{
        student_id: student.id, faculty_id: adminUser?.id, faculty_name: adminUser?.name || "Admin",
        subject: form.subject, exam_type: form.exam_type, max_marks: Number(form.max_marks),
        marks_obtained: Number(form.marks_obtained), grade: form.grade,
      }]);
      setSaving(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Marks recorded!");
    }
    setForm({ subject: "", exam_type: "", max_marks: "100", marks_obtained: "", grade: "" });
    const { data: mData } = await supabase.from("marks").select("*").eq("student_id", student.id).order("created_at", { ascending: false });
    setMarksData(mData || []);
  };

  const deleteMark = async (id: string) => {
    await supabase.from("marks").delete().eq("id", id);
    setMarksData(marksData.filter(m => m.id !== id));
    toast.success("Record deleted.");
  };

  return (
    <div>
      <SectionTitle>Marks & Grades</SectionTitle>

      {/* Search + Entries */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex gap-3 flex-1 min-w-[200px]">
          <input type="text" placeholder="Search student name, admission no, or class…" value={search} onChange={e => setSearch(e.target.value)} className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30" style={{ fontFamily: "Inter,sans-serif" }} />
        </div>
        <EntriesDropdown value={entriesPerPage} onChange={setEntriesPerPage} />
      </div>

      {/* Student Detail View */}
      {student ? (
        <>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setStudent(null)} className="text-[#d4af37] text-sm font-bold hover:underline flex items-center gap-1">← Back to list</button>
            <span className="text-slate-300">|</span>
            <p className="text-sm font-semibold text-slate-700" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{student.name} — {student.class}-{student.section} ({student.admission_no})</p>
          </div>
          <form onSubmit={addMark} className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 grid sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
            <Inp label="Subject *" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
            <Inp label="Exam Type *" placeholder="e.g. FA1, SA1" required value={form.exam_type} onChange={e => setForm({ ...form, exam_type: e.target.value })} />
            <Inp label="Max Marks *" type="number" required value={form.max_marks} onChange={e => setForm({ ...form, max_marks: e.target.value })} />
            <Inp label="Obtained *" type="number" step="0.1" required value={form.marks_obtained} onChange={e => setForm({ ...form, marks_obtained: e.target.value })} />
            <Inp label="Grade" placeholder="Optional" value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} />
            <div className="sm:col-span-2 md:col-span-5 pt-2 flex gap-3">
              <button type="submit" disabled={saving} className="bg-[#d4af37] text-white font-bold text-xs px-5 py-2.5 rounded-lg disabled:opacity-60">{saving ? "Saving…" : editingId ? "Update Marks" : "Save Marks"}</button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm({ subject: "", exam_type: "", max_marks: "100", marks_obtained: "", grade: "" }); }} className="border border-slate-300 text-slate-600 font-bold text-xs px-5 py-2.5 rounded-lg">Cancel</button>
              )}
            </div>
          </form>
          {loading ? <p className="text-slate-400 text-sm py-4">Loading marks…</p> : (
            <table className="portal-table">
              <thead><tr><th>Date</th><th>Exam Type</th><th>Subject</th><th>Marks</th><th>Grade</th><th>Faculty</th><th>Action</th></tr></thead>
              <tbody>
                {marksData.map(m => (
                  <tr key={m.id}>
                    <td>{new Date(m.date).toLocaleDateString("en-GB")}</td>
                    <td><span className="font-medium text-slate-800">{m.exam_type}</span></td>
                    <td>{m.subject}</td>
                    <td><span className="font-bold">{m.marks_obtained}</span> <span className="text-slate-400 text-[10px]">/ {m.max_marks}</span></td>
                    <td>{m.grade || "—"}</td>
                    <td>{m.faculty_name || "—"}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => editMark(m)} className="text-[#d4af37] text-xs font-medium hover:underline">Edit</button>
                        <button type="button" onClick={() => deleteMark(m.id)} className="text-red-400 text-xs font-medium hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {marksData.length === 0 && <tr><td colSpan={7} className="text-center py-3 text-slate-400">No marks recorded yet.</td></tr>}
              </tbody>
            </table>
          )}
        </>
      ) : (
        /* Student List View */
        <>
          {loadingList ? (
            <p className="text-slate-400 text-sm py-6">Loading students…</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="portal-table">
                  <thead><tr><th>#</th><th>Name</th><th>Class</th><th>Admission No.</th><th>Roll No.</th><th>Action</th></tr></thead>
                  <tbody>
                    {paginatedStudents.length === 0 && <tr><td colSpan={6} className="text-center py-6 text-slate-400">No students found.</td></tr>}
                    {paginatedStudents.map((s, i) => (
                      <tr key={s.id} className="hover:bg-gold-50/40 cursor-pointer transition-colors" onClick={() => selectStudent(s)}>
                        <td className="text-slate-400">{startIndex + i + 1}</td>
                        <td className="font-medium text-slate-800">{s.name}</td>
                        <td>{s.class} – {s.section}</td>
                        <td className="text-slate-500">{s.admission_no}</td>
                        <td className="text-slate-500">{s.roll_no || "—"}</td>
                        <td>
                          <button onClick={(e) => { e.stopPropagation(); selectStudent(s); }} className="text-[#d4af37] text-xs font-bold hover:underline">View / Add Marks</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredStudents.length} startIndex={startIndex} endIndex={endIndex} />
            </>
          )}
        </>
      )}
    </div>
  );
};


export default MarksAdminPanel;
