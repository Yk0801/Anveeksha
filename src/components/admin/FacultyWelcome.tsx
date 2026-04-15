import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronRight, ChevronLeft, Users, CheckSquare, List, DollarSign, MessageSquare, Clipboard, Calendar, Settings, FileText, Bus, UserCircle, Bell, X, Moon, LogOut, ChevronsLeft, ChevronsRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { hashPassword } from "@/lib/utils";
import { Student, AdminUserRow } from "./types";
import { SectionTitle, Inp, Sel, PaginationControls, EntriesDropdown } from "./SharedUI";

// ─── FACULTY WELCOME (restricted) ────────────────────────────────────────────
const FacultyWelcome = ({ name }: { name: string }) => (
  <div>
    <SectionTitle>Welcome, {name}</SectionTitle>
    <p className="text-sm text-slate-600 mb-4" style={{ fontFamily: "Inter,sans-serif" }}>You are logged in as Faculty. Use the menu on the left to mark attendance or add remarks for students.</p>
    <div className="border border-slate-200 rounded-xl p-5 bg-white">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Your Access</p>
      <ul className="space-y-2 text-sm text-slate-700" style={{ fontFamily: "Inter,sans-serif" }}>
        <li>✓ Mark daily attendance for any class</li>
        <li>✓ View attendance history for any student</li>
        <li>✓ Add academic and disciplinary remarks</li>
        <li>✗ Student registration, fees, admissions, announcements (admin only)</li>
      </ul>
    </div>
  </div>
);


export default FacultyWelcome;
