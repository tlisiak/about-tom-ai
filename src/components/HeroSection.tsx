import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Linkedin, Mail, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const HeroSection = () => {
  const {
    toast
  } = useToast();
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
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-in slide-in-from-bottom-4 duration-700">Hi there 👋</h1>
          
          {/* Bio */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-in slide-in-from-bottom-6 duration-700 delay-200">
            I'm Tommy, a product leader focused on the intersection of AI and impact. At <span className="text-primary font-semibold">Scout</span>, 
            I lead product to help mission-driven companies win non-dilutive funding. Thanks for stopping by my little corner of the web.
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
          
          <Button variant="outline" size="lg" className="border-red-500/40 text-red-600 hover:border-red-500 hover:bg-red-500/10 hover:text-red-700 transition-all duration-300 hover:scale-105" asChild>
            <a href="https://redfoxlabs.co" target="_blank" rel="noopener noreferrer">
              <Zap className="w-5 h-5 mr-2" />
              Red Fox Labs
            </a>
          </Button>
        </div>

        {/* Scroll indicator - centered between CTA and next section */}
        <div className="flex flex-col items-center mt-16 mb-12 animate-in slide-in-from-bottom-10 duration-700 delay-600">
          
          <div className="animate-bounce mt-4">
            
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;