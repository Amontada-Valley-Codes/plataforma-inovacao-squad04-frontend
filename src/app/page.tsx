import AuthVisual from "@/components/lading/AuthVisual";
import InnovationFunnel from "@/components/lading/InnovationFunnel";
import LandingPage from "@/components/lading/LadingPage";
import PlataformaInovacao from "@/components/lading/PlataformaInovação";

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
    </div>
  );
}
