import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Linkedin, Github, Mail, Cat, Trophy, FileText } from "lucide-react";

const HeroSection = () => {
  return <section 
      className="min-h-screen flex items-center justify-center p-6 pb-8 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/lovable-uploads/f5f8febe-809a-47df-a2eb-cebc85bb6263.png)' }}
      aria-label="Hero section with profile information"
    >
      <main className="relative max-w-4xl mx-auto text-center space-y-8 backdrop-blur-md bg-black/30 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
        {/* Profile Avatar */}
        <header className="relative">
          <Avatar className="w-32 h-32 mx-auto border-4 border-white/30 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:scale-105">
            <AvatarImage 
              src="/lovable-uploads/00d98ff0-cea1-495b-a987-33713991e19b.png" 
              alt="Tommy Lisiak - Product Leader and Climate Tech Advocate" 
              loading="eager"
            />
            <AvatarFallback className="text-2xl font-bold bg-white/20 backdrop-blur-sm text-white border border-white/30">
              TL
            </AvatarFallback>
          </Avatar>
        </header>

        {/* Bio Section */}
        <article className="space-y-6">
          <div className="space-y-2 animate-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
              Tommy Lisiak
            </h1>
            <p className="text-xl md:text-2xl font-light text-white/80 drop-shadow">
              Product & Growth Leader
            </p>
          </div>
          
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-in slide-in-from-bottom-6 duration-700 delay-200 drop-shadow">
            Hi there 👋 I'm Tommy, a product leader focused on the intersection of AI and impact. At Scout, I lead product to help mission-driven companies win non-dilutive funding. Over the past 8 years, I've helped turn complex problems into elegant, scalable, and useful products across climate, finance, SaaS, and media, while building empowered, outcome-driven teams along the way.
          </p>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-in slide-in-from-bottom-6 duration-700 delay-200 drop-shadow">
            Outside of work, you'll usually find me playing or watching soccer, cooking something gourmet, hiking a new trail, tending to my plants, catching up with friends, reading, or hanging out with my partner and dog, Paco. Thanks for stopping by my little corner of the web!
          </p>
        </article>

        {/* Action Buttons */}
        <nav className="flex flex-wrap justify-center gap-4 animate-in slide-in-from-bottom-8 duration-700 delay-400" aria-label="Social media and contact links">
          <Button variant="glass" size="lg" asChild>
            <a 
              href="https://www.linkedin.com/in/tommylisiak/" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Visit Tommy Lisiak's LinkedIn profile"
            >
              <Linkedin className="w-5 h-5 mr-2" aria-hidden="true" />
              LinkedIn
            </a>
          </Button>
          
          <Button variant="glass" size="lg" asChild>
            <a 
              href="https://drive.google.com/file/d/11D2oAKYEuAqIllN4pRRTpbzbPQ7z7DR8/view?usp=sharing" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Download Tommy Lisiak's resume"
            >
              <FileText className="w-5 h-5 mr-2" aria-hidden="true" />
              Resume
            </a>
          </Button>
          
          <Button variant="glass" size="lg" asChild>
            <a 
              href="https://github.com/tlisiak" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Visit Tommy Lisiak's GitHub profile"
            >
              <Github className="w-5 h-5 mr-2" aria-hidden="true" />
              GitHub
            </a>
          </Button>
          
          <Button variant="glass" size="lg" asChild>
            <a 
              href="mailto:tommylisiak@gmail.com"
              aria-label="Send email to Tommy Lisiak"
            >
              <Mail className="w-5 h-5 mr-2" aria-hidden="true" />
              Email
            </a>
          </Button>
        </nav>

        {/* Fun Things Section */}
        <aside className="mt-8 space-y-4 animate-in slide-in-from-bottom-10 duration-700 delay-500">
          <h2 className="text-2xl font-semibold text-white/90 drop-shadow">Fun Projects</h2>
          <nav className="flex flex-wrap justify-center gap-4" aria-label="Personal projects">
            <Button variant="glass" size="lg" className="border-orange-300/60 hover:border-orange-200 hover:bg-orange-500/20" asChild>
              <a 
                href="https://redfoxlabs.co" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visit Red Fox Labs website"
              >
                <Cat className="w-5 h-5 mr-2" aria-hidden="true" />
                Red Fox Labs
              </a>
            </Button>
            
            <Button variant="glass" size="lg" asChild>
              <a 
                href="https://goalpredict.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visit Goal Predict app"
              >
                <Trophy className="w-5 h-5 mr-2" aria-hidden="true" />
                Goal Predict
              </a>
            </Button>
          </nav>
        </aside>

        {/* Footer text */}
        <footer className="mt-12 pt-6 border-t border-white/20 animate-in slide-in-from-bottom-10 duration-700 delay-600">
          <p className="text-sm text-white/80">
            Built by <a 
              href="https://redfoxlabs.co" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white font-medium hover:text-white/90 transition-colors"
              aria-label="Visit Red Fox Labs website"
            >
              Red Fox Labs
            </a>
          </p>
        </footer>
      </main>
    </section>;
};
export default HeroSection;