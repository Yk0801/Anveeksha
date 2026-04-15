import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronRight, ChevronLeft, Users, CheckSquare, List, DollarSign, MessageSquare, Clipboard, Calendar, Settings, FileText, Bus, UserCircle, Bell, X, Moon, LogOut, ChevronsLeft, ChevronsRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { hashPassword } from "@/lib/utils";
import { Student, AdminUserRow } from "./types";
import { SectionTitle, Inp, Sel, PaginationControls, EntriesDropdown } from "./SharedUI";

// ─── BUS MANAGEMENT ───────────────────────────────────────────────────────────
const BusPanel = () => {
  const [routes, setRoutes] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ route_no: "", route_name: "", areas: "", pickup_time: "", drop_time: "", driver_name: "", driver_mobile: "" });

  useEffect(() => {
    supabase.from("bus_routes").select("*").order("route_no").then(({ data }) => setRoutes(data || []));
  }, []);

  const addRoute = async () => {
    const { data, error } = await supabase.from("bus_routes").insert([form]).select().single();
    if (error) { toast.error(error.message); return; }
    setRoutes([...routes, data]);
    setShowAdd(false); setForm({ route_no: "", route_name: "", areas: "", pickup_time: "", drop_time: "", driver_name: "", driver_mobile: "" });
    toast.success("Route added!");
  };

  const del = async (id: string) => {
    await supabase.from("bus_routes").delete().eq("id", id);
    setRoutes(routes.filter(r => r.id !== id));
    toast.success("Route deleted.");
  };

  return (
    <div>
      <SectionTitle>Bus Management</SectionTitle>
      <button onClick={() => setShowAdd(v => !v)} className="bg-[#d4af37] text-white font-bold text-xs px-4 py-2 rounded-lg mb-4">+ Add Route</button>
      {showAdd && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 grid sm:grid-cols-2 gap-3">
          {[["Route No.", "route_no"], ["Route Name", "route_name"], ["Areas Covered", "areas"], ["Pickup Time", "pickup_time"], ["Drop Time", "drop_time"], ["Driver Name", "driver_name"], ["Driver Mobile", "driver_mobile"]].map(([l, k]) => (
            <Inp key={k} label={l} value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} />
          ))}
          <div className="sm:col-span-2 flex gap-3">
            <button onClick={addRoute} className="bg-[#d4af37] text-white font-bold text-xs px-5 py-2 rounded-lg">Save Route</button>
            <button onClick={() => setShowAdd(false)} className="border border-slate-300 text-slate-600 font-bold text-xs px-4 py-2 rounded-lg">Cancel</button>
          </div>
        </div>
      )}
      <table className="portal-table">
        <thead><tr><th>No.</th><th>Name</th><th>Areas</th><th>Pickup</th><th>Drop</th><th>Driver</th><th>Mobile</th><th>Del</th></tr></thead>
        <tbody>
          {routes.map(r => (
            <tr key={r.id}>
              <td className="font-bold text-[#d4af37]">{r.route_no}</td>
              <td>{r.route_name}</td><td>{r.areas}</td><td>{r.pickup_time}</td><td>{r.drop_time}</td><td>{r.driver_name}</td><td>{r.driver_mobile}</td>
              <td><button onClick={() => del(r.id)} className="text-red-400 text-xs font-medium hover:underline">Delete</button></td>
            </tr>
          ))}
          {routes.length === 0 && <tr><td colSpan={8} className="text-center py-3 text-slate-400">No routes added yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};


export default BusPanel;
