export const mockProfiles = [
  {
    userId: "u1",
    name: "Arjun Sharma",
    avatar: "https://ui-avatars.com/api/?name=Arjun+Sharma&background=6366F1&color=fff",
    bio: "Full stack developer interested in blockchain, AI, and scalable microservices. Built two hackathon-winning projects.",
    headline: "Pre-final Year CS Student | Technical Architect",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker", "Solidity"],
    interests: ["Fintech", "Web3", "Artificial Intelligence"],
    availability: "PART_TIME",
    github: "github.com/arjunsharma",
    linkedin: "linkedin.com/in/arjunsharma",
    portfolio: "arjun.dev",
    personalityTraits: ["Analytical", "Executor"]
  },
  {
    userId: "u2",
    name: "Priya Patel",
    avatar: "https://ui-avatars.com/api/?name=Priya+Patel&background=06B6D4&color=fff",
    bio: "Product designer passionate about creating clean, user-centric interfaces. Experienced in wireframing, prototyping, and brand design.",
    headline: "UI/UX Designer | Creative Lead",
    skills: ["Figma", "Adobe XD", "User Research", "Wireframing", "Tailwind CSS"],
    interests: ["EdTech", "SaaS", "HealthTech"],
    availability: "FULL_TIME",
    github: "github.com/priyadesign",
    linkedin: "linkedin.com/in/priyapatel",
    portfolio: "priya.design",
    personalityTraits: ["Visionary", "Creative"]
  },
  {
    userId: "u3",
    name: "Kabir Mehta",
    avatar: "https://ui-avatars.com/api/?name=Kabir+Mehta&background=F59E0B&color=fff",
    bio: "Management student specializing in growth marketing, customer development, and business model generation. Startup enthusiast.",
    headline: "Marketing Strategist | Growth Hacker",
    skills: ["Google Analytics", "Growth Hacking", "SEO", "Pitching", "Financial Modeling"],
    interests: ["E-commerce", "Fintech", "Creator Economy"],
    availability: "PART_TIME",
    github: "",
    linkedin: "linkedin.com/in/kabirmehta",
    portfolio: "kabirmarketing.co",
    personalityTraits: ["Visionary", "Communicator"]
  },
  {
    userId: "u4",
    name: "Sneha Reddy",
    avatar: "https://ui-avatars.com/api/?name=Sneha+Reddy&background=10B981&color=fff",
    bio: "AI researcher focusing on computer vision and natural language processing. Looking to join a startup building generative AI tools.",
    headline: "AI/ML Engineer | Researcher",
    skills: ["Python", "PyTorch", "TensorFlow", "FastAPI", "Pandas", "Scikit-Learn"],
    interests: ["Artificial Intelligence", "HealthTech", "DeepTech"],
    availability: "FULL_TIME",
    github: "github.com/snehareddy",
    linkedin: "linkedin.com/in/snehareddy",
    portfolio: "snehaml.io",
    personalityTraits: ["Analytical", "Visionary"]
  }
];

