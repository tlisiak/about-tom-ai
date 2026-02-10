const experiences = [
  { logo: "/logos/scout.png", company: "Scout", role: "Head of Product", dates: "Mar 2025 – Present" },
  { logo: "/logos/inspire.png", company: "Inspire (Shell)", role: "Senior Product Manager", dates: "Nov 2021 – Mar 2025" },
  { logo: "/logos/wapo.png", company: "The Washington Post", role: "Product Manager, Zeus Technology", dates: "Apr 2020 – Nov 2021" },
  { logo: "/logos/arcadia.png", company: "Arcadia", role: "Product Manager, Utility Data", dates: "Aug 2019 – Mar 2020" },
  { logo: "/logos/xappmedia.png", company: "XAPPmedia", role: "Product Manager, Voice UX", dates: "Jun 2017 – Jul 2019" },
];

const ExperienceTimeline = () => {
  return (
    <section className="mt-10 space-y-4 animate-in slide-in-from-bottom-8 duration-700 delay-400">
      <h2
        className="text-3xl font-semibold text-white/90 drop-shadow text-center"
        style={{ fontFamily: "'Caveat', cursive" }}
      >
        Experience
      </h2>

      {/* Timeline container */}
      <div className="relative max-w-3xl mx-auto">
        {/* Central line (desktop: center, mobile: left) */}
        <div className="absolute top-0 bottom-0 left-4 md:left-1/2 w-px bg-white/20 -translate-x-1/2" />

        <div className="space-y-8 md:space-y-10">
          {experiences.map((exp, i) => {
            const isLeft = i % 2 === 0; // odd entries (0-indexed even) go left on desktop

            return (
              <div
                key={exp.company}
                className={`relative flex items-start gap-4 pl-10 md:pl-0 ${
                  isLeft ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                {/* Dot on timeline */}
                <div
                  className="absolute left-4 md:left-1/2 top-3 w-3 h-3 rounded-full bg-white/60 border-2 border-white/30 -translate-x-1/2 z-10"
                />

                {/* Spacer for the other side (desktop only) */}
                <div className="hidden md:block md:w-1/2" />

                {/* Content card */}
                <div
                  className={`md:w-1/2 flex items-start gap-3 text-left ${
                    isLeft ? "md:justify-end md:text-right" : "md:justify-start md:text-left"
                  }`}
                >
                  {/* Logo - on desktop, swap order for left-side entries */}
                  <div
                    className={`w-9 h-9 flex items-center justify-center shrink-0 ${
                      isLeft ? "md:order-last md:ml-3 md:mr-0" : ""
                    }`}
                  >
                    <img
                      src={exp.logo}
                      alt={`${exp.company} logo`}
                      className="w-7 h-7 object-contain"
                    />
                  </div>

                  {/* Text */}
                  <div className="min-w-0">
                    <p className={`text-white font-semibold ${isLeft ? "md:text-right" : ""}`}>
                      {exp.company}
                    </p>
                    <p className={`text-white/70 text-sm ${isLeft ? "md:text-right" : ""}`}>
                      {exp.role}
                    </p>
                    <p className={`text-white/50 text-xs mt-0.5 ${isLeft ? "md:text-right" : ""}`}>
                      {exp.dates}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;
