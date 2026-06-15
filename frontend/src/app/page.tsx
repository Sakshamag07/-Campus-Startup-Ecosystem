'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  useStore 
} from '../store/useStore';
import { 
  mockProfiles, 
  mockProjects, 
  mockMentors, 
  mockInternships 
} from '../services/mockData';
import { 
  Rocket, 
  Users, 
  Layers, 
  GraduationCap, 
  Briefcase, 
  MessageSquare, 
  Cpu, 
  User as UserIcon, 
  ShieldAlert, 
  Bell, 
  Compass, 
  Sparkles, 
  Send, 
  LucideIcon
} from 'lucide-react';

interface SidebarTab {
  id: string;
  name: string;
  icon: LucideIcon;
}

export default function Home() {
  // Safe destructuring compatible with strict Zustand configurations
  const { 
    user, 
    isAuthenticated, 
    activeTab, 
    setActiveTab, 
    login, 
    register, 
    logout 
  } = useStore((state: any) => state);

  // Auth local state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('STUDENT');

  // API loading / error states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // App local states
  const [activeIdeaText, setActiveIdeaText] = useState('');
  const [ideaReport, setIdeaReport] = useState<any>(null);
  const [resumeReport, setResumeReport] = useState<any>(null);
  const [teamHealthReport, setTeamHealthReport] = useState<any>(null);
  const [selectedHealthProject, setSelectedHealthProject] = useState('p1');
  const [billingModal, setBillingModal] = useState(false);
  const [billingPlan, setBillingPlan] = useState('');
  
  // Custom Profiles / Projects State with explicit array typings
  const [profilesList] = useState<any[]>(mockProfiles);
  const [projectsList, setProjectsList] = useState<any[]>(mockProjects);
  const [internshipsList, setInternshipsList] = useState<any[]>(mockInternships);
  const [mentorsList] = useState<any[]>(mockMentors);
  
  // User Profile edit states
  const [myProfile, setMyProfile] = useState<any>({
    name: 'Jane Doe',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&background=6366F1&color=fff',
    headline: 'Engineering Student | Tech Enthusiast',
    bio: 'Fascinated by building apps that help communities. Looking to join a startup project.',
    skills: ['React', 'CSS', 'JavaScript'],
    interests: ['EdTech', 'Social Impact'],
    availability: 'PART_TIME',
    personalityTraits: ['Executor', 'Communicator']
  });
  const [newSkill, setNewSkill] = useState('');

  // Connections List state
  const [connections, setConnections] = useState<any[]>([]);
  const [cardIndex, setCardIndex] = useState(0);

  // Chat local state
  const [chatRooms, setChatRooms] = useState<any[]>([
    { id: 'room1', name: 'MedSync Team Group', type: 'TEAM', members: [], messages: [
      { id: 'm_1', senderName: 'Rohan Das', content: 'Welcome to the team! Glad to have you.', time: '10:30 AM' }
    ] },
    { id: 'room2', name: 'Priya Patel', type: 'DIRECT', members: [], messages: [
      { id: 'm_2', senderName: 'Priya Patel', content: "Hey Arjun, saw your profile. Let's catch up to discuss EduLink?", time: 'Yesterday' }
    ] }
  ]);
  const [selectedRoomId, setSelectedRoomId] = useState('room1');
  const [chatInput, setChatInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Create Project state
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjTagline, setNewProjTagline] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjDomain, setNewProjDomain] = useState('');
  const [newProjRoles, setNewProjRoles] = useState('');
  const [newProjMilestones, setNewProjMilestones] = useState('');
  const [applyModal, setApplyModal] = useState<any>(null); 
  const [applyLetter, setApplyLetter] = useState('');

  // Post Internship state
  const [newInternTitle, setNewInternTitle] = useState('');
  const [newInternDesc, setNewInternDesc] = useState('');
  const [newInternReqs, setNewInternReqs] = useState('');
  const [newInternStipend, setNewInternStipend] = useState('');

  // Mentor Booking state
  const [bookMentorModal, setBookMentorModal] = useState<any>(null);
  const [mentorDate, setMentorDate] = useState('');
  const [mentorTime, setMentorTime] = useState('');
  const [mentorSessions, setMentorSessions] = useState<any[]>([
    { id: 'sess_1', mentorName: 'Vikram Sen', date: '2026-06-18', time: '14:00', status: 'BOOKED', link: 'https://meet.jit.si/startiva-vikram' }
  ]);

  // Notifications
  const [notifications, setNotifications] = useState<any[]>([
    { id: 'n1', title: 'AI Matching Completed', content: 'We found 4 potential co-founders with complementary skills.', type: 'MATCH', time: '5m ago' },
    { id: 'n2', title: 'Welcome to Startiva', content: 'Setup your profile to begin matching.', type: 'SYSTEM', time: '1h ago' }
  ]);

  // Scroll chat bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatRooms, selectedRoomId]);

  // Auto-fill active profile if user logs in
  useEffect(() => {
    if (user) {
      setMyProfile((prev: any) => ({
        ...prev,
        name: user.name || 'Jane Doe',
        avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366F1&color=fff`
      }));
    }
  }, [user]);

  // Handle Auth
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        await login({ email, password });
      } else {
        await register({ email, password, name, role });
      }
    } catch (err: any) {
      console.error(err || error);
      const mockUser = {
        id: `usr_${Math.random().toString(36).substring(2, 9)}`,
        name: name || (email ? email.split('@')[0] : 'Demo User'),
        email: email || 'demo@startiva.com',
        role: role as any,
        isPremium: false
      };
      useStore.getState().setUser(mockUser);
    } finally {
      setLoading(false);
    }
  };

  // Co-founder Connect action
  const handleConnect = (candidate: any) => {
    setConnections(prev => [...prev, { ...candidate, status: 'CONNECTED' }]);
    
    setNotifications(prev => [
      { id: Date.now().toString(), title: 'New Connection Match!', content: `You matched with ${candidate.name}! Open Chat to coordinate.`, type: 'MATCH', time: 'Just now' },
      ...prev
    ]);

    const newRoom = {
      id: `room_${Date.now()}`,
      name: candidate.name,
      type: 'DIRECT',
      messages: [
        { id: `m_c_${Date.now()}`, senderName: candidate.name, content: `Hey! I saw we had high compatibility (${calculateMatchScore(myProfile, candidate)}% match). I'd love to discuss coding projects!`, time: 'Just now' }
      ]
    };

    setChatRooms(prev => [...prev, newRoom]);
    setCardIndex(prev => prev + 1);
  };

  // Mock AI calculations
  const runValidator = () => {
    if (!activeIdeaText || activeIdeaText.length < 10) {
      alert('Please enter a descriptive startup idea (at least 10 characters).');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const normalized = activeIdeaText.toLowerCase();
      let domain = 'General Startup';
      if (normalized.includes('health') || normalized.includes('doctor') || normalized.includes('clinic')) domain = 'HealthTech';
      else if (normalized.includes('learn') || normalized.includes('college') || normalized.includes('student') || normalized.includes('course')) domain = 'EdTech';
      else if (normalized.includes('money') || normalized.includes('pay') || normalized.includes('wallet') || normalized.includes('crypto')) domain = 'FinTech';
      else if (normalized.includes('shop') || normalized.includes('buy') || normalized.includes('ecom') || normalized.includes('store')) domain = 'E-commerce';
      else if (normalized.includes('ai') || normalized.includes('gpt') || normalized.includes('bot') || normalized.includes('intelligence')) domain = 'Artificial Intelligence';

      setIdeaReport({
        idea: activeIdeaText,
        marketAnalysis: {
          tam: `USD 12.5 Billion global market for ${domain} platforms.`,
          sam: `USD 1.8 Billion addressable regional campus/student audience.`,
          som: `USD 45 Million initial launch within local colleges and partner networks.`
        },
        competitors: ['LinkedIn (too broad)', 'Y Combinator directory', 'Discord groups'],
        swot: {
          strengths: ['Low initial operational cost', 'Direct student acquisition paths'],
          weaknesses: ['Student lack of initial capital', 'High seasonal churn during exams'],
          opportunities: ['University entrepreneurship cell partnerships', 'National scale-up grants'],
          threats: ['Clones by large software houses', 'Low retention if co-founders drop out']
        },
        revenueModel: 'Freemium dashboard access. $9/month premium options, 15% commission on paid mentor sessions.',
        risks: ['Traditional college admins slow to adopt', 'High student rotation']
      });
      setLoading(false);
    }, 1200);
  };

  const runResumeAnalyzer = () => {
    setLoading(true);
    setTimeout(() => {
      const skillsScore = 75 + Math.min(myProfile.skills.length * 3, 20);
      setResumeReport({
        skillsScore,
        startupScore: Math.min(skillsScore + 5, 96),
        internshipScore: Math.min(skillsScore - 4, 98),
        improvements: [
          'Add links to your active GitHub repositories or portfolio sites.',
          'Post a clear project description to your profile cards.',
          'Consider picking up container technologies like Docker to boost deployment skills.'
        ]
      });
      setLoading(false);
    }, 1000);
  };

  const runTeamHealth = () => {
    setLoading(true);
    setTimeout(() => {
      const selected = projectsList.find(p => p.id === selectedHealthProject);
      if (selected) {
        setTeamHealthReport({
          score: selected.members.length > 0 ? 88 : 45,
          risks: selected.members.length === 0 
            ? ['Solo Founder Risk: No active team members are added.']
            : ['Skill Gap: The team lacks expertise in frontend design frameworks.'],
          actions: selected.members.length === 0
            ? ['Add at least one co-founder using the swipe matching engine.']
            : ['Hire a UI/UX Designer intern from the Marketplace.']
        });
      }
      setLoading(false);
    }, 800);
  };

  // Profile functions
  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !myProfile.skills.includes(newSkill.trim())) {
      setMyProfile((prev: any) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const deleteSkill = (index: number) => {
    setMyProfile((prev: any) => ({
      ...prev,
      skills: prev.skills.filter((_: any, i: number) => i !== index)
    }));
  };

  // Calculator compatibility
  const calculateMatchScore = (profA: any, profB: any) => {
    let score = 55;
    const skillsA = new Set(profA.skills.map((s: string) => s.toLowerCase()));
    const skillsB = new Set(profB.skills.map((s: string) => s.toLowerCase()));
    const intersection = [...skillsA].filter(x => skillsB.has(x));

    score += Math.min(intersection.length * 8, 20);

    const intA = new Set(profA.interests.map((i: string) => i.toLowerCase()));
    const intB = new Set(profB.interests.map((i: string) => i.toLowerCase()));
    const sharedInt = [...intA].filter(x => intB.has(x));

    score += Math.min(sharedInt.length * 10, 20);

    if (profA.availability === profB.availability) score += 10;
    
    return Math.min(score, 98);
  };

  // Submit project application
  const submitProjectApplication = () => {
    if (!applyModal) return;
    
    const updated = projectsList.map(p => {
      if (p.id === applyModal.id) {
        return {
          ...p,
          members: [
            ...p.members,
            { userId: 'me', roleName: 'Associate', user: { profile: { name: myProfile.name, avatar: myProfile.avatar } } }
          ]
        };
      }
      return p;
    });

    setProjectsList(updated);

    const newRoom = {
      id: `room_${Date.now()}`,
      name: `${applyModal.title} Team Group`,
      type: 'TEAM',
      messages: [
        { id: `m_p_${Date.now()}`, senderName: 'System', content: `You have successfully joined ${applyModal.title}!`, time: 'Just now' }
      ]
    };
    setChatRooms(prev => [...prev, newRoom]);

    setApplyModal(null);
    setApplyLetter('');
    alert('Application submitted! You have been added to the project team.');
  };

  // Create project form submit
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle || !newProjTagline || !newProjDesc || !newProjDomain) {
      alert('Please fill out all required fields.');
      return;
    }

    const newProj = {
      id: `p_${Date.now()}`,
      title: newProjTitle,
      tagline: newProjTagline,
      description: newProjDesc,
      domain: newProjDomain,
      status: 'IDEA' as any,
      logoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(newProjTitle)}&background=random&color=fff`,
      pitchDeckUrl: '',
      creator: { profile: { name: myProfile.name, avatar: myProfile.avatar } },
      members: [],
      roles: newProjRoles.split(',').filter(r => r.trim()).map((r, i) => ({
        id: `r_n_${Date.now()}_${i}`,
        title: r.trim(),
        description: `Responsible for building out project elements.`,
        skillsRequired: ['React', 'Node'],
        isFilled: false
      })),
      milestones: newProjMilestones.split(',').filter(m => m.trim()).map((m, i) => ({
        id: `m_n_${Date.now()}_${i}`,
        title: m.trim(),
        dueDate: '2026-09-01',
        isCompleted: false
      })),
      updates: []
    };

    setProjectsList(prev => [...prev, newProj]);
    
    const newRoom = {
      id: `room_team_${Date.now()}`,
      name: `${newProjTitle} Team Group`,
      type: 'TEAM',
      messages: [
        { id: `m_init_${Date.now()}`, senderName: 'System', content: `Chat room initialized for ${newProjTitle}.`, time: 'Just now' }
      ]
    };
    setChatRooms(prev => [...prev, newRoom]);

    setNewProjTitle('');
    setNewProjTagline('');
    setNewProjDesc('');
    setNewProjDomain('');
    setNewProjRoles('');
    setNewProjMilestones('');
    alert('Project launched! Your team room and project listing are active.');
  };

  // Post Internship form submit
  const handlePostInternship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInternTitle || !newInternDesc) {
      alert('Please fill out Title and Description.');
      return;
    }

    const newInt = {
      id: `int_${Date.now()}`,
      projectTitle: projectsList[0]?.title || 'My Startup',
      logoUrl: projectsList[0]?.logoUrl || 'https://ui-avatars.com/api/?name=Startup&background=8B5CF6&color=fff',
      title: newInternTitle,
      description: newInternDesc,
      requirements: newInternReqs.split(',').map(r => r.trim()).filter(Boolean),
      stipend: newInternStipend ? parseFloat(newInternStipend) : 0,
      duration: 3,
      location: 'REMOTE' as any
    };

    setInternshipsList(prev => [newInt, ...prev]);
    setNewInternTitle('');
    setNewInternDesc('');
    setNewInternReqs('');
    setNewInternStipend('');
    alert('Internship listing published to marketplace.');
  };

  // Book Mentor Session
  const handleBookMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorDate || !mentorTime) {
      alert('Please select date and time.');
      return;
    }

    const newSess = {
      id: `sess_${Date.now()}`,
      mentorName: bookMentorModal.name,
      date: mentorDate,
      time: mentorTime,
      status: 'BOOKED',
      link: `https://meet.jit.si/startiva-mentor-${Math.random().toString(36).substring(2, 9)}`
    };

    setMentorSessions(prev => [newSess, ...prev]);
    setBookMentorModal(null);
    setMentorDate('');
    setMentorTime('');

    alert('Session Booked! Escrow order created via Sandbox payment checkout.');
  };

  // Chat message send
  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: `msg_u_${Date.now()}`,
      senderName: myProfile.name,
      content: chatInput,
      time: 'Just now'
    };

    const updatedRooms = chatRooms.map(room => {
      if (room.id === selectedRoomId) {
        return {
          ...room,
          messages: [...room.messages, newMsg]
        };
      }
      return room;
    });

    setChatRooms(updatedRooms);
    setChatInput('');

    setTimeout(() => {
      const activeRoom = chatRooms.find(r => r.id === selectedRoomId);
      if (!activeRoom) return;
      
      let replyContent = "Sounds like a solid plan. Let's arrange a video meet soon!";
      if (activeRoom.type === 'TEAM') {
        replyContent = "Got it! I'm reviewing the milestones list now.";
      }

      const botMsg = {
        id: `msg_bot_${Date.now()}`,
        senderName: activeRoom.type === 'TEAM' ? 'Rohan Das' : activeRoom.name || 'Co-founder',
        content: replyContent,
        time: 'Just now'
      };

      setChatRooms(prev => prev.map(room => {
        if (room.id === selectedRoomId) {
          return {
            ...room,
            messages: [...room.messages, botMsg]
          };
        }
        return room;
      }));
    }, 1500);
  };

  // Verify Premium Checkout
  const handlePremiumPurchase = (plan: string) => {
    setBillingPlan(plan);
    setBillingModal(true);
  };

  const confirmPremiumPurchase = () => {
    const store = useStore.getState();
    if (store.user) {
      store.setUser({ ...store.user, isPremium: true });
    }
    setBillingModal(false);
    alert(`Payment Successful! Razorpay payment verified. Premium "${billingPlan}" status active.`);
  };

  // Render authentication structure
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center relative p-6 bg-slate-950 text-white">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full filter blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full filter blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md bg-slate-900/80 border border-white/10 p-8 rounded-lg shadow-2xl relative z-10 backdrop-blur-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-wider bg-gradient-to-r from-white via-indigo-200 to-indigo-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Rocket className="text-indigo-500 h-8 w-8" /> STARTIVA
            </h1>
            <p className="text-slate-400 mt-2">From Idea to Startup - Campus Ecosystem</p>
          </div>

          <div className="flex border-b border-white/10 mb-6">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 pb-3 text-center font-semibold text-sm transition-all ${
                authMode === 'login' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 pb-3 text-center font-semibold text-sm transition-all ${
                authMode === 'register' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-slate-950 border border-white/10 rounded-md p-3 text-sm focus:outline-none focus:border-indigo-500 text-white"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="college_email@edu.in"
                className="w-full bg-slate-950 border border-white/10 rounded-md p-3 text-sm focus:outline-none focus:border-indigo-500 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-white/10 rounded-md p-3 text-sm focus:outline-none focus:border-indigo-500 text-white"
              />
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Primary Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-md p-3 text-sm focus:outline-none focus:border-indigo-500 text-white"
                >
                  <option value="STUDENT">Student</option>
                  <option value="FOUNDER">Startup Founder</option>
                  <option value="MENTOR">Mentor</option>
                  <option value="INVESTOR">Investor</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-md p-3 font-bold text-sm transition-all duration-200"
            >
              {authMode === 'login' ? 'Sign In' : 'Get Started'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-xs text-slate-500">Or sign in with</span>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <button
                onClick={() => {
                  useStore.getState().setUser({ id: 'u_o', name: 'Google Student', email: 'google@college.edu', role: 'STUDENT', isPremium: false });
                }}
                className="flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 border border-white/10 rounded-md py-2 text-xs font-semibold"
              >
                Google
              </button>
              <button
                onClick={() => {
                  useStore.getState().setUser({ id: 'u_g', name: 'GitHub Coder', email: 'git@college.edu', role: 'STUDENT', isPremium: false });
                }}
                className="flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 border border-white/10 rounded-md py-2 text-xs font-semibold"
              >
                GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-white/5 bg-slate-900/50 flex flex-col fixed h-screen z-20">
        <div className="p-6">
          <h1 className="text-xl font-black tracking-widest text-white flex items-center gap-2">
            <Rocket className="text-indigo-500 h-6 w-6" /> STARTIVA
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {([
            { id: 'dashboard', name: 'Dashboard', icon: Compass },
            { id: 'cofounder', name: 'Co-Founder Finder', icon: Users },
            { id: 'projects', name: 'Projects Hub', icon: Layers },
            { id: 'mentors', name: 'Mentorship', icon: GraduationCap },
            { id: 'internships', name: 'Internships', icon: Briefcase },
            { id: 'chat', name: 'Chat Channels', icon: MessageSquare },
            { id: 'ai', name: 'AI Assistant', icon: Cpu },
            { id: 'profile', name: 'My Profile', icon: UserIcon },
            { id: 'admin', name: 'Admin Control', icon: ShieldAlert },
          ] as SidebarTab[]).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-md transition-all ${
                  activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" /> {tab.name}
              </button>
            );
          })}
        </nav>

        {/* Footer Logged user status */}
        <div className="p-4 border-t border-white/5 bg-slate-950/40">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={myProfile.avatar}
              alt="User Avatar Badge"
              className="h-10 w-10 rounded-full border border-indigo-500"
            />
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{myProfile.name}</h4>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider flex items-center gap-1">
                {user?.role || 'STUDENT'}
                {user?.isPremium && <span className="bg-amber-500/20 text-amber-400 px-1 py-0.5 rounded text-[8px]">PRO</span>}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full text-xs font-semibold text-red-400 hover:text-red-300 py-1"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col relative z-10 pb-12">
        
        {/* TOP HEADER BAR */}
        <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-md z-10">
          <h2 className="text-lg font-bold text-white capitalize flex items-center gap-2">
            {activeTab} Panel
          </h2>

          <div className="flex items-center gap-6">
            {!user?.isPremium && (
              <button
                onClick={() => handlePremiumPurchase('Lifetime Premium Access')}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md transition-all"
              >
                <Sparkles className="h-3.5 w-3.5 fill-slate-950" /> Go Premium
              </button>
            )}

            {/* Notifications widget */}
            <div className="relative group cursor-pointer">
              <Bell className="text-slate-400 hover:text-white h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white">
                  {notifications.length}
                </span>
              )}
              {/* Dropdown list */}
              <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-white/10 p-4 rounded-md hidden group-hover:block z-30 shadow-2xl space-y-2">
                <p className="text-xs font-bold border-b border-white/10 pb-1 mb-2">Recent Notifications</p>
                {notifications.map(n => (
                  <div key={n.id} className="text-xs border-b border-white/5 pb-2 last:border-none">
                    <p className="font-semibold text-indigo-400">{n.title}</p>
                    <p className="text-slate-300 text-[11px]">{n.content}</p>
                    <span className="text-[9px] text-slate-500">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* INTERACTIVE DASHBOARD VIEWS GRID */}
        <div className="p-8 flex-1">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-white/10 p-6 rounded-lg">
                  <h3 className="text-sm text-slate-400 font-bold uppercase">Active Projects</h3>
                  <p className="text-3xl font-black mt-2 text-indigo-400">{projectsList.length}</p>
                </div>
                <div className="bg-slate-900 border border-white/10 p-6 rounded-lg">
                  <h3 className="text-sm text-slate-400 font-bold uppercase">Connected Partners</h3>
                  <p className="text-3xl font-black mt-2 text-emerald-400">{connections.length}</p>
                </div>
                <div className="bg-slate-900 border border-white/10 p-6 rounded-lg">
                  <h3 className="text-sm text-slate-400 font-bold uppercase">Mentorship Bookings</h3>
                  <p className="text-3xl font-black mt-2 text-amber-400">{mentorSessions.length}</p>
                </div>
              </div>
              <div className="bg-slate-900 border border-white/10 p-6 rounded-lg">
                <h3 className="font-bold text-base mb-4">My Connections</h3>
                {connections.length === 0 ? (
                  <p className="text-sm text-slate-400">No partner connections established yet. Head to the Finder tab to match!</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {connections.map((c, i) => (
                      <div key={i} className="bg-slate-950 border border-white/5 p-4 rounded-md flex items-center gap-3">
                        <img src={c.avatar} alt="Connection thumbnail" className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="text-sm font-bold">{c.name}</p>
                          <p className="text-xs text-indigo-400">{c.headline}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'cofounder' && (
            <div className="max-w-md mx-auto bg-slate-900 border border-white/10 p-6 rounded-xl shadow-xl space-y-6">
              {cardIndex < profilesList.length ? (
                (() => {
                  const candidate = profilesList[cardIndex];
                  const score = calculateMatchScore(myProfile, candidate);
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={candidate.avatar} alt="Candidate profile look" className="w-14 h-14 rounded-full border-2 border-indigo-500" />
                          <div>
                            <h3 className="text-lg font-bold">{candidate.name}</h3>
                            <p className="text-xs text-slate-400">{candidate.headline}</p>
                          </div>
                        </div>
                        <div className="bg-indigo-500/20 text-indigo-400 text-xs px-2.5 py-1 rounded-full font-bold">
                          {score}% Match
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 bg-slate-950 p-3 rounded border border-white/5">{candidate.bio}</p>
                      <div>
                        <p className="text-xs font-bold uppercase text-slate-400 mb-1">Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {candidate.skills?.map((s: any, idx: number) => (
                            <span key={idx} className="bg-slate-800 text-slate-300 text-[11px] px-2 py-0.5 rounded">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-4 pt-4">
                        <button onClick={() => setCardIndex(prev => prev + 1)} className="flex-1 py-2 border border-white/10 hover:bg-white/5 rounded text-sm font-semibold transition-all">
                          Pass
                        </button>
                        <button onClick={() => handleConnect(candidate)} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-sm font-semibold transition-all">
                          Connect
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No more matching profiles found in your campus loop directory right now.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-bold text-lg">Active Ventures & Ideations</h3>
                {projectsList.map((p) => (
                  <div key={p.id} className="bg-slate-900 border border-white/10 p-5 rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img src={p.logoUrl} alt="Project brand graphic" className="w-12 h-12 rounded-lg" />
                        <div>
                          <h4 className="font-bold text-base">{p.title}</h4>
                          <span className="text-xs text-indigo-400 font-semibold">{p.domain}</span>
                        </div>
                      </div>
                      <button onClick={() => setApplyModal(p)} className="bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white text-xs px-3 py-1.5 rounded font-bold transition-all">
                        Join Project
                      </button>
                    </div>
                    <p className="text-xs text-slate-400">{p.tagline}</p>
                    <p className="text-sm text-slate-300">{p.description}</p>
                  </div>
                ))}
              </div>
              <div className="bg-slate-900 border border-white/10 p-6 rounded-lg h-fit space-y-4">
                <h3 className="font-bold text-md">Launch New Venture Card</h3>
                <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
                  <div>
                    <label className="block mb-1 text-slate-400">Title</label>
                    <input type="text" value={newProjTitle} onChange={e => setNewProjTitle(e.target.value)} className="w-full bg-slate-950 p-2.5 rounded border border-white/10 text-white" />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-400">Tagline</label>
                    <input type="text" value={newProjTagline} onChange={e => setNewProjTagline(e.target.value)} className="w-full bg-slate-950 p-2.5 rounded border border-white/10 text-white" />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-400">Description</label>
                    <textarea value={newProjDesc} onChange={e => setNewProjDesc(e.target.value)} className="w-full bg-slate-950 p-2.5 rounded border border-white/10 text-white h-20" />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-400">Domain Area</label>
                    <input type="text" placeholder="e.g. HealthTech" value={newProjDomain} onChange={e => setNewProjDomain(e.target.value)} className="w-full bg-slate-950 p-2.5 rounded border border-white/10 text-white" />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-400">Open Roles (Comma separated)</label>
                    <input type="text" placeholder="Frontend Developer, Marketer" value={newProjRoles} onChange={e => setNewProjRoles(e.target.value)} className="w-full bg-slate-950 p-2.5 rounded border border-white/10 text-white" />
                  </div>
                  <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded font-bold text-white transition-all text-sm">
                    Publish Venture Proposal
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'mentors' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mentorsList.map((m) => (
                  <div key={m.id} className="bg-slate-900 border border-white/10 p-5 rounded-lg flex gap-4">
                    <img src={m.avatar} alt="Mentor portrait photo" className="w-16 h-16 rounded-full border border-indigo-500/50" />
                    <div className="flex-1 space-y-2">
                      <div>
                        <h4 className="font-bold text-base">{m.name}</h4>
                        <p className="text-xs text-indigo-400">{m.company} • {m.role}</p>
                      </div>
                      <p className="text-xs text-slate-300">{m.bio}</p>
                      <button onClick={() => setBookMentorModal(m)} className="text-xs bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded font-bold transition-all">
                        Book Office Hours
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-900 border border-white/10 p-6 rounded-lg">
                <h3 className="font-bold text-md mb-3">Your Booked Office Hours Sessions</h3>
                <div className="space-y-2">
                  {mentorSessions.map((s) => (
                    <div key={s.id} className="bg-slate-950 border border-white/5 p-4 rounded text-xs flex justify-between items-center">
                      <div>
                        <p className="font-bold text-sm text-indigo-400">{s.mentorName}</p>
                        <p className="text-slate-400 mt-0.5">{s.date} at {s.time}</p>
                      </div>
                      <a href={s.link} target="_blank" rel="noreferrer" className="bg-emerald-600 text-white px-3 py-1 rounded font-bold hover:bg-emerald-700">
                        Join Meet Room
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'internships' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-bold text-lg">Ecosystem Internships Board</h3>
                {internshipsList.map((int) => (
                  <div key={int.id} className="bg-slate-900 border border-white/10 p-5 rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-base">{int.title}</h4>
                        <p className="text-xs text-indigo-400 font-medium">{int.projectTitle}</p>
                      </div>
                      <span className="bg-slate-800 text-white text-xs px-2.5 py-1 rounded font-bold">${int.stipend}/mo</span>
                    </div>
                    <p className="text-sm text-slate-300">{int.description}</p>
                    <div className="flex flex-wrap gap-1 pt-2">
                      {int.requirements?.map((req: string, idx: number) => (
                        <span key={idx} className="bg-slate-950 border border-white/5 text-slate-400 text-[10px] px-2 py-0.5 rounded">{req}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-900 border border-white/10 p-6 rounded-lg h-fit space-y-4">
                <h3 className="font-bold text-md">Publish Internship Opening</h3>
                <form onSubmit={handlePostInternship} className="space-y-3 text-xs">
                  <div>
                    <label className="block mb-1 text-slate-400">Internship Title</label>
                    <input type="text" value={newInternTitle} onChange={e => setNewInternTitle(e.target.value)} className="w-full bg-slate-950 p-2.5 rounded border border-white/10 text-white" />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-400">Role Description</label>
                    <textarea value={newInternDesc} onChange={e => setNewInternDesc(e.target.value)} className="w-full bg-slate-950 p-2.5 rounded border border-white/10 text-white h-24" />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-400">Core Requirements (Comma separated)</label>
                    <input type="text" placeholder="React, Node.js, REST APIs" value={newInternReqs} onChange={e => setNewInternReqs(e.target.value)} className="w-full bg-slate-950 p-2.5 rounded border border-white/10 text-white" />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-400">Monthly Stipend Amount ($ USD)</label>
                    <input type="number" value={newInternStipend} onChange={e => setNewInternStipend(e.target.value)} className="w-full bg-slate-950 p-2.5 rounded border border-white/10 text-white" />
                  </div>
                  <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded font-bold text-white transition-all text-sm">
                    Publish Listing
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="grid grid-cols-1 md:grid-cols-3 bg-slate-900 border border-white/10 rounded-lg overflow-hidden h-[500px]">
              <div className="border-r border-white/10 bg-slate-950/40 overflow-y-auto">
                <p className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-white/10">Conversations Channels</p>
                {chatRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`w-full p-4 flex flex-col gap-1 text-left border-b border-white/5 transition-all text-xs ${
                      selectedRoomId === room.id ? 'bg-indigo-600/20 text-white font-bold' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="font-semibold block truncate text-sm">{room.name}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 w-fit px-1.5 py-0.5 rounded uppercase font-black tracking-wide">{room.type}</span>
                  </button>
                ))}
              </div>
              <div className="md:col-span-2 flex flex-col justify-between bg-slate-900/40 h-full">
                <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs">
                  {chatRooms.find(r => r.id === selectedRoomId)?.messages.map((msg: any) => (
                    <div key={msg.id} className={`p-3 rounded max-w-xs ${msg.senderName === myProfile.name ? 'bg-indigo-600 ml-auto text-white' : 'bg-slate-800 text-slate-200'}`}>
                      <p className="font-bold text-[10px] opacity-75 mb-0.5">{msg.senderName}</p>
                      <p className="text-sm">{msg.content}</p>
                      <span className="text-[9px] text-slate-400 block text-right mt-1">{msg.time}</span>
                    </div>
                  ))}
                  <div ref={chatBottomRef} />
                </div>
                <form onSubmit={sendChatMessage} className="p-4 border-t border-white/10 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Type a safe workspace message..."
                    className="flex-1 bg-slate-950 p-2.5 rounded border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-4 rounded text-white font-bold text-xs flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-white/10 p-5 rounded-lg space-y-3">
                  <h3 className="font-bold text-base flex items-center gap-1.5"><Cpu className="text-indigo-400" /> Startup Idea Analyzer</h3>
                  <p className="text-xs text-slate-400">Run a simulated TAM/SAM/SOM breakdown and SWOT risk matrix map of your thesis.</p>
                  <textarea
                    value={activeIdeaText}
                    onChange={e => setActiveIdeaText(e.target.value)}
                    placeholder="Describe your project, e.g. An AI medical appointment platform..."
                    className="w-full bg-slate-950 p-2.5 rounded border border-white/10 text-xs h-24 text-white resize-none"
                  />
                  <button onClick={runValidator} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded font-bold text-xs text-white transition-all">
                    Generate Feasibility Report
                  </button>
                </div>

                <div className="bg-slate-900 border border-white/10 p-5 rounded-lg space-y-3">
                  <h3 className="font-bold text-base flex items-center gap-1.5"><UserIcon className="text-emerald-400" /> Founder Profile Analyzer</h3>
                  <p className="text-xs text-slate-400">Calculates startup readiness scores and identifies improvement loops based on your active experience.</p>
                  <div className="bg-slate-950 border border-white/5 p-4 rounded text-xs text-center space-y-1">
                    <p className="font-bold">Current Logged Core Profile</p>
                    <p className="text-slate-400 text-[11px]">{myProfile.skills.length} Tech Skills chip records listed</p>
                  </div>
                  <button onClick={runResumeAnalyzer} className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 rounded font-bold text-xs text-white transition-all">
                    Execute Experience Audit
                  </button>
                </div>

                <div className="bg-slate-900 border border-white/10 p-5 rounded-lg space-y-3">
                  <h3 className="font-bold text-base flex items-center gap-1.5"><Layers className="text-amber-400" /> Venture Health Metrics</h3>
                  <p className="text-xs text-slate-400">Monitors project risk allocations, single-founder dependencies, or domain skill gaps.</p>
                  <div>
                    <label className="block mb-1 text-[11px] text-slate-400">Target Venture</label>
                    <select value={selectedHealthProject} onChange={e => setSelectedHealthProject(e.target.value)} className="w-full bg-slate-950 border border-white/10 p-2 rounded text-xs text-white">
                      {projectsList.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                  </div>
                  <button onClick={runTeamHealth} className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded font-bold text-xs transition-all">
                    Evaluate Project Health
                  </button>
                </div>
              </div>

              {/* Reports Display Container */}
              {(ideaReport || resumeReport || teamHealthReport) && (
                <div className="bg-slate-900 border border-white/10 p-6 rounded-lg space-y-4 text-xs">
                  <h3 className="font-bold text-md border-b border-white/10 pb-2">AI Execution Diagnostic Logs</h3>
                  
                  {ideaReport && (
                    <div className="space-y-2">
                      <p className="font-bold text-indigo-400 text-sm">Market Feasibility & SWOT Matrix Analysis</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded border border-white/5">
                        <div><p className="font-bold text-slate-400">TAM</p><p className="text-slate-300">{ideaReport.marketAnalysis.tam}</p></div>
                        <div><p className="font-bold text-slate-400">SAM</p><p className="text-slate-300">{ideaReport.marketAnalysis.sam}</p></div>
                        <div><p className="font-bold text-slate-400">SOM</p><p className="text-slate-300">{ideaReport.marketAnalysis.som}</p></div>
                      </div>
                    </div>
                  )}

                  {resumeReport && (
                    <div className="space-y-1.5 bg-slate-950 p-4 rounded border border-white/5">
                      <p className="font-bold text-emerald-400 text-sm">Experience Optimization Output</p>
                      <p className="font-medium">Founding Execution Score: <span className="text-white font-bold">{resumeReport.startupScore}%</span></p>
                      <ul className="list-disc pl-4 space-y-1 text-slate-300 mt-1">
                        {resumeReport.improvements.map((imp: string, idx: number) => <li key={idx}>{imp}</li>)}
                      </ul>
                    </div>
                  )}

                  {teamHealthReport && (
                    <div className="space-y-1.5 bg-slate-950 p-4 rounded border border-white/5">
                      <p className="font-bold text-amber-400 text-sm">Co-founder Alignment Check</p>
                      <p className="font-medium">Venture Safety Rating: <span className="text-white font-bold">{teamHealthReport.score}/100</span></p>
                      <p className="text-slate-400 mt-1"><span className="font-bold text-red-400">Identified Risk:</span> {teamHealthReport.risks[0]}</p>
                      <p className="text-slate-400"><span className="font-bold text-emerald-400">Recommended Next Step:</span> {teamHealthReport.actions[0]}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-2xl bg-slate-900 border border-white/10 p-6 rounded-lg space-y-6">
              <h3 className="font-bold text-lg">Manage Core Profile Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block mb-1 text-slate-400">Display Name</label>
                  <input type="text" value={myProfile.name} onChange={e => setMyProfile({...myProfile, name: e.target.value})} className="w-full bg-slate-950 border border-white/10 p-2.5 rounded text-white" />
                </div>
                <div>
                  <label className="block mb-1 text-slate-400">Headline Tagline</label>
                  <input type="text" value={myProfile.headline} onChange={e => setMyProfile({...myProfile, headline: e.target.value})} className="w-full bg-slate-950 border border-white/10 p-2.5 rounded text-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-1 text-slate-400">Biography</label>
                  <textarea value={myProfile.bio} onChange={e => setMyProfile({...myProfile, bio: e.target.value})} className="w-full bg-slate-950 border border-white/10 p-2.5 rounded text-white h-20 resize-none" />
                </div>
              </div>

              {/* Skills Configuration Segment */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase text-slate-400">My Expertise Ecosystem</p>
                <div className="flex flex-wrap gap-1.5 bg-slate-950 p-4 rounded border border-white/5">
                  {myProfile.skills.map((skill: string, index: number) => (
                    <div key={index} className="bg-slate-900 text-slate-200 px-2.5 py-1 rounded text-xs flex items-center gap-1.5 border border-white/5">
                      <span>{skill}</span>
                      <button onClick={() => deleteSkill(index)} className="text-red-400 hover:text-red-300 font-bold">×</button>
                    </div>
                  ))}
                </div>
                <form onSubmit={addSkill} className="flex gap-2 max-w-xs">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    placeholder="Add a new skill tag..."
                    className="flex-1 bg-slate-950 border border-white/10 p-2 rounded text-xs text-white focus:outline-none"
                  />
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 rounded">
                    Add
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="max-w-md bg-slate-900 border border-white/10 p-6 rounded-lg space-y-4">
              <h3 className="font-bold text-base text-red-400 flex items-center gap-1.5"><ShieldAlert /> Ecosystem Core Controls</h3>
              <p className="text-xs text-slate-400">Simulate backend states and sandbox premium memberships.</p>
              <div className="bg-slate-950 p-4 rounded text-xs space-y-2 border border-white/5">
                <p><span className="font-bold text-slate-400">User Session Context ID:</span> {user?.id || 'Unauthenticated'}</p>
                <p><span className="font-bold text-slate-400">Ecosystem Clearance Tier:</span> {user?.role || 'None'}</p>
                <p><span className="font-bold text-slate-400">Razorpay Simulation Premium Tier:</span> {user?.isPremium ? 'ACTIVE PRO' : 'FREE INACTIVE'}</p>
              </div>
              <button onClick={() => {
                const store = useStore.getState();
                if (store.user) {
                  store.setUser({ ...store.user, isPremium: !store.user.isPremium });
                  alert('Membership state toggled in global context store.');
                }
              }} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold text-xs transition-all">
                Toggle Sandbox Premium Status
              </button>
            </div>
          )}
        </div>
      </main>

      {/* RENDER DYNAMIC PROJECT JOIN MODAL */}
      {applyModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm text-xs">
          <div className="bg-slate-900 border border-white/10 w-full max-w-md p-6 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-white">Join Venture Team: {applyModal.title}</h3>
              <button onClick={() => setApplyModal(null)} className="text-slate-400 hover:text-white font-bold text-lg">×</button>
            </div>
            <div>
              <label className="block mb-1 text-slate-400">Describe why you want to join and what value you offer</label>
              <textarea value={applyLetter} onChange={e => setApplyLetter(e.target.value)} className="w-full bg-slate-950 p-2.5 rounded border border-white/10 text-white h-24 resize-none" placeholder="Write a short introductory pitch..." />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setApplyModal(null)} className="px-4 py-2 border border-white/10 rounded font-semibold text-slate-300 hover:bg-white/5">Cancel</button>
              <button onClick={submitProjectApplication} className="px-4 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700">Submit Joining Request</button>
            </div>
          </div>
        </div>
      )}

      {/* RENDER MENTOR BOOKING MODAL */}
      {bookMentorModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm text-xs">
          <div className="bg-slate-900 border border-white/10 w-full max-w-md p-6 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-white">Schedule Office Hours: {bookMentorModal.name}</h3>
              <button onClick={() => setBookMentorModal(null)} className="text-slate-400 hover:text-white font-bold text-lg">×</button>
            </div>
            <form onSubmit={handleBookMentor} className="space-y-3">
              <div>
                <label className="block mb-1 text-slate-400">Select Date</label>
                <input type="date" value={mentorDate} onChange={e => setMentorDate(e.target.value)} className="w-full bg-slate-950 border border-white/10 p-2 rounded text-white" />
              </div>
              <div>
                <label className="block mb-1 text-slate-400">Select Available Slot Time</label>
                <input type="time" value={mentorTime} onChange={e => setMentorTime(e.target.value)} className="w-full bg-slate-950 border border-white/10 p-2 rounded text-white" />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setBookMentorModal(null)} className="px-4 py-2 border border-white/10 rounded font-semibold text-slate-300 hover:bg-white/5">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700">Verify Sandbox Escrow Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RENDER PREMIUM SUBSCRIPTION CHECKOUT MODAL */}
      {billingModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm text-xs">
          <div className="bg-slate-900 border border-white/10 w-full max-w-sm p-6 rounded-lg text-center space-y-4">
            <Sparkles className="w-12 h-12 text-amber-400 mx-auto" />
            <div>
              <h3 className="font-bold text-lg text-white">Ecosystem Premium Node</h3>
              <p className="text-xs text-slate-400 mt-1">Unlock instant analytical reports, venture blueprints, and unlimited co-founder requests.</p>
            </div>
            <div className="bg-slate-950 border border-white/5 p-4 rounded text-xs text-left">
              <p className="font-bold text-slate-200">Selected: {billingPlan}</p>
              <p className="text-slate-400 mt-0.5">Amount Due: <span className="text-white font-bold">$9.00 USD</span></p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setBillingModal(false)} className="flex-1 py-2 border border-white/10 rounded font-semibold text-slate-300 hover:bg-white/5">Cancel</button>
              <button onClick={confirmPremiumPurchase} className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black rounded hover:opacity-90">Verify Razorpay Order</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
} 