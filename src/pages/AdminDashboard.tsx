import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ADMIN_MENU = [
  { id: "dashboard", label: "Dashboard", roles: ["superadmin", "admin"] },
  { id: "students", label: "Students", roles: ["superadmin", "admin", "faculty"] },
  { id: "attendance", label: "Attendance", roles: ["superadmin", "admin", "faculty"] },
  { id: "fee", label: "Fee Management", roles: ["superadmin", "admin"] },
  { id: "marks", label: "Marks", roles: ["superadmin", "admin", "faculty"] },
  { id: "remarks", label: "Remarks", roles: ["superadmin", "admin", "faculty"] },
  { id: "admissions", label: "Admissions", roles: ["superadmin", "admin"] },
  { id: "announcements", label: "Announcements", roles: ["superadmin", "admin"] },
  { id: "bus", label: "Bus Management", roles: ["superadmin", "admin"] },
  { id: "staff", label: "Staff", roles: ["superadmin", "admin"] },
  { id: "manage-users", label: "Manage Users", roles: ["superadmin", "admin"] },
  { id: "reports", label: "Reports", roles: ["superadmin", "admin"] },
  { id: "settings", label: "Settings", roles: ["superadmin", "admin"] },
];

const AdminDashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { adminUser, isFaculty, logout } = useAuth();

  // Extract active path segment (e.g. "students" from "/admin/students")
  const active = location.pathname.split("/").pop() || "";

  useEffect(() => {
    if (!adminUser) navigate("/login?role=admin");
  }, [adminUser, navigate]);

  if (!adminUser) return null;

  const visibleMenu = ADMIN_MENU.filter(m => m.roles.includes(adminUser.role));

  const handleLogout = () => { logout(); navigate("/"); };

  const SidebarContent = () => (
    <>
      <div className="px-5 py-5 border-b border-slate-100">
        <p className="text-[10px] font-black tracking-[0.2em] text-[#d4af37] uppercase mb-3" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          {isFaculty ? "Faculty Portal" : "Admin Portal"}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gold-50 border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] font-bold text-xs flex-shrink-0">
            {adminUser.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{adminUser.name}</p>
            <p className="text-[10px] text-slate-400 truncate capitalize" style={{ fontFamily: "Inter,sans-serif" }}>{adminUser.role} {adminUser.designation ? `· ${adminUser.designation}` : ""}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {visibleMenu.map(item => (
          <Link key={item.id} to={`/admin/${item.id}`} onClick={() => setMobileMenuOpen(false)}
            className={`w-full flex items-center text-left px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${active === item.id ? "bg-gold-50 text-[#d4af37] shadow-[inset_3px_0_0_0_#d4af37]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
            style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            <ChevronRight className={`w-3.5 h-3.5 mr-2.5 transition-transform ${active === item.id ? "rotate-90 text-[#d4af37]" : "text-slate-300"}`} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-100">
        <button onClick={handleLogout} className="w-full text-center px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 hover:text-[#d4af37] hover:border-[#d4af37]/30 font-bold tracking-wide uppercase transition-all" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Sign Out</button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileMenuOpen(true)} className="p-1.5 -ml-1.5 text-slate-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div>
            <span className="text-xs font-black tracking-widest text-[#d4af37] uppercase" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              {isFaculty ? "Faculty" : "Admin"} Portal
            </span>
            <span className="text-[10px] text-slate-400 block" style={{ fontFamily: "Inter,sans-serif" }}>{adminUser.name}</span>
          </div>
        </div>
        <select value={active} onChange={e => navigate(`/admin/${e.target.value}`)} className="border border-slate-200 bg-slate-50 text-slate-800 rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          {visibleMenu.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
        </select>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && <div className="fixed inset-0 bg-slate-900/40 z-50 md:hidden" onClick={() => setMobileMenuOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 md:hidden ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <span className="text-xs font-black tracking-widest text-[#d4af37] uppercase" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Menu</span>
          <button onClick={() => setMobileMenuOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
        </div>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-slate-200 bg-white flex-shrink-0 sticky top-0 h-screen overflow-y-auto z-30">
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="flex-1 pt-20 md:pt-6 md:px-8 px-4 pb-12 overflow-x-auto">
        <div className="max-w-6xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;