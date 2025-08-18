import HeroSection from "@/components/HeroSection";
import ChatBot from "@/components/ChatBot";
const Index = () => {
  return <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <HeroSection />
        <ChatBot />
      </div>
      <footer className="py-4 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          Built by <span className="text-primary font-medium">Red Fox Labs</span>
        </p>
      </footer>
    </div>;
};
export default Index;