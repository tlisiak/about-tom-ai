import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Linkedin, Github, Mail, Cat, Trophy, FileText } from "lucide-react";

const HeroSection = () => {
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
            I'm Tommy, a product leader focused on the intersection of AI and impact. At Scout, I lead product to help mission-driven companies win non-dilutive funding. Over the past 8 years, I've helped turn complex problems into elegant, scalable, and useful products across climate, finance, SaaS, and media, while building empowered, outcome-driven teams along the way.
          </p>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-in slide-in-from-bottom-6 duration-700 delay-200 drop-shadow">
            Outside of work, you'll usually find me playing or watching soccer, cooking something gourmet, hiking a new trail, tending to my plants, catching up with friends, reading, or hanging out with my partner and dog, Paco. Thanks for stopping by my little corner of the web!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 animate-in slide-in-from-bottom-8 duration-700 delay-400">
          <Button variant="glass" size="lg" asChild>
            <a href="https://www.linkedin.com/in/tommylisiak/" target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-5 h-5 mr-2" />
              LinkedIn
            </a>
          </Button>
          
          <Button variant="glass" size="lg" asChild>
            <a href="https://drive.google.com/file/d/11D2oAKYEuAqIllN4pRRTpbzbPQ7z7DR8/view?usp=sharing" target="_blank" rel="noopener noreferrer">
              <FileText className="w-5 h-5 mr-2" />
              Resume
            </a>
          </Button>
          
          <Button variant="glass" size="lg" asChild>
            <a href="https://github.com/tlisiak" target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </a>
          </Button>
          
          <Button variant="glass" size="lg" asChild>
            <a href="mailto:tommylisiak@gmail.com">
              <Mail className="w-5 h-5 mr-2" />
              Email
            </a>
          </Button>
        </div>

        {/* Fun Things Section */}
        <div className="mt-8 space-y-4 animate-in slide-in-from-bottom-10 duration-700 delay-500">
          <h2 className="text-2xl font-semibold text-white/90 drop-shadow">Fun Things</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="glass" size="lg" className="border-orange-300/60 hover:border-orange-200 hover:bg-orange-500/20" asChild>
              <a href="https://redfoxlabs.co" target="_blank" rel="noopener noreferrer">
                <Cat className="w-5 h-5 mr-2" />
                Red Fox Labs
              </a>
            </Button>
            
            <Button variant="glass" size="lg" asChild>
              <a href="https://goalpredict.app/" target="_blank" rel="noopener noreferrer">
                <Trophy className="w-5 h-5 mr-2" />
                Goal Predict
              </a>
            </Button>
          </div>
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