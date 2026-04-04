import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { ADMIN_CREDENTIALS } from "@/data/seedData";

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role") || "parent";

  // Parent login state
  const [parentEmail, setParentEmail] = useState("");
  const [parentPwd, setParentPwd] = useState("");
  const [showParentPwd, setShowParentPwd] = useState(false);
  const [parentLoading, setParentLoading] = useState(false);
  const [parentError, setParentError] = useState("");

  // Admin login state
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPwd, setAdminPwd] = useState("");
  const [showAdminPwd, setShowAdminPwd] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");

  const handleParentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setParentLoading(true);
    setParentError("");

    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('admission_no', parentEmail.trim().toUpperCase())
        .eq('password', parentPwd)
        .single();

      if (error) {
        console.error("Supabase Login Error:", error);
        if (error.code === 'PGRST116') {
          setParentError("Invalid Admission Number or Password.");
        } else {
          setParentError("Database Error: " + error.message);
        }
      } else if (!data) {
        setParentError("Invalid Admission Number or Password.");
      } else {
        toast.success(`Welcome! Logged in as ${data.name}`);
        localStorage.setItem("saps_role", "parent");
        localStorage.setItem("saps_student_id", data.id);
        navigate("/parent");
      }
    } catch (err: any) {
      setParentError(err.message || "Something went wrong.");
    } finally {
      setParentLoading(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    setAdminLoading(true);
    setTimeout(() => {
      if (adminEmail.trim().toLowerCase() === ADMIN_CREDENTIALS.email && adminPwd === ADMIN_CREDENTIALS.password) {
        toast.success("Welcome, Admin!");
        localStorage.setItem("saps_role", "admin");
        navigate("/admin");
      } else {
        setAdminError("Invalid email or password.");
      }
      setAdminLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/school-hero.jpg"
          alt="School Background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7))" }} />
      </div>

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-white/5 font-black text-center leading-tight"
          style={{ fontSize: "clamp(3rem, 10vw, 9rem)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          SRI<br />ANVEEKSHA
        </span>
      </div>

      {/* School Logo */}
      <div className="text-center mb-8 relative z-10">
        {/* <div className="w-16 h-16 rounded-2xl bg-white p-1 mb-3 flex items-center justify-center border border-white/20 shadow-xl overflow-hidden">
          <img src="/school_logo.png" alt="Logo" className="w-full h-full object-contain" onError={e => e.currentTarget.style.display = 'none'} />
        </div> */}
        <h1 className="text-white font-bold text-2xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sri Anveeksha Public School</h1>
        <p className="text-white/80 text-sm mt-1 tracking-wider uppercase font-medium" style={{ fontFamily: "Inter, sans-serif" }}>Ootla, Jinnaram</p>
      </div>

      {/* Single-card layout based on role */}
      <div className="relative z-10 w-full max-w-md">

        {/* Toggle navigation for user convenience */}
        <div className="flex bg-black/40 backdrop-blur-md rounded-2xl p-1 mb-6 border border-white/10">
          <button
            type="button"
            onClick={() => navigate("/login?role=parent")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${role === 'parent' ? 'bg-[#F97316] text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Parent Login
          </button>
          <button
            type="button"
            onClick={() => navigate("/login?role=admin")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${role === 'admin' ? 'bg-[#F97316] text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Admin Login
          </button>
        </div>

        <div className="relative overflow-hidden transition-all duration-300">
          {role === "parent" && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-6 bg-[#F97316] rounded-full" />
                  <h2 className="font-bold text-slate-900 text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Parent Portal</h2>
                </div>
                <p className="text-slate-500 text-xs ml-4 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>Use your child's Admission No. to sign in</p>
              </div>
              <form onSubmit={handleParentLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Admission No.</label>
                  <input type="text" placeholder="e.g. ADM001" required value={parentEmail}
                    onChange={e => setParentEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] transition-all bg-slate-50 hover:bg-white focus:bg-white"
                    style={{ fontFamily: "Inter, sans-serif" }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Password</label>
                  <div className="relative">
                    <input type={showParentPwd ? "text" : "password"} placeholder="Enter password" required value={parentPwd}
                      onChange={e => setParentPwd(e.target.value)}
                      className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] transition-all bg-slate-50 hover:bg-white focus:bg-white"
                      style={{ fontFamily: "Inter, sans-serif" }} />
                    <button type="button" onClick={() => setShowParentPwd(!showParentPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
                      {showParentPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                {parentError && <p className="text-[#F97316] text-xs font-medium bg-orange-50 p-2 rounded-lg" style={{ fontFamily: "Inter, sans-serif" }}>{parentError}</p>}

                <button type="submit" disabled={parentLoading}
                  className="w-full py-3.5 rounded-xl bg-[#F97316] text-white font-bold text-sm transition-all hover:bg-[#ea580c] hover:shadow-lg hover:shadow-orange-500/30 active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-none mt-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {parentLoading ? "Signing in…" : "Sign in to Dashboard"}
                </button>
              </form>
              <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xs text-slate-500 font-bold mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Database Credentials</p>
                <div className="flex justify-between items-center bg-white border border-slate-200 py-2 px-3 rounded-lg mb-2">
                  <p className="text-xs text-slate-600" style={{ fontFamily: "Inter, sans-serif" }}>ADM001 / <span className="font-mono font-bold text-slate-800">password123</span></p>
                </div>
              </div>
            </div>
          )}

          {role === "admin" && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-6 bg-[#F97316] rounded-full" />
                  <h2 className="font-bold text-slate-900 text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Admin Portal</h2>
                </div>
                <p className="text-slate-500 text-xs ml-4 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>Secure administration access</p>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Email Address</label>
                  <input type="email" placeholder="admin@srianveeksha.edu.in" required value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] transition-all bg-slate-50 hover:bg-white focus:bg-white"
                    style={{ fontFamily: "Inter, sans-serif" }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Password</label>
                  <div className="relative">
                    <input type={showAdminPwd ? "text" : "password"} placeholder="Enter admin password" required value={adminPwd}
                      onChange={e => setAdminPwd(e.target.value)}
                      className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] transition-all bg-slate-50 hover:bg-white focus:bg-white"
                      style={{ fontFamily: "Inter, sans-serif" }} />
                    <button type="button" onClick={() => setShowAdminPwd(!showAdminPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition-colors">
                      {showAdminPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                {adminError && <p className="text-[#F97316] text-xs font-medium bg-orange-50 p-2 rounded-lg" style={{ fontFamily: "Inter, sans-serif" }}>{adminError}</p>}

                <button type="submit" disabled={adminLoading}
                  className="w-full py-3.5 rounded-xl bg-[#F97316] text-white font-bold text-sm transition-all hover:bg-[#ea580c] hover:shadow-lg hover:shadow-orange-500/30 active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-none mt-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {adminLoading ? "Authenticating…" : "Secure Login"}
                </button>
              </form>
              <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xs text-slate-500 font-bold mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Test Credentials</p>
                <div className="flex justify-between items-center bg-white border border-slate-200 py-2 px-3 rounded-lg">
                  <p className="text-xs text-slate-600" style={{ fontFamily: "Inter, sans-serif" }}>admin@srianveeksha.edu.in / <span className="font-mono font-bold text-slate-800">admin123</span></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Back link */}
      <button onClick={() => navigate("/")}
        className="relative z-10 mt-8 text-white/60 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 group backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full border border-white/10"
        style={{ fontFamily: "Inter, sans-serif" }}>
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to website
      </button>
    </div>
  );
};

export default LoginPage;
