import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { STUDENTS, PARENTS, FEES, ATTENDANCE, REMARKS, NOTICES } from "@/data/seedData";
import { ChevronRight, ChevronDown, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const menuItems = [
  { id: "profile", label: "Student Profile" },
  { id: "attendance", label: "Attendance" },
  { id: "fees", label: "Fee Details" },
  { id: "remarks", label: "Academic Remarks" },
  { id: "notices", label: "Notices & Circulars" },
  { id: "receipts", label: "Receipts" },
  { id: "certificate", label: "Study Certificate Request" },
  { id: "settings", label: "Profile Settings" },
];

export let cachedStudent: any = null;
const useStudent = () => {
  const [student, setStudent] = useState<any>(STUDENTS[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sid = localStorage.getItem("saps_student_id");
    if (!sid) { setStudent(STUDENTS[0]); setLoading(false); return; }
    
    // Use cache only if the cached student matches the currently active ID
    if (cachedStudent && (cachedStudent.admissionNo === sid || cachedStudent.id === sid)) {
      setStudent(cachedStudent);
      setLoading(false);
      return;
    }

    setLoading(true);
    supabase.from('students').select('*').eq('admission_no', sid).single().then(({ data }) => {
      // Changed eq('id', sid) to eq('admission_no', sid) because sid from localStorage is "ADM001" not UUID!!
      // Wait, let's also allow UUID just in case. But localStorage "saps_student_id" stores Parent login ID (ADM001...).
      if (data) {
        const mapped = {
          ...STUDENTS[0], id: data.id, name: data.name, rollNo: data.roll_no, admissionNo: data.admission_no,
          class: data.class, section: data.section, gender: data.gender, dob: data.dob, status: data.status,
          aadhar: data.aadhar_number, joiningDate: data.joining_date,
          nationality: data.nationality, religion: data.religion, caste: data.caste, mobile: data.mobile_number, email: data.email,

          fatherName: data.father_name, fatherOcc: data.father_occupation, fatherMobile: data.father_mobile_number, fatherEmail: data.father_email_id, fatherAadhar: data.father_aadhar_number,
          motherName: data.mother_name, motherOcc: data.mother_occupation, motherMobile: data.mother_mobile_number, motherEmail: data.mother_email_id, motherAadhar: data.mother_aadhar_number,
          corrAddress: data.correspondence_address, permAddress: data.permanent_address, annualIncome: data.annual_income,
          guardianEnabled: data.guardian_enabled, guardianName: data.guardian_name, guardianOcc: data.guardian_occupation, guardianMobile: data.guardian_mobile_number, guardianEmail: data.guardian_mail_id, guardianAddress: data.guardian_address, guardianAadhar: data.guardian_aadhar_number
        };
        cachedStudent = mapped;
        setStudent(mapped);
      } else {
        setStudent(STUDENTS[0]);
      }
      setLoading(false);
    });
  }, []);

  return { student, loading };
};

// ─── Accordion component ─────────────────────────────────────────────────────
const Accordion = ({ label, children, defaultOpen }: { label: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className="border border-slate-200 rounded-none overflow-hidden mb-0">
      <button onClick={() => setOpen(!open)}
        className={`flex items-center justify-between w-full px-5 py-4 text-left border-b border-slate-200 transition-colors ${open ? 'bg-orange-50/50' : 'bg-slate-50 hover:bg-slate-100'}`}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <span className={`font-bold text-xs uppercase tracking-wider ${open ? 'text-[#F97316]' : 'text-slate-700'}`}>{label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-180 text-[#F97316]" : "text-slate-400"}`} />
      </button>
      <div className={`transition-all duration-300 overflow-hidden ${open ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 bg-white border-b border-slate-100">{children}</div>
      </div>
    </div>
  );
};

// ─── Two-column label-value table ─────────────────────────────────────────────
const InfoTable = ({ rows }: { rows: [string, string | undefined][] }) => (
  <table className="w-full text-sm border-collapse">
    <tbody>
      {rows.map(([label, value]) => (
        <tr key={label} className="border-b border-slate-100 last:border-0">
          <td className="py-2 pr-4 text-slate-500 w-1/3 font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{label}</td>
          <td className="py-2 text-slate-800" style={{ fontFamily: "Inter, sans-serif" }}>{value || "—"}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

// ─── STUDENT PROFILE ──────────────────────────────────────────────────────────
const StudentProfilePanel = () => {
  const { student, loading } = useStudent();
  if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Loading Parent Portal...</div>;
  const parent = PARENTS.find(p => p.studentId === student.id);

  return (
    <div>
      {/* Profile Header without Banner */}
      <div className="flex items-center gap-5 mb-8 mt-2">
        <div className="w-20 md:w-24 aspect-square rounded-2xl bg-white p-1.5 shadow-sm border border-slate-100 flex-shrink-0">
          <div className="w-full h-full bg-orange-50 rounded-xl flex items-center justify-center text-[#F97316] font-bold text-2xl border border-[#F97316]/20"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {student.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{student.name}</h2>
          <p className="text-slate-500 font-medium mt-1">Class {student.class}-{student.section} ✨ Roll: {student.rollNo}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
        <Accordion label="Bio-Data" defaultOpen>
          <InfoTable rows={[
            ["Name", student.name], ["Admission No.", student.admissionNo], ["Roll No.", student.rollNo], ["Class / Section", `${student.class} – ${student.section}`],
            ["Date of Birth", student.dob], ["Gender", student.gender], ["Nationality", student.nationality], ["Religion", student.religion], ["Caste", student.caste],
            ["Student Mobile", student.mobile], ["Student Email", student.email], ["Aadhar", student.aadhar],
            ["Joining Date", student.joiningDate], ["Status", student.status]
          ]} />
        </Accordion>
        <Accordion label="Parent Details">
          <InfoTable rows={[
            ["Father's Name", student.fatherName], ["Father's Occupation", student.fatherOcc], ["Father's Mobile", student.fatherMobile], ["Father's Email", student.fatherEmail], ["Father's Aadhar", student.fatherAadhar],
            ["Mother's Name", student.motherName], ["Mother's Occupation", student.motherOcc], ["Mother's Mobile", student.motherMobile], ["Mother's Email", student.motherEmail], ["Mother's Aadhar", student.motherAadhar],
            ["Correspondence Address", student.corrAddress], ["Permanent Address", student.permAddress], ["Annual Income", student.annualIncome]
          ]} />
        </Accordion>
        <Accordion label="Guardian Details">
          {student.guardianEnabled ? (
            <InfoTable rows={[
              ["Guardian's Name", student.guardianName], ["Occupation", student.guardianOcc], ["Mobile", student.guardianMobile], ["Email", student.guardianEmail], ["Aadhar", student.guardianAadhar], ["Address", student.guardianAddress]
            ]} />
          ) : (
            <p className="text-slate-400 text-sm italic" style={{ fontFamily: "Inter, sans-serif" }}>No separate guardian on file. Parent details apply.</p>
          )}
        </Accordion>
      </div>
      <div className="flex gap-3 mt-6">
        <button className="bg-[#F97316] text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-[#ea580c] transition-colors shadow-sm">Print Profile</button>
        <button className="border border-slate-300 text-slate-600 font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">Export PDF</button>
      </div>
    </div>
  );
};

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const STATUS_STYLE: Record<string, string> = { P: "status-present", A: "status-absent", L: "status-leave", H: "status-holiday" };

const AttendancePanel = () => {
  const { student, loading } = useStudent();
  const [selMonth, setSelMonth] = useState(1);
  const [selYear, setSelYear] = useState("2026");
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    if (!student || !student.id) return;
    supabase.from('attendance').select('*').eq('student_id', student.id).then(({ data }) => {
      setRecords(data || []);
    });
  }, [student]);

  if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Loading Parent Portal...</div>;

  const monthRecords = records.filter(a => {
    const [y, m] = a.date.split("-").map(Number);
    return m === selMonth + 1 && String(y) === selYear;
  });
  const workingDays = records.filter(a => a.status !== "H");
  const present = workingDays.filter(a => a.status === "P").length;
  const absent = workingDays.filter(a => a.status === "A").length;
  const pct = workingDays.length ? Math.round((present / workingDays.length) * 100) : 0;

  const daysInMonth = new Date(Number(selYear), selMonth + 1, 0).getDate();
  const firstDay = new Date(`${selYear}-${String(selMonth + 1).padStart(2, "0")}-01`).getDay();

  return (
    <div>
      <h2 className="section-title">Attendance</h2>
      {/* Summary */}
      <p className="text-sm text-slate-700 mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
        Total Working Days: <strong>{workingDays.length}</strong> &nbsp;|&nbsp; Present: <strong className="text-[#F97316]">{present}</strong> &nbsp;|&nbsp; Absent: <strong className="text-[#F97316]">{absent}</strong> &nbsp;|&nbsp; Attendance: <strong>{pct}%</strong>
      </p>
      {/* Progress bar */}
      <div className="mb-6">
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#F97316] rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-slate-400 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>{pct}% attendance this year</p>
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <select value={selMonth} onChange={e => setSelMonth(Number(e.target.value))}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
          style={{ fontFamily: "Inter, sans-serif" }}>
          {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
        </select>
        <select value={selYear} onChange={e => setSelYear(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
          style={{ fontFamily: "Inter, sans-serif" }}>
          {["2024", "2025"].map(y => <option key={y}>{y}</option>)}
        </select>
      </div>

      {/* Calendar grid */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 bg-slate-100">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <div key={d} className="py-2 text-center text-xs font-bold text-slate-500" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="py-3 border-b border-r border-slate-100" />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const d = i + 1;
            const dateStr = `${selYear}-${String(selMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            const rec = monthRecords.find(r => r.date === dateStr);
            return (
              <div key={d} className="py-2 border-b border-r border-slate-100 text-center">
                <span className="text-xs text-slate-400 block">{d}</span>
                {rec && <span className={`text-xs font-bold ${STATUS_STYLE[rec.status]}`}>{rec.status}</span>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex gap-4 mt-3 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
        <span><strong className="status-present">P</strong> = Present</span>
        <span><strong className="status-absent">A</strong> = Absent</span>
        <span><strong className="status-leave">L</strong> = Leave</span>
        <span><strong className="status-holiday">H</strong> = Holiday</span>
      </div>
    </div>
  );
};

// ─── FEE DETAILS ─────────────────────────────────────────────────────────────
const FeeDetailsPanel = () => {
  const { student, loading } = useStudent();
  const [fees, setFees] = useState<any[]>([]);
  const [feesLoading, setFeesLoading] = useState(true);

  useEffect(() => {
    if (!student || !student.id) return;
    supabase.from('fees').select('*').eq('student_id', student.id).then(({ data }) => {
      setFees(data || []);
      setFeesLoading(false);
    });
  }, [student]);

  if (loading || feesLoading) return <div className="p-10 text-center text-slate-500 font-medium">Loading Fee Details...</div>;

  const total = fees.reduce((s, f) => s + Number(f.amount), 0);
  const paid = fees.filter(f => f.status === "Paid").reduce((s, f) => s + Number(f.amount), 0);
  const pending = fees.filter(f => f.status !== "Paid").reduce((s, f) => s + Number(f.amount), 0);

  return (
    <div>
      <h2 className="section-title">Fee Details</h2>
      <p className="text-sm text-slate-700 mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
        Total Fee: <strong>₹{total.toLocaleString()}</strong> &nbsp;|&nbsp; Paid: <strong className="text-[#F97316]">₹{paid.toLocaleString()}</strong> &nbsp;|&nbsp; Balance Due: <strong className="text-[#F97316]">₹{(total - paid).toLocaleString()}</strong>
      </p>
      <div className="overflow-x-auto">
        <table className="portal-table">
          <thead>
            <tr><th>Term</th><th>Fee Type</th><th>Amount</th><th>Due Date</th><th>Paid On</th><th>Status</th><th>Receipt</th></tr>
          </thead>
          <tbody>
            {fees.map((f, i) => (
              <tr key={i}>
                <td>{f.term}</td>
                <td>{f.type}</td>
                <td>₹{f.amount.toLocaleString()}</td>
                <td>{f.dueDate}</td>
                <td>{f.paidOn || "—"}</td>
                <td><span className={f.status === "Paid" ? "status-paid" : "status-pending"}>{f.status}</span></td>
                <td>{f.receiptNo ? <button className="text-[#F97316] text-xs font-medium hover:underline">Download</button> : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── ACADEMIC REMARKS ─────────────────────────────────────────────────────────
const AcademicRemarksPanel = () => {
  const { student, loading } = useStudent();
  if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Loading Parent Portal...</div>;
  const allRemarks = REMARKS.filter(r => r.studentId === student.id);
  const academic = allRemarks.filter(r => r.category !== "Disciplinary");
  const disciplinary = allRemarks.filter(r => r.category === "Disciplinary");
  return (
    <div>
      <h2 className="section-title">Academic Remarks</h2>
      <table className="portal-table mb-6">
        <thead><tr><th>Subject</th><th>Remark</th><th>Given By</th><th>Date</th><th>Category</th></tr></thead>
        <tbody>
          {academic.map((r, i) => (
            <tr key={i}>
              <td>{r.subject}</td>
              <td>{r.remark}</td>
              <td>{r.givenBy}</td>
              <td>{r.date}</td>
              <td><span className={r.category === "Academic" ? "text-[#F97316] font-medium" : "text-[#4F46E5] font-medium"}>{r.category}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      {disciplinary.length > 0 && (
        <>
          <div className="border-t border-slate-300 pt-4 mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#F97316]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Disciplinary Remarks</p>
          </div>
          <table className="portal-table">
            <thead><tr><th>Subject</th><th>Remark</th><th>Given By</th><th>Date</th></tr></thead>
            <tbody>
              {disciplinary.map((r, i) => (
                <tr key={i}>
                  <td>{r.subject}</td>
                  <td className="text-[#F97316]">{r.remark}</td>
                  <td>{r.givenBy}</td>
                  <td>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

// ─── NOTICES ─────────────────────────────────────────────────────────────────
const NoticesPanel = () => {
  const [notices, setNotices] = useState(NOTICES);
  const markAllRead = () => setNotices(n => n.map(x => ({ ...x, read: true })));
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title mb-0">Notices & Circulars</h2>
        <button onClick={markAllRead} className="text-[#F97316] text-xs font-medium hover:underline" style={{ fontFamily: "Inter, sans-serif" }}>Mark all read</button>
      </div>
      <div className="divide-y divide-slate-100">
        {notices.map(n => (
          <div key={n.id} className="py-3 flex items-start gap-3">
            {!n.read && <div className="w-2 h-2 rounded-full bg-[#F97316] flex-shrink-0 mt-1.5" />}
            {n.read && <div className="w-2 h-2 flex-shrink-0 mt-1.5" />}
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs text-slate-400" style={{ fontFamily: "Inter, sans-serif" }}>{n.date}</span>
              </div>
              <p className={`text-sm ${!n.read ? "font-semibold text-slate-900" : "text-slate-700"}`} style={{ fontFamily: "Inter, sans-serif" }}>{n.title}</p>
              <p className="text-xs text-slate-500 mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>{n.description}</p>
              <button className="text-[#F97316] text-xs font-medium mt-1 hover:underline">View →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── RECEIPTS ─────────────────────────────────────────────────────────────────
import { RECEIPTS } from "@/data/seedData";
const ReceiptsPanel = () => {
  const { student, loading } = useStudent();
  if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Loading Parent Portal...</div>;
  const receipts = RECEIPTS.filter(r => r.studentId === student.id);
  return (
    <div>
      <h2 className="section-title">Receipts</h2>
      <table className="portal-table">
        <thead><tr><th>Receipt No.</th><th>Date</th><th>Amount</th><th>Payment Method</th><th>Download</th></tr></thead>
        <tbody>
          {receipts.map((r, i) => (
            <tr key={i}>
              <td className="font-mono text-xs">{r.receiptNo}</td>
              <td>{r.date}</td>
              <td>₹{r.amount.toLocaleString()}</td>
              <td>{r.method}</td>
              <td><button className="text-[#F97316] text-xs font-medium hover:underline">Download PDF</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── STUDY CERTIFICATE ────────────────────────────────────────────────────────
const CertificatePanel = () => {
  const [form, setForm] = useState({ reason: "", note: "" });
  const [requests, setRequests] = useState([
    { date: "Feb 10, 2025", reason: "Bank purpose", status: "Approved" },
    { date: "Mar 22, 2025", reason: "Visa application", status: "Pending" },
  ]);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequests([{ date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), reason: form.reason, status: "Pending" }, ...requests]);
    setForm({ reason: "", note: "" });
    toast.success("Certificate request submitted!");
  };
  return (
    <div>
      <h2 className="section-title">Study Certificate Request</h2>
      <form onSubmit={submit} className="space-y-4 mb-8 max-w-md">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Reason for Request</label>
          <select required value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
            style={{ fontFamily: "Inter, sans-serif" }}>
            <option value="">Select reason</option>
            {["Bank purpose", "Visa application", "Scholarship application", "Transfer", "Other"].map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Additional Note (optional)</label>
          <textarea rows={3} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
            style={{ fontFamily: "Inter, sans-serif" }} placeholder="Any specific instructions..." />
        </div>
        <button type="submit" className="btn-primary px-5 py-2.5 rounded-lg text-sm">Submit Request</button>
      </form>
      <div className="border-t border-slate-200 pt-5">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Past Requests</p>
        <table className="portal-table">
          <thead><tr><th>Request Date</th><th>Reason</th><th>Status</th></tr></thead>
          <tbody>
            {requests.map((r, i) => (
              <tr key={i}>
                <td>{r.date}</td>
                <td>{r.reason}</td>
                <td><span className={r.status === "Approved" ? "status-paid" : r.status === "Rejected" ? "status-absent" : "status-pending"}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
const SettingsPanel = () => {
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [email, setEmail] = useState("");

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.next !== pwd.confirm) { toast.error("Passwords do not match."); return; }
    if (pwd.next.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    toast.success("Password updated successfully!");
    setPwd({ current: "", next: "", confirm: "" });
  };

  return (
    <div>
      <h2 className="section-title">Profile Settings</h2>
      <div className="max-w-md space-y-8">
        <div>
          <p className="text-sm font-bold text-slate-700 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Change Password</p>
          <form onSubmit={savePassword} className="space-y-3">
            {[
              { label: "Current Password", key: "current" },
              { label: "New Password", key: "next" },
              { label: "Confirm New Password", key: "confirm" },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-semibold text-slate-700 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.label}</label>
                <input type="password" required value={pwd[f.key as keyof typeof pwd]} onChange={e => setPwd({ ...pwd, [f.key]: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
                  style={{ fontFamily: "Inter, sans-serif" }} />
              </div>
            ))}
            <button type="submit" className="btn-primary px-5 py-2.5 rounded-lg text-sm">Save Password</button>
          </form>
        </div>
        <div className="border-t border-slate-200 pt-6">
          <p className="text-sm font-bold text-slate-700 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Update Email</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>New Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
                style={{ fontFamily: "Inter, sans-serif" }} placeholder="new@email.com" />
            </div>
            <button onClick={() => { if (email) { toast.success("OTP sent to " + email); setEmail(""); } }} className="btn-outline px-5 py-2.5 rounded-lg text-sm">Send OTP</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN PARENT DASHBOARD ────────────────────────────────────────────────────
const ParentDashboard = () => {
  const [active, setActive] = useState("profile");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { student, loading } = useStudent();
  if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Loading Parent Portal...</div>;

  const panels: Record<string, React.ReactNode> = {
    profile: <StudentProfilePanel />,
    attendance: <AttendancePanel />,
    fees: <FeeDetailsPanel />,
    remarks: <AcademicRemarksPanel />,
    notices: <NoticesPanel />,
    receipts: <ReceiptsPanel />,
    certificate: <CertificatePanel />,
    settings: <SettingsPanel />,
  };

  const logout = () => { 
    localStorage.removeItem("saps_role"); 
    localStorage.removeItem("saps_student_id"); 
    cachedStudent = null;
    navigate("/"); 
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row">
      {/* Mobile Header Toolbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileMenuOpen(true)} className="p-1.5 -ml-1.5 text-slate-600 hover:text-[#F97316]">
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <span className="text-xs font-black tracking-widest text-[#F97316] uppercase block" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Dashboard</span>
            <span className="text-[10px] text-slate-500 font-bold max-w-[120px] truncate block" style={{ fontFamily: "Inter, sans-serif" }}>{student.name}</span>
          </div>
        </div>
        <button onClick={logout} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md text-slate-600 font-medium transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sign Out</button>
      </div>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 md:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar (Desktop + Mobile Slide-out) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 py-6 border-b border-slate-100 md:block hidden">
          <p className="text-xs font-black tracking-[0.2em] text-[#F97316] uppercase mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Portal Menu</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#F97316] font-bold text-xs tracking-tighter">SA</div>
            <p className="text-sm font-bold text-slate-800 truncate" style={{ fontFamily: "Inter, sans-serif" }}>{student.name}</p>
          </div>
        </div>

        {/* Mobile Sidebar Header */}
        <div className="px-6 py-6 border-b border-slate-100 md:hidden flex items-center justify-between">
          <p className="text-xs font-black tracking-[0.2em] text-[#F97316] uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Menu</p>
          <button onClick={() => setMobileMenuOpen(false)} className="p-1 -mr-2 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => { setActive(item.id); setMobileMenuOpen(false); }}
              className={`w-full flex items-center text-left px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${active === item.id
                ? "bg-orange-50 text-[#F97316] shadow-[inset_3px_0_0_0_#F97316]"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-3 ${active === item.id ? "bg-[#F97316]" : "bg-transparent text-slate-300"}`}>
                {active !== item.id && <ChevronRight className="w-4 h-4 -ml-1 text-slate-300" />}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 hidden md:block">
          <button onClick={logout} className="w-full text-center px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 hover:text-[#F97316] hover:border-[#F97316]/30 hover:shadow-sm font-bold tracking-wide transition-all uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Log Out securely</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[100vw] md:max-w-none pt-20 md:pt-6 md:px-8 px-4 pb-12 overflow-x-auto min-h-screen relative">
        <div className="max-w-5xl mx-auto w-full">
          {panels[active]}
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;
