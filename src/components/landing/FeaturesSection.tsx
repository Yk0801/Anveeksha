import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const features = [
  {
    title: "Smart Classrooms",
    desc: "Interactive digital whiteboards and projectors in every class to make learning visual and engaging.",
    image: "/feature_smartclass.png"
  },
  {
    title: "Activity-Based Learning",
    desc: "Hands-on projects and experiments that allow children to understand concepts practically.",
    image: "/feature_activities.png"
  },
  {
    title: "Individual Attention",
    desc: "Small class sizes ensure our caring teachers can focus on each child's unique needs.",
    image: "/feature_attention.png"
  },
  {
    title: "Structured Curriculum",
    desc: "A thoughtfully designed curriculum and rich library resources to build strong foundations.",
    image: "/feature_curriculum.png"
  }
];

const FeaturesSection = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % features.length);
  const prev = () => setCurrent((prev) => (prev - 1 + features.length) % features.length);

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-[#F97316] font-semibold text-sm uppercase tracking-widest mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Why Choose Us</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Our Features</h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
            Experience an environment thoughtfully crafted for comprehensive child growth.
          </p>
        </motion.div>

        <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden shadow-xl group">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img src={features[current].image} alt={features[current].title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 text-white z-10 pointer-events-none">
            <motion.h3 
              key={`h-${current}`}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {features[current].title}
            </motion.h3>
            <motion.p
              key={`p-${current}`}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-white/80 max-w-lg text-sm sm:text-base" style={{ fontFamily: "Inter, sans-serif" }}
            >
              {features[current].desc}
            </motion.p>
          </div>

          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 z-20">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 z-20">
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <div className="absolute bottom-6 right-6 flex gap-2 z-20">
            {features.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-[#F97316] w-8" : "bg-white/50 hover:bg-white"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
