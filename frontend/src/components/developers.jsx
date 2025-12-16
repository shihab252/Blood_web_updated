import React from "react";

export default function Developers() {
  const teamMembers = [
    {
      id: 1,
      name: "Shihab Uddin Khan",
      role: "Team Leader & Full Stack Developer",
      image: "/image/Shihab.jpg", 
      email: "khanshihab252@gmail.com",
      bio: "An Ethical Hacker and Full Stack wizard. Passionate about exploring the depths of the internet, cybersecurity, and building robust web architectures.",
      skills: ["MERN Stack", "Ethical Hacking", "System Security"],
      social: { github: "#", linkedin: "#" },
    },
    {
      id: 2,
      name: "Tanjil Bhuiyan Joy",
      role: "Junior Frontend Developer",
      image: "/image/Joy.jpg",
      email: "muhammadbinarad@gmail.com",
      bio: "A creative frontend enthusiast dedicated to crafting responsive and interactive user interfaces. Loves turning complex logic into smooth visual experiences.",
      skills: ["React.js", "Tailwind CSS", "JavaScript"],
      social: { github: "#", linkedin: "#" },
    },
    {
      id: 3,
      name: "Aporna Bhumik",
      role: "Junior Backend Developer",
      image: "/image/aporna.jpeg",
      email: "aporna@gmail.com",
      bio: "The structural organizer of the team. Active across multiple fields, she ensures the backend logic is solid and the team stays coordinated.",
      skills: ["Node.js", "Express.js", "MongoDB"],
      social: { github: "#", linkedin: "#" },
    },
    {
      id: 4,
      name: "Asifur Rahman",
      role: "Product Strategist & Developer",
      image: "/image/Atef.jpg",
      email: "atef@gmail.com",
      bio: "Focused on the bigger picture. He bridges the gap between technical code and market needs through data-driven decision making and competitive analysis.",
      skills: ["Product Strategy", "Tech Management", "Analytics"],
      social: { github: "#", linkedin: "#" },
    },
    {
      id: 5,
      name: "Nowrin",
      role: "UI/UX Designer",
      image: "/image/Nowrin.jpg",
      email: "nowrin@example.com",
      bio: "An artist with a technical edge. Specializes in mobile-first design and user research to ensure the application is not just functional, but beautiful.",
      skills: ["Figma", "User Research", "Mobile Design"],
      social: { github: "#", linkedin: "#" },
    },
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden" id="developers">
      {/* --- Background Pattern --- */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>
      
      {/* --- Decorative Blobs --- */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* --- Header --- */}
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 mb-4 border border-red-200 rounded-full bg-red-50/50 backdrop-blur-sm">
            <span className="text-red-600 font-bold tracking-widest uppercase text-xs">
              The Dream Team
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Builders</span>
          </h2>
          <p className="mt-6 text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            United by code and driven by compassion. We are the diverse minds working behind the scenes to save lives.
          </p>
        </div>

        {/* --- Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10 justify-items-center">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="group relative w-full max-w-sm"
            >
              {/* Card Container */}
              <div className="relative h-full bg-white/60 backdrop-blur-lg border border-white/20 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-red-500/10 hover:bg-white/80">
                
                {/* Avatar Section with Gradient Ring */}
                <div className="relative mx-auto mb-8 w-32 h-32">
                  <div className="absolute inset-0 bg-gradient-to-tr from-red-500 to-orange-500 rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <div className="relative w-full h-full rounded-full p-[3px] bg-gradient-to-tr from-slate-100 to-slate-200 group-hover:from-red-500 group-hover:to-orange-500 transition-colors duration-500">
                    <img
                      src={member.image}
                      onError={(e) => {e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}} 
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full border-4 border-white shadow-sm"
                    />
                  </div>
                  {/* Status Indicator */}
                  <div className="absolute bottom-2 right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-md z-10"></div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-red-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-100 pb-4">
                    {member.role}
                  </p>
                  
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {member.bio}
                  </p>

                  {/* Skills Pills */}
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {member.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-lg group-hover:bg-red-50 group-hover:text-red-600 transition-colors duration-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Floating Action Buttons */}
                  <div className="flex items-center justify-center gap-4">
                    <SocialButton href={`mailto:${member.email}`} icon="fas fa-envelope" color="red" />
                    <SocialButton href={member.social.github} icon="fab fa-github" color="slate" />
                    <SocialButton href={member.social.linkedin} icon="fab fa-linkedin-in" color="blue" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Helper Component for Social Buttons
function SocialButton({ href, icon, color }) {
  const colorClasses = {
    red: "text-red-500 hover:bg-red-500 hover:text-white hover:shadow-red-500/30",
    slate: "text-slate-700 hover:bg-slate-800 hover:text-white hover:shadow-slate-800/30",
    blue: "text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-blue-600/30",
  };

  return (
    <a
      href={href}
      className={`w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center transition-all duration-300 shadow-sm hover:-translate-y-1 hover:shadow-lg ${colorClasses[color]}`}
    >
      <i className={icon}></i>
    </a>
  );
}