import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Linkedin, Mail, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const HeroSection = () => {
  const {
    toast
  } = useToast();
  return <section 
      className="min-h-screen flex items-center justify-center p-6 pb-8 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/lovable-uploads/f5f8febe-809a-47df-a2eb-cebc85bb6263.png)' }}
    >
      {/* Glass card container */}
      <div className="max-w-4xl mx-auto text-center space-y-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
        {/* Profile Avatar */}
        <div className="relative">
          <Avatar className="w-32 h-32 mx-auto border-4 border-white/30 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:scale-105">
            <AvatarImage src="/lovable-uploads/00d98ff0-cea1-495b-a987-33713991e19b.png" alt="Tommy Lisiak" />
            <AvatarFallback className="text-2xl font-bold bg-white/20 backdrop-blur-sm text-white border border-white/30">
              TL
            </AvatarFallback>
          </Avatar>
          
        </div>

        {/* Hero Title */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg animate-in slide-in-from-bottom-4 duration-700">Hi there 👋</h1>
          
          {/* Bio */}
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-in slide-in-from-bottom-6 duration-700 delay-200 drop-shadow">
            I'm Tommy, a product leader focused on the intersection of AI and impact. At <a href="http://scoutclimate.com/" target="_blank" rel="noopener noreferrer" className="text-white font-semibold drop-shadow hover:text-white/80 transition-colors underline decoration-white/50 hover:decoration-white/80">Scout</a>, 
            I lead product to help mission-driven companies win non-dilutive funding. Thanks for stopping by my little corner of the web.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 animate-in slide-in-from-bottom-8 duration-700 delay-400">
          <Button variant="default" size="lg" className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105" asChild>
            <a href="https://www.linkedin.com/in/tommylisiak/" target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-5 h-5 mr-2" />
              LinkedIn
            </a>
          </Button>
          
          <Button variant="secondary" size="lg" className="bg-white/15 text-white border-white/25 hover:bg-white/25 backdrop-blur-sm transition-all duration-300 hover:scale-105" asChild>
            <a href="mailto:tommylisiak@gmail.com">
              <Mail className="w-5 h-5 mr-2" />
              Email
            </a>
          </Button>
          
          <Button variant="outline" size="lg" className="border-orange-300/60 text-orange-100 hover:border-orange-200 hover:bg-orange-500/20 hover:text-orange-50 backdrop-blur-sm transition-all duration-300 hover:scale-105" asChild>
            <a href="https://redfoxlabs.co" target="_blank" rel="noopener noreferrer">
              <Zap className="w-5 h-5 mr-2" />
              Red Fox Labs
            </a>
          </Button>
        </div>

        {/* Footer text */}
        <div className="mt-12 pt-6 border-t border-white/20 animate-in slide-in-from-bottom-10 duration-700 delay-600">
          <p className="text-sm text-white/80">
            Built by <a href="https://redfoxlabs.co" target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:text-white/90 transition-colors">Red Fox Labs</a>
          </p>
        </div>
      </div>
    </section>;
};
export default HeroSection;