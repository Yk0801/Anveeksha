import { motion } from "framer-motion";

const routes = [
  { routeNo: "R-01", name: "Ootla – Jinnaram", areas: "Ootla, Bhanur, Chegunta", pickup: "7:30 AM", drop: "4:30 PM", driver: "Ramu Naik", mobile: "9876550001" },
  { routeNo: "R-02", name: "Sangareddy – Patancheru", areas: "Sangareddy, Manoharabad, Patancheru", pickup: "7:00 AM", drop: "5:00 PM", driver: "Venkat Reddy", mobile: "9876550002" },
  { routeNo: "R-03", name: "Narsapur – Sadasivpet", areas: "Narsapur, Ramachandrapuram, Sadasivpet", pickup: "7:15 AM", drop: "4:45 PM", driver: "Kishore Kumar", mobile: "9876550003" },
];

const safety = [
  { icon: "📍", label: "GPS Tracking", desc: "All buses equipped with real-time GPS tracking accessible by parents." },
  { icon: "🚨", label: "CCTV on Board", desc: "Internal cameras in all school buses for student safety." },
  { icon: "🩹", label: "First Aid Kit", desc: "Every bus carries a stocked first aid kit and emergency contact list." },
  { icon: "📞", label: "Driver Contact", desc: "Direct driver contact number available to parents at all times." },
];

const BusFacilitiesSection = () => (
  <section id="bus" className="py-20 bg-white">
    <div className="max-w-6xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <p className="text-[#F97316] font-semibold text-sm uppercase tracking-widest mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Transport</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Bus Facilities</h2>
        <p className="text-slate-500 mt-3" style={{ fontFamily: "Inter, sans-serif" }}>Safe, reliable, and GPS-tracked transportation for your child.</p>
      </motion.div>

      {/* Routes table */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm mb-10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F97316] text-white">
              {["Route No.", "Route Name", "Areas Covered", "Pickup Time", "Drop Time", "Driver", "Contact"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {routes.map((r, i) => (
              <tr key={r.routeNo} className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-orange-50 transition-colors`}>
                <td className="px-4 py-3 font-bold text-[#F97316]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{r.routeNo}</td>
                <td className="px-4 py-3 font-semibold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{r.name}</td>
                <td className="px-4 py-3 text-slate-600" style={{ fontFamily: "Inter, sans-serif" }}>{r.areas}</td>
                <td className="px-4 py-3 text-slate-600" style={{ fontFamily: "Inter, sans-serif" }}>{r.pickup}</td>
                <td className="px-4 py-3 text-slate-600" style={{ fontFamily: "Inter, sans-serif" }}>{r.drop}</td>
                <td className="px-4 py-3 text-slate-700" style={{ fontFamily: "Inter, sans-serif" }}>{r.driver}</td>
                <td className="px-4 py-3 text-[#4F46E5] font-medium" style={{ fontFamily: "Inter, sans-serif" }}>{r.mobile}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Safety features */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {safety.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="bg-slate-50 rounded-xl p-5 border border-slate-100">
            <div className="text-2xl mb-3">{s.icon}</div>
            <p className="font-bold text-slate-800 text-sm mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.label}</p>
            <p className="text-slate-500 text-xs leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BusFacilitiesSection;
