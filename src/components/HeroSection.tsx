import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Linkedin, Github, Mail, Cat, Trophy, FileText, MessageCircle, Calendar } from "lucide-react";
import ChatWidget from "./ChatWidget";

const SWIPE_THRESHOLD = 80;

const HeroSection = () => {
  const [chatMode, setChatMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  
  // Swipe gesture state
  const touchStartY = useRef<number | null>(null);
  const sheetContentRef = useRef<HTMLDivElement>(null);

  // Page load fade-in
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const openChat = () => {
    setChatMode(true);
    heroRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  const closeChat = () => {
    setChatMode(false);
    setPullProgress(0);
    setTimeout(() => ctaButtonRef.current?.focus(), 100);
  };

  // Swipe-down gesture handlers (mobile only)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    const scrollableContainer = target.closest('[data-chat-messages]');
    
    if (scrollableContainer && scrollableContainer.scrollTop > 0) {
      touchStartY.current = null;
      return;
    }
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;
    
    const progress = Math.min(Math.max(diff / SWIPE_THRESHOLD, 0), 1);
    setPullProgress(progress);
    
    if (diff > SWIPE_THRESHOLD) {
      touchStartY.current = null;
      closeChat();
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    touchStartY.current = null;
    setPullProgress(0);
  }, []);

  const isReady = pullProgress >= 1;

  return (
    <>
      <section 
        ref={heroRef} 
        className={`min-h-screen flex items-center justify-center p-6 pb-8 relative transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        aria-label="Hero section with profile information"
      >
        {/* Background image with responsive formats */}
        <picture className="absolute inset-0">
          <source 
            srcSet="/lovable-uploads/background.webp" 
            type="image/webp" 
          />
          <img 
            src="/lovable-uploads/f5f8febe-809a-47df-a2eb-cebc85bb6263.png"
            alt=""
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        
        {/* Dark overlay for background */}
        <div className="absolute inset-0 bg-black/25" />
        
        <main className="relative max-w-4xl w-full mx-auto backdrop-blur-md bg-black/30 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="text-center">
            {/* Profile Header: Avatar + Name */}
            <header className="relative flex flex-col md:flex-row items-center md:justify-center md:gap-8">
              <Avatar className="w-32 h-32 border-4 border-white/30 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:scale-105 shrink-0">
                <AvatarImage 
                  src="/lovable-uploads/00d98ff0-cea1-495b-a987-33713991e19b.png" 
                  alt="Tommy Lisiak - Product & Growth Leader | Tech & Sustainability Advocate" 
                  loading="eager" 
                />
                <AvatarFallback className="text-2xl font-bold bg-white/20 backdrop-blur-sm text-white border border-white/30">
                  TL
                </AvatarFallback>
              </Avatar>
              <div className="mt-6 md:mt-0 md:text-left space-y-2 animate-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
                  Tommy Lisiak
                </h1>
                <p className="text-2xl md:text-3xl font-light text-white/80 drop-shadow" style={{ fontFamily: "'Caveat', cursive" }}>
                  Building products for people and progress
                </p>
              </div>
            </header>

            {/* Bio Section */}
            <article className="space-y-6 mt-8">
              
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-in slide-in-from-bottom-6 duration-700 delay-200 drop-shadow">
                ​Hi there 👋 I'm Tommy, a San Francisco Bay Area based product and startup leader passionate about the intersection of AI, sustainability and impact. I love building solutions that integrate with the human experience to make the world a better place. As Head of Product @ Scout, I lead product strategy and development for an AI-powered grant platform that's helped 1,000+ users secure over $10M+ in funding. 

Over the past 8 years, I've built scalable systems and empowered teams that turn complex problems into meaningful, measurable outcomes across energy, fintech, climate tech, SaaS, and media. 

Outside of work, I'm usually playing or watching soccer, experimenting in the kitchen, exploring new trails, or hanging out with my fiancée and our dog, Paco.
              </p>
            </article>

            {/* Primary CTA */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 animate-in slide-in-from-bottom-8 duration-700 delay-400">
              <Button 
                variant="glass" 
                size="lg" 
                className="text-lg px-10 py-6 border-rose-400/70 hover:border-rose-300 hover:bg-rose-500/25 shadow-[0_0_25px_hsl(350_80%_60%/0.5),0_0_50px_hsl(350_80%_60%/0.25)] hover:shadow-[0_0_35px_hsl(350_80%_60%/0.6),0_0_70px_hsl(350_80%_60%/0.3)]" 
                asChild
              >
                <a href="https://calendar.app.google/Gprm21LzaVVUGQ9V8" target="_blank" rel="noopener noreferrer" aria-label="Book time with Tommy Lisiak">
                  <Calendar className="w-6 h-6 mr-2" aria-hidden="true" />
                  Book Time
                </a>
              </Button>
              <Button 
                ref={ctaButtonRef} 
                variant="glass" 
                size="lg" 
                onClick={openChat} 
                className="text-lg px-10 py-6 border-green-300/60 hover:border-green-200 hover:bg-green-500/20 shadow-[0_0_25px_hsl(150_70%_55%/0.5),0_0_50px_hsl(150_70%_55%/0.25)] hover:shadow-[0_0_35px_hsl(150_70%_55%/0.6),0_0_70px_hsl(150_70%_55%/0.3)]"
              >
                <MessageCircle className="w-6 h-6 mr-2" aria-hidden="true" />
                Chat with Me
              </Button>
            </div>

            {/* Experience Section */}
            <section className="mt-10 space-y-4 animate-in slide-in-from-bottom-8 duration-700 delay-400">
              <h2 className="text-3xl font-semibold text-white/90 drop-shadow" style={{ fontFamily: "'Caveat', cursive" }}>Experience</h2>
              <div className="space-y-3 text-left max-w-2xl mx-auto">
                {[
                  { logo: "/logos/scout.png", company: "Scout", role: "Head of Product", dates: "Mar 2025 – Present" },
                  { logo: "/logos/inspire.png", company: "Inspire (Shell)", role: "Senior Product Manager", dates: "Nov 2021 – Mar 2025" },
                  { logo: "/logos/wapo.png", company: "The Washington Post", role: "Product Manager, Zeus Technology", dates: "Apr 2020 – Nov 2021" },
                  { logo: "/logos/arcadia.png", company: "Arcadia", role: "Product Manager, Utility Data", dates: "Aug 2019 – Mar 2020" },
                  { logo: "/logos/xappmedia.png", company: "XAPPmedia", role: "Product Manager, Voice UX", dates: "Jun 2017 – Jul 2019" },
                ].map((exp) => (
                  <div key={exp.company} className="flex items-center gap-4 py-3 border-b border-white/10 last:border-b-0">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/10 overflow-hidden">
                      <img src={exp.logo} alt={`${exp.company} logo`} className="w-6 h-6 object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-white font-semibold">{exp.company}</span>
                        <span className="text-white/50 text-sm">{exp.dates}</span>
                      </div>
                      <p className="text-white/70 text-sm">{exp.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Fun Things Section */}
            <aside className="mt-8 space-y-4 animate-in slide-in-from-bottom-10 duration-700 delay-500">
              <h2 className="text-3xl font-semibold text-white/90 drop-shadow" style={{ fontFamily: "'Caveat', cursive" }}>Fun Projects</h2>
              <nav className="flex flex-wrap justify-center gap-4" aria-label="Personal projects">
                <Button 
                  variant="glass" 
                  size="lg" 
                  className="border-purple-300/60 hover:border-purple-200 hover:bg-purple-500/20 shadow-[0_0_20px_hsl(270_70%_60%/0.4),0_0_35px_hsl(270_70%_60%/0.2)]" 
                  asChild
                >
                  <a href="https://goalpredict.app/" target="_blank" rel="noopener noreferrer" aria-label="Visit Goal Predict app">
                    <Trophy className="w-5 h-5 mr-2" aria-hidden="true" />
                    Goal Predict
                  </a>
                </Button>
                
                <Button variant="glass" size="lg" className="border-orange-300/60 hover:border-orange-200 hover:bg-orange-500/20" asChild>
                  <a href="https://redfoxlabs.co" target="_blank" rel="noopener noreferrer" aria-label="Visit Red Fox Labs website">
                    <Cat className="w-5 h-5 mr-2" aria-hidden="true" />
                    Red Fox Labs
                  </a>
                </Button>
              </nav>
            </aside>

            {/* Informal Links */}
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-white/60 text-sm animate-in slide-in-from-bottom-10 duration-700 delay-500">
              {[
                { href: "https://www.linkedin.com/in/tommylisiak/", icon: Linkedin, label: "LinkedIn" },
                { href: "https://drive.google.com/file/d/1CRRtz-5OmoVZtvo1UJQX7Q0PDZ5ecZJD/view?usp=sharing", icon: FileText, label: "Resume" },
                { href: "https://github.com/tlisiak", icon: Github, label: "GitHub" },
                { href: "mailto:tommylisiak@gmail.com", icon: Mail, label: "Email" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={label === "Email" ? undefined : "_blank"}
                  rel={label === "Email" ? undefined : "noopener noreferrer"}
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors duration-200 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-px after:bottom-0 after:left-0 after:bg-white/60 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                </a>
              ))}
            </div>

            {/* Footer text */}
            <footer className="mt-8 pt-6 border-t border-white/20 animate-in slide-in-from-bottom-10 duration-700 delay-600">
              <p className="text-lg text-white/80" style={{ fontFamily: "'Caveat', cursive" }}>
                Built by{" "}
                <a 
                  href="https://redfoxlabs.co" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white font-medium relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left" 
                  aria-label="Visit Red Fox Labs website"
                >
                  Red Fox Labs
                </a>
                {" "}(aka me)
              </p>
            </footer>
          </div>
        </main>
      </section>

      {/* Chat Sheet - used for both mobile and desktop */}
      <Sheet open={chatMode} onOpenChange={open => !open && closeChat()}>
        <SheetContent 
          ref={sheetContentRef}
          side="bottom" 
          className={`p-0 bg-black/40 backdrop-blur-lg border-t border-white/25 rounded-t-3xl ${
            isMobile 
              ? 'h-[95dvh] max-h-[95dvh]' 
              : 'h-[70vh] max-h-[600px] max-w-3xl mx-auto md:rounded-t-3xl md:border-x'
          }`}
          onTouchStart={isMobile ? handleTouchStart : undefined}
          onTouchMove={isMobile ? handleTouchMove : undefined}
          onTouchEnd={isMobile ? handleTouchEnd : undefined}
        >
          {/* Pull indicator (mobile only) */}
          {isMobile && (
            <div className="flex flex-col items-center pt-3 pb-1">
              <div 
                className="h-1 rounded-full transition-all duration-100"
                style={{
                  width: `${Math.max(40, 40 + pullProgress * 40)}px`,
                  backgroundColor: isReady 
                    ? 'rgb(74, 222, 128)' 
                    : `rgba(255, 255, 255, ${0.4 + pullProgress * 0.4})`,
                }}
              />
              {pullProgress > 0.1 && (
                <span 
                  className="text-xs mt-1 transition-opacity duration-150"
                  style={{ 
                    opacity: pullProgress,
                    color: isReady ? 'rgb(74, 222, 128)' : 'rgba(255, 255, 255, 0.6)'
                  }}
                >
                  {isReady ? 'Release to close' : 'Pull to close'}
                </span>
              )}
            </div>
          )}
          <ChatWidget 
            title="Chat with Me" 
            welcome={"Hi! Ask me anything about my work, projects, or even personal interests!\n\nI'm happy to share specific details about my experience!"}
            onClose={closeChat} 
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default HeroSection;
