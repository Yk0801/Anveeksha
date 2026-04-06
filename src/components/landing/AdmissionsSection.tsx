import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

const timeline = [
  { label: "Application Opens", date: "May 1, 2026" },
  { label: "Last Date to Apply", date: "May 30, 2026" },
  { label: "Classes Begin", date: "Jun 12, 2026" },
];

const eligibility = [
  { cls: "Pre-KG", age: "3 – 4 years (as of June 1, 2026)" },
  { cls: "LKG", age: "4 – 5 years (as of June 1, 2026)" },
  { cls: "UKG", age: "5 – 6 years (as of June 1, 2026)" },
];

const documents = [
  "Birth Certificate (original + 1 copy)",
  "Aadhar card of child",
  "Parent's Aadhar card (both)",
  "4 recent passport-size photos",
  "Residential proof (electricity bill / ration card)",
  "For transfer cases: Transfer Certificate from previous school",
  "Medical / immunization records",
];

const AdmissionsSection = () => {
  const [formData, setFormData] = useState({ parentName: "", childName: "", class: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openDocs, setOpenDocs] = useState(false);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="admissions" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-to-r from-[#F97316] to-[#4F46E5] rounded-2xl p-8 text-center text-white mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest opacity-80 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Enroll Today</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Admissions open for 2026–27
          </h2>
          <p className="opacity-80 text-lg" style={{ fontFamily: "Inter, sans-serif" }}>Limited seats available. Secure your child's future today.</p>
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <button onClick={() => document.querySelector("#admission-form")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-[#F97316] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#ea580c] transition-all hover:scale-105"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Apply Online
            </button>
            <button className="border-2 border-white text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-all"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Download Brochure
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            {/* Timeline */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 className="font-bold text-slate-900 text-xl mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Key Dates for 2025–26</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
                {timeline.map((t, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="flex gap-4 mb-5 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 flex-shrink-0 border-2 ${i <= 2 ? "bg-[#F97316] border-[#F97316] text-white" : "bg-white border-slate-300 text-slate-500"
                      }`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{i + 1}</div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.label}</p>
                      <p className="text-slate-500 text-xs mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>{t.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Eligibility */}
            <div>
              <h3 className="font-bold text-slate-900 text-xl mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Age Eligibility</h3>
              <div className="space-y-2">
                {eligibility.map((e) => (
                  <div key={e.cls} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <span className="font-bold text-[#F97316] w-14 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{e.cls}</span>
                    <span className="text-slate-600 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>{e.age}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents Checklist */}
            <div>
              <button onClick={() => setOpenDocs(!openDocs)}
                className="flex items-center justify-between w-full font-bold text-slate-900 text-lg mb-3 text-left"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <span>Documents Required</span>
                {openDocs ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>
              {openDocs && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="space-y-2">
                  {documents.map((d, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#F97316]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#F97316]" />
                      </div>
                      <span className="text-slate-600 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>{d}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Inquiry Form */}
          <motion.div id="admission-form" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="bg-slate-50 rounded-2xl p-7 border border-slate-100">
            <h3 className="font-bold text-slate-900 text-xl mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Admission Inquiry</h3>
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-[#F97316]/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-[#F97316]" />
                </div>
                <p className="font-bold text-slate-800 text-lg mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Inquiry Received!</p>
                <p className="text-slate-500 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>We'll contact you within 1–2 working days.</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-[#F97316] font-medium text-sm hover:underline">Submit another</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                {[
                  { label: "Parent Name", name: "parentName", type: "text", placeholder: "Your full name" },
                  { label: "Child's Name", name: "childName", type: "text", placeholder: "Child's full name" },
                  { label: "Phone Number", name: "phone", type: "tel", placeholder: "+91 XXXXX XXXXX" },
                  { label: "Email Address", name: "email", type: "email", placeholder: "you@email.com" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm font-semibold text-slate-700 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.label}</label>
                    <input type={f.type} name={f.name} placeholder={f.placeholder} required
                      value={formData[f.name as keyof typeof formData]} onChange={handle}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316]"
                      style={{ fontFamily: "Inter, sans-serif" }} />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Class Applying For</label>
                  <select name="class" required value={formData.class} onChange={handle}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316]"
                    style={{ fontFamily: "Inter, sans-serif" }}>
                    <option value="">Select class</option>
                    {["Pre-KG", "LKG", "UKG"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Message (optional)</label>
                  <textarea name="message" rows={3} placeholder="Any specific questions?"
                    value={formData.message} onChange={handle}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316]"
                    style={{ fontFamily: "Inter, sans-serif" }} />
                </div>
                <button type="submit" className="btn-coral w-full py-3 rounded-xl font-bold text-sm">
                  Submit Inquiry →
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AdmissionsSection;
