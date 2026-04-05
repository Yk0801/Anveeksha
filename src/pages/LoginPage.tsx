import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

type View = "login" | "forgot" | "otp" | "newpwd" | "mustchange";

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role") || "parent";
  const { loginAdmin, loginParent, sendOtp, verifyOtp, changePassword, adminUser, parentStudentId } = useAuth();

  useEffect(() => {
    if (adminUser) navigate("/admin", { replace: true });
    else if (parentStudentId) navigate("/parent", { replace: true });
  }, [adminUser, parentStudentId, navigate]);

  // Parent
  const [pAdm, setPAdm] = useState("");
  const [pPwd, setPPwd] = useState("");
  const [showPPwd, setShowPPwd] = useState(false);
  const [pLoading, setPLoading] = useState(false);
  const [pErr, setPErr] = useState("");

  // Admin / Faculty
  const [aEmail, setAEmail] = useState("");
  const [aPwd, setAPwd] = useState("");
  const [showAPwd, setShowAPwd] = useState(false);
  const [aLoading, setALoading] = useState(false);
  const [aErr, setAErr] = useState("");

  // Forgot / OTP / New password flow
  const [view, setView] = useState<View>("login");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpVal, setOtpVal] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [flowLoading, setFlowLoading] = useState(false);
  const [flowErr, setFlowErr] = useState("");

  // Must-change password (first login)
  const [mustPwd, setMustPwd] = useState("");
  const [mustConfirm, setMustConfirm] = useState("");

  const handleParentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPLoading(true); setPErr("");
    const { error } = await loginParent(pAdm, pPwd);
    setPLoading(false);
    if (error) { setPErr(error); return; }
    toast.success("Welcome to Parent Portal!");
    navigate("/parent");
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setALoading(true); setAErr("");
    const { error, mustChange } = await loginAdmin(aEmail, aPwd);
    setALoading(false);
    if (error) { setAErr(error); return; }
    if (mustChange) { setView("mustchange"); return; }
    toast.success("Login successful!");
    navigate("/admin");
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlowLoading(true); setFlowErr("");
    const { error } = await sendOtp(forgotEmail);
    setFlowLoading(false);
    if (error) { setFlowErr(error); return; }
    toast.success("OTP sent! Check your registered email (or console for testing).");
    setView("otp");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlowLoading(true); setFlowErr("");
    const { error } = await verifyOtp(forgotEmail, otpVal);
    setFlowLoading(false);
    if (error) { setFlowErr(error); return; }
    setView("newpwd");
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) { setFlowErr("Passwords do not match."); return; }
    if (newPwd.length < 8) { setFlowErr("Password must be at least 8 characters."); return; }
    setFlowLoading(true); setFlowErr("");
    // Set the new password via update (user already verified OTP)
    const { error } = await changePassword(newPwd);
    setFlowLoading(false);
    if (error) { setFlowErr("Error updating password. Please try again."); return; }
    toast.success("Password updated! Please log in.");
    setView("login");
  };

  const handleMustChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mustPwd !== mustConfirm) { setFlowErr("Passwords do not match."); return; }
    if (mustPwd.length < 8) { setFlowErr("Password must be at least 8 characters."); return; }
    setFlowLoading(true); setFlowErr("");
    const { error } = await changePassword(mustPwd);
    setFlowLoading(false);
    if (error) { setFlowErr(error); return; }
    toast.success("Password set! Welcome.");
    navigate("/admin");
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/40 focus:border-[#F97316] transition-all bg-slate-50 hover:bg-white focus:bg-white";
  const btnPrimary = "w-full py-3.5 rounded-xl bg-[#F97316] text-white font-bold text-sm hover:bg-[#ea580c] active:scale-[0.98] disabled:opacity-60 transition-all";
  const label = "block text-sm font-semibold text-slate-700 mb-1.5";

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden bg-slate-900">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src="/school-hero.jpg" alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-900/80" />
      </div>

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-white/[0.04] font-black text-center leading-none"
          style={{ fontSize: "clamp(4rem,14vw,12rem)", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          SRI<br />ANVEEKSHA
        </span>
      </div>

      {/* School header */}
      <div className="text-center mb-8 relative z-10">
        <h1 className="text-white font-bold text-2xl" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Sri Anveeksha Public School</h1>
        <p className="text-white/60 text-sm mt-1 tracking-wider uppercase font-medium" style={{ fontFamily: "Inter,sans-serif" }}>Ootla, Jinnaram, Telangana</p>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* ── Role toggle ── */}
        {view === "login" && (
          <div className="flex bg-black/40 backdrop-blur-md rounded-2xl p-1 mb-5 border border-white/10">
            {["parent", "admin"].map(r => (
              <button key={r} type="button" onClick={() => navigate(`/login?role=${r}`)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all capitalize ${role === r ? "bg-[#F97316] text-white shadow-lg" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                {r === "admin" ? "Staff / Admin" : "Parent"} Login
              </button>
            ))}
          </div>
        )}

        {/* ═══════ PARENT LOGIN ═══════ */}
        {view === "login" && role === "parent" && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-6 bg-[#F97316] rounded-full" />
              <div>
                <h2 className="font-bold text-slate-900 text-xl" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Parent Portal</h2>
                <p className="text-slate-500 text-xs font-medium" style={{ fontFamily: "Inter,sans-serif" }}>Login with your child's Admission Number</p>
              </div>
            </div>
            <form onSubmit={handleParentLogin} className="space-y-5">
              <div>
                <label className={label} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Admission Number</label>
                <input type="text" placeholder="e.g. ADM001" required value={pAdm} onChange={e => setPAdm(e.target.value)} className={inputCls} style={{ fontFamily: "Inter,sans-serif" }} />
              </div>
              <div>
                <label className={label} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Password</label>
                <div className="relative">
                  <input type={showPPwd ? "text" : "password"} placeholder="Enter password" required value={pPwd} onChange={e => setPPwd(e.target.value)} className={`${inputCls} pr-11`} style={{ fontFamily: "Inter,sans-serif" }} />
                  <button type="button" onClick={() => setShowPPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {pErr && <p className="text-red-600 text-xs font-medium bg-red-50 px-3 py-2 rounded-lg">{pErr}</p>}
              <button type="submit" disabled={pLoading} className={btnPrimary} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                {pLoading ? "Signing in…" : "Sign in to Parent Portal"}
              </button>
            </form>
          </div>
        )}

        {/* ═══════ ADMIN / FACULTY LOGIN ═══════ */}
        {view === "login" && role === "admin" && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-6 bg-[#4F46E5] rounded-full" />
              <div>
                <h2 className="font-bold text-slate-900 text-xl" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Staff & Admin Login</h2>
                <p className="text-slate-500 text-xs font-medium" style={{ fontFamily: "Inter,sans-serif" }}>For admin, faculty, and management</p>
              </div>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div>
                <label className={label} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Email Address</label>
                <input type="email" placeholder="yourname@gmail.com" required value={aEmail} onChange={e => setAEmail(e.target.value)} className={inputCls} style={{ fontFamily: "Inter,sans-serif" }} />
              </div>
              <div>
                <label className={label} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Password</label>
                <div className="relative">
                  <input type={showAPwd ? "text" : "password"} placeholder="Enter password" required value={aPwd} onChange={e => setAPwd(e.target.value)} className={`${inputCls} pr-11`} style={{ fontFamily: "Inter,sans-serif" }} />
                  <button type="button" onClick={() => setShowAPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showAPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button type="button" onClick={() => { setForgotEmail(aEmail); setView("forgot"); setFlowErr(""); }}
                className="text-xs text-[#4F46E5] hover:underline font-medium -mt-2 block text-right w-full" style={{ fontFamily: "Inter,sans-serif" }}>
                Forgot password?
              </button>
              {aErr && <p className="text-red-600 text-xs font-medium bg-red-50 px-3 py-2 rounded-lg">{aErr}</p>}
              <button type="submit" disabled={aLoading} className={`${btnPrimary} !bg-[#4F46E5] hover:!bg-[#4338ca]`} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                {aLoading ? "Authenticating…" : "Secure Login"}
              </button>
            </form>
          </div>
        )}

        {/* ═══════ FORGOT PASSWORD ═══════ */}
        {view === "forgot" && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <button onClick={() => setView("login")} className="text-slate-400 hover:text-slate-600 text-sm mb-5 flex items-center gap-1">← Back to login</button>
            <h2 className="font-bold text-slate-900 text-xl mb-1" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Reset Password</h2>
            <p className="text-slate-500 text-sm mb-6" style={{ fontFamily: "Inter,sans-serif" }}>Enter your registered email. We'll send a 6-digit OTP.</p>
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className={label} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Email Address</label>
                <input type="email" required value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="yourname@gmail.com" className={inputCls} style={{ fontFamily: "Inter,sans-serif" }} />
              </div>
              {flowErr && <p className="text-red-600 text-xs font-medium bg-red-50 px-3 py-2 rounded-lg">{flowErr}</p>}
              <button type="submit" disabled={flowLoading} className={`${btnPrimary} !bg-[#4F46E5] hover:!bg-[#4338ca]`} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                {flowLoading ? "Sending OTP…" : "Send OTP"}
              </button>
            </form>
          </div>
        )}

        {/* ═══════ VERIFY OTP ═══════ */}
        {view === "otp" && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="font-bold text-slate-900 text-xl mb-1" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Enter OTP</h2>
            <p className="text-slate-500 text-sm mb-6" style={{ fontFamily: "Inter,sans-serif" }}>A 6-digit code was sent to <strong>{forgotEmail}</strong>. Valid for 10 minutes.</p>
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className={label} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>OTP Code</label>
                <input type="text" maxLength={6} required value={otpVal} onChange={e => setOtpVal(e.target.value.replace(/\D/g, ""))} placeholder="6-digit code" className={`${inputCls} text-center text-2xl tracking-[0.5em] font-mono`} />
              </div>
              {flowErr && <p className="text-red-600 text-xs font-medium bg-red-50 px-3 py-2 rounded-lg">{flowErr}</p>}
              <button type="submit" disabled={flowLoading} className={`${btnPrimary} !bg-[#4F46E5] hover:!bg-[#4338ca]`} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                {flowLoading ? "Verifying…" : "Verify OTP"}
              </button>
              <button type="button" onClick={handleSendOtp} className="w-full text-center text-xs text-slate-500 hover:text-[#4F46E5] mt-1">Didn't receive? Resend OTP</button>
            </form>
          </div>
        )}

        {/* ═══════ SET NEW PASSWORD ═══════ */}
        {view === "newpwd" && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="font-bold text-slate-900 text-xl mb-1" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Set New Password</h2>
            <p className="text-slate-500 text-sm mb-6" style={{ fontFamily: "Inter,sans-serif" }}>Choose a strong password (min. 8 characters).</p>
            <form onSubmit={handleSetNewPassword} className="space-y-4">
              {[{ label: "New Password", val: newPwd, set: setNewPwd }, { label: "Confirm Password", val: confirmPwd, set: setConfirmPwd }].map(f => (
                <div key={f.label}>
                  <label className={label} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{f.label}</label>
                  <input type="password" required value={f.val} onChange={e => f.set(e.target.value)} className={inputCls} style={{ fontFamily: "Inter,sans-serif" }} />
                </div>
              ))}
              {flowErr && <p className="text-red-600 text-xs font-medium bg-red-50 px-3 py-2 rounded-lg">{flowErr}</p>}
              <button type="submit" disabled={flowLoading} className={`${btnPrimary} !bg-[#4F46E5] hover:!bg-[#4338ca]`} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                {flowLoading ? "Saving…" : "Save Password & Login"}
              </button>
            </form>
          </div>
        )}

        {/* ═══════ MUST CHANGE PASSWORD (first login) ═══════ */}
        {view === "mustchange" && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="mb-6">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                <span className="text-[#F97316] text-xl font-bold">!</span>
              </div>
              <h2 className="font-bold text-slate-900 text-xl mb-1" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Set Your Password</h2>
              <p className="text-slate-500 text-sm" style={{ fontFamily: "Inter,sans-serif" }}>Welcome! This is your first login. Please set a new password to continue.</p>
            </div>
            <form onSubmit={handleMustChange} className="space-y-4">
              {[{ label: "New Password", val: mustPwd, set: setMustPwd }, { label: "Confirm Password", val: mustConfirm, set: setMustConfirm }].map(f => (
                <div key={f.label}>
                  <label className={label} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{f.label}</label>
                  <input type="password" required value={f.val} onChange={e => f.set(e.target.value)} className={inputCls} placeholder="Min. 8 characters" style={{ fontFamily: "Inter,sans-serif" }} />
                </div>
              ))}
              {flowErr && <p className="text-red-600 text-xs font-medium bg-red-50 px-3 py-2 rounded-lg">{flowErr}</p>}
              <button type="submit" disabled={flowLoading} className={btnPrimary} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                {flowLoading ? "Saving…" : "Set Password & Enter Dashboard"}
              </button>
            </form>
          </div>
        )}
      </div>

      <button onClick={() => navigate("/")}
        className="relative z-10 mt-8 text-white/50 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 group bg-black/20 px-4 py-2 rounded-full border border-white/10"
        style={{ fontFamily: "Inter,sans-serif" }}>
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to website
      </button>
    </div>
  );
};

export default LoginPage;