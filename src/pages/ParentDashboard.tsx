import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, DollarSign, Calendar, ChevronRight, X, FileText, Bell, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const ParentDashboard = () => {
  const { parentStudentId, logout } = useAuth();
  const navigate = useNavigate();
  
  const [active, setActive] = useState("profile");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [student, setStudent] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [remarks, setRemarks] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Settings
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");

  const loadData = useCallback(async () => {
    if (!parentStudentId) return;
    setLoading(true);
    
    const [stRes, attRes, feeRes, rmRes, annRes, mkRes] = await Promise.all([
      supabase.from("students").select("*").eq("id", parentStudentId).single(),
      supabase.from("attendance").select("*").eq("student_id", parentStudentId).order("date", { ascending: false }),
      supabase.from("fees").select("*").eq("student_id", parentStudentId).order("due_date", { ascending: false }),
      supabase.from("remarks").select("*").eq("student_id", parentStudentId).order("date", { ascending: false }),
      supabase.from("announcements").select("*").order("date", { ascending: false }),
      supabase.from("marks").select("*").eq("student_id", parentStudentId).order("date", { ascending: false })
    ]);

    if (stRes.data) setStudent(stRes.data);
    if (attRes.data) setAttendance(attRes.data);
    if (feeRes.data) setFees(feeRes.data);
    if (rmRes.data) setRemarks(rmRes.data);
    if (annRes.data) setAnnouncements(annRes.data);
    if (mkRes.data) setMarks(mkRes.data);
    
    setLoading(false);
  }, [parentStudentId]);

  useEffect(() => {
    if (!parentStudentId) navigate("/login");
    else loadData();
  }, [parentStudentId, navigate, loadData]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out safely");
    navigate("/");
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd.length < 8) return toast.error("Password must be at least 8 characters.");
    if (student.password !== oldPwd) return toast.error("Old password is incorrect.");
    
    const { error } = await supabase.from("students").update({ password: newPwd }).eq("id", parentStudentId);
    if (error) return toast.error(error.message);
    
    toast.success("Password updated successfully.");
    setOldPwd(""); setNewPwd("");
    loadData();
  };

  if (loading || !student) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-slate-500 font-medium">Loading Parent Portal...</p></div>;
  }

  const validDays = attendance.filter(a => a.status !== "Holiday");
  const presents = validDays.filter(a => a.status === "P").length;
  const attendancePercentage = validDays.length > 0 ? Math.round((presents / validDays.length) * 100) : 0;
  const totalFees = fees.reduce((acc, f) => acc + Number(f.amount), 0);
  const paidFees = fees.filter(f => f.status === "Paid").reduce((acc, f) => acc + Number(f.amount), 0);

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xs font-black uppercase tracking-[0.15em] text-[#F97316] mb-4 pb-2 border-b border-slate-100" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      {children}
    </h3>
  );

  const panels: Record<string, React.ReactNode> = {
    profile: (
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <SectionTitle>Bio-Data</SectionTitle>
          <div className="grid md:grid-cols-2 gap-y-4 gap-x-6">
            {[["Name", student.name], ["Admission No.", student.admission_no], ["Roll No.", student.roll_no || "—"], 
              ["Class / Section", `${student.class} — ${student.section}`], ["Date of Birth", student.dob], 
              ["Gender", student.gender], ["Nationality", student.nationality || "Indian"], ["Religion", student.religion || "—"],
              ["Caste", student.caste || "—"], ["Student Mobile", student.student_mobile || "—"], 
              ["Student Email", student.student_email || "—"], ["Aadhar", student.aadhar_no || "—"],
              ["Joining Date", student.joining_date || "—"], ["Blood Group", student.blood_group || "—"]
            ].map(([l, v]) => (
              <div key={l as string} className="flex justify-between py-2 border-b border-slate-50 text-sm">
                <span className="text-slate-500 font-medium">{l}</span>
                <span className="text-slate-900 font-semibold text-right">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <SectionTitle>Parent Details</SectionTitle>
          <div className="grid md:grid-cols-2 gap-y-4 gap-x-6">
            {[["Father's Name", student.father_name], ["Father's Occupation", student.father_occupation || "—"], 
              ["Father's Mobile", student.father_mobile || "—"], ["Father's Email", student.father_email || "—"], 
              ["Father's Aadhar", student.father_aadhar || "—"], ["Mother's Name", student.mother_name], 
              ["Mother's Occupation", student.mother_occupation || "—"], ["Mother's Mobile", student.mother_mobile || "—"], 
              ["Mother's Email", student.mother_email || "—"], ["Mother's Aadhar", student.mother_aadhar || "—"],
              ["Correspondence Address", student.correspondence_address || "—"], ["Permanent Address", student.permanent_address || "—"],
              ["Annual Income", student.annual_income || "—"]
            ].map(([l, v]) => (
              <div key={l as string} className="flex justify-between py-2 border-b border-slate-50 text-sm">
                <span className="text-slate-500 font-medium">{l}</span>
                <span className="text-slate-900 font-semibold text-right">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {student.guardian_name && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <SectionTitle>Guardian Details</SectionTitle>
            <div className="grid md:grid-cols-2 gap-y-4 gap-x-6">
              {[["Guardian's Name", student.guardian_name], ["Relationship", student.guardian_relation || "—"], 
                ["Guardian's Mobile", student.guardian_mobile || "—"], ["Guardian's Email", student.guardian_email || "—"], 
                ["Guardian's Aadhar", student.guardian_aadhar || "—"], ["Guardian's Address", student.guardian_address || "—"]
              ].map(([l, v]) => (
                <div key={l as string} className="flex justify-between py-2 border-b border-slate-50 text-sm">
                  <span className="text-slate-500 font-medium">{l}</span>
                  <span className="text-slate-900 font-semibold text-right">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    ),
    attendance: (
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
    ),
    fees: (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <SectionTitle>Fee Details</SectionTitle>
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
            {fees.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-slate-400">No fee records.</td></tr>}
          </tbody>
        </table>
      </div>
    ),
    remarks: (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <SectionTitle>Academic Remarks</SectionTitle>
        <div className="space-y-4">
          {remarks.map((r: any) => (
            <div key={r.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-slate-900 text-sm">{r.subject}</p>
                <div className="text-right">
                  <p className="text-xs text-slate-500">{new Date(r.date).toLocaleDateString("en-GB")}</p>
                  <p className="text-[10px] uppercase font-bold text-[#F97316]">{r.faculty_name}</p>
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">{r.remark}</p>
            </div>
          ))}
          {remarks.length === 0 && <p className="text-slate-400 text-sm text-center py-4">No remarks found.</p>}
        </div>
      </div>
    ),
    marks: (
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
    ),
    notices: (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <SectionTitle>Notices & Circulars</SectionTitle>
        <div className="space-y-4">
          {announcements.map((a: any) => (
            <div key={a.id} className="p-4 border border-indigo-100 rounded-xl bg-indigo-50/30">
              <div className="flex gap-3">
                <Bell className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{a.title}</h4>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide mb-2">{new Date(a.date).toLocaleDateString("en-GB")} · Audience: {a.audience}</p>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{a.content}</p>
                </div>
              </div>
            </div>
          ))}
          {announcements.length === 0 && <p className="text-slate-400 text-sm text-center py-4">No announcements.</p>}
        </div>
      </div>
    ),
    certificates: (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <SectionTitle>Study Certificate Request</SectionTitle>
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Purpose of Request</label>
            <select className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold bg-white focus:outline-none focus:border-[#F97316]">
              <option>Higher Education</option>
              <option>Passport Application</option>
              <option>Visa Processing</option>
              <option>Address Proof</option>
              <option>Other</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full md:w-auto px-6 py-2.5 bg-[#F97316] text-white font-bold text-sm rounded-lg hover:bg-[#ea580c] transition-colors whitespace-nowrap">
              Submit Request
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-black tracking-widest text-slate-400 uppercase mb-2">Previous Requests</p>
          <div className="flex justify-between items-center p-4 border border-slate-100 rounded-xl bg-white shadow-sm">
            <div>
              <p className="font-bold text-slate-900 text-sm">Passport Application</p>
              <p className="text-xs text-slate-400 font-medium">Requested on 12 Mar 2026</p>
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle className="w-3.5 h-3.5" /> Approved
            </span>
          </div>
          {/* Mock pending item */}
          <div className="flex justify-between items-center p-4 border border-slate-100 rounded-xl bg-white shadow-sm">
            <div>
              <p className="font-bold text-slate-900 text-sm">Visa Processing</p>
              <p className="text-xs text-slate-400 font-medium">Requested on 04 Apr 2026</p>
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-orange-100 text-orange-700">
              <Clock className="w-3.5 h-3.5" /> Pending
            </span>
          </div>
        </div>
      </div>
    ),
    settings: (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-lg">
        <SectionTitle>Profile Settings</SectionTitle>
        <form onSubmit={changePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Current Password</label>
            <input type="password" required value={oldPwd} onChange={e => setOldPwd(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white text-sm" placeholder="Enter current password" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">New Password</label>
            <input type="password" required value={newPwd} onChange={e => setNewPwd(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white text-sm" placeholder="Min 8 characters" />
          </div>
          <button type="submit" className="w-full px-4 py-3 bg-[#F97316] text-white font-bold text-sm rounded-lg hover:bg-[#ea580c] transition-colors mt-2">
            Change Password
          </button>
        </form>
      </div>
    )
  };

  const navItems = [
    { id: "profile", label: "Student Profile" },
    { id: "attendance", label: "Attendance" },
    { id: "marks", label: "Marks & Grades" },
    { id: "fees", label: "Fee Details" },
    { id: "remarks", label: "Academic Remarks" },
    { id: "notices", label: "Notices & Circulars" },
    { id: "certificates", label: "Study Certificate Request" },
    { id: "settings", label: "Profile Settings" }
  ];

  const SidebarContent = () => (
    <>
      <div className="px-5 py-5 border-b border-slate-100 text-center">
        <div className="w-12 h-12 mx-auto rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-bold mb-3">
          {student.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
        </div>
        <p className="text-sm font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{student.name}</p>
        <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold mt-1">Class {student.class}-{student.section}</p>
      </div>
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(item => (
          <button key={item.id} onClick={() => { setActive(item.id); setMobileMenuOpen(false); }}
            className={`w-full flex items-center text-left px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${active === item.id ? "bg-orange-50 text-[#F97316] shadow-[inset_3px_0_0_0_#F97316]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
            style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            <ChevronRight className={`w-3.5 h-3.5 mr-2.5 transition-transform ${active === item.id ? "rotate-90 text-[#F97316]" : "text-slate-300"}`} />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-100">
        <button onClick={handleLogout} className="w-full flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 hover:text-[#F97316] hover:border-[#F97316]/30 font-bold tracking-wide uppercase transition-all">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row">
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileMenuOpen(true)} className="p-1.5 -ml-1.5 text-slate-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div>
            <span className="text-xs font-black tracking-widest text-[#F97316] uppercase" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Parent Portal
            </span>
            <span className="text-[10px] text-slate-400 block font-medium uppercase">{student.name}</span>
          </div>
        </div>
      </div>

      {mobileMenuOpen && <div className="fixed inset-0 bg-slate-900/40 z-50 md:hidden" onClick={() => setMobileMenuOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 md:hidden ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <span className="text-xs font-black tracking-widest text-[#F97316] uppercase" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Portal Menu</span>
          <button onClick={() => setMobileMenuOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
        </div>
        <SidebarContent />
      </aside>

      <aside className="hidden md:flex flex-col w-60 border-r border-slate-200 bg-white flex-shrink-0 sticky top-0 h-screen overflow-y-auto z-30">
        <SidebarContent />
      </aside>

      <main className="flex-1 pt-20 md:pt-8 px-4 md:px-10 pb-12 overflow-x-auto min-h-screen">
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#F97316] text-white flex items-center justify-center font-black text-xl shadow-lg border border-orange-600/20">
              {student.name[0]}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{student.name}</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Class {student.class}-{student.section} &nbsp;<span className="text-[#F97316]">✨</span>&nbsp; Roll: {student.roll_no || student.admission_no}</p>
            </div>
          </div>
          
          <div className="mb-6 flex gap-4 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-200">
             {/* Mobile horizontal scroll for panels fallback if needed, but we use sidebar! */}
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {panels[active]}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;