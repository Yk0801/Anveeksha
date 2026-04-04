import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
  STUDENTS, PARENTS, FEES, ATTENDANCE, REMARKS, NOTICES,
  STAFF, BUS_ROUTES, ADMISSIONS_INQUIRIES, ANNOUNCEMENTS, Student
} from "@/data/seedData";

const menuItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "students", label: "Students" },
  { id: "attendance", label: "Attendance" },
  { id: "fees", label: "Fee Management" },
  { id: "remarks", label: "Remarks" },
  { id: "admissions", label: "Admissions" },
  { id: "announcements", label: "Announcements" },
  { id: "bus", label: "Bus Management" },
  { id: "staff", label: "Staff" },
  { id: "reports", label: "Reports" },
  { id: "settings", label: "Settings" },
];

// ─── DASHBOARD ─────────────────────────────────────────────────────────────
const DashboardPanel = () => {
  const prekg = STUDENTS.filter(s => s.class === "Pre-KG").length;
  const lkg = STUDENTS.filter(s => s.class === "LKG").length;
  const ukg = STUDENTS.filter(s => s.class === "UKG").length;
  const pending = ADMISSIONS_INQUIRIES.filter(a => a.status === "New" || a.status === "Reviewing").length;
  const feesThisMonth = 19500;

  const boxes = [
    { label: "Total Students", value: STUDENTS.length },
    { label: "Pre-KG", value: prekg },
    { label: "LKG", value: lkg },
    { label: "UKG", value: ukg },
    { label: "Staff", value: STAFF.length },
    { label: "Pending Admissions", value: pending },
    { label: "Fees This Month", value: `₹${feesThisMonth.toLocaleString()}` },
  ];

  const activity = [
    { date: "04 Apr 2025", text: "Attendance marked for all classes" },
    { date: "03 Apr 2025", text: "Remark added for Rohith Goud (UKG-A) by Mr. Suresh" },
    { date: "03 Apr 2025", text: "New admission inquiry — Anika Rao for Pre-KG" },
    { date: "02 Apr 2025", text: "Fee payment of ₹9,000 received — Mohammed Aariz (LKG)" },
    { date: "01 Apr 2025", text: "Announcement posted: Summer Vacation Schedule" },
  ];

  return (
    <div>
      <h2 className="section-title">Dashboard</h2>
      <p className="text-sm text-slate-700 mb-5" style={{ fontFamily: "Inter, sans-serif" }}>
        Total Students: <strong>{STUDENTS.length}</strong> &nbsp;|&nbsp; Pre-KG: <strong>{prekg}</strong> &nbsp;|&nbsp; LKG: <strong>{lkg}</strong> &nbsp;|&nbsp; UKG: <strong>{ukg}</strong> &nbsp;|&nbsp; Staff: <strong>{STAFF.length}</strong>
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {boxes.map(b => (
          <div key={b.label} className="border border-slate-200 rounded-xl p-4 bg-white">
            <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{b.value}</p>
            <p className="text-slate-500 text-xs mt-1" style={{ fontFamily: "Inter, sans-serif" }}>{b.label}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recent Activity</p>
        <div className="divide-y divide-slate-100">
          {activity.map((a, i) => (
            <div key={i} className="py-2.5 flex items-start gap-3">
              <span className="text-xs text-slate-400 flex-shrink-0 w-24" style={{ fontFamily: "Inter, sans-serif" }}>{a.date}</span>
              <span className="text-sm text-slate-700" style={{ fontFamily: "Inter, sans-serif" }}>{a.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── STUDENTS ─────────────────────────────────────────────────────────────────
const StudentsPanel = () => {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [viewStudent, setViewStudent] = useState<any | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ 
    name: "", class: "Pre-KG", section: "A", gender: "Male", dob: "", nationality: "Indian", religion: "Hindu", caste: "OC", mobile: "", email: "", aadhar: "", admissionNo: "", rollNo: "",
    fatherName: "", fatherOcc: "", fatherMobile: "", fatherEmail: "", fatherAadhar: "",
    motherName: "", motherOcc: "", motherMobile: "", motherEmail: "", motherAadhar: "",
    corrAddress: "", permAddress: "", annualIncome: "",
    guardianEnabled: false, guardianName: "", guardianOcc: "", guardianMobile: "", guardianEmail: "", guardianAddress: "", guardianAadhar: ""
  });

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
    if (!error && data) setStudents(data);
    setLoading(false);
  };

  useState(() => { fetchStudents(); });

  const handleAddStudent = async () => {
    try {
      const { data, error } = await supabase.from('students').insert([
        { 
          name: form.name, class: form.class, section: form.section, gender: form.gender, dob: form.dob || null, nationality: form.nationality, religion: form.religion, caste: form.caste, mobile_number: form.mobile, email: form.email, aadhar_number: form.aadhar, admission_no: form.admissionNo, roll_no: form.rollNo,
          father_name: form.fatherName, father_occupation: form.fatherOcc, father_mobile_number: form.fatherMobile, father_email_id: form.fatherEmail, father_aadhar_number: form.fatherAadhar,
          mother_name: form.motherName, mother_occupation: form.motherOcc, mother_mobile_number: form.motherMobile, mother_email_id: form.motherEmail, mother_aadhar_number: form.motherAadhar,
          correspondence_address: form.corrAddress, permanent_address: form.permAddress, annual_income: form.annualIncome,
          guardian_enabled: form.guardianEnabled, guardian_name: form.guardianName, guardian_occupation: form.guardianOcc, guardian_mobile_number: form.guardianMobile, guardian_mail_id: form.guardianEmail, guardian_address: form.guardianAddress, guardian_aadhar_number: form.guardianAadhar,
          status: 'Active', password: 'password123'
        }
      ]);
      if (error) throw error;
      toast.success("Student added successfully!");
      setAddMode(false);
      fetchStudents();
    } catch (err: any) {
      toast.error(err.message || "Failed to add student.");
    }
  };

  const filtered = students.filter(s =>
    (!search || s.name.toLowerCase().includes(search.toLowerCase()) || (s.admission_no && s.admission_no.toLowerCase().includes(search.toLowerCase()))) &&
    (!classFilter || s.class === classFilter)
  );

  if (viewStudent) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setViewStudent(null)} className="text-[#F97316] text-sm font-medium hover:underline">← Back to List</button>
          <span className="text-slate-300">|</span>
          <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{viewStudent.name}</h2>
        </div>
        <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white">
          <div className="p-5">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 block border-b border-slate-100 pb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>BIO-DATA</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
              {[["Admission No.", viewStudent.admission_no], ["Roll No.", viewStudent.roll_no], ["Class", `${viewStudent.class} – ${viewStudent.section}`], ["Gender", viewStudent.gender], ["DOB", viewStudent.dob], ["Mobile", viewStudent.mobile_number], ["Email", viewStudent.email], ["Aadhar", viewStudent.aadhar_number], ["Religion/Caste", `${viewStudent.religion||''} ${viewStudent.caste||''}`]].map(([l, v]) => (
                <div key={l as string}>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">{l}</p>
                  <p className="text-sm font-medium text-slate-800">{v || "—"}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-5">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 block border-b border-slate-100 pb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>PARENT DETAILS</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6">
              {[["Father", viewStudent.father_name], ["Father Occ.", viewStudent.father_occupation], ["Father Mobile", viewStudent.father_mobile_number], ["Father Aadhar", viewStudent.father_aadhar_number], ["Mother", viewStudent.mother_name], ["Mother Occ.", viewStudent.mother_occupation], ["Mother Mobile", viewStudent.mother_mobile_number], ["Mother Aadhar", viewStudent.mother_aadhar_number], ["Annual Income", viewStudent.annual_income]].map(([l, v]) => (
                <div key={l as string}>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">{l}</p>
                  <p className="text-sm font-medium text-slate-800">{v || "—"}</p>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 mt-4 gap-6">
              <div><p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Correspondence Address</p><p className="text-sm font-medium text-slate-800">{viewStudent.correspondence_address || "—"}</p></div>
              <div><p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Permanent Address</p><p className="text-sm font-medium text-slate-800">{viewStudent.permanent_address || "—"}</p></div>
            </div>
          </div>
          {viewStudent.guardian_enabled && (
            <div className="p-5">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 block border-b border-slate-100 pb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>GUARDIAN DETAILS</p>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6">
                {[["Name", viewStudent.guardian_name], ["Occupation", viewStudent.guardian_occupation], ["Mobile", viewStudent.guardian_mobile_number], ["Email", viewStudent.guardian_mail_id], ["Aadhar", viewStudent.guardian_aadhar_number]].map(([l, v]) => (
                  <div key={l as string}>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">{l}</p>
                    <p className="text-sm font-medium text-slate-800">{v || "—"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <h2 className="section-title mb-0">Students</h2>
        <div className="flex-1" />
        <button onClick={() => setAddMode(!addMode)} className="btn-primary text-sm px-4 py-2 rounded-lg">+ Add New Student</button>
        <button className="border border-slate-300 text-slate-600 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-slate-50">Export CSV</button>
      </div>
      <div className="flex gap-3 mb-4 flex-wrap">
        <input type="text" placeholder="Search name or admission no." value={search} onChange={e => setSearch(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-40 focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
          style={{ fontFamily: "Inter, sans-serif" }} />
        <select value={classFilter} onChange={e => setClassFilter(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
          style={{ fontFamily: "Inter, sans-serif" }}>
          <option value="">All Classes</option>
          {["Pre-KG","LKG","UKG"].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      {addMode && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-5 space-y-6">
          <div className="flex justify-between items-center"><p className="font-bold text-[#F97316] text-sm uppercase tracking-wide">Register New Student</p><button onClick={() => setAddMode(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button></div>
          
          <div>
            <p className="text-xs font-bold text-slate-800 mb-2 pb-1 border-b border-slate-200">1. Student Personal Details</p>
            <div className="grid sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[
                {l:"Name", k:"name"}, {l:"Admission No", k:"admissionNo"}, {l:"Roll No", k:"rollNo"}, {l:"Class", k:"class", type:"select", opts:["Pre-KG","LKG","UKG","1st Grade"]}, {l:"Section", k:"section", type:"select", opts:["A","B","C"]}, {l:"Gender", k:"gender", type:"select", opts:["Male","Female"]}, {l:"DOB", k:"dob", type:"date"}, {l:"Nationality", k:"nationality"}, {l:"Religion", k:"religion"}, {l:"Caste", k:"caste"}, {l:"Mobile", k:"mobile"}, {l:"Email", k:"email"}, {l:"Aadhar No.", k:"aadhar"}
              ].map(f => (
                <div key={f.k}>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">{f.l}</label>
                  {f.type === "select" ? (
                    <select value={(form as any)[f.k]} onChange={e=>setForm({...form, [f.k]: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-[#F97316]/30 focus:outline-none bg-white">
                      {f.opts?.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type||"text"} value={(form as any)[f.k]} onChange={e=>setForm({...form, [f.k]: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-[#F97316]/30 focus:outline-none bg-white" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-800 mb-2 pb-1 border-b border-slate-200">2. Parent Details</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-3">
              {[
                {l:"Father Name", k:"fatherName"}, {l:"Occupation", k:"fatherOcc"}, {l:"Mobile", k:"fatherMobile"}, {l:"Email", k:"fatherEmail"}, {l:"Aadhar", k:"fatherAadhar"},
                {l:"Mother Name", k:"motherName"}, {l:"Occupation", k:"motherOcc"}, {l:"Mobile", k:"motherMobile"}, {l:"Email", k:"motherEmail"}, {l:"Aadhar", k:"motherAadhar"},
                {l:"Correspondence Address", k:"corrAddress", cls:"md:col-span-2"}, {l:"Permanent Address", k:"permAddress", cls:"md:col-span-2"}, {l:"Annual Income", k:"annualIncome"}
              ].map(f => (
                <div key={f.k} className={f.cls}>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">{f.l}</label>
                  <input value={(form as any)[f.k]} onChange={e=>setForm({...form, [f.k]: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-[#F97316]/30 focus:outline-none bg-white"/>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-200 cursor-pointer w-fit">
              <input type="checkbox" checked={form.guardianEnabled} onChange={e=>setForm({...form, guardianEnabled: e.target.checked})} className="accent-[#F97316]" />
              <p className="text-xs font-bold text-slate-800">3. Guardian Details <span className="font-normal text-slate-500">(Check if applicable)</span></p>
            </label>
            {form.guardianEnabled && (
              <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  {l:"Guardian Name", k:"guardianName"}, {l:"Occupation", k:"guardianOcc"}, {l:"Mobile", k:"guardianMobile"}, {l:"Email", k:"guardianEmail"}, {l:"Aadhar", k:"guardianAadhar"}, {l:"Guardian Address", k:"guardianAddress", cls:"md:col-span-5"}
                ].map(f => (
                  <div key={f.k} className={f.cls}>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">{f.l}</label>
                    <input value={(form as any)[f.k]} onChange={e=>setForm({...form, [f.k]: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-[#F97316]/30 focus:outline-none bg-white"/>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-slate-200">
            <button onClick={() => setAddMode(false)} className="border border-slate-300 text-slate-600 font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-slate-100 transition-colors">Cancel</button>
            <button onClick={handleAddStudent} className="bg-[#F97316] text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-sm hover:bg-[#ea580c] transition-colors">Save Student Account</button>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="py-10 text-center text-slate-500 text-sm font-medium">Loading database records...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead><tr><th>#</th><th>Name</th><th>Class</th><th>Roll No.</th><th>Admission No.</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={7} className="text-center py-4 text-slate-500">No students found.</td></tr>}
              {filtered.map((s, i) => (
                <tr key={s.id}>
                  <td>{i + 1}</td>
                  <td className="font-medium">{s.name}</td>
                  <td>{s.class} – {s.section}</td>
                  <td>{s.roll_no}</td>
                  <td>{s.admission_no}</td>
                  <td><span className={s.status === "Active" ? "status-present" : "status-absent"}>{s.status}</span></td>
                  <td>
                    <button onClick={() => setViewStudent(s)} className="text-[#F97316] text-xs font-medium hover:underline mr-3">View</button>
                    <button className="text-slate-600 hover:text-slate-900 text-xs font-medium hover:underline">Edit</button>
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

// ─── ATTENDANCE ADMIN ─────────────────────────────────────────────────────────
const AttendanceAdminPanel = () => {
  const [selClass, setSelClass] = useState("Pre-KG");
  const [selDate, setSelDate] = useState("2025-03-15");
  const [marks, setMarks] = useState<Record<string, string>>({});

  const students = STUDENTS.filter(s => s.class === selClass);
  const markAll = (status: string) => {
    const m: Record<string, string> = {};
    students.forEach(s => { m[s.id] = status; });
    setMarks(m);
  };

  return (
    <div>
      <h2 className="section-title">Attendance</h2>
      <div className="flex flex-wrap gap-3 mb-5">
        <input type="date" value={selDate} onChange={e => setSelDate(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
          style={{ fontFamily: "Inter, sans-serif" }} />
        <select value={selClass} onChange={e => setSelClass(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
          style={{ fontFamily: "Inter, sans-serif" }}>
          {["Pre-KG","LKG","UKG"].map(c => <option key={c}>{c}</option>)}
        </select>
        <button onClick={() => markAll("P")} className="text-[#F97316] text-sm font-medium hover:underline">Mark All Present</button>
      </div>
      <table className="portal-table mb-5">
        <thead><tr><th>#</th><th>Name</th><th>Roll No.</th><th>Mark Attendance</th></tr></thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={s.id}>
              <td>{i + 1}</td>
              <td className="font-medium">{s.name}</td>
              <td>{s.rollNo}</td>
              <td>
                <div className="flex gap-3">
                  {["P","A","L"].map(status => (
                    <label key={status} className={`flex items-center gap-1 cursor-pointer text-sm font-bold ${{"P":"text-[#F97316]","A":"text-[#F97316]","L":"text-[#4F46E5]"}[status]}`}>
                      <input type="radio" name={`att-${s.id}`} value={status}
                        checked={marks[s.id] === status}
                        onChange={() => setMarks({ ...marks, [s.id]: status })}
                        className="accent-current" />
                      {status}
                    </label>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => toast.success("Attendance saved for " + selDate)} className="btn-primary text-sm px-5 py-2.5 rounded-lg">Save Attendance</button>
    </div>
  );
};

// ─── FEE MANAGEMENT ──────────────────────────────────────────────────────────
const FeeManagementPanel = () => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"student" | "outstanding">("student");
  const [payForm, setPayForm] = useState({ amount: "", date: "", receipt: "", method: "" });
  const [showPayForm, setShowPayForm] = useState(false);

  const student = selectedId ? STUDENTS.find(s => s.admissionNo === selectedId.toUpperCase() || s.name.toLowerCase().includes(selectedId.toLowerCase())) : null;
  const fees = student ? FEES.filter(f => f.studentId === student.id) : [];
  const outstanding = STUDENTS.map(s => {
    const studentFees = FEES.filter(f => f.studentId === s.id);
    const balance = studentFees.filter(f => f.status === "Pending").reduce((acc, f) => acc + f.amount, 0);
    return { student: s, balance };
  }).filter(x => x.balance > 0).sort((a, b) => b.balance - a.balance);

  return (
    <div>
      <h2 className="section-title">Fee Management</h2>
      <div className="flex gap-2 mb-5">
        <button onClick={() => setActiveTab("student")} className={`px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-lg ${activeTab === "student" ? "bg-[#F97316] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Student Fees</button>
        <button onClick={() => setActiveTab("outstanding")} className={`px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-lg ${activeTab === "outstanding" ? "bg-[#F97316] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Outstanding</button>
      </div>

      {activeTab === "student" && (
        <>
          <div className="flex gap-3 mb-4">
            <input type="text" placeholder="Search student name or admission no." value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
              style={{ fontFamily: "Inter, sans-serif" }} />
            <button onClick={() => setSelectedId(search)} className="btn-primary text-sm px-4 py-2 rounded-lg">Search</button>
          </div>
          {student && (
            <>
              <p className="text-sm font-semibold text-slate-700 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{student.name} — {student.class} – {student.section}</p>
              <table className="portal-table mb-4">
                <thead><tr><th>Term</th><th>Fee Type</th><th>Amount</th><th>Due Date</th><th>Paid On</th><th>Status</th></tr></thead>
                <tbody>
                  {fees.map((f, i) => (
                    <tr key={i}>
                      <td>{f.term}</td><td>{f.type}</td><td>₹{f.amount.toLocaleString()}</td><td>{f.dueDate}</td>
                      <td>{f.paidOn || "—"}</td>
                      <td><span className={f.status === "Paid" ? "status-paid" : "status-pending"}>{f.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={() => setShowPayForm(!showPayForm)} className="btn-primary text-sm px-4 py-2 rounded-lg mb-3">+ Add Payment</button>
              {showPayForm && (
                <div className="border border-slate-200 rounded-xl p-4 mb-4 bg-slate-50 grid sm:grid-cols-2 gap-3">
                  {[{ label: "Amount (₹)", key: "amount" }, { label: "Date", key: "date" }, { label: "Receipt No.", key: "receipt" }, { label: "Payment Method", key: "method" }].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold text-slate-600 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.label}</label>
                      <input value={payForm[f.key as keyof typeof payForm]} onChange={e => setPayForm({ ...payForm, [f.key]: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
                        style={{ fontFamily: "Inter, sans-serif" }} />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <button onClick={() => { setShowPayForm(false); toast.success("Payment recorded!"); setPayForm({ amount: "", date: "", receipt: "", method: "" }); }}
                      className="btn-primary text-sm px-4 py-2 rounded-lg">Save Payment</button>
                  </div>
                </div>
              )}
              <button className="border border-slate-300 text-slate-600 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-slate-50">Print Ledger</button>
            </>
          )}
        </>
      )}

      {activeTab === "outstanding" && (
        <table className="portal-table">
          <thead><tr><th>#</th><th>Student</th><th>Class</th><th>Balance Due</th></tr></thead>
          <tbody>
            {outstanding.map((x, i) => (
              <tr key={x.student.id}>
                <td>{i + 1}</td>
                <td className="font-medium">{x.student.name}</td>
                <td>{x.student.class}</td>
                <td className="status-pending font-bold">₹{x.balance.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// ─── REMARKS ADMIN ─────────────────────────────────────────────────────────────
const RemarksAdminPanel = () => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState({ category: "Academic", subject: "", remark: "", date: "" });
  const [localRemarks, setLocalRemarks] = useState(REMARKS);

  const student = selectedId ? STUDENTS.find(s => s.name.toLowerCase().includes(selectedId.toLowerCase()) || s.admissionNo.toUpperCase() === selectedId.toUpperCase()) : null;
  const studentRemarks = student ? localRemarks.filter(r => r.studentId === student.id) : [];

  const addRemark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    setLocalRemarks([{ studentId: student.id, subject: form.subject, remark: form.remark, givenBy: "Admin", date: form.date || new Date().toLocaleDateString(), category: form.category as "Academic"|"Disciplinary"|"General" }, ...localRemarks]);
    setForm({ category: "Academic", subject: "", remark: "", date: "" });
    toast.success("Remark added!");
  };

  return (
    <div>
      <h2 className="section-title">Remarks</h2>
      <div className="flex gap-3 mb-4">
        <input type="text" placeholder="Search student name or admission no." value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
          style={{ fontFamily: "Inter, sans-serif" }} />
        <button onClick={() => setSelectedId(search)} className="btn-primary text-sm px-4 py-2 rounded-lg">Search</button>
      </div>
      {student && (
        <>
          <p className="text-sm font-semibold text-slate-700 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{student.name} — {student.class}</p>
          <form onSubmit={addRemark} className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
                style={{ fontFamily: "Inter, sans-serif" }}>
                {["Academic","Disciplinary","General"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Subject</label>
              <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
                style={{ fontFamily: "Inter, sans-serif" }} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Remark</label>
              <textarea required value={form.remark} onChange={e => setForm({ ...form, remark: e.target.value })} rows={2}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
                style={{ fontFamily: "Inter, sans-serif" }} />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="btn-primary text-sm px-4 py-2 rounded-lg">Add Remark</button>
            </div>
          </form>
          <table className="portal-table">
            <thead><tr><th>Date</th><th>Category</th><th>Subject</th><th>Remark</th><th>Given By</th><th>Actions</th></tr></thead>
            <tbody>
              {studentRemarks.map((r, i) => (
                <tr key={i}>
                  <td>{r.date}</td>
                  <td><span className={{"Academic":"text-[#F97316]","Disciplinary":"text-[#F97316]","General":"text-[#4F46E5]"}[r.category] + " font-medium"}>{r.category}</span></td>
                  <td>{r.subject}</td>
                  <td>{r.remark}</td>
                  <td>{r.givenBy}</td>
                  <td>
                    <button className="text-[#4F46E5] text-xs font-medium hover:underline mr-2">Edit</button>
                    <button onClick={() => { setLocalRemarks(localRemarks.filter((_, j) => !(j === i))); toast.success("Remark deleted."); }} className="text-[#F97316] text-xs font-medium hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

// ─── ADMISSIONS ADMIN ─────────────────────────────────────────────────────────
const AdmissionsAdminPanel = () => {
  const [inquiries, setInquiries] = useState(ADMISSIONS_INQUIRIES);
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = inquiries.filter(a => !statusFilter || a.status === statusFilter);

  return (
    <div>
      <h2 className="section-title">Admissions</h2>
      <div className="flex gap-3 mb-4">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
          style={{ fontFamily: "Inter, sans-serif" }}>
          <option value="">All Status</option>
          {["New","Reviewing","Accepted","Rejected"].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <table className="portal-table">
        <thead><tr><th>#</th><th>Parent Name</th><th>Child</th><th>Class</th><th>Phone</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {filtered.map((a, i) => (
            <tr key={a.id}>
              <td>{i + 1}</td>
              <td className="font-medium">{a.parentName}</td>
              <td>{a.childName}</td>
              <td>{a.class}</td>
              <td>{a.phone}</td>
              <td>{a.date}</td>
              <td>
                <select value={a.status}
                  onChange={e => setInquiries(inquiries.map(x => x.id === a.id ? { ...x, status: e.target.value } : x))}
                  className={`border rounded px-2 py-1 text-xs font-medium focus:outline-none ${a.status === "Accepted" ? "border-[#F97316] text-[#F97316]" : a.status === "Rejected" ? "border-[#F97316] text-[#F97316]" : "border-slate-300 text-slate-600"}`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {["New","Reviewing","Accepted","Rejected"].map(s => <option key={s}>{s}</option>)}
                </select>
              </td>
              <td>
                {a.status === "Accepted" && (
                  <button onClick={() => toast.success("Offer letter sent (demo)!")} className="text-[#F97316] text-xs font-medium hover:underline">Send Offer</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── ANNOUNCEMENTS ─────────────────────────────────────────────────────────────
const AnnouncementsPanel = () => {
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS);
  const [form, setForm] = useState({ title: "", message: "", audience: "All" });

  const post = (e: React.FormEvent) => {
    e.preventDefault();
    setAnnouncements([{ id: Date.now(), ...form, date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) }, ...announcements]);
    setForm({ title: "", message: "", audience: "All" });
    toast.success("Announcement posted!");
  };

  return (
    <div>
      <h2 className="section-title">Announcements</h2>
      <form onSubmit={post} className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>New Announcement</p>
        <div><label className="block text-xs font-semibold text-slate-600 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Title</label>
          <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30" style={{ fontFamily: "Inter, sans-serif" }} /></div>
        <div><label className="block text-xs font-semibold text-slate-600 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Message</label>
          <textarea required rows={3} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#F97316]/30" style={{ fontFamily: "Inter, sans-serif" }} /></div>
        <div><label className="block text-xs font-semibold text-slate-600 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Audience</label>
          <select value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value })}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30" style={{ fontFamily: "Inter, sans-serif" }}>
            {["All","Pre-KG","LKG","UKG","All Parents","All Staff"].map(a => <option key={a}>{a}</option>)}
          </select></div>
        <button type="submit" className="btn-primary text-sm px-4 py-2 rounded-lg">Post Announcement</button>
      </form>
      <div className="divide-y divide-slate-100">
        {announcements.map(a => (
          <div key={a.id} className="py-3 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400 mb-0.5" style={{ fontFamily: "Inter, sans-serif" }}>{a.date} · {a.audience}</p>
              <p className="font-semibold text-slate-800 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{a.title}</p>
              <p className="text-slate-500 text-xs mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>{a.message}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button className="text-[#4F46E5] text-xs font-medium hover:underline">Edit</button>
              <button onClick={() => setAnnouncements(announcements.filter(x => x.id !== a.id))} className="text-[#F97316] text-xs font-medium hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── BUS MANAGEMENT ───────────────────────────────────────────────────────────
const BusPanel = () => {
  const [routes, setRoutes] = useState(BUS_ROUTES);
  const [showAdd, setShowAdd] = useState(false);
  const [newRoute, setNewRoute] = useState({ routeNo: "", routeName: "", areas: "", pickup: "", drop: "", driver: "", mobile: "" });

  return (
    <div>
      <h2 className="section-title">Bus Management</h2>
      <button onClick={() => setShowAdd(!showAdd)} className="btn-primary text-sm px-4 py-2 rounded-lg mb-4">+ Add Route</button>
      {showAdd && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 grid sm:grid-cols-2 gap-3">
          {[{ l: "Route No.", k: "routeNo" }, { l: "Route Name", k: "routeName" }, { l: "Areas", k: "areas" }, { l: "Pickup Time", k: "pickup" }, { l: "Drop Time", k: "drop" }, { l: "Driver Name", k: "driver" }, { l: "Driver Mobile", k: "mobile" }].map(f => (
            <div key={f.k}>
              <label className="block text-xs font-semibold text-slate-600 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.l}</label>
              <input value={newRoute[f.k as keyof typeof newRoute]} onChange={e => setNewRoute({ ...newRoute, [f.k]: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30" style={{ fontFamily: "Inter, sans-serif" }} />
            </div>
          ))}
          <div className="sm:col-span-2">
            <button onClick={() => { setRoutes([...routes, { id: Date.now(), ...newRoute }]); setShowAdd(false); toast.success("Route added!"); }}
              className="btn-primary text-sm px-4 py-2 rounded-lg">Save Route</button>
          </div>
        </div>
      )}
      <table className="portal-table">
        <thead><tr><th>Route No.</th><th>Name</th><th>Areas</th><th>Pickup</th><th>Drop</th><th>Driver</th><th>Mobile</th><th>Actions</th></tr></thead>
        <tbody>
          {routes.map((r) => (
            <tr key={r.id}>
              <td className="font-bold text-[#F97316]">{r.routeNo}</td>
              <td>{r.routeName}</td>
              <td>{r.areas}</td>
              <td>{r.pickup}</td>
              <td>{r.drop}</td>
              <td>{r.driver}</td>
              <td>{r.mobile}</td>
              <td>
                <button className="text-[#4F46E5] text-xs font-medium hover:underline mr-2">Edit</button>
                <button onClick={() => setRoutes(routes.filter(x => x.id !== r.id))} className="text-[#F97316] text-xs font-medium hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── STAFF ────────────────────────────────────────────────────────────────────
const StaffPanel = () => {
  const [staff, setStaff] = useState(STAFF);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", designation: "", subject: "", mobile: "", email: "" });

  return (
    <div>
      <h2 className="section-title">Staff</h2>
      <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm px-4 py-2 rounded-lg mb-4">+ Add Staff</button>
      {showForm && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 grid sm:grid-cols-2 gap-3">
          {[{ l: "Name", k: "name" }, { l: "Designation", k: "designation" }, { l: "Subject", k: "subject" }, { l: "Mobile", k: "mobile" }, { l: "Email", k: "email" }].map(f => (
            <div key={f.k}>
              <label className="block text-xs font-semibold text-slate-600 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.l}</label>
              <input value={form[f.k as keyof typeof form]} onChange={e => setForm({ ...form, [f.k]: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30" style={{ fontFamily: "Inter, sans-serif" }} />
            </div>
          ))}
          <div className="sm:col-span-2">
            <button onClick={() => { setStaff([...staff, { id: Date.now(), ...form }]); setShowForm(false); toast.success("Staff added!"); }}
              className="btn-primary text-sm px-4 py-2 rounded-lg">Save Staff</button>
          </div>
        </div>
      )}
      <table className="portal-table">
        <thead><tr><th>#</th><th>Name</th><th>Designation</th><th>Subject</th><th>Mobile</th><th>Email</th><th>Actions</th></tr></thead>
        <tbody>
          {staff.map((s, i) => (
            <tr key={s.id}>
              <td>{i + 1}</td>
              <td className="font-medium">{s.name}</td>
              <td>{s.designation}</td>
              <td>{s.subject}</td>
              <td>{s.mobile}</td>
              <td>{s.email}</td>
              <td>
                <button className="text-[#4F46E5] text-xs font-medium hover:underline mr-2">Edit</button>
                <button onClick={() => setStaff(staff.filter(x => x.id !== s.id))} className="text-[#F97316] text-xs font-medium hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── REPORTS ─────────────────────────────────────────────────────────────────
const ReportsPanel = () => {
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const reports = [
    { id: "strength", label: "Student Strength Report", desc: "Filter by class, export PDF/CSV." },
    { id: "attendance", label: "Attendance Report", desc: "Filter by student or class + date range." },
    { id: "fees", label: "Fee Collection Report", desc: "Filter by date range, export PDF/Excel." },
    { id: "remarks", label: "Remarks Report", desc: "Filter by student, export PDF." },
  ];

  return (
    <div>
      <h2 className="section-title">Reports</h2>
      <div className="space-y-3 mb-6">
        {reports.map(r => (
          <button key={r.id} onClick={() => setActiveReport(r.id === activeReport ? null : r.id)}
            className="w-full flex items-center justify-between text-left px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <div>
              <p className="font-semibold text-slate-800 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{r.label}</p>
              <p className="text-slate-500 text-xs mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>{r.desc}</p>
            </div>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${activeReport === r.id ? "rotate-90" : ""}`} />
          </button>
        ))}
      </div>
      {activeReport && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <p className="font-bold text-slate-800 text-sm mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{reports.find(r => r.id === activeReport)?.label}</p>
          <div className="flex gap-3 flex-wrap mb-4">
            <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ fontFamily: "Inter, sans-serif" }}>
              <option>All Classes</option>
              {["Pre-KG","LKG","UKG"].map(c => <option key={c}>{c}</option>)}
            </select>
            <input type="date" className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ fontFamily: "Inter, sans-serif" }} />
          </div>
          <table className="portal-table mb-4">
            <thead><tr><th>#</th><th>Name</th><th>Class</th><th>Value</th></tr></thead>
            <tbody>
              {STUDENTS.slice(0, 3).map((s, i) => (
                <tr key={s.id}><td>{i+1}</td><td>{s.name}</td><td>{s.class}</td><td className="text-[#F97316] font-medium">90%</td></tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => toast.success("Report exported (demo)!")} className="btn-primary text-sm px-4 py-2 rounded-lg">Export PDF</button>
        </div>
      )}
    </div>
  );
};

// ─── SETTINGS ADMIN ──────────────────────────────────────────────────────────
const SettingsPanel = () => {
  const [open, setOpen] = useState<string | null>("school");
  const toggleSection = (s: string) => setOpen(open === s ? null : s);

  return (
    <div>
      <h2 className="section-title">Settings</h2>
      <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
        {[
          {
            id: "school", label: "School Info",
            content: (
              <div className="grid sm:grid-cols-2 gap-3">
                {["School Name","Address","Phone","Email"].map(f => (
                  <div key={f}>
                    <label className="block text-xs font-semibold text-slate-600 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f}</label>
                    <input defaultValue={f === "School Name" ? "Sri Anveeksha Public School" : f === "Address" ? "Ootla, Jinnaram, Telangana" : f === "Phone" ? "+91 98765 43210" : "info@srianveeksha.edu.in"}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30" style={{ fontFamily: "Inter, sans-serif" }} />
                  </div>
                ))}
                <div className="sm:col-span-2"><button onClick={() => toast.success("Settings saved!")} className="btn-primary text-sm px-4 py-2 rounded-lg">Save</button></div>
              </div>
            )
          },
          {
            id: "year", label: "Academic Year",
            content: (
              <div className="space-y-3">
                <div className="flex gap-3 flex-wrap">
                  <div><label className="block text-xs font-semibold text-slate-600 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Start Date</label>
                    <input type="date" defaultValue="2026-06-10" className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ fontFamily: "Inter, sans-serif" }} /></div>
                  <div><label className="block text-xs font-semibold text-slate-600 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>End Date</label>
                    <input type="date" defaultValue="2027-04-15" className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ fontFamily: "Inter, sans-serif" }} /></div>
                </div>
                <button onClick={() => toast.success("Academic year saved!")} className="btn-primary text-sm px-4 py-2 rounded-lg">Save</button>
              </div>
            )
          },
          {
            id: "admins", label: "Admin Accounts",
            content: (
              <div>
                <table className="portal-table mb-3">
                  <thead><tr><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    <tr><td>admin@srianveeksha.edu.in</td><td>Super Admin</td><td className="status-present">Active</td><td><button className="text-[#4F46E5] text-xs font-medium hover:underline">Reset Password</button></td></tr>
                  </tbody>
                </table>
                <button className="btn-primary text-sm px-4 py-2 rounded-lg">+ Add Admin</button>
              </div>
            )
          },
        ].map(section => (
          <div key={section.id}>
            <button onClick={() => toggleSection(section.id)}
              className="flex items-center justify-between w-full px-4 py-3 bg-white text-left hover:bg-slate-50 transition-colors"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span className="font-bold text-slate-700 text-xs uppercase tracking-wider">{section.label}</span>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open === section.id ? "rotate-90" : ""}`} />
            </button>
            {open === section.id && <div className="p-4 bg-white border-t border-slate-100">{section.content}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── MAIN ADMIN DASHBOARD ─────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [active, setActive] = useState("dashboard");
  const navigate = useNavigate();

  const panels: Record<string, React.ReactNode> = {
    dashboard: <DashboardPanel />,
    students: <StudentsPanel />,
    attendance: <AttendanceAdminPanel />,
    fees: <FeeManagementPanel />,
    remarks: <RemarksAdminPanel />,
    admissions: <AdmissionsAdminPanel />,
    announcements: <AnnouncementsPanel />,
    bus: <BusPanel />,
    staff: <StaffPanel />,
    reports: <ReportsPanel />,
    settings: <SettingsPanel />,
  };

  const logout = () => { localStorage.removeItem("saps_role"); navigate("/"); };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row">
      {/* Mobile top menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black tracking-[0.15em] text-[#F97316] uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Admin</span>
          <select value={active} onChange={e => setActive(e.target.value)}
            className="border border-slate-200 bg-slate-50 text-slate-800 rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F97316]/30"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {menuItems.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </div>
        <button onClick={logout} className="text-xs bg-slate-100 px-3 py-1.5 rounded-md text-slate-600 font-medium hover:bg-slate-200" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sign Out</button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white flex-shrink-0 sticky top-0 h-screen overflow-y-auto z-50">
        <div className="px-6 py-6 border-b border-slate-100">
          <p className="text-xs font-black tracking-[0.2em] text-[#F97316] uppercase mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Portal Menu</p>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#F97316] font-bold text-xs tracking-tighter shadow-sm border border-[#F97316]/20">AD</div>
            <p className="text-sm font-bold text-slate-800 truncate" style={{ fontFamily: "Inter, sans-serif" }}>Administrator</p>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)}
              className={`w-full flex items-center text-left px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                active === item.id 
                  ? "bg-orange-50 text-[#F97316] shadow-[inset_3px_0_0_0_#F97316]" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span className={`w-1.5 h-1.5 rounded-full mr-3 ${active === item.id ? "bg-[#F97316]" : "bg-transparent text-slate-300"}`}>
                {active !== item.id && <ChevronRight className="w-4 h-4 -ml-1 text-slate-300" />}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button onClick={logout} className="w-full text-center px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 hover:text-[#F97316] hover:border-[#F97316]/30 hover:shadow-sm font-bold tracking-wide transition-all uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sign Out</button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-h-screen pt-20 md:pt-6 md:px-8 px-4 pb-12 overflow-x-auto relative">
        <div className="max-w-6xl mx-auto w-full">
          {panels[active]}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
