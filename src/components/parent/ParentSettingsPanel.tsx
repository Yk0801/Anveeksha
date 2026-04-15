import React, { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-black uppercase tracking-[0.15em] text-[#d4af37] mb-4 pb-2 border-b border-slate-100" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
    {children}
  </h3>
);

const isValidPassword = (pwd: string) => /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd) && pwd.length >= 8;

const ParentSettingsPanel = () => {
  const { parentStudentId } = useAuth();
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentStudentId) return;
    if (!isValidPassword(newPwd)) {
      return toast.error("Password must be at least 8 chars, containing uppercase, lowercase, and symbols.");
    }
    
    // Check old password
    const { data: st } = await supabase.from("students").select("password").eq("id", parentStudentId).single();
    if (st?.password !== oldPwd) return toast.error("Old password is incorrect.");
    
    // Update
    const { error } = await supabase.from("students").update({ password: newPwd }).eq("id", parentStudentId);
    if (error) return toast.error(error.message);
    
    toast.success("Password updated successfully.");
    setOldPwd(""); setNewPwd("");
  };

  return (
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
        <button type="submit" className="w-full px-4 py-3 bg-[#d4af37] text-white font-bold text-sm rounded-lg hover:bg-[#c49e29] transition-colors mt-2">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ParentSettingsPanel;
