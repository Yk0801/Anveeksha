import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LogOut, ChevronRight, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const ParentDashboard = () => {
  const { parentStudentId, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");

  const active = location.pathname.split("/").pop() || "profile";

  useEffect(() => {
    if (!parentStudentId) navigate("/login");
    else {
      supabase.from("students").select("name, class, section").eq("id", parentStudentId).single().then(({ data }) => {
        if (data) {
          setStudentName(data.name);
          setStudentClass(`${data.class}-${data.section}`);
        }
      });
    }
  }, [parentStudentId, navigate]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out safely");
    navigate("/");
  };

  const navItems = [
    { id: "profile", label: "Student Profile" },
    { id: "attendance", label: "Attendance" },
    { id: "marks", label: "Marks & Grades" },
    { id: "fees", label: "Fee Details" },
    { id: "remarks", label: "Academic Remarks" },
    { id: "notices", label: "Notices & Circulars" },
    { id: "certificates", label: "Study Certificate Request" },
    { id: "settings", label: "Profile Settings" }
  ];

  const SidebarContent = () => (
    <>
      <div className="px-5 py-5 border-b border-slate-100 text-center">
        <div className="w-12 h-12 mx-auto rounded-xl bg-gold-50 border border-gold-100 flex items-center justify-center text-gold-600 font-bold mb-3">
          {studentName ? studentName.split(" ").map((n: string) => n[0]).slice(0, 2).join("") : "?"}
        </div>
        <p className="text-sm font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{studentName}</p>
        <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold mt-1">Class {studentClass}</p>
      </div>
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(item => (
          <Link key={item.id} to={`/parent/${item.id}`} onClick={() => setMobileMenuOpen(false)}
            className={`w-full flex items-center text-left px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${active === item.id || (active === "parent" && item.id === "profile") ? "bg-gold-50 text-[#d4af37] shadow-[inset_3px_0_0_0_#d4af37]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
            style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            <ChevronRight className={`w-3.5 h-3.5 mr-2.5 transition-transform ${active === item.id || (active === "parent" && item.id === "profile") ? "rotate-90 text-[#d4af37]" : "text-slate-300"}`} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-100">
        <button onClick={handleLogout} className="w-full flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 hover:text-[#d4af37] hover:border-[#d4af37]/30 font-bold tracking-wide uppercase transition-all">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row">
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileMenuOpen(true)} className="p-1.5 -ml-1.5 text-slate-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div>
            <span className="text-xs font-black tracking-widest text-[#d4af37] uppercase" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Parent Portal
            </span>
            <span className="text-[10px] text-slate-400 block font-medium uppercase">{studentName}</span>
          </div>
        </div>
      </div>

      {mobileMenuOpen && <div className="fixed inset-0 bg-slate-900/40 z-50 md:hidden" onClick={() => setMobileMenuOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 md:hidden ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <span className="text-xs font-black tracking-widest text-[#d4af37] uppercase" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Portal Menu</span>
          <button onClick={() => setMobileMenuOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
        </div>
        <SidebarContent />
      </aside>

      <aside className="hidden md:flex flex-col w-60 border-r border-slate-200 bg-white flex-shrink-0 sticky top-0 h-screen overflow-y-auto z-30">
        <SidebarContent />
      </aside>

      <main className="flex-1 pt-20 md:pt-8 px-4 md:px-10 pb-12 overflow-x-auto min-h-screen">
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#d4af37] text-white flex items-center justify-center font-black text-xl shadow-lg border border-gold-600/20">
              {studentName ? studentName[0] : "?"}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{studentName}</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Class {studentClass}</p>
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;