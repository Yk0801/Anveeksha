import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronRight, ChevronLeft, Users, CheckSquare, List, DollarSign, MessageSquare, Clipboard, Calendar, Settings, FileText, Bus, UserCircle, Bell, X, Moon, LogOut, ChevronsLeft, ChevronsRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { hashPassword } from "@/lib/utils";
import { Student, AdminUserRow } from "./types";
import { SectionTitle, Inp, Sel, PaginationControls, EntriesDropdown } from "./SharedUI";

// ─── ADMIN STUDENT VIEWER ────────────────────────────────────────────────────────
const AdminStudentViewer = ({ student, onClose }: { student: Student, onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [attendance, setAttendance] = useState<any[]>([]);
  const [remarks, setRemarks] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [attRes, feeRes, rmRes, mkRes] = await Promise.all([
        supabase.from("attendance").select("*").eq("student_id", student.id).order("date", { ascending: false }),
        supabase.from("fees").select("*").eq("student_id", student.id).order("due_date", { ascending: false }),
        supabase.from("remarks").select("*").eq("student_id", student.id).order("created_at", { ascending: false }),
        supabase.from("marks").select("*").eq("student_id", student.id).order("date", { ascending: false }),
      ]);
      if (attRes.data) setAttendance(attRes.data);
      if (feeRes.data) setFees(feeRes.data);
      if (rmRes.data) setRemarks(rmRes.data);
      if (mkRes.data) setMarks(mkRes.data);
      setLoading(false);
    };
    loadData();
  }, [student.id]);

  const validDays = attendance.filter(a => a.status !== "Holiday");
  const presents = validDays.filter(a => a.status === "P").length;
  const attendancePercentage = validDays.length > 0 ? Math.round((presents / validDays.length) * 100) : 0;
  const totalFees = fees.reduce((acc, f) => acc + Number(f.amount), 0);
  const paidFees = fees.filter(f => f.status === "Paid").reduce((acc, f) => acc + Number(f.amount), 0);

  const navItems = [
    { id: "profile", label: "Student Profile", icon: UserCircle },
    { id: "attendance", label: "Attendance Record", icon: Calendar },
    { id: "marks", label: "Marks & Grades", icon: CheckSquare },
    { id: "fees", label: "Fee Records", icon: DollarSign },
    { id: "remarks", label: "Academic Remarks", icon: FileText }
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-5 border-b border-slate-200 pb-4">
        <button onClick={onClose} className="text-[#d4af37] text-sm font-bold hover:underline flex items-center gap-1">← Back</button>
        <span className="text-slate-300">|</span>
        <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 font-bold text-xs">{student.name[0]}</div>
        <div>
          <h2 className="font-black text-slate-900 text-lg" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{student.name}</h2>
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Adm No: {student.admission_no} • Class {student.class}-{student.section}</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-6 pb-1 scrollbar-hide">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === item.id ? "bg-[#d4af37] text-white shadow-md shadow-slate-500/20" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
              <Icon className="w-3.5 h-3.5" /> {item.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 font-medium border border-slate-200 rounded-xl bg-white shadow-sm">Loading complete student profile...</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {activeTab === "profile" && (
            <div className="divide-y divide-slate-100">
              {[
                { title: "Bio-Data", rows: [["Name", student.name], ["Admission No.", student.admission_no], ["Roll No.", student.roll_no], ["Class", `${student.class} – ${student.section}`], ["Gender", student.gender], ["DOB", student.dob], ["Mobile", student.mobile_number], ["Email", student.email], ["Aadhar", student.aadhar_number], ["Nationality", student.nationality], ["Religion / Caste", `${student.religion} ${student.caste}`], ["Joining Date", student.joining_date], ["Status", student.status]] },
                { title: "Parent Details", rows: [["Father", student.father_name], ["Father Occ.", student.father_occupation], ["Father Mobile", student.father_mobile_number], ["Father Email", student.father_email_id], ["Father Aadhar", student.father_aadhar_number], ["Mother", student.mother_name], ["Mother Occ.", student.mother_occupation], ["Mother Mobile", student.mother_mobile_number], ["Mother Email", student.mother_email_id], ["Mother Aadhar", student.mother_aadhar_number], ["Annual Income", student.annual_income], ["Current Address", student.correspondence_address], ["Permanent Address", student.permanent_address]] },
                ...(student.guardian_enabled ? [{ title: "Guardian Details", rows: [["Name", student.guardian_name], ["Occupation", student.guardian_occupation], ["Mobile", student.guardian_mobile_number], ["Email", student.guardian_mail_id], ["Aadhar", student.guardian_aadhar_number], ["Address", student.guardian_address]] }] : []),
              ].map(sec => (
                <div key={sec.title} className="p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#d4af37] mb-3 pb-2 border-b border-gold-100" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{sec.title}</p>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
                    {(sec.rows as [string, string][]).map(([l, v]) => (
                      <div key={l}>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">{l}</p>
                        <p className="text-sm font-medium text-slate-800">{v || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="p-5">
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
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${a.status === "P" ? "bg-emerald-100 text-emerald-700" : a.status === "A" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"}`}>
                          {a.status === "P" ? "Present" : a.status === "A" ? "Absent" : a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {attendance.length === 0 && <tr><td colSpan={2} className="py-4 text-center text-slate-400">No attendance records found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "fees" && (
            <div className="p-5">
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
                  {fees.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-slate-400">No fee records found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "marks" && (
            <div className="p-5">
              <table className="portal-table w-full text-left text-sm whitespace-nowrap">
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
          )}

          {activeTab === "remarks" && (
            <div className="p-5">
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
                {remarks.length === 0 && <p className="text-slate-400 text-sm text-center py-4">No remarks found for this student.</p>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


// ─── STUDENTS ─────────────────────────────────────────────────────────────────
const StudentsPanel = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [addMode, setAddMode] = useState(false);
  const blankForm = {
    name: "", class: "Pre-KG", section: "A", gender: "Male", dob: "", nationality: "Indian",
    religion: "Hindu", caste: "OC", mobile: "", email: "", aadhar: "", admissionNo: "", rollNo: "",
    fatherName: "", fatherOcc: "", fatherMobile: "", fatherEmail: "", fatherAadhar: "",
    motherName: "", motherOcc: "", motherMobile: "", motherEmail: "", motherAadhar: "",
    corrAddress: "", permAddress: "", annualIncome: "",
    guardianEnabled: false, guardianName: "", guardianOcc: "", guardianMobile: "", guardianEmail: "", guardianAddress: "", guardianAadhar: ""
  };
  const [form, setForm] = useState(blankForm);
  const [saving, setSaving] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("students").select("*").order("created_at", { ascending: false });
    setStudents((data as Student[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const filtered = students.filter(s =>
    (!search || s.name.toLowerCase().includes(search.toLowerCase()) || s.admission_no?.toLowerCase().includes(search.toLowerCase())) &&
    (!classFilter || s.class === classFilter)
  );

  const handleAdd = async () => {
    if (!form.name || !form.admissionNo) { toast.error("Name and Admission No. are required."); return; }
    setSaving(true);
    const { error } = await supabase.from("students").insert([{
      admission_no: form.admissionNo.toUpperCase(), roll_no: form.rollNo, name: form.name,
      class: form.class, section: form.section, gender: form.gender, dob: form.dob || null,
      nationality: form.nationality, religion: form.religion, caste: form.caste,
      mobile_number: form.mobile, email: form.email, aadhar_number: form.aadhar,
      father_name: form.fatherName, father_occupation: form.fatherOcc, father_mobile_number: form.fatherMobile, father_email_id: form.fatherEmail, father_aadhar_number: form.fatherAadhar,
      mother_name: form.motherName, mother_occupation: form.motherOcc, mother_mobile_number: form.motherMobile, mother_email_id: form.motherEmail, mother_aadhar_number: form.motherAadhar,
      correspondence_address: form.corrAddress, permanent_address: form.permAddress, annual_income: form.annualIncome,
      guardian_enabled: form.guardianEnabled, guardian_name: form.guardianName, guardian_occupation: form.guardianOcc,
      guardian_mobile_number: form.guardianMobile, guardian_mail_id: form.guardianEmail,
      guardian_address: form.guardianAddress, guardian_aadhar_number: form.guardianAadhar,
      status: "Active", password: "password123",
    }]);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Student added!");
    setAddMode(false); setForm(blankForm); fetchStudents();
  };

  const toggleStatus = async (s: Student) => {
    const ns = s.status === "Active" ? "Inactive" : "Active";
    await supabase.from("students").update({ status: ns }).eq("id", s.id);
    fetchStudents();
    toast.success(`Student marked as ${ns}.`);
  };

  if (viewStudent) {
    return <AdminStudentViewer student={viewStudent} onClose={() => setViewStudent(null)} />;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <SectionTitle>Students</SectionTitle>
        <div className="flex-1" />
        <button onClick={() => setAddMode(v => !v)} className="bg-[#d4af37] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#c49e29]">+ Add Student</button>
        <button onClick={() => { const csv = students.map(s => `${s.admission_no},${s.name},${s.class},${s.roll_no},${s.status}`).join("\n"); const b = new Blob([`Admission No,Name,Class,Roll No,Status\n${csv}`], { type: "text/csv" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "students.csv"; a.click(); }} className="border border-slate-300 text-slate-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-50">Export CSV</button>
      </div>
      <div className="flex gap-3 mb-4 flex-wrap">
        <input type="text" placeholder="Search name or admission no." value={search} onChange={e => setSearch(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-40 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30" style={{ fontFamily: "Inter,sans-serif" }} />
        <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ fontFamily: "Inter,sans-serif" }}>
          <option value="">All Classes</option>
          {["Pre-KG", "LKG", "UKG"].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {addMode && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-5 space-y-5">
          <div className="flex justify-between items-center">
            <p className="font-bold text-[#d4af37] text-xs uppercase tracking-widest" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Register New Student</p>
            <button onClick={() => setAddMode(false)}><X className="w-4 h-4 text-slate-400" /></button>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 pb-1 border-b border-slate-200" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>1 — Student Details</p>
            <div className="grid sm:grid-cols-3 md:grid-cols-4 gap-3">
              <Inp label="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <Inp label="Admission No. *" value={form.admissionNo} onChange={e => setForm({ ...form, admissionNo: e.target.value })} />
              <Inp label="Roll No." value={form.rollNo} onChange={e => setForm({ ...form, rollNo: e.target.value })} />
              <Sel label="Class *" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })}>
                {["Pre-KG", "LKG", "UKG"].map(c => <option key={c}>{c}</option>)}
              </Sel>
              <Sel label="Section" value={form.section} onChange={e => setForm({ ...form, section: e.target.value })}>
                {["A", "B", "C"].map(s => <option key={s}>{s}</option>)}
              </Sel>
              <Sel label="Gender" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                <option>Male</option><option>Female</option>
              </Sel>
              <Inp label="Date of Birth" type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
              <Inp label="Nationality" value={form.nationality} onChange={e => setForm({ ...form, nationality: e.target.value })} />
              <Inp label="Religion" value={form.religion} onChange={e => setForm({ ...form, religion: e.target.value })} />
              <Inp label="Caste" value={form.caste} onChange={e => setForm({ ...form, caste: e.target.value })} />
              <Inp label="Mobile" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />
              <Inp label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <Inp label="Aadhar No." value={form.aadhar} onChange={e => setForm({ ...form, aadhar: e.target.value })} />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 pb-1 border-b border-slate-200" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>2 — Parent Details</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-3">
              <Inp label="Father Name" value={form.fatherName} onChange={e => setForm({ ...form, fatherName: e.target.value })} />
              <Inp label="Occupation" value={form.fatherOcc} onChange={e => setForm({ ...form, fatherOcc: e.target.value })} />
              <Inp label="Mobile" value={form.fatherMobile} onChange={e => setForm({ ...form, fatherMobile: e.target.value })} />
              <Inp label="Email" value={form.fatherEmail} onChange={e => setForm({ ...form, fatherEmail: e.target.value })} />
              <Inp label="Aadhar" value={form.fatherAadhar} onChange={e => setForm({ ...form, fatherAadhar: e.target.value })} />
              <Inp label="Mother Name" value={form.motherName} onChange={e => setForm({ ...form, motherName: e.target.value })} />
              <Inp label="Occupation" value={form.motherOcc} onChange={e => setForm({ ...form, motherOcc: e.target.value })} />
              <Inp label="Mobile" value={form.motherMobile} onChange={e => setForm({ ...form, motherMobile: e.target.value })} />
              <Inp label="Email" value={form.motherEmail} onChange={e => setForm({ ...form, motherEmail: e.target.value })} />
              <Inp label="Aadhar" value={form.motherAadhar} onChange={e => setForm({ ...form, motherAadhar: e.target.value })} />
              <div className="md:col-span-2"><Inp label="Correspondence Address" value={form.corrAddress} onChange={e => setForm({ ...form, corrAddress: e.target.value })} /></div>
              <div className="md:col-span-2"><Inp label="Permanent Address" value={form.permAddress} onChange={e => setForm({ ...form, permAddress: e.target.value })} /></div>
              <Inp label="Annual Income" value={form.annualIncome} onChange={e => setForm({ ...form, annualIncome: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 mb-3 cursor-pointer">
              <input type="checkbox" checked={form.guardianEnabled} onChange={e => setForm({ ...form, guardianEnabled: e.target.checked })} className="accent-[#d4af37]" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>3 — Guardian Details (if applicable)</p>
            </label>
            {form.guardianEnabled && (
              <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-3">
                <Inp label="Guardian Name" value={form.guardianName} onChange={e => setForm({ ...form, guardianName: e.target.value })} />
                <Inp label="Occupation" value={form.guardianOcc} onChange={e => setForm({ ...form, guardianOcc: e.target.value })} />
                <Inp label="Mobile" value={form.guardianMobile} onChange={e => setForm({ ...form, guardianMobile: e.target.value })} />
                <Inp label="Email" value={form.guardianEmail} onChange={e => setForm({ ...form, guardianEmail: e.target.value })} />
                <Inp label="Aadhar" value={form.guardianAadhar} onChange={e => setForm({ ...form, guardianAadhar: e.target.value })} />
                <div className="md:col-span-5"><Inp label="Address" value={form.guardianAddress} onChange={e => setForm({ ...form, guardianAddress: e.target.value })} /></div>
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-2 border-t border-slate-200">
            <button onClick={handleAdd} disabled={saving} className="bg-[#d4af37] text-white font-bold text-xs px-6 py-2.5 rounded-lg hover:bg-[#c49e29] disabled:opacity-60">{saving ? "Saving…" : "Save Student"}</button>
            <button onClick={() => { setAddMode(false); setForm(blankForm); }} className="border border-slate-300 text-slate-600 font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-slate-50">Cancel</button>
          </div>
        </div>
      )}

      {loading ? <p className="text-slate-500 text-sm py-6">Loading students from database…</p> : (
        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead><tr><th>#</th><th>Name</th><th>Class</th><th>Roll No.</th><th>Admission No.</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={7} className="text-center py-6 text-slate-400">No students found.</td></tr>}
              {filtered.map((s, i) => (
                <tr key={s.id}>
                  <td>{i + 1}</td>
                  <td className="font-medium">{s.name}</td>
                  <td>{s.class} – {s.section}</td>
                  <td>{s.roll_no}</td>
                  <td>{s.admission_no}</td>
                  <td><span className={s.status === "Active" ? "status-present" : "status-absent"}>{s.status}</span></td>
                  <td className="flex gap-3">
                    <button onClick={() => setViewStudent(s)} className="text-[#d4af37] text-xs font-medium hover:underline">View</button>
                    <button onClick={() => toggleStatus(s)} className="text-slate-500 text-xs font-medium hover:underline">{s.status === "Active" ? "Deactivate" : "Activate"}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


export default StudentsPanel;
