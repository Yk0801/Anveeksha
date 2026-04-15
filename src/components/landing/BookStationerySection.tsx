import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const classData = [
  {
    cls: "Pre-KG",
    books: ["English Primer – Part 1", "Telugu Akshara Maala", "Math Fun – Numbers 1-10", "Drawing Book"],
    uniform: ["Blue half-pant / skirt", "White shirt with school logo", "White canvas shoes", "Navy blue school bag"],
    stationery: ["HB Pencils (6)", "Big Eraser", "Crayons (16 colours)", "Scissor (safe-tip)", "Glue stick", "Drawing book (A4)"],
  },
  {
    cls: "LKG",
    books: ["English Reading Readiness", "Telugu Balageetalu", "Math Activity – 1–20", "EVS Picture Book", "GK Beginners"],
    uniform: ["Blue half-pant / skirt", "White shirt with school logo", "White canvas shoes", "Navy blue school bag"],
    stationery: ["HB Pencils (6)", "Eraser (2)", "Ruler 15cm", "Crayons (24 colours)", "Colour pencils", "Sketch pens", "Glue stick", "Scissors"],
  },
  {
    cls: "UKG",
    books: ["My English Book – UKG", "Telugu Bala Patham", "Mathematics – Grade Ready", "EVS Explore", "GK & Reasoning", "Hindi Primer (optional)"],
    uniform: ["Blue half-pant / skirt", "White polo shirt with school logo", "Black school shoes", "White socks (2 pairs)", "Navy blue tie", "School bag (navy)"],
    stationery: ["HB + 2B Pencils (8)", "Eraser & sharpener", "Ruler 30cm", "Colour pencils set", "Sketch pens (2 sets)", "Crayons", "Glue stick", "Scissors", "Geometry box"],
  },
];

const BookStationerySection = () => {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (cls: string) => setOpen(open === cls ? null : cls);

  return (
    <section id="books" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-[#d4af37] font-semibold text-sm uppercase tracking-widest mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Stationery & Books</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Books & Stationery List</h2>
          <p className="text-slate-500 mt-3" style={{ fontFamily: "Inter, sans-serif" }}>Expand each class to see the complete list for 2025–26.</p>
        </motion.div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {classData.map((c, i) => (
            <motion.div key={c.cls} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              <button onClick={() => toggle(c.cls)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <span className={`font-bold text-lg transition-colors ${open === c.cls ? 'text-[#d4af37]' : 'text-slate-800 group-hover:text-[#d4af37]'}`}>{c.cls} — Complete List</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${open === c.cls ? 'bg-gold-50' : 'bg-slate-50'}`}>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${open === c.cls ? "rotate-180 text-[#d4af37]" : "text-slate-400"}`} />
                </div>
              </button>
              <AnimatePresence>
                {open === c.cls && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="px-6 pb-6 grid md:grid-cols-3 gap-6 border-t border-slate-100 pt-5">
                      {[
                        { label: "📚 Books", items: c.books },
                        { label: "👕 Uniform", items: c.uniform },
                        { label: "✏️ Stationery", items: c.stationery },
                      ].map((cat) => (
                        <div key={cat.label} className="bg-gold-50/30 rounded-xl p-4 border border-gold-50">
                          <p className="font-bold text-slate-800 text-sm mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{cat.label}</p>
                          <ul className="space-y-2">
                            {cat.items.map((item) => (
                              <li key={item} className="text-slate-600 text-xs flex items-start gap-2 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                                <span className="text-[#d4af37] flex-shrink-0 mt-0.5">•</span>{item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="px-6 pb-6 flex justify-center sm:justify-start">
                      <button className="text-[#d4af37] font-semibold text-sm px-6 py-2.5 rounded-lg border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-white transition-colors">
                        ⬇ Download {c.cls} List (PDF)
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookStationerySection;
