import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronRight, ChevronLeft, Users, CheckSquare, List, DollarSign, MessageSquare, Clipboard, Calendar, Settings, FileText, Bus, UserCircle, Bell, X, Moon, LogOut, ChevronsLeft, ChevronsRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { hashPassword } from "@/lib/utils";
import { Student, AdminUserRow } from "./types";
import { SectionTitle, Inp, Sel, PaginationControls, EntriesDropdown } from "./SharedUI";

// ─── ANNOUNCEMENTS ────────────────────────────────────────────────────────────
const AnnouncementsPanel = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", message: "", audience: "All" });
  const [sendSms, setSendSms] = useState(false);
  const [saving, setSaving] = useState(false);
  const { adminUser, invokeFast2Sms } = useAuth();

  useEffect(() => {
    supabase.from("announcements").select("*").order("created_at", { ascending: false }).then(({ data }) => setAnnouncements(data || []));
  }, []);

  const post = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data, error } = await supabase.from("announcements").insert([{ ...form, posted_by: adminUser?.name }]).select().single();
    if (error) { setSaving(false); toast.error(error.message); return; }
    
    // Broadcast via Fast2SMS if ticked
    if (sendSms && (form.audience === "All" || form.audience === "All Parents" || ["Pre-KG", "LKG", "UKG"].includes(form.audience))) {
        toast.loading("Broadcasting SMS...", { id: "smsLoad" });
        // Fetch matching parent numbers dynamically
        let query = supabase.from("students").select("father_mobile_number, mother_mobile_number, guardian_mobile_number, mobile_number").eq("status", "Active");
        if (["Pre-KG", "LKG", "UKG"].includes(form.audience)) {
            query = query.eq("class", form.audience);
        }
        
        const { data: studentsInfo } = await query;
        if (studentsInfo && studentsInfo.length > 0) {
            // Aggregate all the primary mobiles 
            const mobiles = studentsInfo.map(s => s.father_mobile_number || s.mother_mobile_number || s.guardian_mobile_number || s.mobile_number).filter(Boolean);
            if (mobiles.length > 0) {
                // Batch maximum 1000 numbers allowed by Fast2SMS bulk, but let's just join them array style
                const commaList = mobiles.join(",");
                const textBody = `Notice: ${form.title}\n${form.message}\n- Sri Anveeksha School`;
                await invokeFast2Sms(textBody, commaList);
                toast.success(`Broadly sent SMS to ${mobiles.length} parents!`, { id: "smsLoad" });
            } else {
                toast.error("No valid mobile numbers found for this audience.", { id: "smsLoad" });
            }
        } else {
            toast.error("No parents found for this audience.", { id: "smsLoad" });
        }
    }

    setSaving(false);
    toast.success("Announcement posted!");
    setAnnouncements([data, ...announcements]);
    setForm({ title: "", message: "", audience: "All" });
    setSendSms(false);
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
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30" style={{ fontFamily: "Inter,sans-serif" }} />
        </div>
        <div className="flex items-center justify-between">
          <Sel label="Audience" value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value })}>
            {["All", "Pre-KG", "LKG", "UKG", "All Parents", "All Staff"].map(a => <option key={a}>{a}</option>)}
          </Sel>
          {/* Temporarily disabled Fast2SMS DLT routing
          <label className="flex items-center gap-2 cursor-pointer pr-4 mt-4">
            <input type="checkbox" checked={sendSms} onChange={e => setSendSms(e.target.checked)} className="w-4 h-4 text-[#d4af37] border-slate-300 rounded focus:ring-[#d4af37]" />
            <span className="text-xs font-bold text-slate-700" style={{ fontFamily: "Inter,sans-serif" }}>Also Broadcast via SMS</span>
          </label>
          */}
        </div>
        <button type="submit" disabled={saving} className="bg-[#d4af37] text-white font-bold text-xs px-5 py-2.5 rounded-lg disabled:opacity-60">{saving ? "Posting…" : "Post Announcement"}</button>
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


export default AnnouncementsPanel;
