import HeroVideo from "@/components/hero-video";
import PipesSection from "@/components/pipes-section";
import AboutSection from "@/components/about-section";
import SponsorsSection from "@/components/sponsors-section";
import FAQSection from "@/components/faq-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="bg-void min-h-screen">
      <HeroVideo />
      <PipesSection />
      <AboutSection />
      <SponsorsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
