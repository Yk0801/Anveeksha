import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, GraduationCap, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "Admissions", href: "#admissions" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-black/20 backdrop-blur-sm"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 group">
            <img src="/school_logo.jpeg" alt="Sri Anveeksha Logo" className="w-10 h-10 object-contain rounded-xl bg-white p-0.5 shadow-sm" onError={(e) => (e.currentTarget.style.display = 'none')} />
            <div className="text-left hidden sm:block">
              <div className={`font-bold text-sm leading-tight transition-colors ${scrolled ? "text-slate-900" : "text-white"}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sri Anveeksha</div>
              <div className={`text-xs transition-colors ${scrolled ? "text-slate-500" : "text-white/80"}`}>Techno School</div>
            </div>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-5">
            {navLinks.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className={`text-sm font-medium transition-colors hover:text-[#d4af37] ${scrolled ? "text-slate-700" : "text-white/90 hover:text-white"}`}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {l.label}
              </button>
            ))}

            {/* Divider */}
            <div className={`h-5 w-px ${scrolled ? "bg-slate-200" : "bg-white/30"}`} />

            {/* Parent Login */}
            <button
              onClick={() => navigate("/login?role=parent")}
              className={`flex items-center gap-1.5 text-sm font-semibold transition-all px-3 py-1.5 rounded-lg ${scrolled
                ? "text-[#d4af37] hover:bg-gold-50 border border-[#d4af37]/30"
                : "text-white/90 hover:bg-white/10 border border-white/25"
                }`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <GraduationCap className="w-4 h-4" />
              Parent Login
            </button>

            {/* Admin Login */}
            <button
              onClick={() => navigate("/login?role=admin")}
              className={`flex items-center gap-1.5 text-sm font-semibold transition-all px-3 py-1.5 rounded-lg ${scrolled
                ? "text-[#0c2340] hover:bg-navy-50 border border-[#0c2340]/30"
                : "text-white/90 hover:bg-white/10 border border-white/25"
                }`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Login
            </button>

            <button
              onClick={() => scrollTo("#admissions")}
              className="btn-coral text-sm px-5 py-2"
            >
              Apply Now
            </button>
          </div>

          {/* Mobile burger */}
          <button onClick={() => setOpen(true)} className={`md:hidden p-2 rounded-lg ${scrolled ? "text-slate-900" : "text-white"}`}>
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-bold text-[#d4af37]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sri Anveeksha</span>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 p-4 space-y-1">
                {navLinks.map((l) => (
                  <button key={l.href} onClick={() => scrollTo(l.href)}
                    className="w-full text-left px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium text-sm"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {l.label}
                  </button>
                ))}
              </div>
              <div className="p-4 border-t space-y-2">
                <button onClick={() => { setOpen(false); scrollTo("#admissions"); }} className="btn-coral w-full text-center text-sm">Apply Now</button>
                <button
                  onClick={() => { setOpen(false); navigate("/login?role=parent"); }}
                  className="w-full flex items-center justify-center gap-2 text-sm text-[#d4af37] font-semibold py-2.5 rounded-lg border border-[#d4af37]/30 hover:bg-gold-50 transition-colors"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <GraduationCap className="w-4 h-4" />
                  Parent Login
                </button>
                <button
                  onClick={() => { setOpen(false); navigate("/login?role=admin"); }}
                  className="w-full flex items-center justify-center gap-2 text-sm text-[#0c2340] font-semibold py-2.5 rounded-lg border border-[#0c2340]/30 hover:bg-navy-50 transition-colors"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Login
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
