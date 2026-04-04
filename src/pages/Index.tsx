import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import TeamSection from "@/components/landing/TeamSection";
import CurriculumSection from "@/components/landing/CurriculumSection";
import AdmissionsSection from "@/components/landing/AdmissionsSection";
import BusFacilitiesSection from "@/components/landing/BusFacilitiesSection";
import BookStationerySection from "@/components/landing/BookStationerySection";
import SportsSection from "@/components/landing/SportsSection";
import CoCurricularSection from "@/components/landing/CoCurricularSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <TeamSection />
      <CurriculumSection />
      <AdmissionsSection />
      <BusFacilitiesSection />
      <BookStationerySection />
      <SportsSection />
      <CoCurricularSection />
      <FeaturesSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
