import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronRight, ChevronLeft, Users, CheckSquare, List, DollarSign, MessageSquare, Clipboard, Calendar, Settings, FileText, Bus, UserCircle, Bell, X, Moon, LogOut, ChevronsLeft, ChevronsRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { hashPassword } from "@/lib/utils";
import { Student, AdminUserRow } from "./types";
import { SectionTitle, Inp, Sel, PaginationControls, EntriesDropdown } from "./SharedUI";

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
      <button onClick={() => setShowForm(v => !v)} className="bg-[#d4af37] text-white font-bold text-xs px-4 py-2 rounded-lg mb-4">+ Add Staff</button>
      {showForm && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 grid sm:grid-cols-2 gap-3">
          <Inp label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Inp label="Designation" value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} />
          <Inp label="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
          <Inp label="Mobile" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />
          <Inp label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <div className="sm:col-span-2 flex gap-3">
            <button onClick={addStaff} className="bg-[#d4af37] text-white font-bold text-xs px-5 py-2 rounded-lg">Save</button>
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


export default StaffPanel;
