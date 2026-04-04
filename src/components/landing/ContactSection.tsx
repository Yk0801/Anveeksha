import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-inquiry', {
        body: form,
      });
      if (error) throw error;
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to send message. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-[#F97316] font-semibold text-sm uppercase tracking-widest mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Get in Touch</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Contact Us</h2>
          <p className="text-slate-500 mt-3" style={{ fontFamily: "Inter, sans-serif" }}>We'd love to hear from you. Reach out for admissions, queries, or just to say hello.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Info + Map */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            {/* Contact details */}
            <div className="space-y-4">
              {[
                { icon: "📍", label: "Address", value: "Ootla, Jinnaram, Sangareddy District, Telangana 502319" },
                { icon: "📞", label: "Phone", value: "+91 98765 43210" },
                { icon: "✉️", label: "Email", value: "info@srianveeksha.edu.in" },
                { icon: "🕐", label: "Office Hours", value: "Monday – Saturday: 9:00 AM – 4:00 PM" },
              ].map((c) => (
                <div key={c.label} className="flex gap-3">
                  <span className="text-xl flex-shrink-0">{c.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.label}</p>
                    <p className="text-slate-500 text-sm mt-0.5" style={{ fontFamily: "Inter, sans-serif" }}>{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Google Map embed */}
            <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm h-56">
              {/* <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3803.8!2d78.0!3d17.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDQyJzAwLjAiTiA3OMKwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title="Sri Anveeksha Public School Location"
              /> */}

              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d933.0185590991558!2d78.3080444098268!3d17.6324803850841!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb8b3be178ec19%3A0xc5eefc52bbb0b740!2sOotla%2C%20Telangana%20502319!5e1!3m2!1sen!2sin!4v1775313592820!5m2!1sen!2sin"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title="Sri Anveeksha Public School Location"
              />
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="bg-slate-50 rounded-2xl p-7 border border-slate-100">
            <h3 className="font-bold text-slate-900 text-xl mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Send us a message</h3>
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full bg-[#F97316]/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-7 h-7 text-[#F97316]" />
                </div>
                <p className="font-bold text-slate-800 text-lg mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Message Sent!</p>
                <p className="text-slate-500 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>We'll respond within 24–48 hours.</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-[#F97316] font-medium text-sm hover:underline">Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: "Name", name: "name", type: "text", placeholder: "Your full name" },
                  { label: "Email", name: "email", type: "email", placeholder: "you@email.com" },
                  { label: "Phone", name: "phone", type: "tel", placeholder: "+91 XXXXX XXXXX" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm font-semibold text-slate-700 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.label}</label>
                    <input type={f.type} name={f.name} placeholder={f.placeholder} required
                      value={form[f.name as keyof typeof form]} onChange={handle}
                      disabled={loading}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] disabled:opacity-50"
                      style={{ fontFamily: "Inter, sans-serif" }} />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Message</label>
                  <textarea name="message" rows={4} placeholder="How can we help you?" required
                    value={form.message} onChange={handle}
                    disabled={loading}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] disabled:opacity-50"
                    style={{ fontFamily: "Inter, sans-serif" }} />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-75 relative">
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                  ) : (
                    "Send Message →"
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
