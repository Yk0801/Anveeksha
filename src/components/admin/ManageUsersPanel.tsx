import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronRight, ChevronLeft, Users, CheckSquare, List, DollarSign, MessageSquare, Clipboard, Calendar, Settings, FileText, Bus, UserCircle, Bell, X, Moon, LogOut, ChevronsLeft, ChevronsRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { hashPassword } from "@/lib/utils";
import { Student, AdminUserRow } from "./types";
import { SectionTitle, Inp, Sel, PaginationControls, EntriesDropdown } from "./SharedUI";

// ─── MANAGE USERS (Faculty + Admin) ──────────────────────────────────────────
const ManageUsersPanel = () => {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const [form, setForm] = useState({ email: "", name: "", role: "faculty", designation: "", subject: "", mobile: "" });
  const [saving, setSaving] = useState(false);
  const { adminUser } = useAuth();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("admin_users").select("*").order("created_at", { ascending: false });
    setUsers((data as AdminUserRow[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const addUser = async () => {
    if (!form.email || !form.name) { toast.error("Email and Name are required."); return; }
    setSaving(true);
    const hashedPwd = await hashPassword("Welcome@123");
    const { error } = await supabase.from("admin_users").insert([{
      email: form.email.trim().toLowerCase(), name: form.name, role: form.role,
      designation: form.designation, subject: form.subject, mobile: form.mobile,
      password: hashedPwd, must_change_password: true, is_active: true,
      created_by: adminUser?.id,
    }]);
    setSaving(false);
    if (error) { toast.error(error.message.includes("unique") ? "This email is already registered." : error.message); return; }
    toast.success(`${form.role === "faculty" ? "Faculty" : "Admin"} added! Default password: Welcome@123`);
    setShowForm(false); setForm({ email: "", name: "", role: "faculty", designation: "", subject: "", mobile: "" });
    fetchUsers();
  };

  const toggleActive = async (u: AdminUserRow) => {
    if (u.email === adminUser?.email) { toast.error("You cannot deactivate your own account."); return; }
    await supabase.from("admin_users").update({ is_active: !u.is_active }).eq("id", u.id);
    fetchUsers();
    toast.success(`Account ${u.is_active ? "deactivated" : "activated"}.`);
  };

  const filtered = users.filter(u => !roleFilter || u.role === roleFilter);
  const roleBadge: Record<string, string> = { superadmin: "text-purple-600", admin: "text-navy-600", faculty: "text-emerald-600" };

  return (
    <div>
      <SectionTitle>Manage Users (Admin & Faculty)</SectionTitle>
      <div className="flex flex-wrap gap-3 mb-5">
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ fontFamily: "Inter,sans-serif" }}>
          <option value="">All Roles</option>
          <option value="superadmin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="faculty">Faculty</option>
        </select>
        <button onClick={() => setShowForm(v => !v)} className="bg-[#d4af37] text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-[#c49e29]">+ Add Faculty / Admin</button>
      </div>

      {showForm && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-5">
          <div className="flex justify-between items-center mb-4">
            <p className="text-xs font-black uppercase tracking-widest text-[#d4af37]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Add New User</p>
            <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-slate-400" /></button>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            <Inp label="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Inp label="Email Address *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <Sel label="Role *" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="faculty">Faculty (restricted access)</option>
              <option value="admin">Admin (full access)</option>
            </Sel>
            <Inp label="Designation" placeholder="e.g. Class Teacher LKG-A" value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} />
            <Inp label="Subject" placeholder="e.g. English, Maths" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
            <Inp label="Mobile" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4">
            <p className="text-xs text-amber-700 font-medium" style={{ fontFamily: "Inter,sans-serif" }}>
              Default password will be <strong>Welcome@123</strong>. The user will be asked to change it on first login. Faculty accounts can only access Attendance and Remarks pages.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={addUser} disabled={saving} className="bg-[#d4af37] text-white font-bold text-xs px-6 py-2.5 rounded-lg disabled:opacity-60">{saving ? "Adding…" : "Add User"}</button>
            <button onClick={() => setShowForm(false)} className="border border-slate-300 text-slate-600 font-bold text-xs px-5 py-2.5 rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      {loading ? <p className="text-slate-400 text-sm">Loading users…</p> : (
        <table className="portal-table">
          <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Designation</th><th>Status</th><th>Pwd Set</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id}>
                <td>{i + 1}</td>
                <td className="font-medium">{u.name}</td>
                <td>{u.email}</td>
                <td><span className={`font-bold ${roleBadge[u.role] || ""}`}>{u.role}</span></td>
                <td>{u.designation || "—"}</td>
                <td><span className={u.is_active ? "status-present" : "status-absent"}>{u.is_active ? "Active" : "Inactive"}</span></td>
                <td><span className={u.must_change_password ? "status-pending" : "status-paid"}>{u.must_change_password ? "Pending" : "Set"}</span></td>
                <td>
                  {u.email !== adminUser?.email && (
                    <button onClick={() => toggleActive(u)} className="text-slate-500 text-xs font-medium hover:underline">
                      {u.is_active ? "Deactivate" : "Activate"}
                    </button>
                  )}
                  {u.email === adminUser?.email && <span className="text-xs text-slate-300">You</span>}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} className="text-center py-4 text-slate-400">No users found.</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
};


export default ManageUsersPanel;
