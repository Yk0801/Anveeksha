import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const sportsCarousel = [
  { sport: "Cricket", image: "/cricket.jpeg", coach: "Mr. Sudheer", facilities: "Practice pitch, batting cages" },
  { sport: "Kabaddi", image: "/kabaddi.jpeg", coach: "Mr. Kiran Rao", facilities: "Dedicated kabaddi court" },
  { sport: "Athletics", image: "/running.jpeg", coach: "Mr. Arun Goud", facilities: "100m track, long jump pit" },
  { sport: "Football", image: "/football.jpeg", coach: "Mr. Arun Goud", facilities: "Full-size ground, practice nets" },
];

const achievements = [
  "🥇 District Level Kabaddi Champions – 2024",
  "🥈 State Athletics Meet – 2nd Place, Relay (U-8 Girls)",
  "🏆 Zonal Football Tournament Winners – 2023",
  "🎖️ Best Sports School Award – Jinnaram Block, 2024",
];

const SportsSection = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % sportsCarousel.length);
  const prev = () => setCurrent((prev) => (prev - 1 + sportsCarousel.length) % sportsCarousel.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="sports" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-[#F97316] font-semibold text-sm uppercase tracking-widest mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sports & Fitness</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sports at Sri Anveeksha</h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
            Annual Sports Day: <span className="font-semibold text-slate-700">April 18, 2025</span>. All parents are warmly invited.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative w-full max-w-5xl mx-auto aspect-[4/3] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl group mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img src={sportsCarousel[current].image} alt={sportsCarousel[current].sport} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)" }} />

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <h3 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {sportsCarousel[current].sport}
                </h3>
                <p className="text-white/90 text-sm md:text-base max-w-2xl font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                  Coach: {sportsCarousel[current].coach} <br className="md:hidden" /> <span className="hidden md:inline"> | </span> {sportsCarousel[current].facilities}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-[#F97316] backdrop-blur-md flex items-center justify-center text-white transition-colors opacity-0 group-hover:opacity-100">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-[#F97316] backdrop-blur-md flex items-center justify-center text-white transition-colors opacity-0 group-hover:opacity-100">
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 right-6 md:right-10 flex gap-2">
            {sportsCarousel.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-[#F97316] w-8" : "bg-white/50 hover:bg-white"}`} />
            ))}
          </div>
        </div>

        {/* Achievements strip */}
        {/* <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-to-r from-[#F97316]/5 to-[#4F46E5]/5 rounded-2xl p-6 border border-[#F97316]/10">
          <h3 className="font-bold text-slate-800 mb-4 text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recent Achievements</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {achievements.map((a, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-700 bg-white/50 backdrop-blur-sm p-3 rounded-lg border border-white/50" style={{ fontFamily: "Inter, sans-serif" }}>
                <span>{a}</span>
              </div>
            ))}
          </div>
        </motion.div> */}
      </div>
    </section>
  );
};

export default SportsSection;
