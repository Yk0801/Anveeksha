import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// const stats = [
//   { label: "Students Enrolled", value: 487, suffix: "+" },
//   { label: "Qualified Teachers", value: 32, suffix: "" },
//   { label: "Years of Excellence", value: 15, suffix: "" },
//   { label: "Acres of Campus", value: 3, suffix: "" },
// ];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(value / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(start);
    }, 20);
    return () => clearInterval(timer);
  }, [inView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.25, duration: 0.5 } }),
};

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
          <p className="text-[#d4af37] font-semibold text-sm uppercase tracking-widest mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>About Us</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            A school built on a single question
          </h2>
        </motion.div>

        {/* Split layout */}
        <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
          {/* Pull quote */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="bg-gradient-to-br from-[#d4af37]/5 to-[#0c2340]/5 rounded-2xl p-8 border-l-4 border-[#d4af37]">
            <p className="text-2xl sm:text-3xl font-bold text-slate-800 leading-snug italic"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              "We believe the best education starts with a single question: <span className="text-[#d4af37]">Why?</span>"
            </p>
            <p className="mt-4 text-[#d4af37] font-semibold text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              — Sri Anveeksha Techno School
            </p>
          </motion.div>

          {/* Paragraphs */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
            className="space-y-4 text-slate-600 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
            <p>
              Nestled in the heart of Ootla, Jinnaram, Sri Anveeksha Public School was founded on the belief that every child carries within them an infinite capacity to learn — provided they are given the freedom to wonder.
            </p>
            <p>
              Our philosophy is rooted in nurturing curiosity before knowledge, confidence before competition, and character before curriculum. We create an environment where asking questions is more celebrated than getting answers.
            </p>
            <p>
              From our carefully designed Pre-KG classrooms to our vibrant sports fields, every corner of Sri Anveeksha is a space for growth, exploration, and joy. We partner closely with families to ensure each child's journey is truly their own.
            </p>
          </motion.div>
        </div>

        {/* Stats row */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 3}
              className="bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <p className="text-4xl font-bold text-[#d4af37] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="text-slate-500 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>{s.label}</p>
            </motion.div>
          ))}
        </div> */}
      </div>
    </section>
  );
};

export default AboutSection;
