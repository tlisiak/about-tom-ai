import HeroSection from "@/components/HeroSection";
const Index = () => {
  return <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <HeroSection />
      </div>
      <footer className="py-4 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          Built by <a href="https://redfoxlabs.co" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:text-primary/80 transition-colors">Red Fox Labs</a>
        </p>
      </footer>
    </div>;
};
export default Index;