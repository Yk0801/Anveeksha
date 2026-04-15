import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const principal = {
  name: "Mrs. Bollina Parvathi",
  designation: "Founder & Principal",
  image: "/teacher_principal.jpeg",
  message: "At Sri Anveeksha, we don't just educate — we inspire. Every child who walks through our doors carries a unique spark, and our mission is to help them let it shine.",
};

const teachers = [
  { name: "Mrs. Lakshmi Devi", subject: "English", designation: "Senior Teacher", image: "/teacher_female1.png", bio: "15 years of experience in early childhood English literacy. Passionate about storytelling and phonics." },
  { name: "Mr. Suresh Kumar", subject: "Mathematics", designation: "Teacher", image: "/teacher_male1.png", bio: "Specialist in activity-based math learning. Makes numbers fun through puzzles and games." },
  { name: "Mr. Rahul Verma", subject: "EVS / Science", designation: "Teacher", image: "/teacher_male2.png", bio: "Nature enthusiast who takes learning outdoors. Leads the school's eco-garden initiative." },
  { name: "Mrs. Priya Rao", subject: "Class Teacher – Pre-KG", designation: "Class Teacher", image: "/teacher_female2.png", bio: "Early childhood development expert with a nurturing approach to classroom management." },
  { name: "Mrs. Kavitha Sharma", subject: "Art & Craft", designation: "Art Teacher", image: "/teacher_female3.png", bio: "Professional artist and educator. Has exhibited work at state-level art exhibitions." },
  { name: "Ms. Deepa Nair", subject: "Dance", designation: "Dance Teacher", image: "/teacher_female4.png", bio: "Trained in Bharatanatyam and Folk Dance. Guides students to express emotions through movement." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const TeamSection = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="team" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="text-[#d4af37] font-semibold text-sm uppercase tracking-widest mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Our People</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            The hearts behind the school
          </h2>
        </motion.div>

        {/* Principal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-16 bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col md:flex-row items-center"
        >
          <div className="w-full md:w-2/5 relative overflow-hidden shrink-0 bg-slate-50">
            <img src={principal.image} alt={principal.name} className="w-full h-auto object-cover object-top block" />
          </div>
          <div className="w-full md:w-3/5 p-8 text-center md:text-left">
            <h3 className="font-bold text-2xl text-slate-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{principal.name}</h3>
            <p className="text-[#d4af37] text-sm font-bold uppercase tracking-wide mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{principal.designation}</p>
            <p className="text-slate-600 text-lg italic leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>"{principal.message}"</p>
          </div>
        </motion.div>

        {/* Teachers grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {teachers.map((t, i) => (
            <motion.div
              key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              className="bg-white rounded-xl border border-slate-100 p-5 relative overflow-hidden cursor-default hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold-50 flex-shrink-0">
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.name}</h4>
                  <p className="text-[#d4af37] text-xs font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.subject}</p>
                  <p className="text-slate-400 text-xs">{t.designation}</p>
                </div>
              </div>
              {/* Hover bio */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={hovered === i ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="mt-4 text-slate-500 text-xs leading-relaxed border-t border-slate-100 pt-3"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {t.bio}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
