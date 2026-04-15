import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Check } from "lucide-react";

const testimonials = [
  { name: "Ramesh Kumar Reddy", role: "Parent – Pre-KG", stars: 5, quote: "Sri Anveeksha changed my son completely. He now asks questions about everything — and that's the best gift a school can give." },
  { name: "Nalini Srinivas", role: "Parent – LKG", stars: 5, quote: "The teachers here genuinely care. My daughter comes home excited to share what she learned every single day." },
  { name: "Gopal Nair", role: "Parent – UKG", stars: 5, quote: "The balance of academics and activities is outstanding. My child has grown in confidence remarkably since joining." },
  { name: "Abdul Khan", role: "Parent – LKG", stars: 4, quote: "The bus facility with GPS tracking gives us complete peace of mind. The school communication is also very prompt." },
  { name: "Smt. Padmavathi", role: "Parent – Pre-KG", stars: 5, quote: "The zero-pressure environment allows my daughter to explore and be herself. I couldn't ask for more." },
];

const TestimonialsSection = () => {
  const [idx, setIdx] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [review, setReview] = useState({ name: "", role: "", quote: "", stars: 5 });

  const prev = () => setIdx((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIdx((i) => (i + 1) % testimonials.length);
  const t = testimonials[idx];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-[#d4af37]/5 to-[#0c2340]/5">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-[#d4af37] font-semibold text-sm uppercase tracking-widest mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>What Parents Say</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Voices from our community</h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div key={idx}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center"
            >
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < t.stars ? "text-[#d4af37] fill-[#d4af37]" : "text-slate-200"}`} />
                ))}
              </div>
              <p className="text-slate-700 text-lg italic leading-relaxed mb-6 max-w-2xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
                "{t.quote}"
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center font-bold text-[#d4af37]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {t.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.name}</p>
                  <p className="text-slate-400 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons */}
          <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-9 h-9 bg-white rounded-full border border-slate-200 shadow flex items-center justify-center hover:bg-slate-50 hidden sm:flex">
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-9 h-9 bg-white rounded-full border border-slate-200 shadow flex items-center justify-center hover:bg-slate-50 hidden sm:flex">
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === idx ? "bg-[#d4af37] w-6" : "bg-slate-300"}`} />
          ))}
        </div>

        {/* Mobile swipe buttons */}
        <div className="flex gap-3 justify-center mt-4 sm:hidden">
          <button onClick={prev} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600">← Prev</button>
          <button onClick={next} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600">Next →</button>
        </div>

        {/* Leave a review */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-100 p-7">
          <h3 className="font-bold text-slate-800 text-lg mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Leave a Review</h3>
          {reviewSubmitted ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-[#d4af37]" />
              </div>
              <p className="font-semibold text-slate-800 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Thank you for your review!</p>
              <button onClick={() => setReviewSubmitted(false)} className="text-[#d4af37] text-sm hover:underline mt-1">Submit another</button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setReviewSubmitted(true); }} className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Name</label>
                <input type="text" required value={review.name} onChange={e => setReview({ ...review, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37]"
                  style={{ fontFamily: "Inter, sans-serif" }} placeholder="Parent name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Role</label>
                <input type="text" required value={review.role} onChange={e => setReview({ ...review, role: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37]"
                  style={{ fontFamily: "Inter, sans-serif" }} placeholder="e.g. Parent – LKG" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Review</label>
                <textarea required rows={3} value={review.quote} onChange={e => setReview({ ...review, quote: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 focus:border-[#d4af37]"
                  style={{ fontFamily: "Inter, sans-serif" }} placeholder="Share your experience..." />
              </div>
              <div className="sm:col-span-2 flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Rating:</span>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setReview({ ...review, stars: s })}>
                    <Star className={`w-6 h-6 transition-colors ${s <= review.stars ? "text-[#d4af37] fill-[#d4af37]" : "text-slate-300"}`} />
                  </button>
                ))}
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="btn-primary px-6 py-2.5 rounded-lg font-semibold text-sm">Submit Review</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
