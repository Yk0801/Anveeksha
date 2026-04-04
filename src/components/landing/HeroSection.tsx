import { motion } from "framer-motion";

const HeroSection = () => {
  const scrollToAdmissions = () => {
    document.querySelector("#admissions")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background: School Image with dark overlay */}
      <div className="absolute inset-0">
        <img
          src="/school-hero.jpg"
          alt="Sri Anveeksha Public School"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.65) 100%)" }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-8 py-24">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-white/30"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
          Admissions Open for 2025–26
        </motion.div>

        {/* School Name Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
          className="text-white/80 text-sm tracking-[0.2em] uppercase font-medium"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Sri Anveeksha Public School · Ootla, Jinnaram
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: "#ffffff",
            textShadow: "0 2px 20px rgba(0,0,0,0.4)"
          }}
        >
          Where every story<br />begins with{" "}
          <span
            className="italic"
            style={{
              background: "linear-gradient(90deg, #fbbf24, #f97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            curiosity.
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/85 text-base sm:text-lg max-w-xl leading-relaxed"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          A place where children don't just learn — they wonder, grow, and discover their best selves.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <button
            onClick={scrollToAdmissions}
            className="font-bold px-8 py-3.5 rounded-xl transition-all hover:scale-105 active:scale-100 shadow-2xl"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              color: "#fff"
            }}
          >
            Explore the school →
          </button>
          <button
            onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
            className="text-white font-medium px-6 py-3 border border-white/40 rounded-xl hover:bg-white/15 transition-all backdrop-blur-sm"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Learn more
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator — no logo/illustration, just the scroll cue */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/60 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-5 h-8 border-2 border-white/40 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
