import HeroVideo from "@/components/hero-video";
import PipesSection from "@/components/pipes-section";
import AboutSection from "@/components/about-section";
import TimelineSection from "@/components/timeline-section";
import PrizesSection from "@/components/prizes-section";
import SponsorsSection from "@/components/sponsors-section";
import FAQSection from "@/components/faq-section";
import ContactSection from "@/components/contact-section";

export default function Home() {
  return (
    <main className="bg-void min-h-screen">
      <HeroVideo />
      <PipesSection />
      <AboutSection />
      <TimelineSection />
      <PrizesSection />
      <SponsorsSection />
      <FAQSection />
      <ContactSection />
    </main>
  );
}

