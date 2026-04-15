import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { supabase } from "@/lib/supabase";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-black uppercase tracking-[0.15em] text-[#d4af37] mb-4 pb-2 border-b border-slate-100" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
    {children}
  </h3>
);

const ParentNoticesPanel = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("announcements").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setAnnouncements(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-6 text-slate-500">Loading notices...</div>;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <SectionTitle>Notices & Circulars</SectionTitle>
      <div className="space-y-4">
        {announcements.map((a: any) => (
          <div key={a.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
            <div className="flex gap-3">
              <Bell className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{a.title}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">{new Date(a.created_at).toLocaleDateString("en-GB")} · Audience: {a.audience}</p>
                <p className="text-sm text-slate-700 leading-relaxed font-medium" style={{ fontFamily: "Inter,sans-serif" }}>{a.message}</p>
              </div>
            </div>
          </div>
        ))}
        {announcements.length === 0 && <p className="text-slate-400 text-sm text-center py-4">No announcements.</p>}
      </div>
    </div>
  );
};

export default ParentNoticesPanel;
