import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Linkedin, Github, Mail, Cat, Trophy, FileText, MessageCircle } from "lucide-react";
import ChatWidget from "./ChatWidget";
const CHAT_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const HeroSection = () => {
  const [chatMode, setChatMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const openChat = () => {
    setChatMode(true);
    // Scroll hero into view if needed
    heroRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };
  const closeChat = () => {
    setChatMode(false);
    // Return focus to CTA button
    setTimeout(() => ctaButtonRef.current?.focus(), 100);
  };

  // Mobile: use Sheet for full-screen chat
  if (isMobile && chatMode) {
    return <>
        <section ref={heroRef} className="min-h-screen flex items-center justify-center p-6 pb-8 bg-cover bg-center bg-no-repeat relative" style={{
        backgroundImage: 'url(/lovable-uploads/f5f8febe-809a-47df-a2eb-cebc85bb6263.png)'
      }} aria-label="Hero section with profile information" />
        <Sheet open={chatMode} onOpenChange={open => !open && closeChat()}>
          <SheetContent side="bottom" className="h-[90vh] p-0 bg-black/80 backdrop-blur-xl border-t border-white/20 rounded-t-3xl">
            <ChatWidget endpoint={CHAT_ENDPOINT} title="Talk with Tommy's AI" welcome="Hi! 👋 Ask me about Tommy's work, projects, or resume. I have access to his full background and can give you specific details." speakReplies={true} onClose={closeChat} />
          </SheetContent>
        </Sheet>
      </>;
  }
  return <section ref={heroRef} className="min-h-screen flex items-center justify-center p-6 pb-8 bg-cover bg-center bg-no-repeat relative" style={{
    backgroundImage: 'url(/lovable-uploads/f5f8febe-809a-47df-a2eb-cebc85bb6263.png)'
  }} aria-label="Hero section with profile information">
      <main className="relative max-w-4xl mx-auto text-center backdrop-blur-md bg-black/30 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
        {chatMode ? (/* Chat Mode */
      <ChatWidget endpoint={CHAT_ENDPOINT} title="Talk with Tommy's AI" welcome="Hi! 👋 Ask me about Tommy's work, projects, or resume. I have access to his full background and can give you specific details." speakReplies={true} onClose={closeChat} />) : (/* Default Hero Content */
      <>
            {/* Profile Avatar */}
            <header className="relative">
              <Avatar className="w-32 h-32 mx-auto border-4 border-white/30 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:scale-105">
                <AvatarImage src="/lovable-uploads/00d98ff0-cea1-495b-a987-33713991e19b.png" alt="Tommy Lisiak - Product & Growth Leader | Tech & Sustainability Advocate" loading="eager" />
                <AvatarFallback className="text-2xl font-bold bg-white/20 backdrop-blur-sm text-white border border-white/30">
                  TL
                </AvatarFallback>
              </Avatar>
            </header>

            {/* Bio Section */}
            <article className="space-y-6 mt-8">
              <div className="space-y-2 animate-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
                  Tommy Lisiak
                </h1>
                <p className="text-xl md:text-2xl font-light text-white/80 drop-shadow">
                  Building products for people and progress
                </p>
              </div>
              
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-in slide-in-from-bottom-6 duration-700 delay-200 drop-shadow">
                Hi there 👋 I'm Tommy, based in the San Francisco Bay Area, a product leader focused on the intersection of AI and impact. Most recently at Scout, I led product to help mission-driven companies win non-dilutive funding. Over the past 8 years, I've helped turn complex problems into elegant, scalable, and useful products across climate, finance, SaaS, and media, while building empowered, outcome-driven teams along the way.
              </p>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-in slide-in-from-bottom-6 duration-700 delay-200 drop-shadow">
                Outside of work, you'll usually find me playing or watching soccer, cooking something gourmet, hiking a new trail, tending to my plants, catching up with friends, reading, or hanging out with my partner and dog, Paco. Thanks for stopping by my little corner of the web!
              </p>
            </article>

            {/* Action Buttons */}
            <nav className="flex flex-wrap justify-center gap-4 mt-6 animate-in slide-in-from-bottom-8 duration-700 delay-400" aria-label="Social media and contact links">
              <Button variant="glass" size="lg" asChild>
                <a href="https://www.linkedin.com/in/tommylisiak/" target="_blank" rel="noopener noreferrer" aria-label="Visit Tommy Lisiak's LinkedIn profile">
                  <Linkedin className="w-5 h-5 mr-2" aria-hidden="true" />
                  LinkedIn
                </a>
              </Button>
              
              <Button variant="glass" size="lg" asChild>
                <a href="https://drive.google.com/file/d/1CRRtz-5OmoVZtvo1UJQX7Q0PDZ5ecZJD/view?usp=sharing" target="_blank" rel="noopener noreferrer" aria-label="Download Tommy Lisiak's resume">
                  <FileText className="w-5 h-5 mr-2" aria-hidden="true" />
                  Resume
                </a>
              </Button>
              
              <Button variant="glass" size="lg" asChild>
                <a href="https://github.com/tlisiak" target="_blank" rel="noopener noreferrer" aria-label="Visit Tommy Lisiak's GitHub profile">
                  <Github className="w-5 h-5 mr-2" aria-hidden="true" />
                  GitHub
                </a>
              </Button>
              
              <Button variant="glass" size="lg" asChild>
                <a href="mailto:tommylisiak@gmail.com" aria-label="Send email to Tommy Lisiak">
                  <Mail className="w-5 h-5 mr-2" aria-hidden="true" />
                  Email
                </a>
              </Button>
            </nav>

            {/* Fun Things Section */}
            <aside className="mt-8 space-y-4 animate-in slide-in-from-bottom-10 duration-700 delay-500">
              <h2 className="text-2xl font-semibold text-white/90 drop-shadow">Fun Projects</h2>
              <nav className="flex flex-wrap justify-center gap-4" aria-label="Personal projects">
                <Button ref={ctaButtonRef} variant="glass" size="lg" onClick={openChat} className="border-green-300/60 hover:border-green-200 hover:bg-green-500/20 animate-pulse">
                  <MessageCircle className="w-5 h-5 mr-2" aria-hidden="true" />
                  Chat with Me
                </Button>
                
                <Button variant="glass" size="lg" className="border-orange-300/60 hover:border-orange-200 hover:bg-orange-500/20" asChild>
                  <a href="https://redfoxlabs.co" target="_blank" rel="noopener noreferrer" aria-label="Visit Red Fox Labs website">
                    <Cat className="w-5 h-5 mr-2" aria-hidden="true" />
                    Red Fox Labs
                  </a>
                </Button>
                
                <Button variant="glass" size="lg" asChild>
                  <a href="https://goalpredict.app/" target="_blank" rel="noopener noreferrer" aria-label="Visit Goal Predict app">
                    <Trophy className="w-5 h-5 mr-2" aria-hidden="true" />
                    Goal Predict
                  </a>
                </Button>
              </nav>
            </aside>

            {/* Footer text */}
            <footer className="mt-12 pt-6 border-t border-white/20 animate-in slide-in-from-bottom-10 duration-700 delay-600">
              <p className="text-sm text-white/80">
                Built by <a href="https://redfoxlabs.co" target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:text-white/90 transition-colors" aria-label="Visit Red Fox Labs website">
                  Red Fox Labs
                </a>
              </p>
            </footer>
          </>)}
      </main>
    </section>;
};
export default HeroSection;