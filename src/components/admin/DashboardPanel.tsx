import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronRight, ChevronLeft, Users, CheckSquare, List, DollarSign, MessageSquare, Clipboard, Calendar, Settings, FileText, Bus, UserCircle, Bell, X, Moon, LogOut, ChevronsLeft, ChevronsRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

import { hashPassword } from "@/lib/utils";
import { Student, AdminUserRow } from "./types";
import { SectionTitle, Inp, Sel, PaginationControls, EntriesDropdown } from "./SharedUI";

// ─── DASHBOARD ─────────────────────────────────────────────────────────────────
const DashboardPanel = () => {
  const [counts, setCounts] = useState({ total: 0, prekg: 0, lkg: 0, ukg: 0, staff: 0, pending: 0 });
  const [activity, setActivity] = useState<{ date: string; text: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: students }, { data: users }, { data: admissions }] = await Promise.all([
        supabase.from("students").select("id,class,status"),
        supabase.from("admin_users").select("id,role,is_active"),
        supabase.from("admissions_inquiries").select("id,status,parent_name,child_name,created_at").order("created_at", { ascending: false }).limit(5),
      ]);
      const s = students || [];
      const recentAdm = (admissions || []).map(a => ({
        date: new Date(a.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        text: `New admission inquiry — ${a.child_name || "—"} by ${a.parent_name || "—"}`,
      }));
      setCounts({
        total: s.length,
        prekg: s.filter(x => x.class === "Pre-KG").length,
        lkg: s.filter(x => x.class === "LKG").length,
        ukg: s.filter(x => x.class === "UKG").length,
        staff: (users || []).filter(u => u.role === "faculty" && u.is_active).length,
        pending: 0,
      });
      setActivity(recentAdm.length ? recentAdm : [{ date: "—", text: "No recent activity yet." }]);
      setLoading(false);
    };
    load();
  }, []);

  const boxes = [
    { label: "Total Students", value: counts.total },
    { label: "Pre-KG", value: counts.prekg },
    { label: "LKG", value: counts.lkg },
    { label: "UKG", value: counts.ukg },
    { label: "Active Faculty", value: counts.staff },
  ];

  return (
    <div>
      <SectionTitle>Dashboard</SectionTitle>
      {loading ? <p className="text-slate-500 text-sm">Loading...</p> : (
        <>
          <p className="text-sm text-slate-600 mb-5" style={{ fontFamily: "Inter,sans-serif" }}>
            Total Students: <strong>{counts.total}</strong> &nbsp;|&nbsp; Pre-KG: <strong>{counts.prekg}</strong> &nbsp;|&nbsp; LKG: <strong>{counts.lkg}</strong> &nbsp;|&nbsp; UKG: <strong>{counts.ukg}</strong> &nbsp;|&nbsp; Faculty: <strong>{counts.staff}</strong>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {boxes.map(b => (
              <div key={b.label} className="border border-slate-200 rounded-xl p-4 bg-white">
                <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{b.value}</p>
                <p className="text-slate-500 text-xs mt-1" style={{ fontFamily: "Inter,sans-serif" }}>{b.label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Recent Activity</p>
          <div className="divide-y divide-slate-100">
            {activity.map((a, i) => (
              <div key={i} className="py-2.5 flex items-start gap-3">
                <span className="text-xs text-slate-400 flex-shrink-0 w-28" style={{ fontFamily: "Inter,sans-serif" }}>{a.date}</span>
                <span className="text-sm text-slate-700" style={{ fontFamily: "Inter,sans-serif" }}>{a.text}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};


export default DashboardPanel;
