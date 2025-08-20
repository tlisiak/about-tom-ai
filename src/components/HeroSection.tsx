import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Linkedin, Mail, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const HeroSection = () => {
  const { toast } = useToast();

  return <section className="min-h-screen flex items-center justify-center p-6 pb-8 bg-gradient-to-br from-background via-background to-accent/10">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Profile Avatar */}
        <div className="relative">
          <Avatar className="w-32 h-32 mx-auto border-4 border-primary/20 shadow-glow transition-all duration-500 hover:scale-105">
            <AvatarImage src="/lovable-uploads/00d98ff0-cea1-495b-a987-33713991e19b.png" alt="Tommy Lisiak" />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-accent text-primary-foreground">
              TL
            </AvatarFallback>
          </Avatar>
          
        </div>

        {/* Hero Title */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-in slide-in-from-bottom-4 duration-700">
            Hi, I'm Tommy
          </h1>
          
          {/* Bio */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-in slide-in-from-bottom-6 duration-700 delay-200">
            As a product leader and climate tech advocate, I blend innovation with sustainability to drive impactful change. 
            Currently Head of Product at <span className="text-primary font-semibold">Scout</span>, building AI-powered tools 
            to help socially responsible businesses win non-dilutive funding.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 animate-in slide-in-from-bottom-8 duration-700 delay-400">
          <Button variant="default" size="lg" className="bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300 hover:scale-105" asChild>
            <a href="https://www.linkedin.com/in/tommylisiak/" target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-5 h-5 mr-2" />
              LinkedIn
            </a>
          </Button>
          
          <Button variant="secondary" size="lg" className="hover:bg-accent/20 transition-all duration-300 hover:scale-105" asChild>
            <a href="mailto:tommylisiak@gmail.com">
              <Mail className="w-5 h-5 mr-2" />
              Email
            </a>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="border-red-500/40 text-red-600 hover:border-red-500 hover:bg-red-500/10 hover:text-red-700 transition-all duration-300 hover:scale-105"
            onClick={() => {
              toast({
                title: "Coming soon!",
                description: "Red Fox Labs website is under development.",
              });
            }}
          >
            <Zap className="w-5 h-5 mr-2" />
            Red Fox Labs
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center space-y-2 animate-in slide-in-from-bottom-10 duration-700 delay-600">
          <p className="text-sm text-muted-foreground">Got questions? Let's chat!</p>
          <div className="animate-bounce">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent p-2 shadow-glow hover:shadow-xl transition-all duration-300 cursor-pointer"
                 onClick={() => {
                   const chatSection = document.querySelector('section:nth-child(2)');
                   chatSection?.scrollIntoView({ behavior: 'smooth' });
                 }}>
              <svg 
                className="w-4 h-4 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;