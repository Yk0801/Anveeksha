import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Bus, MapPin, Clock, Shield, Trophy, Dumbbell, Puzzle, Music, Palette, BookOpen, Drama, Cpu } from "lucide-react";

const busRoutes = [
  { route: "1", areas: "Jinnaram, Ootla, Sangareddy Rd", pickup: "7:30 AM", drop: "3:30 PM", fee: "₹1,500" },
  { route: "2", areas: "Patancheru, Isnapur, RC Puram", pickup: "7:15 AM", drop: "3:45 PM", fee: "₹1,800" },
  { route: "3", areas: "Miyapur, Bachupally, Pragathi Nagar", pickup: "7:00 AM", drop: "4:00 PM", fee: "₹2,000" },
];

const sports = [
  { name: "Cricket", coach: "Mr. Ravi" },
  { name: "Football", coach: "Mr. Ahmed" },
  { name: "Basketball", coach: "Mr. Sunil" },
  { name: "Kabaddi", coach: "Mr. Naresh" },
  { name: "Athletics", coach: "Mrs. Sravani" },
  { name: "Chess", coach: "Mr. Mohan" },
];

const activities = [
  { name: "Dance", icon: Music, freq: "Weekly" },
  { name: "Music", icon: Music, freq: "Weekly" },
  { name: "Art & Craft", icon: Palette, freq: "Weekly" },
  { name: "Drama / Theatre", icon: Drama, freq: "Monthly" },
  { name: "Yoga", icon: Dumbbell, freq: "Daily" },
  { name: "Robotics Club", icon: Cpu, freq: "Weekly" },
  { name: "Science Club", icon: Puzzle, freq: "Weekly" },
  { name: "Reading Club", icon: BookOpen, freq: "Daily" },
];

const FacilitiesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="facilities" className="section-padding bg-background" ref={ref}>
      <div className="container mx-auto">
        {/* Bus */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Transport</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mt-2">
              <span className="text-gradient-hero">Safe</span> Bus Facilities
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              { icon: Bus, title: "GPS-Tracked Fleet", desc: "All buses equipped with real-time GPS tracking" },
              { icon: Shield, title: "Trained Staff", desc: "Experienced drivers and attendants on every route" },
              { icon: MapPin, title: "Door-Step Pickup", desc: "Convenient pickup points across the region" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 text-center hover-lift"
              >
                <item.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                <h4 className="font-heading font-bold text-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-hero text-primary-foreground">
                  <th className="p-3 text-left font-semibold">Route</th>
                  <th className="p-3 text-left font-semibold">Areas Covered</th>
                  <th className="p-3 font-semibold">Pickup</th>
                  <th className="p-3 font-semibold">Drop</th>
                  <th className="p-3 font-semibold">Fee/Month</th>
                </tr>
              </thead>
              <tbody>
                {busRoutes.map((r, i) => (
                  <tr key={r.route} className={`${i % 2 === 0 ? "bg-card" : "bg-muted"} hover:bg-primary/5 transition-colors`}>
                    <td className="p-3 font-medium text-foreground">{r.route}</td>
                    <td className="p-3 text-muted-foreground">{r.areas}</td>
                    <td className="p-3 text-center text-muted-foreground">{r.pickup}</td>
                    <td className="p-3 text-center text-muted-foreground">{r.drop}</td>
                    <td className="p-3 text-center font-semibold text-foreground">{r.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Sports */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Sports</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mt-2">
              Building <span className="text-gradient-hero">Champions</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sports.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4 + i * 0.06 }}
                className="bg-card border border-border rounded-xl p-4 text-center hover-lift cursor-default"
              >
                <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
                <h4 className="font-heading font-semibold text-sm text-foreground">{s.name}</h4>
                <p className="text-xs text-muted-foreground">Coach: {s.coach}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Co-Curricular */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          id="activities"
        >
          <div className="text-center mb-10">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Beyond Academics</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mt-2">
              Co-Curricular <span className="text-gradient-hero">Activities</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activities.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.06 }}
                className="bg-card border border-border rounded-xl p-5 text-center hover-lift cursor-default group"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/10 mx-auto mb-3 flex items-center justify-center group-hover:bg-gradient-hero transition-colors duration-300">
                  <a.icon className="w-6 h-6 text-secondary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h4 className="font-heading font-semibold text-sm text-foreground">{a.name}</h4>
                <span className="text-xs text-primary font-medium">{a.freq}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
