import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronRight, ChevronLeft, Users, CheckSquare, List, DollarSign, MessageSquare, Clipboard, Calendar, Settings, FileText, Bus, UserCircle, Bell, X, Moon, LogOut, ChevronsLeft, ChevronsRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

import { hashPassword } from "@/lib/utils";
import { Student, AdminUserRow } from "./types";
import { SectionTitle, Inp, Sel, PaginationControls, EntriesDropdown } from "./SharedUI";

// ─── ADMISSIONS ───────────────────────────────────────────────────────────────
const AdmissionsPanel = () => {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    supabase.from("admissions_inquiries").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setInquiries(data || []);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("admissions_inquiries").update({ status }).eq("id", id);
    setInquiries(inquiries.map(a => a.id === id ? { ...a, status } : a));
  };

  const filtered = inquiries.filter(a => !statusFilter || a.status === statusFilter);
  const statusColor: Record<string, string> = { New: "text-navy-500", Reviewing: "text-amber-600", Accepted: "text-emerald-600", Rejected: "text-red-500" };

  return (
    <div>
      <SectionTitle>Admissions</SectionTitle>
      <div className="flex gap-3 mb-4">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none" style={{ fontFamily: "Inter,sans-serif" }}>
          <option value="">All Status</option>
          {["New", "Reviewing", "Accepted", "Rejected"].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      {loading ? <p className="text-slate-400 text-sm">Loading…</p> : (
        <table className="portal-table">
          <thead><tr><th>#</th><th>Parent</th><th>Child</th><th>Class</th><th>Phone</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {filtered.map((a, i) => (
              <tr key={a.id}>
                <td>{i + 1}</td>
                <td className="font-medium">{a.parent_name}</td>
                <td>{a.child_name}</td>
                <td>{a.class}</td>
                <td>{a.phone}</td>
                <td>{new Date(a.created_at).toLocaleDateString("en-GB")}</td>
                <td>
                  <select value={a.status || "New"} onChange={e => updateStatus(a.id, e.target.value)}
                    className={`border rounded px-2 py-1 text-xs font-bold focus:outline-none bg-white ${statusColor[a.status] || ""}`}
                    style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                    {["New", "Reviewing", "Accepted", "Rejected"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td>{a.status === "Accepted" && <button onClick={() => toast.success("Offer letter sent (email service needed).")} className="text-[#d4af37] text-xs font-medium hover:underline">Send Offer</button>}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} className="text-center py-4 text-slate-400">No inquiries yet.</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
};


export default AdmissionsPanel;
