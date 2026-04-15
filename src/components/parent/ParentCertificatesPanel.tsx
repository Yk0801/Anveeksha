import React, { useState, useEffect } from "react";
import { CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-black uppercase tracking-[0.15em] text-[#d4af37] mb-4 pb-2 border-b border-slate-100" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
    {children}
  </h3>
);

const ParentCertificatesPanel = () => {
  const { parentStudentId } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [purpose, setPurpose] = useState("Higher Education");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!parentStudentId) return;
    supabase.from("certificate_requests").select("*").eq("student_id", parentStudentId).order("request_date", { ascending: false }).then(({ data }) => {
      if (data) setRequests(data);
    });
  }, [parentStudentId]);

  const handleSubmit = async () => {
    if (!parentStudentId) return;
    setLoading(true);
    const { data, error } = await supabase.from("certificate_requests").insert([{
      student_id: parentStudentId,
      purpose,
      status: "Pending",
      request_date: new Date().toISOString()
    }]).select().single();
    
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Certificate request submitted!");
      setRequests([data, ...requests]);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <SectionTitle>Study Certificate Request</SectionTitle>
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Purpose of Request</label>
          <select value={purpose} onChange={e => setPurpose(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold bg-white focus:outline-none focus:border-[#d4af37]">
            <option>Higher Education</option>
            <option>Passport Application</option>
            <option>Visa Processing</option>
            <option>Address Proof</option>
            <option>Other</option>
          </select>
        </div>
        <div className="flex items-end">
          <button disabled={loading} onClick={handleSubmit} className="w-full md:w-auto px-6 py-2.5 bg-[#d4af37] text-white font-bold text-sm rounded-lg hover:bg-[#c49e29] transition-colors whitespace-nowrap disabled:opacity-50">
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-xs font-black tracking-widest text-slate-400 uppercase mb-2">Previous Requests</p>
        {requests.map(r => (
          <div key={r.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-xl bg-white shadow-sm">
            <div>
              <p className="font-bold text-slate-900 text-sm">{r.purpose}</p>
              <p className="text-xs text-slate-400 font-medium">Requested on {new Date(r.request_date).toLocaleDateString("en-GB")}</p>
            </div>
            <span className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full ${r.status === "Approved" ? "bg-emerald-100 text-emerald-700" : r.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-gold-100 text-gold-700"}`}>
              {r.status === "Approved" ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />} {r.status}
            </span>
          </div>
        ))}
        {requests.length === 0 && <p className="text-center text-slate-400 text-sm py-4">No previous requests found.</p>}
      </div>
    </div>
  );
};

export default ParentCertificatesPanel;
