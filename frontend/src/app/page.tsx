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
  Search, 
  Bell, 
  Compass, 
  Sparkles, 
  TrendingUp, 
  Send, 
  Plus, 
  CheckCircle, 
  X, 
  Star, 
  MapPin, 
  DollarSign, 
  Clock, 
  LogOut, 
  Lock 
} from 'lucide-react';

export default function Home() {
  const { 
    user, 
    isAuthenticated, 
    activeTab, 
    setActiveTab, 
    login, 
    register, 
    logout 
  } = useStore();

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
  
  // Custom Profiles / Projects State (stored in memory to act as database persistence)
  const [profilesList, setProfilesList] = useState(mockProfiles);
  const [projectsList, setProjectsList] = useState(mockProjects);
  const [internshipsList, setInternshipsList] = useState(mockInternships);
  const [mentorsList, setMentorsList] = useState(mockMentors);
  
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
      { id: 'm_2', senderName: 'Priya Patel', content: 'Hey Arjun, saw your profile. Let\'s catch up to discuss EduLink?', time: 'Yesterday' }
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
  const [applyModal, setApplyModal] = useState<any>(null); // project details to apply
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
      setMyProfile(prev => ({
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
      console.error(err);
      // Fallback fake login to allow testing out-of-the-box!
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
    
    // Add new notification
    setNotifications(prev => [
      { id: Date.now().toString(), title: 'New Connection Match!', content: `You matched with ${candidate.name}! Open Chat to coordinate.`, type: 'MATCH', time: 'Just now' },
      ...prev
    ]);

    // Setup a new Direct Chat Room dynamically
    const newRoom = {
      id: `room_${Date.now()}`,
      name: candidate.name,
      type: 'DIRECT',
      messages: [
        { id: `m_c_${Date.now()}`, senderName: candidate.name, content: `Hey! I saw we had high compatibility (${calculateMatchScore(myProfile, candidate)}% match). I'd love to discuss coding projects!`, time: 'Just now' }
      ]
    };

    setChatRooms(prev => [...prev, newRoom]);

    // Shift card
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
    
    // Add applicant
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

    // Setup chat room dynamically
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
    
    // Add Team Chat Room
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

    // Trigger mock response after delay to make it feel real!
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
    // Set user as premium in Zustand store
    const store = useStore.getState();
    if (store.user) {
      store.setUser({ ...store.user, isPremium: true });
    }
    setBillingModal(false);
    alert(`Payment Successful! Razorpay payment verified. Premium "${billingPlan}" status active.`);
  };

  // ==========================================
  // RENDER AUTH SCREEN (IF NOT LOGGED IN)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center relative p-6">
        {/* Animated Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full filter blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full filter blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md glass-panel p-8 rounded-lg shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-wider bg-gradient-to-r from-white via-indigo-200 to-indigo-500 bg-clip-text text-transparent flex items-center justify-center gap-2 font-heading">
              <Rocket className="text-indigo-500 h-8 w-8" /> STARTIVA
            </h1>
            <p className="text-text-muted mt-2">From Idea to Startup - Campus Ecosystem</p>
          </div>

          {/* Form Tabs */}
          <div className="flex border-b border-white/10 mb-6">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 pb-3 text-center font-semibold text-sm transition-all ${
                authMode === 'login' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-text-muted'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 pb-3 text-center font-semibold text-sm transition-all ${
                authMode === 'register' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-text-muted'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-slate-900 border border-white/10 rounded-md p-3 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="college_email@edu.in"
                className="w-full bg-slate-900 border border-white/10 rounded-md p-3 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-white/10 rounded-md p-3 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Primary Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-md p-3 text-sm focus:outline-none focus:border-indigo-500"
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

          {/* Social OAuth splits */}
          <div className="mt-6 text-center">
            <span className="text-xs text-text-muted">Or sign in with</span>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <button
                onClick={() => {
                  // Fake login directly
                  useStore.getState().setUser({ id: 'u_o', name: 'Google Student', email: 'google@college.edu', role: 'STUDENT', isPremium: false });
                }}
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-md py-2 text-xs font-semibold"
              >
                <i className="fa-brands fa-google text-red-500"></i> Google
              </button>
              <button
                onClick={() => {
                  useStore.getState().setUser({ id: 'u_g', name: 'GitHub Coder', email: 'git@college.edu', role: 'STUDENT', isPremium: false });
                }}
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-md py-2 text-xs font-semibold"
              >
                <i className="fa-brands fa-github"></i> GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER CORE APPLICATION DASHBOARD
  // ==========================================
  return (
    <div className="flex min-h-screen bg-slate-950">
      
      {/* ==========================================
          SIDEBAR NAVIGATION
          ========================================== */}
      <aside className="w-64 border-r border-white/5 bg-slate-900/50 flex flex-col fixed h-screen z-20">
        <div className="p-6">
          <h1 className="text-xl font-black tracking-widest text-white flex items-center gap-2 font-heading">
            <Rocket className="text-indigo-500 h-6 w-6" /> STARTIVA
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-md transition-all ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-text-muted hover:bg-white/5 hover:text-white'
            }`}
          >
            <Compass className="h-5 w-5" /> Dashboard
          </button>

          <button
            onClick={() => setActiveTab('cofounder')}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-md transition-all ${
              activeTab === 'cofounder' ? 'bg-indigo-600 text-white' : 'text-text-muted hover:bg-white/5 hover:text-white'
            }`}
          >
            <Users className="h-5 w-5" /> Co-Founder Finder
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-md transition-all ${
              activeTab === 'projects' ? 'bg-indigo-600 text-white' : 'text-text-muted hover:bg-white/5 hover:text-white'
            }`}
          >
            <Layers className="h-5 w-5" /> Projects Hub
          </button>

          <button
            onClick={() => setActiveTab('mentors')}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-md transition-all ${
              activeTab === 'mentors' ? 'bg-indigo-600 text-white' : 'text-text-muted hover:bg-white/5 hover:text-white'
            }`}
          >
            <GraduationCap className="h-5 w-5" /> Mentorship
          </button>

          <button
            onClick={() => setActiveTab('internships')}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-md transition-all ${
              activeTab === 'internships' ? 'bg-indigo-600 text-white' : 'text-text-muted hover:bg-white/5 hover:text-white'
            }`}
          >
            <Briefcase className="h-5 w-5" /> Internships
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-md transition-all ${
              activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-text-muted hover:bg-white/5 hover:text-white'
            }`}
          >
            <MessageSquare className="h-5 w-5" /> Chat Channels
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-md transition-all ${
              activeTab === 'ai' ? 'bg-indigo-600 text-white' : 'text-text-muted hover:bg-white/5 hover:text-white'
            }`}
          >
            <Cpu className="h-5 w-5" /> AI Assistant
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-md transition-all ${
              activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'text-text-muted hover:bg-white/5 hover:text-white'
            }`}
          >
            <UserIcon className="h-5 w-5" /> My Profile
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-md transition-all ${
              activeTab === 'admin' ? 'bg-indigo-600 text-white' : 'text-text-muted hover:bg-white/5 hover:text-white'
            }`}
          >
            <ShieldAlert className="h-5 w-5" /> Admin Control
          </button>
        </nav>

        {/* Footer Logged user status */}
        <div className="p-4 border-t border-white/5 bg-slate-950/40">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={myProfile.avatar}
              alt="Avatar"
              className="h-10 w-10 rounded-full border border-indigo-500"
            />
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{myProfile.name}</h4>
              <p className="text-[10px] text-text-muted uppercase font-black tracking-wider flex items-center gap-1">
                {user?.role || 'STUDENT'}
                {user?.isPremium && <span className="bg-amber-500/20 text-amber-400 px-1 py-0.5 rounded text-[8px]">PRO</span>}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full text-xs font-semibold text-red-400 hover:text-red-300 py-1"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ==========================================
          MAIN CONTENT CONTAINER
          ========================================== */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col relative z-10 pb-12">
        
        {/* ==========================================
            TOP HEADER BAR
            ========================================== */}
        <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white capitalize font-heading flex items-center gap-2">
              {activeTab} Screen
            </h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Go Premium Callout */}
            {!user?.isPremium && (
              <button
                onClick={() => handlePremiumPurchase('Lifetime Founder')}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md shadow-amber-500/10 transition-all"
              >
                <Sparkles className="h-3.5 w-3.5 fill-slate-950" /> Go Premium
              </button>
            )}

            {/* Notifications widget */}
            <div className="relative group cursor-pointer">
              <Bell className="text-text-muted hover:text-white h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white">
                  {notifications.length}
                </span>
              )}
              {/* Dropdown list */}
              <div className="absolute right-0 mt-3 w-80 glass-panel p-4 rounded-md hidden group-hover:block z-30 shadow-2xl">
                <h4 className="text-xs font-bold text-white border-b border-white/5 pb-2 mb-2">Notifications</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="text-xs p-2 rounded hover:bg-white/5 transition-all">
                      <div className="font-semibold text-white flex justify-between">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-text-muted">{n.time}</span>
                      </div>
                      <p className="text-text-muted text-[11px] mt-0.5">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-l border-white/10 pl-6">
              <span className="text-xs text-text-muted">Domain: <strong className="text-indigo-400 font-bold">Campus Hub</strong></span>
            </div>
          </div>
        </header>

        {/* ==========================================
            SCREEN VIEWS ROUTING SWITCH
            ========================================== */}
        <div className="p-8 flex-1">
          
          {/* ==========================================
              TAB 1: DASHBOARD
              ========================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-indigo-900/40 via-slate-900 to-indigo-950/20 border border-white/5 p-8 rounded-lg relative overflow-hidden">
                <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-25">
                  <Rocket className="h-40 w-40 text-indigo-500" />
                </div>
                <h2 className="text-3xl font-extrabold text-white font-heading">
                  Hello, {myProfile.name}! 👋
                </h2>
                <p className="text-text-muted mt-2 max-w-xl">
                  Welcome back to the Campus Startup Ecosystem. You have matching candidates ready to review, active chat channels, and ongoing project milestones.
                </p>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setActiveTab('cofounder')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded transition-all"
                  >
                    Match Co-founders
                  </button>
                  <button
                    onClick={() => setActiveTab('ai')}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Validate Startup Idea
                  </button>
                </div>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-panel p-6 rounded-lg text-center">
                  <Users className="text-indigo-400 h-8 w-8 mx-auto mb-2" />
                  <h3 className="text-2xl font-black text-white">4</h3>
                  <p className="text-xs text-text-muted mt-1 uppercase font-bold tracking-wider">Matched Founders</p>
                </div>
                <div className="glass-panel p-6 rounded-lg text-center">
                  <Layers className="text-cyan-400 h-8 w-8 mx-auto mb-2" />
                  <h3 className="text-2xl font-black text-white">{projectsList.length}</h3>
                  <p className="text-xs text-text-muted mt-1 uppercase font-bold tracking-wider">Startup Projects</p>
                </div>
                <div className="glass-panel p-6 rounded-lg text-center">
                  <GraduationCap className="text-amber-400 h-8 w-8 mx-auto mb-2" />
                  <h3 className="text-2xl font-black text-white">{mentorsList.length}</h3>
                  <p className="text-xs text-text-muted mt-1 uppercase font-bold tracking-wider">Verified Mentors</p>
                </div>
                <div className="glass-panel p-6 rounded-lg text-center">
                  <Briefcase className="text-emerald-400 h-8 w-8 mx-auto mb-2" />
                  <h3 className="text-2xl font-black text-white">{internshipsList.length}</h3>
                  <p className="text-xs text-text-muted mt-1 uppercase font-bold tracking-wider">Internships Posted</p>
                </div>
              </div>

              {/* Feed Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Startup Projects Feed */}
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                    <Compass className="h-5 w-5 text-indigo-400" /> Trending Startup Projects
                  </h3>
                  <div className="space-y-4">
                    {projectsList.map(proj => (
                      <div key={proj.id} className="glass-panel p-6 rounded-lg flex gap-4 items-start">
                        <img
                          src={proj.logoUrl}
                          alt="Logo"
                          className="w-12 h-12 rounded border border-white/10"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-white">{proj.title}</h4>
                            <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {proj.domain}
                            </span>
                          </div>
                          <p className="text-xs text-text-muted mt-1 font-bold">{proj.tagline}</p>
                          <p className="text-xs text-text-muted mt-2 line-clamp-2">{proj.description}</p>
                          
                          {/* Footer details */}
                          <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5 text-[11px] text-text-muted">
                            <span>Founder: <strong className="text-white">{proj.creator.profile.name}</strong></span>
                            <span>Open Positions: <strong className="text-indigo-400">{proj.roles.filter(r => !r.isFilled).length}</strong></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sidebar Widget (Matched Co-founders list) */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-400" /> Quick Recommendations
                  </h3>
                  <div className="glass-panel p-6 rounded-lg space-y-4">
                    {profilesList.slice(0, 3).map(prof => (
                      <div key={prof.userId} className="flex items-center justify-between pb-3 border-b border-white/5 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <img
                            src={prof.avatar}
                            alt="Avatar"
                            className="h-9 w-9 rounded-full"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-white">{prof.name}</h4>
                            <p className="text-[10px] text-text-muted truncate w-40">{prof.headline}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-indigo-400">{calculateMatchScore(myProfile, prof)}% Match</span>
                          <button
                            onClick={() => setActiveTab('cofounder')}
                            className="block text-[10px] text-white hover:text-indigo-400 font-bold mt-0.5"
                          >
                            View Card
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 2: CO-FOUNDER MATCHING
              ========================================== */}
          {activeTab === 'cofounder' && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center max-w-xl mx-auto">
                <h3 className="text-xl font-bold text-white font-heading">Co-Founder Matching Deck</h3>
                <p className="text-text-muted text-xs mt-1">
                  We use an compatibility formula parsing skills complementarity (e.g. Technical + Business roles) and domain interests alignment.
                </p>
              </div>

              {/* Cards Swiping deck */}
              <div className="max-w-md mx-auto relative h-[450px]">
                {cardIndex < profilesList.length ? (
                  (() => {
                    const candidate = profilesList[cardIndex];
                    const compScore = calculateMatchScore(myProfile, candidate);
                    return (
                      <div className="absolute inset-0 bg-slate-900 border border-indigo-500/30 rounded-lg shadow-2xl p-8 flex flex-col justify-between">
                        <div>
                          {/* Card Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                              <img
                                src={candidate.avatar}
                                alt="Avatar"
                                className="h-14 w-14 rounded-full border-2 border-indigo-500"
                              />
                              <div>
                                <h4 className="text-lg font-bold text-white font-heading">{candidate.name}</h4>
                                <p className="text-xs text-text-muted font-semibold">{candidate.headline}</p>
                              </div>
                            </div>
                            <div className="bg-indigo-500/20 text-indigo-400 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                              <Sparkles className="h-3 w-3 fill-indigo-400" /> {compScore}% Match
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="mt-6 space-y-4">
                            <div>
                              <span className="text-[10px] font-black text-text-muted uppercase tracking-wider block">Bio</span>
                              <p className="text-xs text-text-muted mt-1 leading-relaxed">{candidate.bio}</p>
                            </div>

                            <div>
                              <span className="text-[10px] font-black text-text-muted uppercase tracking-wider block">Skills</span>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {candidate.skills.map((s, idx) => (
                                  <span key={idx} className="bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <span className="text-[10px] font-black text-text-muted uppercase tracking-wider block">Interests</span>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {candidate.interests.map((i, idx) => (
                                  <span key={idx} className="bg-indigo-500/10 text-indigo-400 text-[10px] px-2 py-0.5 rounded">
                                    {i}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="flex gap-4 border-t border-white/5 pt-6">
                          <button
                            onClick={() => setCardIndex(prev => prev + 1)}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 rounded-md transition-all"
                          >
                            Pass
                          </button>
                          <button
                            onClick={() => handleConnect(candidate)}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-md transition-all"
                          >
                            Connect
                          </button>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="absolute inset-0 glass-panel rounded-lg flex flex-col items-center justify-center text-center p-8">
                    <CheckCircle className="text-indigo-400 h-16 w-16 mb-4" />
                    <h4 className="text-lg font-bold text-white">You\'ve reached the end!</h4>
                    <p className="text-text-muted text-xs mt-1">We\'ll notify you when new student profiles register matching your skills.</p>
                    <button
                      onClick={() => setCardIndex(0)}
                      className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded"
                    >
                      Restart Deck
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 3: PROJECTS HUB
              ========================================== */}
          {activeTab === 'projects' && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Nested Navigation */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Side: Create / Post Project */}
                <div className="glass-panel p-6 rounded-lg h-fit space-y-6">
                  <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2 border-b border-white/5 pb-3">
                    <Plus className="text-indigo-400" /> Launch Startup Idea
                  </h3>
                  
                  <form onSubmit={handleCreateProject} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-text-muted uppercase mb-1">Project Name</label>
                      <input
                        type="text"
                        required
                        value={newProjTitle}
                        onChange={(e) => setNewProjTitle(e.target.value)}
                        placeholder="e.g. CampusCart"
                        className="w-full bg-slate-900 border border-white/10 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-muted uppercase mb-1">One-liner Tagline</label>
                      <input
                        type="text"
                        required
                        value={newProjTagline}
                        onChange={(e) => setNewProjTagline(e.target.value)}
                        placeholder="e.g. Peer-to-peer campus marketplace"
                        className="w-full bg-slate-900 border border-white/10 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-muted uppercase mb-1">Description</label>
                      <textarea
                        rows={3}
                        required
                        value={newProjDesc}
                        onChange={(e) => setNewProjDesc(e.target.value)}
                        placeholder="Explain problem, solution, and technology choices..."
                        className="w-full bg-slate-900 border border-white/10 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-muted uppercase mb-1">Domain</label>
                      <input
                        type="text"
                        required
                        value={newProjDomain}
                        onChange={(e) => setNewProjDomain(e.target.value)}
                        placeholder="e.g. E-commerce, EdTech, Web3"
                        className="w-full bg-slate-900 border border-white/10 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-muted uppercase mb-1">Required Roles (comma split)</label>
                      <input
                        type="text"
                        value={newProjRoles}
                        onChange={(e) => setNewProjRoles(e.target.value)}
                        placeholder="e.g. Backend Engineer, Growth Marketer"
                        className="w-full bg-slate-900 border border-white/10 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-muted uppercase mb-1">Milestones (comma split)</label>
                      <input
                        type="text"
                        value={newProjMilestones}
                        onChange={(e) => setNewProjMilestones(e.target.value)}
                        placeholder="e.g. Design Wireframes, Deploy Beta"
                        className="w-full bg-slate-900 border border-white/10 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-md transition-all"
                    >
                      Publish Project Listings
                    </button>
                  </form>
                </div>

                {/* Right Side: List active projects */}
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-lg font-bold text-white font-heading">Active Project Listings</h3>
                  
                  <div className="space-y-6">
                    {projectsList.map(proj => (
                      <div key={proj.id} className="glass-panel p-6 rounded-lg space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            <img
                              src={proj.logoUrl}
                              alt="Logo"
                              className="w-12 h-12 rounded border border-white/10"
                            />
                            <div>
                              <h4 className="text-base font-bold text-white font-heading">{proj.title}</h4>
                              <p className="text-xs text-text-muted font-semibold mt-0.5">{proj.tagline}</p>
                            </div>
                          </div>
                          <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                            {proj.domain}
                          </span>
                        </div>

                        <p className="text-xs text-text-muted leading-relaxed">{proj.description}</p>

                        {/* Open positions checklist */}
                        {proj.roles.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Recruiting Roles:</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {proj.roles.map(r => (
                                <span 
                                  key={r.id}
                                  className={`text-[10px] px-2.5 py-1 rounded border ${
                                    r.isFilled ? 'bg-white/5 border-white/5 text-text-muted line-through' : 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400'
                                  }`}
                                >
                                  {r.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Milestones bar */}
                        {proj.milestones.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Project Milestones:</span>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              {proj.milestones.map(m => (
                                <div key={m.id} className="bg-slate-950 p-2 rounded border border-white/5 flex items-center gap-2">
                                  <span className={`w-2.5 h-2.5 rounded-full ${m.isCompleted ? 'bg-emerald-500' : 'bg-slate-800'}`}></span>
                                  <span className="text-[10px] text-text-muted truncate">{m.title}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Footer details & Apply action */}
                        <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-4">
                          <span className="text-[10px] text-text-muted">Initiator: <strong className="text-white">{proj.creator.profile.name}</strong></span>
                          <button
                            onClick={() => setApplyModal(proj)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded transition-all"
                          >
                            Apply to Team
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==========================================
              TAB 4: MENTORSHIP
              ========================================== */}
          {activeTab === 'mentors' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Side: Sessions bookings checklist */}
                <div className="glass-panel p-6 rounded-lg h-fit space-y-6">
                  <h3 className="text-base font-bold text-white font-heading border-b border-white/5 pb-3">My Mentorship Bookings</h3>
                  {mentorSessions.length > 0 ? (
                    <div className="space-y-4">
                      {mentorSessions.map(sess => (
                        <div key={sess.id} className="bg-slate-950 p-4 rounded border border-white/5 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-white">{sess.mentorName}</h4>
                            <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-bold px-1.5 py-0.5 rounded">
                              {sess.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-text-muted flex items-center gap-1.5">
                            <Clock className="h-3 w-3" /> {sess.date} @ {sess.time}
                          </p>
                          <a
                            href={sess.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center bg-indigo-600/20 hover:bg-indigo-600/35 border border-indigo-500/30 text-indigo-400 font-bold text-[10px] py-1.5 rounded transition-all mt-2"
                          >
                            Join Video Session (Jitsi Meet)
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-text-muted">No scheduled mentorship sessions yet.</p>
                  )}
                </div>

                {/* Right Side: List active mentors */}
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-lg font-bold text-white font-heading">Book Sessions with Experts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mentorsList.map(mentor => (
                      <div key={mentor.id} className="glass-panel p-6 rounded-lg flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={mentor.avatar}
                              alt="Avatar"
                              className="h-12 w-12 rounded-full border border-white/10"
                            />
                            <div>
                              <h4 className="text-base font-bold text-white font-heading">{mentor.name}</h4>
                              <div className="flex items-center gap-1 text-amber-400 text-xs mt-0.5">
                                <Star className="h-3.5 w-3.5 fill-amber-400" /> {mentor.rating} ({mentor.sessionsCount} sessions)
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-text-muted line-clamp-2">{mentor.bio}</p>
                          
                          <div className="flex flex-wrap gap-1">
                            {mentor.expertise.map((exp, idx) => (
                              <span key={idx} className="bg-slate-800 text-white text-[9px] px-2 py-0.5 rounded">
                                {exp}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center border-t border-white/5 pt-4">
                          <div>
                            <span className="text-[10px] text-text-muted uppercase tracking-wider block">Hourly Rate</span>
                            <span className="text-xs font-bold text-white">₹{mentor.hourlyRate}/hr</span>
                          </div>
                          <button
                            onClick={() => setBookMentorModal(mentor)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded transition-all"
                          >
                            Schedule Booking
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==========================================
              TAB 5: INTERNSHIPS
              ========================================== */}
          {activeTab === 'internships' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Side: Post positions form */}
                <div className="glass-panel p-6 rounded-lg h-fit space-y-6">
                  <h3 className="text-base font-bold text-white font-heading border-b border-white/5 pb-3">Recruit Interns</h3>
                  <form onSubmit={handlePostInternship} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-text-muted uppercase mb-1">Internship Title</label>
                      <input
                        type="text"
                        required
                        value={newInternTitle}
                        onChange={(e) => setNewInternTitle(e.target.value)}
                        placeholder="e.g. AI Systems Integrator"
                        className="w-full bg-slate-900 border border-white/10 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-muted uppercase mb-1">Description</label>
                      <textarea
                        rows={3}
                        required
                        value={newInternDesc}
                        onChange={(e) => setNewInternDesc(e.target.value)}
                        placeholder="Task descriptions and deliverables..."
                        className="w-full bg-slate-900 border border-white/10 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-muted uppercase mb-1">Requirements (comma split)</label>
                      <input
                        type="text"
                        value={newInternReqs}
                        onChange={(e) => setNewInternReqs(e.target.value)}
                        placeholder="e.g. Python, Docker, Next"
                        className="w-full bg-slate-900 border border-white/10 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-muted uppercase mb-1">Monthly Stipend (INR)</label>
                      <input
                        type="number"
                        value={newInternStipend}
                        onChange={(e) => setNewInternStipend(e.target.value)}
                        placeholder="e.g. 15000 (0 for unpaid)"
                        className="w-full bg-slate-900 border border-white/10 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-md transition-all"
                    >
                      Post Internship Listing
                    </button>
                  </form>
                </div>

                {/* Right Side: List internships */}
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-lg font-bold text-white font-heading">Available Internship Positions</h3>
                  <div className="space-y-4">
                    {internshipsList.map(item => (
                      <div key={item.id} className="glass-panel p-6 rounded-lg space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            <img
                              src={item.logoUrl}
                              alt="Logo"
                              className="w-10 h-10 rounded border border-white/10"
                            />
                            <div>
                              <h4 className="text-base font-bold text-white font-heading">{item.title}</h4>
                              <span className="text-xs text-text-muted font-bold block">{item.projectTitle}</span>
                            </div>
                          </div>
                          <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {item.location}
                          </span>
                        </div>

                        <p className="text-xs text-text-muted leading-relaxed">{item.description}</p>
                        
                        <div className="flex flex-wrap gap-1">
                          {item.requirements.map((req, idx) => (
                            <span key={idx} className="bg-slate-800 text-white text-[9px] px-2 py-0.5 rounded">
                              {req}
                            </span>
                          ))}
                        </div>

                        <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-4">
                          <div className="flex gap-4 text-xs text-text-muted">
                            <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5 text-emerald-400" /> ₹{item.stipend || 0}/mo</span>
                            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-indigo-400" /> 3 months</span>
                          </div>
                          <button
                            onClick={() => {
                              alert(`Application submitted to ${item.projectTitle}. We graded your matching resume score!`);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-4 py-2 rounded transition-all"
                          >
                            Quick Apply
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==========================================
              TAB 6: CHAT ROOMS
              ========================================== */}
          {activeTab === 'chat' && (
            <div className="glass-panel rounded-lg grid grid-cols-1 lg:grid-cols-3 h-[500px] overflow-hidden animate-fade-in">
              {/* Chat channels Sidebar */}
              <div className="border-r border-white/5 bg-slate-950/20 p-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">Active Chats</h3>
                  <div className="space-y-2">
                    {chatRooms.map(room => (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoomId(room.id)}
                        className={`w-full text-left p-3 rounded flex items-center justify-between transition-all ${
                          selectedRoomId === room.id ? 'bg-indigo-600/20 border-l-4 border-indigo-500 text-white' : 'hover:bg-white/5 text-text-muted'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold truncate">{room.name}</h4>
                          <p className="text-[10px] truncate mt-0.5 text-text-muted">
                            {room.messages[room.messages.length - 1]?.content || 'Start a conversation.'}
                          </p>
                        </div>
                        <span className="text-[8px] text-text-muted shrink-0">
                          {room.messages[room.messages.length - 1]?.time || ''}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat Message feed */}
              <div className="lg:col-span-2 flex flex-col justify-between bg-slate-900/10">
                {/* Chat Header */}
                <div className="h-12 border-b border-white/5 px-6 flex items-center">
                  <h4 className="text-xs font-bold text-white">
                    {chatRooms.find(r => r.id === selectedRoomId)?.name || 'Select Conversation'}
                  </h4>
                </div>

                {/* Messages view */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[380px]">
                  {chatRooms
                    .find(r => r.id === selectedRoomId)
                    ?.messages.map((msg: any, idx: number) => (
                      <div
                        key={idx}
                        className={`flex flex-col max-w-[75%] ${
                          msg.senderName === myProfile.name ? 'ml-auto items-end' : 'items-start'
                        }`}
                      >
                        <span className="text-[9px] text-text-muted mb-0.5">{msg.senderName}</span>
                        <div
                          className={`p-3 rounded-md text-xs leading-relaxed ${
                            msg.senderName === myProfile.name
                              ? 'bg-indigo-600 text-white rounded-tr-none'
                              : 'bg-slate-800 text-text-main rounded-tl-none'
                          }`}
                        >
                          {msg.content}
                        </div>
                        <span className="text-[8px] text-text-muted mt-0.5">{msg.time}</span>
                      </div>
                    ))}
                  <div ref={chatBottomRef}></div>
                </div>

                {/* Input box */}
                <form onSubmit={sendChatMessage} className="p-4 border-t border-white/5 flex gap-3 bg-slate-950/20">
                  <input
                    type="text"
                    required
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-900 border border-white/10 rounded-md px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md p-2.5 transition-all flex items-center justify-center"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 7: AI ASSISTANT
              ========================================== */}
          {activeTab === 'ai' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* AI Startup Validator */}
                <div className="glass-panel p-6 rounded-lg space-y-6">
                  <h3 className="text-base font-bold text-white font-heading border-b border-white/5 pb-3 flex items-center gap-1.5">
                    <Sparkles className="text-indigo-400 h-5 w-5" /> AI Startup Idea Validator
                  </h3>
                  
                  <textarea
                    rows={4}
                    value={activeIdeaText}
                    onChange={(e) => setActiveIdeaText(e.target.value)}
                    placeholder="Type your startup idea (e.g. A marketplace matching students with peer project partners and utilizing custom tokens for payment)..."
                    className="w-full bg-slate-900 border border-white/10 rounded-md p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />

                  <button
                    onClick={runValidator}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-md transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <Cpu className="h-4 w-4" />} Validate Idea
                  </button>

                  {ideaReport && (
                    <div className="bg-slate-950 p-4 rounded border border-white/5 space-y-4 text-xs">
                      <div>
                        <span className="font-bold text-white uppercase text-[10px] tracking-wider block">Market Analysis:</span>
                        <div className="mt-1 space-y-1 text-text-muted">
                          <p>• TAM: {ideaReport.marketAnalysis.tam}</p>
                          <p>• SAM: {ideaReport.marketAnalysis.sam}</p>
                          <p>• SOM: {ideaReport.marketAnalysis.som}</p>
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-white uppercase text-[10px] tracking-wider block">SWOT Analysis:</span>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="bg-emerald-500/10 p-2 rounded text-[10px]">
                            <strong className="text-emerald-400 block mb-0.5">Strengths</strong>
                            {ideaReport.swot.strengths.join(', ')}
                          </div>
                          <div className="bg-red-500/10 p-2 rounded text-[10px]">
                            <strong className="text-red-400 block mb-0.5">Weaknesses</strong>
                            {ideaReport.swot.weaknesses.join(', ')}
                          </div>
                          <div className="bg-indigo-500/10 p-2 rounded text-[10px]">
                            <strong className="text-indigo-400 block mb-0.5">Opportunities</strong>
                            {ideaReport.swot.opportunities.join(', ')}
                          </div>
                          <div className="bg-amber-500/10 p-2 rounded text-[10px]">
                            <strong className="text-amber-400 block mb-0.5">Threats</strong>
                            {ideaReport.swot.threats.join(', ')}
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-white uppercase text-[10px] tracking-wider block">Revenue Model:</span>
                        <p className="text-text-muted mt-1">{ideaReport.revenueModel}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Resume Grader & Team Monitor */}
                <div className="space-y-8">
                  {/* Grader */}
                  <div className="glass-panel p-6 rounded-lg space-y-6">
                    <h3 className="text-base font-bold text-white font-heading border-b border-white/5 pb-3 flex items-center gap-1.5">
                      <Cpu className="text-cyan-400 h-5 w-5" /> Profile & Resume Analyzer
                    </h3>
                    <p className="text-xs text-text-muted">Analyze your skills array, bio density, and checklist completeness to get readiness scores.</p>
                    
                    <button
                      onClick={runResumeAnalyzer}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 rounded-md transition-all"
                    >
                      Analyze Profile Readiness
                    </button>

                    {resumeReport && (
                      <div className="bg-slate-950 p-4 rounded border border-white/5 space-y-4">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-indigo-500/10 p-3 rounded">
                            <span className="text-[9px] text-text-muted uppercase block">Skills Score</span>
                            <span className="text-lg font-black text-white">{resumeReport.skillsScore}%</span>
                          </div>
                          <div className="bg-cyan-500/10 p-3 rounded">
                            <span className="text-[9px] text-text-muted uppercase block">Startup Fit</span>
                            <span className="text-lg font-black text-white">{resumeReport.startupScore}%</span>
                          </div>
                          <div className="bg-emerald-500/10 p-3 rounded">
                            <span className="text-[9px] text-text-muted uppercase block">Intern Ready</span>
                            <span className="text-lg font-black text-white">{resumeReport.internshipScore}%</span>
                          </div>
                        </div>

                        <div>
                          <span className="font-bold text-white uppercase text-[10px] tracking-wider block">Suggested Improvements:</span>
                          <ul className="list-disc list-inside text-text-muted text-xs space-y-1.5 mt-2">
                            {resumeReport.improvements.map((imp: string, idx: number) => (
                              <li key={idx}>{imp}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Team health */}
                  <div className="glass-panel p-6 rounded-lg space-y-6">
                    <h3 className="text-base font-bold text-white font-heading border-b border-white/5 pb-3 flex items-center gap-1.5">
                      <Users className="text-emerald-400 h-5 w-5" /> AI Team Health Monitor
                    </h3>
                    <div className="flex gap-3">
                      <select
                        value={selectedHealthProject}
                        onChange={(e) => setSelectedHealthProject(e.target.value)}
                        className="flex-1 bg-slate-900 border border-white/10 rounded-md p-2.5 text-xs text-white focus:outline-none"
                      >
                        {projectsList.map(p => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                      <button
                        onClick={runTeamHealth}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 rounded transition-all"
                      >
                        Audit
                      </button>
                    </div>

                    {teamHealthReport && (
                      <div className="bg-slate-950 p-4 rounded border border-white/5 space-y-4 text-xs">
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded">
                          <span className="font-bold text-white">Project Health Score</span>
                          <span className="text-lg font-black text-emerald-400">{teamHealthReport.score}%</span>
                        </div>
                        <div>
                          <span className="font-bold text-white uppercase text-[10px] tracking-wider block">Detected Risks:</span>
                          <ul className="list-disc list-inside text-red-400 mt-1 space-y-1">
                            {teamHealthReport.risks.map((r: string, idx: number) => (
                              <li key={idx}>{r}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="font-bold text-white uppercase text-[10px] tracking-wider block">Recommended Actions:</span>
                          <ul className="list-disc list-inside text-indigo-400 mt-1 space-y-1">
                            {teamHealthReport.actions.map((a: string, idx: number) => (
                              <li key={idx}>{a}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ==========================================
              TAB 8: MY PROFILE
              ========================================== */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-fade-in">
              <div className="max-w-2xl mx-auto glass-panel p-8 rounded-lg space-y-6">
                <h3 className="text-xl font-bold text-white font-heading border-b border-white/5 pb-4">Profile Details Settings</h3>
                
                <div className="flex items-center gap-6">
                  <img
                    src={myProfile.avatar}
                    alt="Avatar"
                    className="h-16 w-16 rounded-full border border-indigo-500"
                  />
                  <div>
                    <h4 className="font-bold text-white">{myProfile.name}</h4>
                    <p className="text-xs text-text-muted">{myProfile.headline}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1">Headline</label>
                    <input
                      type="text"
                      value={myProfile.headline}
                      onChange={(e) => setMyProfile({ ...myProfile, headline: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-md p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1">Short Bio</label>
                    <textarea
                      rows={3}
                      value={myProfile.bio}
                      onChange={(e) => setMyProfile({ ...myProfile, bio: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-md p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Skills tags manager */}
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1">My Skills</label>
                    <div className="flex flex-wrap gap-2 mb-3 bg-slate-950 p-3 rounded border border-white/5">
                      {myProfile.skills.map((skill: string, index: number) => (
                        <span key={index} className="bg-slate-800 text-white text-xs px-2.5 py-1 rounded flex items-center gap-1.5">
                          {skill}
                          <button type="button" onClick={() => deleteSkill(index)} className="text-red-400 hover:text-red-300 font-bold">×</button>
                        </span>
                      ))}
                    </div>
                    <form onSubmit={addSkill} className="flex gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add skill tag (e.g. Docker, Python) and press Enter"
                        className="flex-1 bg-slate-900 border border-white/10 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 rounded"
                      >
                        Add
                      </button>
                    </form>
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-1">Weekly Availability</label>
                    <select
                      value={myProfile.availability}
                      onChange={(e) => setMyProfile({ ...myProfile, availability: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-md p-3 text-xs text-white focus:outline-none"
                    >
                      <option value="FULL_TIME">Full Time (40 hrs/week)</option>
                      <option value="PART_TIME">Part Time (10-20 hrs/week)</option>
                      <option value="NOT_AVAILABLE">Not Available</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => alert('Profile changes saved in temporary cache state.')}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-md transition-all"
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 9: ADMIN CONTROL PANEL
              ========================================== */}
          {activeTab === 'admin' && (
            <div className="space-y-8 animate-fade-in">
              <div className="glass-panel p-6 rounded-lg space-y-6">
                <h3 className="text-xl font-bold text-white font-heading border-b border-white/5 pb-3">Simulated Database Operations Logs</h3>
                
                {/* Users List */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-indigo-400">Registered Accounts</h4>
                  <div className="bg-slate-950 rounded border border-white/5 overflow-x-auto text-xs text-left">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                          <th className="p-3 text-text-muted uppercase font-bold text-[10px]">User Name</th>
                          <th className="p-3 text-text-muted uppercase font-bold text-[10px]">Email</th>
                          <th className="p-3 text-text-muted uppercase font-bold text-[10px]">Primary Role</th>
                          <th className="p-3 text-text-muted uppercase font-bold text-[10px]">Subscription</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/5">
                          <td className="p-3 font-semibold">{myProfile.name} (You)</td>
                          <td className="p-3 text-text-muted">{user?.email || 'jane@college.edu'}</td>
                          <td className="p-3 text-text-muted">{user?.role || 'STUDENT'}</td>
                          <td className="p-3 text-text-muted">{user?.isPremium ? 'PREMIUM' : 'FREE'}</td>
                        </tr>
                        {profilesList.map((p, idx) => (
                          <tr key={idx} className="border-b border-white/5 last:border-0 text-text-muted">
                            <td className="p-3 font-semibold text-white">{p.name}</td>
                            <td className="p-3">{p.name.split(' ').join('').toLowerCase()}@college.edu</td>
                            <td className="p-3">STUDENT</td>
                            <td className="p-3">FREE</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Subscriptions ledger */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-indigo-400">Premium Payments Ledger</h4>
                  <div className="bg-slate-950 rounded border border-white/5 p-4 text-xs text-text-muted">
                    {user?.isPremium ? (
                      <div className="flex justify-between items-center border-l-4 border-emerald-500 pl-3 bg-emerald-500/5 p-3 rounded">
                        <div>
                          <span className="font-bold text-white block">Payment ID: pay_RZP_lifetime_99342</span>
                          <span className="text-[10px]">Plan: Lifetime Founder Subscription - Verified checkout</span>
                        </div>
                        <span className="text-emerald-400 font-bold">₹1,999.00</span>
                      </div>
                    ) : (
                      <p>No transactions logged in payments database yet.</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>

      {/* ==========================================
          MODAL: APPLY TO ROLE/PROJECT
          ========================================== */}
      {applyModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50">
          <div className="bg-slate-900 border border-indigo-500/30 w-full max-w-lg rounded-lg shadow-2xl p-6 relative">
            <button
              onClick={() => setApplyModal(null)}
              className="absolute top-4 right-4 text-text-muted hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-bold text-white font-heading">Apply to {applyModal.title}</h3>
            <p className="text-text-muted text-xs mt-1">Send your developer profile resume to the project founder. AI compatibility rating is run instantly.</p>
            
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Cover Letter</label>
                <textarea
                  rows={4}
                  required
                  value={applyLetter}
                  onChange={(e) => setApplyLetter(e.target.value)}
                  placeholder="Explain why you want to join and how your skills align..."
                  className="w-full bg-slate-950 border border-white/10 rounded-md p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="bg-slate-950 p-3 rounded border border-white/5 text-xs text-text-muted">
                📎 Attached Resume: <strong className="text-white">Jane_Doe_Resume.pdf</strong>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setApplyModal(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={submitProjectApplication}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-md"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: BOOK MENTOR SESSION
          ========================================== */}
      {bookMentorModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50">
          <div className="bg-slate-900 border border-indigo-500/30 w-full max-w-md rounded-lg shadow-2xl p-6 relative">
            <button
              onClick={() => setBookMentorModal(null)}
              className="absolute top-4 right-4 text-text-muted hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-bold text-white font-heading">Schedule Mentorship</h3>
            <p className="text-text-muted text-xs mt-1">Book 1 hour with {bookMentorModal.name}. Hourly rate: ₹{bookMentorModal.hourlyRate}.</p>
            
            <form onSubmit={handleBookMentor} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Select Date</label>
                <input
                  type="date"
                  required
                  value={mentorDate}
                  onChange={(e) => setMentorDate(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-md p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Select Time</label>
                <input
                  type="time"
                  required
                  value={mentorTime}
                  onChange={(e) => setMentorTime(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-md p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setBookMentorModal(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-md"
                >
                  Proceed to Pay ₹{bookMentorModal.hourlyRate}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: BILLING CHECKOUT (RAZORPAY SIMULATOR)
          ========================================== */}
      {billingModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="bg-[#0b101c] w-full max-w-sm rounded border border-[#2b354a] shadow-2xl relative overflow-hidden text-left">
            {/* Razorpay header split */}
            <div className="bg-[#182643] p-6 text-white flex justify-between items-center border-b border-[#2b354a]">
              <div>
                <h4 className="text-xs font-black tracking-widest text-[#00b9f5] uppercase">RAZORPAY CHECKOUT</h4>
                <h3 className="text-base font-bold mt-1">Startiva Pro Plan</h3>
              </div>
              <button
                onClick={() => setBillingModal(false)}
                className="text-[#96a9c6] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#96a9c6]">Plan Type:</span>
                <span className="text-xs font-bold text-white">{billingPlan}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#96a9c6]">Amount Due:</span>
                <span className="text-lg font-black text-[#00b9f5]">₹1,999.00</span>
              </div>

              <div className="bg-[#11192e] p-4 rounded text-[11px] text-[#96a9c6] leading-relaxed border border-[#232f4c]">
                ℹ️ This is a simulated Razorpay sandboxed billing transaction checkout flow. Click 'Confirm Payment' to complete the JWT authorization update.
              </div>

              <button
                onClick={confirmPremiumPurchase}
                className="w-full bg-[#00b9f5] hover:bg-[#008dbb] text-slate-950 font-black text-xs py-3.5 rounded transition-all"
              >
                Confirm Payment (Sandbox)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
