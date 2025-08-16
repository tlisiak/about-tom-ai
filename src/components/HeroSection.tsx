import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Linkedin, Mail, FileText } from "lucide-react";
const HeroSection = () => {
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
          
          <Button variant="outline" size="lg" className="border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300 hover:scale-105" asChild>
            <a href="https://drive.google.com/file/d/14tgxD68kkcr2-Rbtw_wSxuR_7OR28OTV/view?usp=share_link" target="_blank" rel="noopener noreferrer">
              <FileText className="w-5 h-5 mr-2" />
              Resume
            </a>
          </Button>
        </div>

        {/* Scroll indicator */}
        
      </div>
    </section>;
};
export default HeroSection;