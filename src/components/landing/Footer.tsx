import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0f172a] text-white py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#F97316] flex items-center justify-center">
                <span className="text-white font-bold text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>SA</span>
              </div>
              <div>
                <div className="font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sri Anveeksha Public School</div>
                <div className="text-slate-400 text-xs">Ootla, Jinnaram, Telangana</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs" style={{ fontFamily: "Inter, sans-serif" }}>
              Where every story begins with curiosity. Nurturing young minds since 2010 in the heart of Jinnaram, Telangana.
            </p>
            <div className="flex gap-3 mt-5">
              {["📘", "📸", "🐦", "📺"].map((icon, i) => (
                <button key={i} className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-base">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-bold text-white text-sm mb-4 uppercase tracking-wider" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Quick Links</p>
            <div className="space-y-2">
              {[
                { label: "About Us", href: "#about" },
                { label: "Curriculum", href: "#curriculum" },
                { label: "Admissions", href: "#admissions" },
                { label: "Bus Routes", href: "#bus" },
                { label: "Sports", href: "#sports" },
                { label: "Contact", href: "#contact" },
              ].map((l) => (
                <button key={l.href} onClick={() => scrollTo(l.href)}
                  className="block text-slate-400 hover:text-[#F97316] text-sm transition-colors text-left" style={{ fontFamily: "Inter, sans-serif" }}>
                  → {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="font-bold text-white text-sm mb-4 uppercase tracking-wider" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Contact</p>
            <div className="space-y-2 text-slate-400 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
              <p>Ootla, Jinnaram</p>
              <p>Sangareddy, Telangana 502319</p>
              <p className="mt-3">+91 98765 43210</p>
              <p>info@srianveeksha.edu.in</p>
              <p className="mt-3">Mon – Sat: 9:00 AM – 4:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
            © 2025 Sri Anveeksha Public School. All rights reserved.
          </p>
          <div className="flex gap-4 items-center">
            <button onClick={() => navigate("/login?role=parent")}
              className="text-slate-400 hover:text-[#F97316] text-xs transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
              Parent Login
            </button>
            <span className="text-slate-600">•</span>
            <button onClick={() => navigate("/login?role=admin")}
              className="text-slate-400 hover:text-[#F97316] text-xs transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
              Admin Login
            </button>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500 text-xs">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
