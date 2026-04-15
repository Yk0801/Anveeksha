import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronRight, ChevronLeft, Users, CheckSquare, List, DollarSign, MessageSquare, Clipboard, Calendar, Settings, FileText, Bus, UserCircle, Bell, X, Moon, LogOut, ChevronsLeft, ChevronsRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { hashPassword } from "@/lib/utils";
import { Student, AdminUserRow } from "./types";
import { SectionTitle, Inp, Sel, PaginationControls, EntriesDropdown } from "./SharedUI";

// ─── REPORTS ─────────────────────────────────────────────────────────────────
const ReportsPanel = () => {
  const [active, setActive] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [classFilter, setClassFilter] = useState("");

  const loadReport = async (id: string) => {
    setActive(id); setData([]);
    if (id === "strength") {
      const { data: d } = await supabase.from("students").select("name,class,section,admission_no,status").order("class");
      setData(d || []);
    } else if (id === "fees") {
      const { data: d } = await supabase.from("fees").select("*, students(name,class)").eq("status", "Pending");
      setData(d || []);
    } else if (id === "remarks") {
      const { data: d } = await supabase.from("remarks").select("*, students(name,class)").order("created_at", { ascending: false }).limit(50);
      setData(d || []);
    }
  };

  const reports = [
    { id: "strength", label: "Student Strength Report" },
    { id: "fees", label: "Outstanding Fees Report" },
    { id: "remarks", label: "Remarks Report (last 50)" },
  ];

  return (
    <div>
      <SectionTitle>Reports</SectionTitle>
      <div className="space-y-2 mb-6">
        {reports.map(r => (
          <button key={r.id} onClick={() => loadReport(r.id)} className="w-full flex items-center justify-between text-left px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <span className="font-semibold text-slate-800 text-sm" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{r.label}</span>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${active === r.id ? "rotate-90" : ""}`} />
          </button>
        ))}
      </div>
      {active && data.length > 0 && (
        <div className="overflow-x-auto">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{reports.find(r => r.id === active)?.label}</p>
            <button onClick={() => { const csv = data.map(d => Object.values(d).join(",")).join("\n"); const b = new Blob([csv], { type: "text/csv" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `${active}_report.csv`; a.click(); }} className="border border-slate-300 text-slate-600 font-bold text-xs px-4 py-2 rounded-lg hover:bg-slate-50">Export CSV</button>
          </div>
          <table className="portal-table">
            <thead><tr>{Object.keys(data[0]).filter(k => !k.includes("_id") && k !== "id").map(k => <th key={k}>{k.replace(/_/g, " ")}</th>)}</tr></thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>{Object.entries(row).filter(([k]) => !k.includes("_id") && k !== "id").map(([k, v]) => <td key={k}>{typeof v === "object" ? JSON.stringify(v) : String(v ?? "—")}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


export default ReportsPanel;
