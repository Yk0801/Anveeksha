import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronRight, ChevronLeft, Users, CheckSquare, List, DollarSign, MessageSquare, Clipboard, Calendar, Settings, FileText, Bus, UserCircle, Bell, X, Moon, LogOut, ChevronsLeft, ChevronsRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { hashPassword } from "@/lib/utils";
import { Student, AdminUserRow } from "./types";
import { SectionTitle, Inp, Sel, PaginationControls, EntriesDropdown } from "./SharedUI";

// ─── REMARKS (Admin + Faculty) ────────────────────────────────────────────────
const RemarksAdminPanel = () => {
  const [search, setSearch] = useState("");
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [remarks, setRemarks] = useState<any[]>([]);
  const [form, setForm] = useState({ category: "Academic", subject: "", remark: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [sendSms, setSendSms] = useState(false);
  const { adminUser, invokeFast2Sms } = useAuth();

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
    const { data: rData } = await supabase.from("remarks").select("*").eq("student_id", s.id).order("created_at", { ascending: false });
    setRemarks(rData || []);
    setLoading(false);
  };

  const editRemark = (r: any) => {
    setEditingId(r.id);
    setForm({ category: r.category, subject: r.subject || "", remark: r.remark });
  };

  const addRemark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !form.remark) return;
    setSaving(true);
    if (editingId) {
      const { error } = await supabase.from("remarks").update({
        category: form.category, subject: form.subject, remark: form.remark
      }).eq("id", editingId);
      setSaving(false);
      if (error) { toast.error(error.message); return; }
      toast.success("Remark updated!");
      setEditingId(null);
    } else {
      const { error } = await supabase.from("remarks").insert([{
        student_id: student.id, category: form.category, subject: form.subject,
        remark: form.remark, given_by: adminUser?.name || "Admin",
        given_by_role: adminUser?.role || "admin",
      }]);
      setSaving(false);
      if (error) { toast.error(error.message); return; }
      
      if (sendSms) {
         toast.loading("Sending SMS to parent...", { id: "smsLoad" });
         const mobile = student.father_mobile_number || student.mother_mobile_number || student.guardian_mobile_number || student.mobile_number;
         if (mobile) {
            const textBody = `Sri Anveeksha - New ${form.category} Remark for ${student.name}:\n${form.remark}\n- By ${adminUser?.name || "Faculty"}`;
            await invokeFast2Sms(textBody, mobile);
            toast.success("Remark added & SMS sent!", { id: "smsLoad" });
         } else {
            toast.error("Remark added, but no mobile number available for SMS.", { id: "smsLoad" });
         }
      } else {
         toast.success("Remark added!");
      }
    }
    setForm({ category: "Academic", subject: "", remark: "" });
    setSendSms(false);
    const { data: rData } = await supabase.from("remarks").select("*").eq("student_id", student.id).order("created_at", { ascending: false });
    setRemarks(rData || []);
  };

  const deleteRemark = async (id: string) => {
    await supabase.from("remarks").delete().eq("id", id);
    setRemarks(remarks.filter(r => r.id !== id));
    toast.success("Remark deleted.");
  };

  const catColor: Record<string, string> = { Academic: "text-emerald-600", Disciplinary: "text-red-500", General: "text-navy-500" };

  return (
    <div>
      <SectionTitle>Remarks</SectionTitle>

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
          <form onSubmit={addRemark} className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 grid sm:grid-cols-2 gap-3">
            <Sel label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {["Academic", "Disciplinary", "General"].map(c => <option key={c}>{c}</option>)}
            </Sel>
            <Inp label="Subject (if Academic)" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wide" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Remark *</label>
              <textarea required value={form.remark} onChange={e => setForm({ ...form, remark: e.target.value })} rows={2}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30" style={{ fontFamily: "Inter,sans-serif" }} />
            </div>
            <div className="sm:col-span-2 flex flex-col gap-3">
              {/* Temporarily disabled Fast2SMS DLT routing 
              <label className="flex items-center gap-2 cursor-pointer w-max">
                <input type="checkbox" checked={sendSms} onChange={e => setSendSms(e.target.checked)} className="w-4 h-4 text-[#d4af37] border-slate-300 rounded focus:ring-[#d4af37]" />
                <span className="text-xs font-bold text-slate-700" style={{ fontFamily: "Inter,sans-serif" }}>Send Copy via SMS to Parent</span>
              </label>
              */}
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="bg-[#d4af37] text-white font-bold text-xs px-5 py-2.5 rounded-lg disabled:opacity-60">{saving ? "Saving…" : editingId ? "Update Remark" : "Add Remark"}</button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setForm({ category: "Academic", subject: "", remark: "" }); }} className="border border-slate-300 text-slate-600 font-bold text-xs px-5 py-2.5 rounded-lg">Cancel</button>
                )}
              </div>
            </div>
          </form>
          {loading ? <p className="text-slate-400 text-sm py-4">Loading remarks…</p> : (
            <table className="portal-table">
              <thead><tr><th>Date</th><th>Category</th><th>Subject</th><th>Remark</th><th>Given By</th><th>Action</th></tr></thead>
              <tbody>
                {remarks.map(r => (
                  <tr key={r.id}>
                    <td>{new Date(r.created_at).toLocaleDateString("en-GB")}</td>
                    <td><span className={`font-medium ${catColor[r.category] || ""}`}>{r.category}</span></td>
                    <td>{r.subject || "—"}</td>
                    <td>{r.remark}</td>
                    <td>{r.given_by}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => editRemark(r)} className="text-[#d4af37] text-xs font-medium hover:underline">Edit</button>
                        <button type="button" onClick={() => deleteRemark(r.id)} className="text-red-400 text-xs font-medium hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {remarks.length === 0 && <tr><td colSpan={6} className="text-center py-3 text-slate-400">No remarks yet.</td></tr>}
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
                          <button onClick={(e) => { e.stopPropagation(); selectStudent(s); }} className="text-[#d4af37] text-xs font-bold hover:underline">View / Add Remarks</button>
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


export default RemarksAdminPanel;