export const mockProjects = [
  {
    id: "p1",
    title: "MedSync AI",
    tagline: "AI-powered clinical documentation and diagnostic support for doctors.",
    description: "MedSync AI uses local LLMs to transcribe doctor-patient conversations in real-time, generate structured clinical summaries, and offer secondary diagnostic recommendations based on medical databases.",
    domain: "HealthTech",
    status: "DEVELOPMENT",
    logoUrl: "https://ui-avatars.com/api/?name=MedSync&background=EF4444&color=fff",
    pitchDeckUrl: "medsync_pitch.pdf",
    creator: { profile: { name: "Dr. Rohan Das", avatar: "https://ui-avatars.com/api/?name=Rohan+Das&background=3B82F6&color=fff" } },
    members: [
      { userId: "u4", roleName: "AI Engineer", user: { profile: { name: "Sneha Reddy", avatar: "https://ui-avatars.com/api/?name=Sneha+Reddy&background=10B981&color=fff" } } }
    ],
    roles: [
      { id: "r1", title: "Frontend Lead", description: "Design and implement the doctor dashboard using React/Next.js.", skillsRequired: ["React", "TypeScript", "Tailwind CSS"], isFilled: false },
      { id: "r2", title: "Backend co-founder", description: "Build scalable microservices and integrate LLM inference endpoints.", skillsRequired: ["Node.js", "Docker", "PostgreSQL"], isFilled: false }
    ],
    milestones: [
      { id: "m1", title: "Complete LLM Fine-tuning", description: "Fine-tune medical text models on clinical summaries.", dueDate: "2026-07-15", isCompleted: true },
      { id: "m2", title: "Launch MVP Dashboard", description: "Deploy initial doctor dashboard on staging.", dueDate: "2026-08-30", isCompleted: false },
      { id: "m3", title: "First 10 Beta Clinics", description: "Onboard initial local clinics for workflow tests.", dueDate: "2026-10-15", isCompleted: false }
    ],
    updates: [
      { id: "up1", title: "LLM Inference latency reduced by 40%", content: "We transitioned our inference engines to vLLM, cutting processing durations in half.", author: { profile: { name: "Rohan Das" } }, createdAt: "2026-06-10" }
    ]
  },
  {
    id: "p2",
    title: "EduLink",
    tagline: "Gamified learning companion and peer mentorship hub for engineering colleges.",
    description: "EduLink bridges student learning gaps by pairing them with senior student tutors. Relies on peer tokens, quest-based learning structures, and direct college partnership administration boards.",
    domain: "EdTech",
    status: "IDEA",
    logoUrl: "https://ui-avatars.com/api/?name=EduLink&background=8B5CF6&color=fff",
    pitchDeckUrl: "edulink_deck.pdf",
    creator: { profile: { name: "Priya Patel", avatar: "https://ui-avatars.com/api/?name=Priya+Patel&background=06B6D4&color=fff" } },
    members: [],
    roles: [
      { id: "r3", title: "Marketing Partner", description: "Form partnerships with student clubs and design outreach.", skillsRequired: ["Growth Hacking", "Social Media", "SEO"], isFilled: false }
    ],
    milestones: [
      { id: "m4", title: "Draft Wireframes", description: "Develop Figma layouts.", dueDate: "2026-06-25", isCompleted: false }
    ],
    updates: []
  }
];

export const mockMentors = [
  {
    id: "m1",
    name: "Vikram Sen",
    avatar: "https://ui-avatars.com/api/?name=Vikram+Sen&background=111827&color=fff",
    expertise: ["SaaS", "Financial Modeling", "Seed Funding"],
    bio: "Ex-Founder of SaaS scaleups. Helped raise over USD 12 Million in seed rounds. Loves mentoring college founders.",
    hourlyRate: 1500,
    rating: 4.9,
    sessionsCount: 34
  },
  {
    id: "m2",
    name: "Ananya Iyer",
    avatar: "https://ui-avatars.com/api/?name=Ananya+Iyer&background=1F2937&color=fff",
    expertise: ["AI/ML Research", "Product Management", "NLP"],
    bio: "Lead Product Manager at OpenAI. Engineering graduate. Passionate about LLMs and AI agent interface design.",
    hourlyRate: 2500,
    rating: 5.0,
    sessionsCount: 18
  }
];

export const mockInternships = [
  {
    id: "i1",
    projectTitle: "MedSync AI",
    logoUrl: "https://ui-avatars.com/api/?name=MedSync&background=EF4444&color=fff",
    title: "AI Inference Systems Intern",
    description: "Help scale our local LLM inference structures and connect them to web sockets.",
    requirements: ["Python", "FastAPI", "Docker", "Basic ML Knowledge"],
    stipend: 15000,
    duration: 3,
    location: "REMOTE"
  },
  {
    id: "i2",
    projectTitle: "EduLink",
    logoUrl: "https://ui-avatars.com/api/?name=EduLink&background=8B5CF6&color=fff",
    title: "UI/UX Graphic Designer",
    description: "Design learning cards interfaces and create promotional social assets.",
    requirements: ["Figma", "Illustrator", "Portfolio of web layouts"],
    stipend: 8000,
    duration: 2,
    location: "HYBRID"
  }
];
