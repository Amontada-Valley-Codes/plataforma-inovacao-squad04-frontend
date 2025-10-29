import AuthVisual from "@/components/landing/AuthVisual";
import ContactPage from "@/components/landing/contacts";
import HeroSection from "@/components/landing/Desafios";
import FeaturesSection from "@/components/landing/Feature";
import InnovationFunnel from "@/components/landing/InnovationFunnel";
import LandingPage from "@/components/landing/LadingPage";
import PlataformaInovacao from "@/components/landing/PlataformaInovação";

export default function LadingPage() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Fundo visual */}
      <div className="absolute inset-0 -z-10">
        <AuthVisual />
      </div>

      {/* Seções */}
      <LandingPage />
      <PlataformaInovacao />
      <InnovationFunnel/>
      <FeaturesSection/>
      <HeroSection/>
      <ContactPage/>
    </div>
  );
}
