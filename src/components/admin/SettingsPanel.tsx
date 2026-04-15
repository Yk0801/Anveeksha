import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { SectionTitle, Inp } from "./SharedUI";

const SettingsPanel = () => {
  const [open, setOpen] = useState<string | null>("school");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", address: "", phone: "", email: "",
    academic_start_date: "", academic_end_date: "",
  });

  useEffect(() => {
    supabase.from("school_settings").select("*").eq("id", 1).single().then(({ data }) => {
      if (data) {
        setForm({
          name: data.name || "",
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          academic_start_date: data.academic_start_date || "",
          academic_end_date: data.academic_end_date || "",
        });
      }
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    // Upsert will create it if id=1 doesn't exist. Sending full form prevents NOT NULL constraint errors.
    const { error } = await supabase.from("school_settings").upsert({ id: 1, ...form });
    setLoading(false);
    if (error) {
      toast.error("Failed to save settings: " + error.message);
    } else {
      toast.success("Settings saved successfully!");
    }
  };

  return (
    <div>
      <SectionTitle>Global Settings</SectionTitle>
      <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
        {[
          {
            id: "school", label: "School Info",
            content: (
              <div className="grid sm:grid-cols-2 gap-3">
                <Inp label="School Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <Inp label="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                <Inp label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                <Inp label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <div className="sm:col-span-2">
                  <button disabled={loading} onClick={handleSave} className="bg-[#d4af37] text-white font-bold text-xs px-5 py-2 rounded-lg hover:bg-[#c49e29]">
                    {loading ? "Saving..." : "Save School Info"}
                  </button>
                </div>
              </div>
            )
          },
          {
            id: "year", label: "Academic Year",
            content: (
              <div className="flex gap-4 flex-wrap">
                <Inp label="Start Date" type="date" value={form.academic_start_date} onChange={e => setForm({ ...form, academic_start_date: e.target.value })} />
                <Inp label="End Date" type="date" value={form.academic_end_date} onChange={e => setForm({ ...form, academic_end_date: e.target.value })} />
                <div className="w-full">
                  <button disabled={loading} onClick={handleSave} className="bg-[#d4af37] text-white font-bold text-xs px-5 py-2 rounded-lg hover:bg-[#c49e29]">
                    {loading ? "Saving..." : "Save Academic Year"}
                  </button>
                </div>
              </div>
            )
          },
        ].map(sec => (
          <div key={sec.id}>
            <button onClick={() => setOpen(open === sec.id ? null : sec.id)} className="flex items-center justify-between w-full px-4 py-3 bg-white text-left hover:bg-slate-50" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              <span className="font-bold text-slate-700 text-xs uppercase tracking-wider">{sec.label}</span>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open === sec.id ? "rotate-90" : ""}`} />
            </button>
            {open === sec.id && <div className="p-4 bg-white border-t border-slate-100">{sec.content}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPanel;
