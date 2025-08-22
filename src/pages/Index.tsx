import HeroSection from "@/components/HeroSection";
import ChatBot from "@/components/ChatBot";
const Index = () => {
  return <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="lg:w-1/2 lg:min-h-screen">
          <HeroSection />
        </div>
        <div className="lg:w-1/2 lg:min-h-screen lg:flex lg:items-center">
          <ChatBot />
        </div>
      </div>
      <footer className="py-4 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          Built by <a href="https://redfoxlabs.co" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:text-primary/80 transition-colors">Red Fox Labs</a>
        </p>
      </footer>
    </div>;
};
export default Index;