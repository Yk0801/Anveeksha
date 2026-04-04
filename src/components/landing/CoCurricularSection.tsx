import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Simplified list for the large image carousel
const carouselActivities = [
  { name: "Classical & Folk Dance", image: "/cocurricular_dance.png", desc: "Expressing emotions through movement, building grace and confidence." },
  { name: "Art & Craft", image: "/cocurricular_art.png", desc: "Nurturing creativity and fine motor skills through guided artistic expression." },
  { name: "Music & Vocals", image: "/cocurricular_music.png", desc: "Discovering rhythm, vocal training, and the joy of classical music." },
  { name: "Yoga & Wellness", image: "/cocurricular_sports.png", desc: "Morning sessions for physical health, mindfulness, and sharp focus." }
];

const CoCurricularSection = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % carouselActivities.length);
  const prev = () => setCurrent((prev) => (prev - 1 + carouselActivities.length) % carouselActivities.length);

  // Auto advance
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="cocurricular" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-[#F97316] font-semibold text-sm uppercase tracking-widest mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Beyond the Classroom</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Co-Curricular Activities</h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
            We nurture talent in every dimension — art, expression, movement, and wellness.
          </p>
        </motion.div>

        <div className="relative w-full max-w-5xl mx-auto aspect-[4/3] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl group">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <img src={carouselActivities[current].image} alt={carouselActivities[current].name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14 text-white z-10 pointer-events-none">
            <motion.h3 
              key={`th-${current}`}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-3xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#fff" }}
            >
              {carouselActivities[current].name}
            </motion.h3>
            <motion.p
              key={`tp-${current}`}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-white/80 max-w-2xl text-base md:text-lg" style={{ fontFamily: "Inter, sans-serif" }}
            >
              {carouselActivities[current].desc}
            </motion.p>
          </div>

          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 z-20">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 z-20">
            <ChevronRight className="w-7 h-7" />
          </button>
          
          <div className="absolute bottom-8 right-8 flex gap-2.5 z-20">
            {carouselActivities.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrent(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${i === current ? "bg-[#F97316] w-10 relative overflow-hidden" : "w-2.5 bg-white/50 hover:bg-white"}`}
              >
                {i === current && (
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 5, ease: "linear" }}
                    className="absolute inset-0 bg-white/40"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoCurricularSection;
