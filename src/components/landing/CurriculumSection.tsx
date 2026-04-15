import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tabs = ["Pre-KG", "LKG", "UKG"];

const curriculum = {
  "Pre-KG": {
    subjects: ["English Basics (Phonics)", "Telugu Basics", "Mathematics Concepts", "Environmental Awareness", "Art & Craft", "Rhymes & Stories", "Yoga & Movement"],
    approach: "Play-based, sensory-rich learning that fosters curiosity and confidence.",
    methodology: "Circle time, sand play, picture books, finger-painting, music, and structured free play.",
    dayInClass: "Morning circle with rhymes → Phonics activity → Snack time → Sensory play → Story time → Nature walk → Drawing → Goodbye circle.",
  },
  "LKG": {
    subjects: ["English (Reading Readiness)", "Telugu (Aksharamala)", "Mathematics (Numbers 1–20)", "EVS", "General Knowledge", "Art & Craft", "Music", "Physical Education"],
    approach: "Activity-based learning with a balance of structured literacy and free exploration.",
    methodology: "Montessori trays, flash cards, hands-on math, interactive read-alouds, and group projects.",
    dayInClass: "Assembly → English phonics → Math with manipulatives → EVS activity → Lunch → Art class → Music/PE → Story reading → Reflection circle.",
  },
  "UKG": {
    subjects: ["English (Reading & Writing)", "Telugu (Reading & Writing)", "Mathematics (Numbers 1–100, Shapes)", "EVS (Plants, Animals, Weather)", "GK & Reasoning", "Art", "Music & Dance", "PE"],
    approach: "Structured academic foundation with creative expression and critical thinking.",
    methodology: "Workbooks, group discussions, project-based learning, science experiments, and presentations.",
    dayInClass: "Assembly → English writing practice → Math worksheet → Science experiment → Lunch → Art/Music → Telugu reading → GK quiz → Tidy-up & dismissal.",
  },
};

const CurriculumSection = () => {
  const [activeTab, setActiveTab] = useState("Pre-KG");
  const data = curriculum[activeTab as keyof typeof curriculum];

  return (
    <section id="curriculum" className="py-20 bg-gradient-to-br from-[#d4af37]/5 via-white to-[#0c2340]/5">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-[#d4af37] font-semibold text-sm uppercase tracking-widest mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Academics</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Our Curriculum</h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
            Thoughtfully designed to nurture the whole child — mind, body, and spirit.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-xl p-1.5 shadow-sm border border-slate-100 max-w-sm mx-auto">
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === t
                  ? "bg-[#d4af37] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Left: Subjects */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <span className="w-2 h-5 bg-[#d4af37] rounded-full" />
                Subjects Covered
              </h3>
              <div className="space-y-2">
                {data.subjects.map((s) => (
                  <div key={s} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] flex-shrink-0" />
                    <span className="text-slate-600 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Approach + Day */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <span className="w-2 h-5 bg-[#0c2340] rounded-full" />
                  Learning Approach
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>{data.approach}</p>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}><strong className="text-slate-700">Methodology:</strong> {data.methodology}</p>
              </div>

              <div className="bg-gradient-to-br from-[#0c2340]/5 to-[#d4af37]/5 rounded-2xl p-6 border border-[#0c2340]/10">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <span className="w-2 h-5 bg-[#d4af37] rounded-full" />
                  A Day in {activeTab}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>{data.dayInClass}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CurriculumSection;
