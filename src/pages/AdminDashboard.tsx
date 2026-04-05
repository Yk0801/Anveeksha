import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Users, CheckSquare, List, DollarSign, MessageSquare, Clipboard, Calendar, Settings, FileText, Bus, UserCircle, Bell, X, Moon, LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth, AdminUser } from "@/context/AuthContext";
import { hashPassword } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Student {
  id: string; admission_no: string; roll_no: string; name: string;
  class: string; section: string; gender: string; dob: string; status: string;
  mobile_number: string; email: string; aadhar_number: string; nationality: string;
  religion: string; caste: string; joining_date: string;
  father_name: string; father_occupation: string; father_mobile_number: string;
  father_email_id: string; father_aadhar_number: string;
  mother_name: string; mother_occupation: string; mother_mobile_number: string;
  mother_email_id: string; mother_aadhar_number: string;
  correspondence_address: string; permanent_address: string; annual_income: string;
  guardian_enabled: boolean; guardian_name: string; guardian_occupation: string;
  guardian_mobile_number: string; guardian_mail_id: string;
  guardian_address: string; guardian_aadhar_number: string;
}

interface AdminUserRow {
  id: string; email: string; name: string; role: string;
  designation: string; subject: string; mobile: string;
  is_active: boolean; must_change_password: boolean; created_at: string;
}

// ─── Menu config ──────────────────────────────────────────────────────────────
const ADMIN_MENU = [
  { id: "dashboard", label: "Dashboard", roles: ["superadmin", "admin"] },
  { id: "students", label: "Students", roles: ["superadmin", "admin"] },
  { id: "attendance", label: "Attendance", roles: ["superadmin", "admin", "faculty"] },
  { id: "fees", label: "Fee Management", roles: ["superadmin", "admin"] },
  { id: "marks", label: "Marks", roles: ["superadmin", "admin", "faculty"] },
  { id: "remarks", label: "Remarks", roles: ["superadmin", "admin", "faculty"] },
  { id: "admissions", label: "Admissions", roles: ["superadmin", "admin"] },
  { id: "announcements", label: "Announcements", roles: ["superadmin", "admin"] },
  { id: "bus", label: "Bus Management", roles: ["superadmin", "admin"] },
  { id: "staff", label: "Staff", roles: ["superadmin", "admin"] },
  { id: "manage_users", label: "Manage Users", roles: ["superadmin", "admin"] },
  { id: "reports", label: "Reports", roles: ["superadmin", "admin"] },
  { id: "settings", label: "Settings", roles: ["superadmin"] },
];

// ─── Shared UI helpers ────────────────────────────────────────────────────────
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-3 mb-5"
    style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{children}</h2>
);

const Inp = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wide" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{label}</label>
    <input {...props} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 bg-white" style={{ fontFamily: "Inter,sans-serif" }} />
  </div>
);

const Sel = ({ label, children, ...props }: { label: string } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div>
    <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wide" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{label}</label>
    <select {...props} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 bg-white" style={{ fontFamily: "Inter,sans-serif" }}>
      {children}
    </select>
  </div>
);

