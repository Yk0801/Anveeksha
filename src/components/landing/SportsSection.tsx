import { motion } from "framer-motion";

const sports = [
  { sport: "Football", coach: "Mr. Arun Goud", facilities: "Full-size ground, practice nets" },
  { sport: "Kabaddi", coach: "Mr. Kiran Rao", facilities: "Dedicated kabaddi court" },
  { sport: "Athletics", coach: "Mr. Arun Goud", facilities: "100m track, long jump pit" },
  { sport: "Cricket", coach: "Mr. Sudheer", facilities: "Practice pitch, batting cages" },
  { sport: "Kho-Kho", coach: "Mrs. Kavitha", facilities: "Outdoor kho-kho court" },
  { sport: "Yoga", coach: "Ms. Deepa Nair", facilities: "Dedicated yoga hall, mats" },
];

const achievements = [
  "🥇 District Level Kabaddi Champions – 2024",
  "🥈 State Athletics Meet – 2nd Place, Relay (U-8 Girls)",
  "🏆 Zonal Football Tournament Winners – 2023",
  "🎖️ Best Sports School Award – Jinnaram Block, 2024",
];

const SportsSection = () => (
  <section id="sports" className="py-20 bg-white">
    <div className="max-w-6xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <p className="text-[#F97316] font-semibold text-sm uppercase tracking-widest mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sports & Fitness</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sports at Sri Anveeksha</h2>
        <p className="text-slate-500 mt-3" style={{ fontFamily: "Inter, sans-serif" }}>
          Annual Sports Day: <span className="font-semibold text-slate-700">April 18, 2025</span>. All parents are warmly invited.
        </p>
      </motion.div>

      {/* Sport cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {sports.map((s, i) => (
          <motion.div key={s.sport} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="bg-slate-50 rounded-xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 flex items-center justify-center mb-3 text-xl">
              {["⚽","🤸","🏃","🏏","🏃","🧘"][i]}
            </div>
            <p className="font-bold text-slate-800 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.sport}</p>
            <p className="text-[#F97316] text-xs font-medium mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Coach: {s.coach}</p>
            <p className="text-slate-500 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{s.facilities}</p>
          </motion.div>
        ))}
      </div>

      {/* Achievements strip */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-r from-[#F97316]/5 to-[#4F46E5]/5 rounded-2xl p-6 border border-[#F97316]/10">
        <h3 className="font-bold text-slate-800 mb-4 text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recent Achievements</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {achievements.map((a, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-slate-700" style={{ fontFamily: "Inter, sans-serif" }}>
              <span>{a}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default SportsSection;
