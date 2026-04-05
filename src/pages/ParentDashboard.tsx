import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, DollarSign, Calendar } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const ParentDashboard = () => {
  const { parentStudentId, logout } = useAuth();
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!parentStudentId) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      const { data: st } = await supabase.from("students").select("*").eq("id", parentStudentId).single();
      if (st) setStudent(st);

      const { data: att } = await supabase.from("attendance").select("*").eq("student_id", parentStudentId).order("date", { ascending: false });
      if (att) setAttendance(att);

      const { data: fe } = await supabase.from("fees").select("*").eq("student_id", parentStudentId).order("due_date", { ascending: false });
      if (fe) setFees(fe);

      setLoading(false);
    };

    loadData();
  }, [parentStudentId, navigate]);

  const doLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-slate-500 font-medium">Loading Parent Portal...</p></div>;
  }

  if (!student) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-red-500 font-medium">Student not found.</p></div>;
  }

  const presents = attendance.filter(a => a.status === "P").length;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _absents = attendance.filter(a => a.status === "A").length;
  const totalFees = fees.reduce((acc, f) => acc + Number(f.amount), 0);
  const paidFees = fees.filter(f => f.status === "Paid").reduce((acc, f) => acc + Number(f.amount), 0);

  const SectionTitle = ({ title, icon: Icon }: any) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
      <Icon className="w-5 h-5 text-[#F97316]" />
      <h2 className="text-sm font-black uppercase tracking-widest text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{title}</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F97316] text-white flex items-center justify-center font-black text-xl" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            A
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Sri Anveeksha
            </h1>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Parent Portal</p>
          </div>
        </div>
        <button onClick={doLogout} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-xs font-bold uppercase tracking-wider">
          <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
        </button>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Header summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#F97316] mb-1">Welcome back,</p>
            <h2 className="text-3xl font-black text-slate-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{student.name}</h2>
            <p className="text-sm text-slate-600 font-medium">Class: <strong className="text-slate-900">{student.class} — {student.section}</strong> &nbsp;|&nbsp; Admission No: <strong>{student.admission_no}</strong></p>
          </div>
          <div className="flex gap-4">
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 min-w-32 text-center">
              <p className="text-xs uppercase font-bold text-emerald-600 mb-1">Attendance</p>
              <p className="text-2xl font-black text-slate-900">{attendance.length > 0 ? Math.round((presents / attendance.length) * 100) : 0}%</p>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 min-w-32 text-center">
              <p className="text-xs uppercase font-bold text-orange-600 mb-1">Fees Due</p>
              <p className="text-2xl font-black text-slate-900">₹{(totalFees - paidFees).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Bio Data Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <SectionTitle title="Bio Data" icon={User} />
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              {[
                ["Student Name", student.name],
                ["DOB", student.dob],
                ["Gender", student.gender],
                ["Blood Group", student.blood_group || "—"],
                ["Father's Name", student.father_name],
                ["Mother's Name", student.mother_name],
                ["Mobile", student.mobile_number],
                ["Email", student.email || "—"],
              ].map(([l, v]) => (
                <div key={l as string}>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide mb-0.5">{l}</p>
                  <p className="text-sm font-semibold text-slate-800">{v}</p>
                </div>
              ))}
              <div className="col-span-2">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide mb-0.5">Address</p>
                <p className="text-sm font-semibold text-slate-800">{student.permanent_address || "—"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Fees */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <SectionTitle title="Fee Details" icon={DollarSign} />
              <div className="divide-y divide-slate-100">
                {fees.map((f: any) => (
                  <div key={f.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{f.type} - {f.term}</p>
                      <p className="text-xs text-slate-500 font-medium">Due: {new Date(f.due_date).toLocaleDateString("en-GB")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">₹{Number(f.amount).toLocaleString()}</p>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${f.status === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-[#F97316]"}`}>
                        {f.status}
                      </span>
                    </div>
                  </div>
                ))}
                {fees.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No fee records found.</p>}
              </div>
            </div>

            {/* Attendance */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <SectionTitle title="Recent Attendance" icon={Calendar} />
              <div className="divide-y divide-slate-100">
                {attendance.slice(0, 5).map((a: any) => (
                  <div key={a.id} className="py-3 flex justify-between items-center">
                    <p className="text-sm font-bold text-slate-800">{new Date(a.date).toLocaleDateString("en-GB", { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                    <span className={`text-xs font-bold uppercase tracking-wider ${a.status === "P" ? "text-emerald-600" : a.status === "A" ? "text-red-500" : "text-indigo-500"}`}>
                      {a.status === "P" ? "Present" : a.status === "A" ? "Absent" : "Leave"}
                    </span>
                  </div>
                ))}
                {attendance.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No attendance records found.</p>}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;