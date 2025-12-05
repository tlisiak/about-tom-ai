import HeroSection from "@/components/HeroSection";
import { usePageView } from "@/hooks/usePageView";

const Index = () => {
  usePageView('/');
  
  return (
    <div className="min-h-screen">
      <HeroSection />
    </div>
  );
};

export default Index;