// ─── DASHBOARD ─────────────────────────────────────────────────────────────────
const DashboardPanel = () => {
  const [counts, setCounts] = useState({ total: 0, prekg: 0, lkg: 0, ukg: 0, staff: 0, pending: 0 });
  const [activity, setActivity] = useState<{ date: string; text: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: students }, { data: users }, { data: admissions }] = await Promise.all([
        supabase.from("students").select("id,class,status"),
        supabase.from("admin_users").select("id,role,is_active"),
        supabase.from("admissions_inquiries").select("id,status,parent_name,child_name,created_at").order("created_at", { ascending: false }).limit(5),
      ]);
      const s = students || [];
      const recentAdm = (admissions || []).map(a => ({
        date: new Date(a.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        text: `New admission inquiry — ${a.child_name || "—"} by ${a.parent_name || "—"}`,
      }));
      setCounts({
        total: s.length,
        prekg: s.filter(x => x.class === "Pre-KG").length,
        lkg: s.filter(x => x.class === "LKG").length,
        ukg: s.filter(x => x.class === "UKG").length,
        staff: (users || []).filter(u => u.role === "faculty" && u.is_active).length,
        pending: 0,
      });
      setActivity(recentAdm.length ? recentAdm : [{ date: "—", text: "No recent activity yet." }]);
      setLoading(false);
    };
    load();
  }, []);

  const boxes = [
    { label: "Total Students", value: counts.total },
    { label: "Pre-KG", value: counts.prekg },
    { label: "LKG", value: counts.lkg },
    { label: "UKG", value: counts.ukg },
    { label: "Active Faculty", value: counts.staff },
  ];

  return (
    <div>
      <SectionTitle>Dashboard</SectionTitle>
      {loading ? <p className="text-slate-500 text-sm">Loading...</p> : (
        <>
          <p className="text-sm text-slate-600 mb-5" style={{ fontFamily: "Inter,sans-serif" }}>
            Total Students: <strong>{counts.total}</strong> &nbsp;|&nbsp; Pre-KG: <strong>{counts.prekg}</strong> &nbsp;|&nbsp; LKG: <strong>{counts.lkg}</strong> &nbsp;|&nbsp; UKG: <strong>{counts.ukg}</strong> &nbsp;|&nbsp; Faculty: <strong>{counts.staff}</strong>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {boxes.map(b => (
              <div key={b.label} className="border border-slate-200 rounded-xl p-4 bg-white">
                <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{b.value}</p>
                <p className="text-slate-500 text-xs mt-1" style={{ fontFamily: "Inter,sans-serif" }}>{b.label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Recent Activity</p>
          <div className="divide-y divide-slate-100">
            {activity.map((a, i) => (
              <div key={i} className="py-2.5 flex items-start gap-3">
                <span className="text-xs text-slate-400 flex-shrink-0 w-28" style={{ fontFamily: "Inter,sans-serif" }}>{a.date}</span>
                <span className="text-sm text-slate-700" style={{ fontFamily: "Inter,sans-serif" }}>{a.text}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

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
        <button onClick={onClose} className="text-[#F97316] text-sm font-bold hover:underline flex items-center gap-1">← Back</button>
        <span className="text-slate-300">|</span>
        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">{student.name[0]}</div>
        <div>
          <h2 className="font-black text-slate-900 text-lg" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{student.name}</h2>
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Adm No: {student.admission_no} • Class {student.class}-{student.section}</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-6 pb-1 scrollbar-hide">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === item.id ? "bg-[#F97316] text-white shadow-md shadow-orange-500/20" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
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
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#F97316] mb-3 pb-2 border-b border-orange-100" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{sec.title}</p>
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
                <div className="flex-1 bg-orange-50 border border-orange-100 p-4 rounded-xl text-center">
                  <p className="text-xs font-bold text-orange-600 uppercase">Percentage</p>
                  <p className="text-2xl font-black text-orange-700">{attendancePercentage}%</p>
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
                <div className="flex-1 bg-orange-50 border border-orange-100 p-4 rounded-xl text-center">
                  <p className="text-xs font-bold text-orange-600 uppercase">Pending Due</p>
                  <p className="text-xl font-black text-orange-700">₹{(totalFees - paidFees).toLocaleString()}</p>
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
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${f.status === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
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
                        <p className="text-[10px] uppercase font-bold text-[#F97316]">{r.given_by}</p>
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
        <button onClick={() => setAddMode(v => !v)} className="bg-[#F97316] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#ea580c]">+ Add Student</button>
        <button onClick={() => { const csv = students.map(s => `${s.admission_no},${s.name},${s.class},${s.roll_no},${s.status}`).join("\n"); const b = new Blob([`Admission No,Name,Class,Roll No,Status\n${csv}`], { type: "text/csv" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "students.csv"; a.click(); }} className="border border-slate-300 text-slate-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-50">Export CSV</button>
      </div>
      <div className="flex gap-3 mb-4 flex-wrap">
        <input type="text" placeholder="Search name or admission no." value={search} onChange={e => setSearch(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-40 focus:outline-none focus:ring-2 focus:ring-[#F97316]/30" style={{ fontFamily: "Inter,sans-serif" }} />
        <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ fontFamily: "Inter,sans-serif" }}>
          <option value="">All Classes</option>
          {["Pre-KG", "LKG", "UKG"].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {addMode && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-5 space-y-5">
          <div className="flex justify-between items-center">
            <p className="font-bold text-[#F97316] text-xs uppercase tracking-widest" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Register New Student</p>
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
              <input type="checkbox" checked={form.guardianEnabled} onChange={e => setForm({ ...form, guardianEnabled: e.target.checked })} className="accent-[#F97316]" />
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
            <button onClick={handleAdd} disabled={saving} className="bg-[#F97316] text-white font-bold text-xs px-6 py-2.5 rounded-lg hover:bg-[#ea580c] disabled:opacity-60">{saving ? "Saving…" : "Save Student"}</button>
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
                    <button onClick={() => setViewStudent(s)} className="text-[#F97316] text-xs font-medium hover:underline">View</button>
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
        <input type="date" value={selDate} onChange={e => setSelDate(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30" style={{ fontFamily: "Inter,sans-serif" }} />
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
          <button onClick={save} disabled={saving} className="bg-[#F97316] text-white font-bold text-xs px-6 py-2.5 rounded-lg hover:bg-[#ea580c] disabled:opacity-60">{saving ? "Saving…" : "Save Attendance"}</button>
        </>
      )}
    </div>
  );
};

// ─── FEE MANAGEMENT ──────────────────────────────────────────────────────────
const FeeManagementPanel = () => {
  const [search, setSearch] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [fees, setFees] = useState<any[]>([]);
  const [outstanding, setOutstanding] = useState<any[]>([]);
  const [tab, setTab] = useState<"student" | "outstanding">("student");
  const [payForm, setPayForm] = useState({ amount: "", date: "", receipt: "", method: "Cash" });
  const [showPay, setShowPay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const searchStudent = async () => {
    if (!search) return;
    setLoading(true);
    const { data } = await supabase.from("students").select("*").or(`admission_no.ilike.%${search}%,name.ilike.%${search}%`).limit(1).single();
    if (data) {
      setStudent(data as Student);
      const { data: fData } = await supabase.from("fees").select("*").eq("student_id", data.id).order("due_date");
      setFees(fData || []);
    } else {
      toast.error("Student not found."); setStudent(null); setFees([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (tab === "outstanding") {
      supabase.from("fees").select("*, students(name,class,admission_no)").eq("status", "Pending").order("due_date").then(({ data }) => setOutstanding(data || []));
    }
  }, [tab]);

  const addPayment = async () => {
    if (!student || !payForm.amount) { toast.error("Fill in amount."); return; }
    setSaving(true);
    const { error } = await supabase.from("fees").insert([{
      student_id: student.id, term: "General", type: "Payment", amount: Number(payForm.amount),
      due_date: payForm.date || new Date().toISOString().split("T")[0], paid_on: payForm.date || new Date().toISOString().split("T")[0],
      status: "Paid",
    }]);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Payment recorded!");
    setShowPay(false); setPayForm({ amount: "", date: "", receipt: "", method: "Cash" });
    const { data: fData } = await supabase.from("fees").select("*").eq("student_id", student.id);
    setFees(fData || []);
  };

  const total = fees.reduce((s, f) => s + Number(f.amount), 0);
  const paid = fees.filter(f => f.status === "Paid").reduce((s, f) => s + Number(f.amount), 0);

  return (
    <div>
      <SectionTitle>Fee Management</SectionTitle>
      <div className="flex gap-2 mb-5">
        {(["student", "outstanding"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-lg ${tab === t ? "bg-[#F97316] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{t === "student" ? "Student Fees" : "Outstanding"}</button>
        ))}
      </div>
      {tab === "student" && (
        <>
          <div className="flex gap-3 mb-4">
            <input type="text" placeholder="Name or admission no." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && searchStudent()} className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30" style={{ fontFamily: "Inter,sans-serif" }} />
            <button onClick={searchStudent} className="bg-[#F97316] text-white font-bold text-xs px-4 py-2 rounded-lg">{loading ? "…" : "Search"}</button>
          </div>
          {student && (
            <>
              <p className="text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{student.name} — {student.class} | Total: ₹{total.toLocaleString()} | Paid: ₹{paid.toLocaleString()} | Due: <span className="text-[#F97316]">₹{(total - paid).toLocaleString()}</span></p>
              <table className="portal-table mb-4">
                <thead><tr><th>Term</th><th>Type</th><th>Amount</th><th>Due</th><th>Paid On</th><th>Status</th></tr></thead>
                <tbody>
                  {fees.map((f, i) => (
                    <tr key={i}><td>{f.term}</td><td>{f.type}</td><td>₹{Number(f.amount).toLocaleString()}</td><td>{f.due_date}</td><td>{f.paid_on || "—"}</td>
                      <td><span className={f.status === "Paid" ? "status-paid" : "status-pending"}>{f.status}</span></td>
                    </tr>
                  ))}
                  {fees.length === 0 && <tr><td colSpan={6} className="text-center py-3 text-slate-400">No fee records yet.</td></tr>}
                </tbody>
              </table>
              <button onClick={() => setShowPay(v => !v)} className="bg-[#F97316] text-white font-bold text-xs px-4 py-2 rounded-lg mb-3">+ Add Payment</button>
              {showPay && (
                <div className="border border-slate-200 rounded-xl p-4 mb-4 bg-slate-50 grid sm:grid-cols-2 gap-3">
                  <Inp label="Amount (₹) *" value={payForm.amount} onChange={e => setPayForm({ ...payForm, amount: e.target.value })} type="number" />
                  <Inp label="Date" value={payForm.date} onChange={e => setPayForm({ ...payForm, date: e.target.value })} type="date" />
                  <Inp label="Receipt No." value={payForm.receipt} onChange={e => setPayForm({ ...payForm, receipt: e.target.value })} />
                  <Sel label="Method" value={payForm.method} onChange={e => setPayForm({ ...payForm, method: e.target.value })}>
                    {["Cash", "Online", "Cheque", "DD"].map(m => <option key={m}>{m}</option>)}
                  </Sel>
                  <div className="sm:col-span-2">
                    <button onClick={addPayment} disabled={saving} className="bg-[#F97316] text-white font-bold text-xs px-5 py-2 rounded-lg disabled:opacity-60">{saving ? "Saving…" : "Save Payment"}</button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
      {tab === "outstanding" && (
        <table className="portal-table">
          <thead><tr><th>#</th><th>Student</th><th>Class</th><th>Type</th><th>Amount</th><th>Due Date</th></tr></thead>
          <tbody>
            {outstanding.map((f, i) => (
              <tr key={f.id}><td>{i + 1}</td><td className="font-medium">{(f.students as any)?.name || "—"}</td><td>{(f.students as any)?.class || "—"}</td><td>{f.type}</td><td className="status-pending font-bold">₹{Number(f.amount).toLocaleString()}</td><td>{f.due_date}</td></tr>
            ))}
            {outstanding.length === 0 && <tr><td colSpan={6} className="text-center py-4 text-slate-400">No outstanding fees.</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
};

// ─── REMARKS (Admin + Faculty) ────────────────────────────────────────────────
const RemarksAdminPanel = () => {
  const [search, setSearch] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [remarks, setRemarks] = useState<any[]>([]);
  const [form, setForm] = useState({ category: "Academic", subject: "", remark: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { adminUser } = useAuth();

  const searchStudent = async () => {
    if (!search) return;
    setLoading(true);
    const { data } = await supabase.from("students").select("id,name,class,section,admission_no").or(`admission_no.ilike.%${search}%,name.ilike.%${search}%`).limit(1).single();
    if (data) {
      setStudent(data as Student);
      const { data: rData } = await supabase.from("remarks").select("*").eq("student_id", data.id).order("created_at", { ascending: false });
      setRemarks(rData || []);
    } else {
      toast.error("Student not found."); setStudent(null); setRemarks([]);
    }
    setLoading(false);
  };

  const addRemark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !form.remark) return;
    setSaving(true);
    const { error } = await supabase.from("remarks").insert([{
      student_id: student.id, category: form.category, subject: form.subject,
      remark: form.remark, given_by: adminUser?.name || "Admin",
      given_by_role: adminUser?.role || "admin",
    }]);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Remark added!");
    setForm({ category: "Academic", subject: "", remark: "" });
    const { data: rData } = await supabase.from("remarks").select("*").eq("student_id", student.id).order("created_at", { ascending: false });
    setRemarks(rData || []);
  };

  const deleteRemark = async (id: string) => {
    await supabase.from("remarks").delete().eq("id", id);
    setRemarks(remarks.filter(r => r.id !== id));
    toast.success("Remark deleted.");
  };

  const catColor: Record<string, string> = { Academic: "text-emerald-600", Disciplinary: "text-red-500", General: "text-indigo-500" };

  return (
    <div>
      <SectionTitle>Remarks</SectionTitle>
      <div className="flex gap-3 mb-4">
        <input type="text" placeholder="Search student name or admission no." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && searchStudent()} className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ fontFamily: "Inter,sans-serif" }} />
        <button onClick={searchStudent} className="bg-[#F97316] text-white font-bold text-xs px-4 py-2 rounded-lg">{loading ? "…" : "Search"}</button>
      </div>
      {student && (
        <>
          <p className="text-sm font-semibold text-slate-700 mb-4" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{student.name} — {student.class}</p>
          <form onSubmit={addRemark} className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 grid sm:grid-cols-2 gap-3">
            <Sel label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {["Academic", "Disciplinary", "General"].map(c => <option key={c}>{c}</option>)}
            </Sel>
            <Inp label="Subject (if Academic)" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wide" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Remark *</label>
              <textarea required value={form.remark} onChange={e => setForm({ ...form, remark: e.target.value })} rows={2}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-[#F97316]/30" style={{ fontFamily: "Inter,sans-serif" }} />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={saving} className="bg-[#F97316] text-white font-bold text-xs px-5 py-2.5 rounded-lg disabled:opacity-60">{saving ? "Adding…" : "Add Remark"}</button>
            </div>
          </form>
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
                  <td><button onClick={() => deleteRemark(r.id)} className="text-red-400 text-xs font-medium hover:underline">Delete</button></td>
                </tr>
              ))}
              {remarks.length === 0 && <tr><td colSpan={6} className="text-center py-3 text-slate-400">No remarks yet.</td></tr>}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

// ─── MARKS (Admin + Faculty) ──────────────────────────────────────────────────
const MarksAdminPanel = () => {
  const [search, setSearch] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [marksData, setMarksData] = useState<any[]>([]);
  const [form, setForm] = useState({ subject: "", exam_type: "", max_marks: "100", marks_obtained: "", grade: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { adminUser } = useAuth();

  const searchStudent = async () => {
    if (!search) return;
    setLoading(true);
    const { data } = await supabase.from("students").select("id,name,class,section,admission_no").or(`admission_no.ilike.%${search}%,name.ilike.%${search}%`).limit(1).single();
    if (data) {
      setStudent(data as Student);
      const { data: mData } = await supabase.from("marks").select("*").eq("student_id", data.id).order("created_at", { ascending: false });
      setMarksData(mData || []);
    } else {
      toast.error("Student not found."); setStudent(null); setMarksData([]);
    }
    setLoading(false);
  };

  const addMark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !form.subject || !form.exam_type || !form.marks_obtained) return;
    setSaving(true);
    const { error } = await supabase.from("marks").insert([{
      student_id: student.id, faculty_id: adminUser?.id, faculty_name: adminUser?.name || "Admin",
      subject: form.subject, exam_type: form.exam_type, max_marks: Number(form.max_marks),
      marks_obtained: Number(form.marks_obtained), grade: form.grade,
    }]);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Marks recorded!");
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
      <div className="flex gap-3 mb-4">
        <input type="text" placeholder="Search student name or admission no." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && searchStudent()} className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30" style={{ fontFamily: "Inter,sans-serif" }} />
        <button onClick={searchStudent} className="bg-[#F97316] text-white font-bold text-xs px-4 py-2 rounded-lg">{loading ? "…" : "Search"}</button>
      </div>
      {student && (
        <>
          <p className="text-sm font-semibold text-slate-700 mb-4" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{student.name} — {student.class}</p>
          <form onSubmit={addMark} className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 grid sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
            <Inp label="Subject *" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
            <Inp label="Exam Type *" placeholder="e.g. FA1, SA1" required value={form.exam_type} onChange={e => setForm({ ...form, exam_type: e.target.value })} />
            <Inp label="Max Marks *" type="number" required value={form.max_marks} onChange={e => setForm({ ...form, max_marks: e.target.value })} />
            <Inp label="Obtained *" type="number" step="0.1" required value={form.marks_obtained} onChange={e => setForm({ ...form, marks_obtained: e.target.value })} />
            <Inp label="Grade" placeholder="Optional" value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} />
            <div className="sm:col-span-2 md:col-span-5 pt-2">
              <button type="submit" disabled={saving} className="bg-[#F97316] text-white font-bold text-xs px-5 py-2.5 rounded-lg disabled:opacity-60">{saving ? "Recording…" : "Save Marks"}</button>
            </div>
          </form>
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
                  <td><button type="button" onClick={() => deleteMark(m.id)} className="text-red-400 text-xs font-medium hover:underline">Delete</button></td>
                </tr>
              ))}
              {marksData.length === 0 && <tr><td colSpan={7} className="text-center py-3 text-slate-400">No marks recorded yet.</td></tr>}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

// ─── MANAGE USERS (Faculty + Admin) ──────────────────────────────────────────
const ManageUsersPanel = () => {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const [form, setForm] = useState({ email: "", name: "", role: "faculty", designation: "", subject: "", mobile: "" });
  const [saving, setSaving] = useState(false);
  const { adminUser } = useAuth();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("admin_users").select("*").order("created_at", { ascending: false });
    setUsers((data as AdminUserRow[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const addUser = async () => {
    if (!form.email || !form.name) { toast.error("Email and Name are required."); return; }
    setSaving(true);
    const hashedPwd = await hashPassword("Welcome@123");
    const { error } = await supabase.from("admin_users").insert([{
      email: form.email.trim().toLowerCase(), name: form.name, role: form.role,
      designation: form.designation, subject: form.subject, mobile: form.mobile,
      password: hashedPwd, must_change_password: true, is_active: true,
      created_by: adminUser?.id,
    }]);
    setSaving(false);
    if (error) { toast.error(error.message.includes("unique") ? "This email is already registered." : error.message); return; }
    toast.success(`${form.role === "faculty" ? "Faculty" : "Admin"} added! Default password: Welcome@123`);
    setShowForm(false); setForm({ email: "", name: "", role: "faculty", designation: "", subject: "", mobile: "" });
    fetchUsers();
  };

  const toggleActive = async (u: AdminUserRow) => {
    if (u.email === adminUser?.email) { toast.error("You cannot deactivate your own account."); return; }
    await supabase.from("admin_users").update({ is_active: !u.is_active }).eq("id", u.id);
    fetchUsers();
    toast.success(`Account ${u.is_active ? "deactivated" : "activated"}.`);
  };

  const filtered = users.filter(u => !roleFilter || u.role === roleFilter);
  const roleBadge: Record<string, string> = { superadmin: "text-purple-600", admin: "text-indigo-600", faculty: "text-emerald-600" };

  return (
    <div>
      <SectionTitle>Manage Users (Admin & Faculty)</SectionTitle>
      <div className="flex flex-wrap gap-3 mb-5">
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ fontFamily: "Inter,sans-serif" }}>
          <option value="">All Roles</option>
          <option value="superadmin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="faculty">Faculty</option>
        </select>
        <button onClick={() => setShowForm(v => !v)} className="bg-[#F97316] text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-[#ea580c]">+ Add Faculty / Admin</button>
      </div>

      {showForm && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-5">
          <div className="flex justify-between items-center mb-4">
            <p className="text-xs font-black uppercase tracking-widest text-[#F97316]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Add New User</p>
            <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-slate-400" /></button>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            <Inp label="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Inp label="Email Address *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <Sel label="Role *" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="faculty">Faculty (restricted access)</option>
              <option value="admin">Admin (full access)</option>
            </Sel>
            <Inp label="Designation" placeholder="e.g. Class Teacher LKG-A" value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} />
            <Inp label="Subject" placeholder="e.g. English, Maths" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
            <Inp label="Mobile" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4">
            <p className="text-xs text-amber-700 font-medium" style={{ fontFamily: "Inter,sans-serif" }}>
              Default password will be <strong>Welcome@123</strong>. The user will be asked to change it on first login. Faculty accounts can only access Attendance and Remarks pages.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={addUser} disabled={saving} className="bg-[#F97316] text-white font-bold text-xs px-6 py-2.5 rounded-lg disabled:opacity-60">{saving ? "Adding…" : "Add User"}</button>
            <button onClick={() => setShowForm(false)} className="border border-slate-300 text-slate-600 font-bold text-xs px-5 py-2.5 rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      {loading ? <p className="text-slate-400 text-sm">Loading users…</p> : (
        <table className="portal-table">
          <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Designation</th><th>Status</th><th>Pwd Set</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id}>
                <td>{i + 1}</td>
                <td className="font-medium">{u.name}</td>
                <td>{u.email}</td>
                <td><span className={`font-bold ${roleBadge[u.role] || ""}`}>{u.role}</span></td>
                <td>{u.designation || "—"}</td>
                <td><span className={u.is_active ? "status-present" : "status-absent"}>{u.is_active ? "Active" : "Inactive"}</span></td>
                <td><span className={u.must_change_password ? "status-pending" : "status-paid"}>{u.must_change_password ? "Pending" : "Set"}</span></td>
                <td>
                  {u.email !== adminUser?.email && (
                    <button onClick={() => toggleActive(u)} className="text-slate-500 text-xs font-medium hover:underline">
                      {u.is_active ? "Deactivate" : "Activate"}
                    </button>
                  )}
                  {u.email === adminUser?.email && <span className="text-xs text-slate-300">You</span>}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} className="text-center py-4 text-slate-400">No users found.</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
};

// ─── ADMISSIONS ───────────────────────────────────────────────────────────────
const AdmissionsPanel = () => {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    supabase.from("admissions_inquiries").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setInquiries(data || []);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("admissions_inquiries").update({ status }).eq("id", id);
    setInquiries(inquiries.map(a => a.id === id ? { ...a, status } : a));
  };

  const filtered = inquiries.filter(a => !statusFilter || a.status === statusFilter);
  const statusColor: Record<string, string> = { New: "text-indigo-500", Reviewing: "text-amber-600", Accepted: "text-emerald-600", Rejected: "text-red-500" };

  return (
    <div>
      <SectionTitle>Admissions</SectionTitle>
      <div className="flex gap-3 mb-4">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ fontFamily: "Inter,sans-serif" }}>
          <option value="">All Status</option>
          {["New", "Reviewing", "Accepted", "Rejected"].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      {loading ? <p className="text-slate-400 text-sm">Loading…</p> : (
        <table className="portal-table">
          <thead><tr><th>#</th><th>Parent</th><th>Child</th><th>Class</th><th>Phone</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {filtered.map((a, i) => (
              <tr key={a.id}>
                <td>{i + 1}</td>
                <td className="font-medium">{a.parent_name}</td>
                <td>{a.child_name}</td>
                <td>{a.class}</td>
                <td>{a.phone}</td>
                <td>{new Date(a.created_at).toLocaleDateString("en-GB")}</td>
                <td>
                  <select value={a.status || "New"} onChange={e => updateStatus(a.id, e.target.value)}
                    className={`border rounded px-2 py-1 text-xs font-bold focus:outline-none bg-white ${statusColor[a.status] || ""}`}
                    style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                    {["New", "Reviewing", "Accepted", "Rejected"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td>{a.status === "Accepted" && <button onClick={() => toast.success("Offer letter sent (email service needed).")} className="text-[#F97316] text-xs font-medium hover:underline">Send Offer</button>}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} className="text-center py-4 text-slate-400">No inquiries yet.</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
};

// ─── ANNOUNCEMENTS ────────────────────────────────────────────────────────────
const AnnouncementsPanel = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", message: "", audience: "All" });
  const [saving, setSaving] = useState(false);
  const { adminUser } = useAuth();

  useEffect(() => {
    supabase.from("announcements").select("*").order("created_at", { ascending: false }).then(({ data }) => setAnnouncements(data || []));
  }, []);

  const post = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data, error } = await supabase.from("announcements").insert([{ ...form, posted_by: adminUser?.name }]).select().single();
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Announcement posted!");
    setAnnouncements([data, ...announcements]);
    setForm({ title: "", message: "", audience: "All" });
  };

  const del = async (id: string) => {
    await supabase.from("announcements").delete().eq("id", id);
    setAnnouncements(announcements.filter(a => a.id !== id));
    toast.success("Deleted.");
  };

  return (
    <div>
      <SectionTitle>Announcements</SectionTitle>
      <form onSubmit={post} className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 space-y-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>New Announcement</p>
        <Inp label="Title *" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wide" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Message *</label>
          <textarea required rows={3} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-[#F97316]/30" style={{ fontFamily: "Inter,sans-serif" }} />
        </div>
        <Sel label="Audience" value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value })}>
          {["All", "Pre-KG", "LKG", "UKG", "All Parents", "All Staff"].map(a => <option key={a}>{a}</option>)}
        </Sel>
        <button type="submit" disabled={saving} className="bg-[#F97316] text-white font-bold text-xs px-5 py-2.5 rounded-lg disabled:opacity-60">{saving ? "Posting…" : "Post Announcement"}</button>
      </form>
      <div className="divide-y divide-slate-100">
        {announcements.map(a => (
          <div key={a.id} className="py-3 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400 mb-0.5" style={{ fontFamily: "Inter,sans-serif" }}>{new Date(a.created_at).toLocaleDateString("en-GB")} · {a.audience}</p>
              <p className="font-semibold text-slate-800 text-sm" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{a.title}</p>
              <p className="text-slate-500 text-xs mt-0.5" style={{ fontFamily: "Inter,sans-serif" }}>{a.message}</p>
            </div>
            <button onClick={() => del(a.id)} className="text-red-400 text-xs font-medium hover:underline flex-shrink-0">Delete</button>
          </div>
        ))}
        {announcements.length === 0 && <p className="text-slate-400 text-sm py-4">No announcements yet.</p>}
      </div>
    </div>
  );
};

// ─── BUS MANAGEMENT ───────────────────────────────────────────────────────────
const BusPanel = () => {
  const [routes, setRoutes] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ route_no: "", route_name: "", areas: "", pickup_time: "", drop_time: "", driver_name: "", driver_mobile: "" });

  useEffect(() => {
    supabase.from("bus_routes").select("*").order("route_no").then(({ data }) => setRoutes(data || []));
  }, []);

  const addRoute = async () => {
    const { data, error } = await supabase.from("bus_routes").insert([form]).select().single();
    if (error) { toast.error(error.message); return; }
    setRoutes([...routes, data]);
    setShowAdd(false); setForm({ route_no: "", route_name: "", areas: "", pickup_time: "", drop_time: "", driver_name: "", driver_mobile: "" });
    toast.success("Route added!");
  };

  const del = async (id: string) => {
    await supabase.from("bus_routes").delete().eq("id", id);
    setRoutes(routes.filter(r => r.id !== id));
    toast.success("Route deleted.");
  };

  return (
    <div>
      <SectionTitle>Bus Management</SectionTitle>
      <button onClick={() => setShowAdd(v => !v)} className="bg-[#F97316] text-white font-bold text-xs px-4 py-2 rounded-lg mb-4">+ Add Route</button>
      {showAdd && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 grid sm:grid-cols-2 gap-3">
          {[["Route No.", "route_no"], ["Route Name", "route_name"], ["Areas Covered", "areas"], ["Pickup Time", "pickup_time"], ["Drop Time", "drop_time"], ["Driver Name", "driver_name"], ["Driver Mobile", "driver_mobile"]].map(([l, k]) => (
            <Inp key={k} label={l} value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} />
          ))}
          <div className="sm:col-span-2 flex gap-3">
            <button onClick={addRoute} className="bg-[#F97316] text-white font-bold text-xs px-5 py-2 rounded-lg">Save Route</button>
            <button onClick={() => setShowAdd(false)} className="border border-slate-300 text-slate-600 font-bold text-xs px-4 py-2 rounded-lg">Cancel</button>
          </div>
        </div>
      )}
      <table className="portal-table">
        <thead><tr><th>No.</th><th>Name</th><th>Areas</th><th>Pickup</th><th>Drop</th><th>Driver</th><th>Mobile</th><th>Del</th></tr></thead>
        <tbody>
          {routes.map(r => (
            <tr key={r.id}>
              <td className="font-bold text-[#F97316]">{r.route_no}</td>
              <td>{r.route_name}</td><td>{r.areas}</td><td>{r.pickup_time}</td><td>{r.drop_time}</td><td>{r.driver_name}</td><td>{r.driver_mobile}</td>
              <td><button onClick={() => del(r.id)} className="text-red-400 text-xs font-medium hover:underline">Delete</button></td>
            </tr>
          ))}
          {routes.length === 0 && <tr><td colSpan={8} className="text-center py-3 text-slate-400">No routes added yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

// ─── STAFF ────────────────────────────────────────────────────────────────────
const StaffPanel = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", designation: "", subject: "", mobile: "", email: "" });

  useEffect(() => {
    supabase.from("staff").select("*").order("name").then(({ data }) => setStaff(data || []));
  }, []);

  const addStaff = async () => {
    const { data, error } = await supabase.from("staff").insert([form]).select().single();
    if (error) { toast.error(error.message); return; }
    setStaff([...staff, data]);
    setShowForm(false); setForm({ name: "", designation: "", subject: "", mobile: "", email: "" });
    toast.success("Staff member added!");
  };

  const del = async (id: string) => {
    await supabase.from("staff").delete().eq("id", id);
    setStaff(staff.filter(s => s.id !== id));
    toast.success("Removed.");
  };

  return (
    <div>
      <SectionTitle>Staff</SectionTitle>
      <button onClick={() => setShowForm(v => !v)} className="bg-[#F97316] text-white font-bold text-xs px-4 py-2 rounded-lg mb-4">+ Add Staff</button>
      {showForm && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 grid sm:grid-cols-2 gap-3">
          <Inp label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Inp label="Designation" value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} />
          <Inp label="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
          <Inp label="Mobile" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />
          <Inp label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <div className="sm:col-span-2 flex gap-3">
            <button onClick={addStaff} className="bg-[#F97316] text-white font-bold text-xs px-5 py-2 rounded-lg">Save</button>
            <button onClick={() => setShowForm(false)} className="border border-slate-300 text-slate-600 font-bold text-xs px-4 py-2 rounded-lg">Cancel</button>
          </div>
        </div>
      )}
      <table className="portal-table">
        <thead><tr><th>#</th><th>Name</th><th>Designation</th><th>Subject</th><th>Mobile</th><th>Email</th><th>Del</th></tr></thead>
        <tbody>
          {staff.map((s, i) => (
            <tr key={s.id}><td>{i + 1}</td><td className="font-medium">{s.name}</td><td>{s.designation}</td><td>{s.subject}</td><td>{s.mobile}</td><td>{s.email}</td>
              <td><button onClick={() => del(s.id)} className="text-red-400 text-xs font-medium hover:underline">Delete</button></td>
            </tr>
          ))}
          {staff.length === 0 && <tr><td colSpan={7} className="text-center py-3 text-slate-400">No staff added.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

// ─── REPORTS ─────────────────────────────────────────────────────────────────
const ReportsPanel = () => {
  const [active, setActive] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [classFilter, setClassFilter] = useState("");

  const loadReport = async (id: string) => {
    setActive(id); setData([]);
    if (id === "strength") {
      const { data: d } = await supabase.from("students").select("name,class,section,admission_no,status").order("class");
      setData(d || []);
    } else if (id === "fees") {
      const { data: d } = await supabase.from("fees").select("*, students(name,class)").eq("status", "Pending");
      setData(d || []);
    } else if (id === "remarks") {
      const { data: d } = await supabase.from("remarks").select("*, students(name,class)").order("created_at", { ascending: false }).limit(50);
      setData(d || []);
    }
  };

  const reports = [
    { id: "strength", label: "Student Strength Report" },
    { id: "fees", label: "Outstanding Fees Report" },
    { id: "remarks", label: "Remarks Report (last 50)" },
  ];

  return (
    <div>
      <SectionTitle>Reports</SectionTitle>
      <div className="space-y-2 mb-6">
        {reports.map(r => (
          <button key={r.id} onClick={() => loadReport(r.id)} className="w-full flex items-center justify-between text-left px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <span className="font-semibold text-slate-800 text-sm" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{r.label}</span>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${active === r.id ? "rotate-90" : ""}`} />
          </button>
        ))}
      </div>
      {active && data.length > 0 && (
        <div className="overflow-x-auto">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{reports.find(r => r.id === active)?.label}</p>
            <button onClick={() => { const csv = data.map(d => Object.values(d).join(",")).join("\n"); const b = new Blob([csv], { type: "text/csv" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `${active}_report.csv`; a.click(); }} className="border border-slate-300 text-slate-600 font-bold text-xs px-4 py-2 rounded-lg hover:bg-slate-50">Export CSV</button>
          </div>
          <table className="portal-table">
            <thead><tr>{Object.keys(data[0]).filter(k => !k.includes("_id") && k !== "id").map(k => <th key={k}>{k.replace(/_/g, " ")}</th>)}</tr></thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>{Object.entries(row).filter(([k]) => !k.includes("_id") && k !== "id").map(([k, v]) => <td key={k}>{typeof v === "object" ? JSON.stringify(v) : String(v ?? "—")}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
const SettingsPanel = () => {
  const [open, setOpen] = useState<string | null>("school");
  const { adminUser } = useAuth();

  return (
    <div>
      <SectionTitle>Settings</SectionTitle>
      <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
        {[
          {
            id: "school", label: "School Info",
            content: (
              <div className="grid sm:grid-cols-2 gap-3">
                <Inp label="School Name" defaultValue="Sri Anveeksha Public School" />
                <Inp label="Address" defaultValue="Ootla, Jinnaram, Telangana" />
                <Inp label="Phone" defaultValue="+91 98765 43210" />
                <Inp label="Email" defaultValue="info@srianveeksha.edu.in" />
                <div className="sm:col-span-2"><button onClick={() => toast.success("Settings saved!")} className="bg-[#F97316] text-white font-bold text-xs px-5 py-2 rounded-lg">Save</button></div>
              </div>
            )
          },
          {
            id: "year", label: "Academic Year",
            content: (
              <div className="flex gap-4 flex-wrap">
                <Inp label="Start Date" type="date" defaultValue="2026-06-10" />
                <Inp label="End Date" type="date" defaultValue="2027-04-15" />
                <div className="w-full"><button onClick={() => toast.success("Year saved!")} className="bg-[#F97316] text-white font-bold text-xs px-5 py-2 rounded-lg">Save</button></div>
              </div>
            )
          },
        ].map(sec => (
          <div key={sec.id}>
            <button onClick={() => setOpen(open === sec.id ? null : sec.id)} className="flex items-center justify-between w-full px-4 py-3 bg-white text-left hover:bg-slate-50" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              <span className="font-bold text-slate-700 text-xs uppercase tracking-wider">{sec.label}</span>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open === sec.id ? "rotate-90" : ""}`} />
            </button>
            {open === sec.id && <div className="p-4 bg-white border-t border-slate-100">{sec.content}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── FACULTY WELCOME (restricted) ────────────────────────────────────────────
const FacultyWelcome = ({ name }: { name: string }) => (
  <div>
    <SectionTitle>Welcome, {name}</SectionTitle>
    <p className="text-sm text-slate-600 mb-4" style={{ fontFamily: "Inter,sans-serif" }}>You are logged in as Faculty. Use the menu on the left to mark attendance or add remarks for students.</p>
    <div className="border border-slate-200 rounded-xl p-5 bg-white">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Your Access</p>
      <ul className="space-y-2 text-sm text-slate-700" style={{ fontFamily: "Inter,sans-serif" }}>
        <li>✓ Mark daily attendance for any class</li>
        <li>✓ View attendance history for any student</li>
        <li>✓ Add academic and disciplinary remarks</li>
        <li>✗ Student registration, fees, admissions, announcements (admin only)</li>
      </ul>
    </div>
  </div>
);

// ─── MAIN ADMIN DASHBOARD ─────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [active, setActive] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { adminUser, isFaculty, logout } = useAuth();

  // Set default active tab based on role
  useEffect(() => {
    if (!adminUser) { navigate("/login?role=admin"); return; }
    setActive(isFaculty ? "attendance" : "dashboard");
  }, [adminUser, isFaculty, navigate]);

  if (!adminUser) return null;

  const visibleMenu = ADMIN_MENU.filter(m => m.roles.includes(adminUser.role));

  const panels: Record<string, React.ReactNode> = {
    dashboard: <DashboardPanel />,
    students: <StudentsPanel />,
    attendance: <AttendanceAdminPanel />,
    fees: <FeeManagementPanel />,
    marks: <MarksAdminPanel />,
    remarks: <RemarksAdminPanel />,
    admissions: <AdmissionsPanel />,
    announcements: <AnnouncementsPanel />,
    bus: <BusPanel />,
    staff: <StaffPanel />,
    manage_users: <ManageUsersPanel />,
    reports: <ReportsPanel />,
    settings: <SettingsPanel />,
    faculty_home: <FacultyWelcome name={adminUser.name} />,
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const SidebarContent = () => (
    <>
      <div className="px-5 py-5 border-b border-slate-100">
        <p className="text-[10px] font-black tracking-[0.2em] text-[#F97316] uppercase mb-3" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          {isFaculty ? "Faculty Portal" : "Admin Portal"}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-50 border border-[#F97316]/20 flex items-center justify-center text-[#F97316] font-bold text-xs flex-shrink-0">
            {adminUser.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{adminUser.name}</p>
            <p className="text-[10px] text-slate-400 truncate capitalize" style={{ fontFamily: "Inter,sans-serif" }}>{adminUser.role} {adminUser.designation ? `· ${adminUser.designation}` : ""}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {visibleMenu.map(item => (
          <button key={item.id} onClick={() => { setActive(item.id); setMobileMenuOpen(false); }}
            className={`w-full flex items-center text-left px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${active === item.id ? "bg-orange-50 text-[#F97316] shadow-[inset_3px_0_0_0_#F97316]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
            style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            <ChevronRight className={`w-3.5 h-3.5 mr-2.5 transition-transform ${active === item.id ? "rotate-90 text-[#F97316]" : "text-slate-300"}`} />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-100">
        <button onClick={handleLogout} className="w-full text-center px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 hover:text-[#F97316] hover:border-[#F97316]/30 font-bold tracking-wide uppercase transition-all" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Sign Out</button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileMenuOpen(true)} className="p-1.5 -ml-1.5 text-slate-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div>
            <span className="text-xs font-black tracking-widest text-[#F97316] uppercase" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              {isFaculty ? "Faculty" : "Admin"} Portal
            </span>
            <span className="text-[10px] text-slate-400 block" style={{ fontFamily: "Inter,sans-serif" }}>{adminUser.name}</span>
          </div>
        </div>
        <select value={active} onChange={e => setActive(e.target.value)} className="border border-slate-200 bg-slate-50 text-slate-800 rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          {visibleMenu.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
        </select>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && <div className="fixed inset-0 bg-slate-900/40 z-50 md:hidden" onClick={() => setMobileMenuOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 md:hidden ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <span className="text-xs font-black tracking-widest text-[#F97316] uppercase" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Menu</span>
          <button onClick={() => setMobileMenuOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
        </div>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-slate-200 bg-white flex-shrink-0 sticky top-0 h-screen overflow-y-auto z-30">
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="flex-1 pt-20 md:pt-6 md:px-8 px-4 pb-12 overflow-x-auto">
        <div className="max-w-6xl mx-auto w-full">
          {active && panels[active]}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;