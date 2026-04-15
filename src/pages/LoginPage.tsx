import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

type View = "login" | "forgot" | "otp" | "newpwd" | "mustchange" | "p_forgot" | "p_methods" | "p_otp" | "p_newpwd";

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role") || "parent";
  const { loginAdmin, loginParent, sendOtp, verifyOtp, changePassword, adminUser, parentStudentId, findParentForReset, sendParentOtpEmail, sendParentOtpSms, verifyParentOtp, changeParentPasswordOffline } = useAuth();

  useEffect(() => {
    if (adminUser && !adminUser.must_change_password) navigate("/admin", { replace: true });
    else if (adminUser && adminUser.must_change_password) setView("mustchange");
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

  // Forgot / OTP / New password flow (Admin)
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

  // Generic flow visibility
  const [showFlowPwd, setShowFlowPwd] = useState(false);

  // Parent Reset state
  const [pData, setPData] = useState<{name?: string, email?: string, mobile?: string} | null>(null);
  const [pMethod, setPMethod] = useState<"email" | "sms">("email");

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

  const isValidPassword = (pwd: string) => /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd) && pwd.length >= 8;

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) { setFlowErr("Passwords do not match."); return; }
    if (!isValidPassword(newPwd)) {
      setFlowErr("Password must be at least 8 chars, containing uppercase, lowercase, and symbols.");
      return;
    }
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
    if (!isValidPassword(mustPwd)) {
      setFlowErr("Password must be at least 8 chars, containing uppercase, lowercase, and symbols.");
      return;
    }
    setFlowLoading(true); setFlowErr("");
    const { error } = await changePassword(mustPwd);
    setFlowLoading(false);
    if (error) { setFlowErr(error); return; }
    toast.success("Password set! Welcome.");
    navigate("/admin");
  };

  // --- Parent Reset Handlers ---
  const handlePFind = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlowLoading(true); setFlowErr("");
    const { error, name, father_email_id, father_mobile_number } = await findParentForReset(pAdm);
    setFlowLoading(false);
    if (error || (!father_email_id && !father_mobile_number)) {
      setFlowErr(error || "No contact info available for this admission number.");
      return;
    }
    setPData({ name, email: father_email_id, mobile: father_mobile_number });
    setView("p_methods");
  };

  const handlePSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlowLoading(true); setFlowErr("");

    if (pMethod === "email") {
      if (!pData?.email) { setFlowErr("No email registered."); setFlowLoading(false); return; }
      const { error } = await sendParentOtpEmail(pAdm, pData.email, pData.name || "Parent");
      setFlowLoading(false);
      if (error) { setFlowErr(error); return; }
      toast.success(`OTP sent to email!`);
      setView("p_otp");
    } else {
      if (!pData?.mobile) { setFlowErr("No mobile registered."); setFlowLoading(false); return; }
      
      const { error } = await sendParentOtpSms(pAdm, pData.mobile, pData.name || "Parent");
      setFlowLoading(false);
      
      if (error) { 
        setFlowErr(error); 
        return; 
      }
      
      toast.success(`OTP sent via SMS!`);
      setView("p_otp");
    }
  };

  const handlePVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlowLoading(true); setFlowErr("");

    // Both Email and SMS now correctly hit our backend OTP verifier!
    const { error } = await verifyParentOtp(pAdm, otpVal);
    setFlowLoading(false);
    if (error) { setFlowErr(error); return; }
    setView("p_newpwd");
  };

  const handlePSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) { setFlowErr("Passwords do not match."); return; }
    if (!isValidPassword(newPwd)) {
      setFlowErr("Password must be at least 8 chars, containing uppercase, lowercase, and symbols.");
      return;
    }
    setFlowLoading(true); setFlowErr("");
    const { error } = await changeParentPasswordOffline(pAdm, newPwd);
    setFlowLoading(false);
    if (error) { setFlowErr(error); return; }
    toast.success("Password updated! Please log in.");
    setView("login");
  };

  const maskEmail = (email?: string) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    if (name.length <= 2) return `${name[0]}***@${domain}`;
    return `${name[0]}${"*".repeat(name.length - 2)}${name[name.length - 1]}@${domain}`;
  };

  const maskPhone = (phone?: string) => {
    if (!phone) return "";
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 4) return clean;
    return `*******${clean.slice(-3)}`;
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 focus:border-[#d4af37] transition-all bg-slate-50 hover:bg-white focus:bg-white";
  const btnPrimary = "w-full py-3.5 rounded-xl bg-[#d4af37] text-white font-bold text-sm hover:bg-[#c49e29] active:scale-[0.98] disabled:opacity-60 transition-all";
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
        <h1 className="text-white font-bold text-2xl" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Sri Anveeksha Techno School</h1>
        <p className="text-white/60 text-sm mt-1 tracking-wider uppercase font-medium" style={{ fontFamily: "Inter,sans-serif" }}>Ootla, Jinnaram, Telangana</p>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* ── Role toggle ── */}
        {view === "login" && (
          <div className="flex bg-black/40 backdrop-blur-md rounded-2xl p-1 mb-5 border border-white/10">
            {["parent", "admin"].map(r => (
              <button key={r} type="button" onClick={() => navigate(`/login?role=${r}`)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all capitalize ${role === r ? "bg-[#d4af37] text-white shadow-lg" : "text-white/60 hover:text-white hover:bg-white/5"}`}
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
              <div className="w-1.5 h-6 bg-[#d4af37] rounded-full" />
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
              <button type="button" onClick={() => { setPAdm(""); setView("p_forgot"); setFlowErr(""); }}
                className="text-xs text-[#d4af37] hover:underline font-medium -mt-2 block text-right w-full" style={{ fontFamily: "Inter,sans-serif" }}>
                Forgot password?
              </button>
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
              <div className="w-1.5 h-6 bg-[#0c2340] rounded-full" />
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
                className="text-xs text-[#0c2340] hover:underline font-medium -mt-2 block text-right w-full" style={{ fontFamily: "Inter,sans-serif" }}>
                Forgot password?
              </button>
              {aErr && <p className="text-red-600 text-xs font-medium bg-red-50 px-3 py-2 rounded-lg">{aErr}</p>}
              <button type="submit" disabled={aLoading} className={`${btnPrimary} !bg-[#0c2340] hover:!bg-[#4338ca]`} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
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
              <button type="submit" disabled={flowLoading} className={`${btnPrimary} !bg-[#0c2340] hover:!bg-[#4338ca]`} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
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
              <button type="submit" disabled={flowLoading} className={`${btnPrimary} !bg-[#0c2340] hover:!bg-[#4338ca]`} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                {flowLoading ? "Verifying…" : "Verify OTP"}
              </button>
              <button type="button" onClick={handleSendOtp} className="w-full text-center text-xs text-slate-500 hover:text-[#0c2340] mt-1">Didn't receive? Resend OTP</button>
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
                  <div className="relative">
                    <input type={showFlowPwd ? "text" : "password"} required value={f.val} onChange={e => f.set(e.target.value)} className={`${inputCls} pr-11`} style={{ fontFamily: "Inter,sans-serif" }} />
                    <button type="button" onClick={() => setShowFlowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showFlowPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              ))}
              {flowErr && <p className="text-red-600 text-xs font-medium bg-red-50 px-3 py-2 rounded-lg">{flowErr}</p>}
              <button type="submit" disabled={flowLoading} className={`${btnPrimary} !bg-[#0c2340] hover:!bg-[#4338ca]`} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                {flowLoading ? "Saving…" : "Save Password & Login"}
              </button>
            </form>
          </div>
        )}

        {/* ═══════ MUST CHANGE PASSWORD (first login) ═══════ */}
        {view === "mustchange" && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="mb-6">
              <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center mb-4">
                <span className="text-[#d4af37] text-xl font-bold">!</span>
              </div>
              <h2 className="font-bold text-slate-900 text-xl mb-1" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Set Your Password</h2>
              <p className="text-slate-500 text-sm" style={{ fontFamily: "Inter,sans-serif" }}>Welcome! This is your first login. Please set a new password to continue.</p>
            </div>
            <form onSubmit={handleMustChange} className="space-y-4">
              {[{ label: "New Password", val: mustPwd, set: setMustPwd }, { label: "Confirm Password", val: mustConfirm, set: setMustConfirm }].map(f => (
                <div key={f.label}>
                  <label className={label} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{f.label}</label>
                  <div className="relative">
                    <input type={showFlowPwd ? "text" : "password"} required value={f.val} onChange={e => f.set(e.target.value)} className={`${inputCls} pr-11`} placeholder="Min. 8 characters" style={{ fontFamily: "Inter,sans-serif" }} />
                    <button type="button" onClick={() => setShowFlowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showFlowPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              ))}
              {flowErr && <p className="text-red-600 text-xs font-medium bg-red-50 px-3 py-2 rounded-lg">{flowErr}</p>}
              <button type="submit" disabled={flowLoading} className={btnPrimary} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                {flowLoading ? "Saving…" : "Set Password & Enter Dashboard"}
              </button>
            </form>
          </div>
        )}
        {/* ═══════ PARENT FORGOT PASSWORD ═══════ */}
        {view === "p_forgot" && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <button onClick={() => setView("login")} className="text-slate-400 hover:text-slate-600 text-sm mb-5 flex items-center gap-1">← Back to login</button>
            <h2 className="font-bold text-slate-900 text-xl mb-1" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Parent Password Reset</h2>
            <p className="text-slate-500 text-sm mb-6" style={{ fontFamily: "Inter,sans-serif" }}>Enter your student's Admission Number to find your account.</p>
            <form onSubmit={handlePFind} className="space-y-4">
              <div>
                <label className={label} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Admission Number</label>
                <input type="text" required value={pAdm} onChange={e => setPAdm(e.target.value)} placeholder="e.g. ADM001" className={inputCls} style={{ fontFamily: "Inter,sans-serif" }} />
              </div>
              {flowErr && <p className="text-red-600 text-xs font-medium bg-red-50 px-3 py-2 rounded-lg">{flowErr}</p>}
              <button type="submit" disabled={flowLoading} className={btnPrimary} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                {flowLoading ? "Searching…" : "Continue"}
              </button>
            </form>
          </div>
        )}

        {/* ═══════ PARENT OTP METHODS ═══════ */}
        {view === "p_methods" && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <button onClick={() => setView("p_forgot")} className="text-slate-400 hover:text-slate-600 text-sm mb-5 flex items-center gap-1">← Back</button>
            <h2 className="font-bold text-slate-900 text-xl mb-1" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Account Found</h2>
            <p className="text-slate-500 text-sm mb-6" style={{ fontFamily: "Inter,sans-serif" }}>Hi {pData?.name}, where should we send your OTP?</p>
            <form onSubmit={handlePSendOtp} className="space-y-4">
              
              <div className="space-y-3 mb-6">
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${pMethod === "email" ? "border-[#d4af37] bg-gold-50/10" : "border-slate-100 bg-white"}`}>
                  <input type="radio" name="p_method" value="email" checked={pMethod === "email"} onChange={() => setPMethod("email")} className="w-4 h-4 text-[#d4af37] focus:ring-[#d4af37]" />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Send via Email</p>
                    <p className="text-slate-500 text-xs">{maskEmail(pData?.email) || "Not available"}</p>
                  </div>
                </label>
                {/* Temporarily disabled SMS due to lack of DLT / API costs
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${pMethod === "sms" ? "border-[#d4af37] bg-gold-50/10" : "border-slate-100 bg-white"}`}>
                  <input type="radio" name="p_method" value="sms" checked={pMethod === "sms"} onChange={() => setPMethod("sms")} className="w-4 h-4 text-[#d4af37] focus:ring-[#d4af37]" />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Send via SMS</p>
                    <p className="text-slate-500 text-xs">{maskPhone(pData?.mobile) || "Not available"}</p>
                  </div>
                </label>
                */}
              </div>

              {/* No reCAPTCHA needed for Fast2SMS */}

              {flowErr && <p className="text-red-600 text-xs font-medium bg-red-50 px-3 py-2 rounded-lg">{flowErr}</p>}
              <button type="submit" disabled={flowLoading || (pMethod === "email" && !pData?.email) || (pMethod === "sms" && !pData?.mobile)} className={btnPrimary} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                {flowLoading ? "Sending OTP…" : "Send OTP"}
              </button>
            </form>
          </div>
        )}

        {/* ═══════ PARENT VERIFY OTP ═══════ */}
        {view === "p_otp" && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="font-bold text-slate-900 text-xl mb-1" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Enter OTP</h2>
            <p className="text-slate-500 text-sm mb-6" style={{ fontFamily: "Inter,sans-serif" }}>
              Code sent to {pMethod === "email" ? maskEmail(pData?.email) : maskPhone(pData?.mobile)}.
            </p>
            <form onSubmit={handlePVerifyOtp} className="space-y-4">
              <div>
                <label className={label} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>OTP Code</label>
                <input type="text" maxLength={6} required value={otpVal} onChange={e => setOtpVal(e.target.value.replace(/\D/g, ""))} placeholder="6-digit code" className={`${inputCls} text-center text-2xl tracking-[0.5em] font-mono`} />
              </div>
              {flowErr && <p className="text-red-600 text-xs font-medium bg-red-50 px-3 py-2 rounded-lg">{flowErr}</p>}
              <button type="submit" disabled={flowLoading} className={btnPrimary} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                {flowLoading ? "Verifying…" : "Verify OTP"}
              </button>
            </form>
          </div>
        )}

        {/* ═══════ PARENT SET NEW PASSWORD ═══════ */}
        {view === "p_newpwd" && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="font-bold text-slate-900 text-xl mb-1" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Set New Password</h2>
            <p className="text-slate-500 text-sm mb-6" style={{ fontFamily: "Inter,sans-serif" }}>Choose a strong password (min. 8 characters).</p>
            <form onSubmit={handlePSetNewPassword} className="space-y-4">
              {[{ label: "New Password", val: newPwd, set: setNewPwd }, { label: "Confirm Password", val: confirmPwd, set: setConfirmPwd }].map(f => (
                <div key={f.label}>
                  <label className={label} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{f.label}</label>
                  <div className="relative">
                    <input type={showFlowPwd ? "text" : "password"} required value={f.val} onChange={e => f.set(e.target.value)} className={`${inputCls} pr-11`} style={{ fontFamily: "Inter,sans-serif" }} />
                    <button type="button" onClick={() => setShowFlowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showFlowPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              ))}
              {flowErr && <p className="text-red-600 text-xs font-medium bg-red-50 px-3 py-2 rounded-lg">{flowErr}</p>}
              <button type="submit" disabled={flowLoading} className={btnPrimary} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                {flowLoading ? "Saving…" : "Save Password & Login"}
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