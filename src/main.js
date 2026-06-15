import { mockProfiles, mockProjects, mockMentors, mockInternships } from './mockData.js';

// Global state
let currentUser = null;
let currentTab = 'dashboard';
let activeProfiles = [...mockProfiles];
let activeProjects = [...mockProjects];
let activeMentors = [...mockMentors];
let activeInternships = [...mockInternships];

let myProfile = {
  name: 'Jane Doe',
  avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&background=6366F1&color=fff',
  headline: 'Engineering Student | Technical Architect',
  bio: 'Passionate about full-stack web architectures, AI validation systems, and student peer mentoring. Rebuilt three hackathon mock systems.',
  skills: ['React', 'Node.js', 'TypeScript', 'CSS'],
  interests: ['EdTech', 'FinTech', 'SaaS'],
  availability: 'PART_TIME',
  personalityTraits: ['Executor', 'Analytical']
};

let myConnections = [];
let swipeIndex = 0;

let chatRooms = [
  { id: 'room_1', name: 'MedSync Team Group', type: 'TEAM', messages: [
    { sender: 'Rohan Das', content: 'Welcome to the team! Glad to have you.', time: '10:30 AM' }
  ] },
  { id: 'room_2', name: 'Priya Patel', type: 'DIRECT', messages: [
    { sender: 'Priya Patel', content: 'Hey Jane, saw your profile. Let\'s catch up to discuss EduLink?', time: 'Yesterday' }
  ] }
];
let activeRoomId = 'room_1';

let myBookings = [
  { id: 'sess_1', mentorName: 'Vikram Sen', date: '2026-06-18', time: '14:00', status: 'BOOKED', link: 'https://meet.jit.si/startiva-vikram' }
];

let myNotifications = [
  { id: 'n1', title: 'AI Matching Completed', content: 'We found 4 potential co-founders with complementary skills.', type: 'MATCH', time: '5m ago' },
  { id: 'n2', title: 'Welcome to Startiva', content: 'Setup your profile to begin matching.', type: 'SYSTEM', time: '1h ago' }
];

// Modal Contexts
let selectedProjectToApply = null;
let selectedMentorToBook = null;
let selectedCheckoutPlan = '';
let selectedCheckoutAmount = 0;

// Initialize
window.addEventListener('load', () => {
  // Hide preloader
  const loader = document.querySelector('.loader-wrapper');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => { loader.style.display = 'none'; }, 500);
  }

  setupAuthHandlers();
  setupSidebarNavigation();
  setupGlobalModalTriggers();
});

// ==========================================
// AUTHENTICATION LOGIC
// ==========================================
function setupAuthHandlers() {
  const authScreen = document.getElementById('auth-screen');
  const appScreen = document.getElementById('app');
  const tabSignin = document.getElementById('tab-signin-btn');
  const tabSignup = document.getElementById('tab-signup-btn');
  const nameGroup = document.getElementById('group-name');
  const roleGroup = document.getElementById('group-role');
  const authForm = document.getElementById('auth-form');
  const submitBtn = document.getElementById('auth-submit-btn');

  let activeMode = 'login';

  tabSignin.addEventListener('click', () => {
    activeMode = 'login';
    tabSignin.classList.add('active');
    tabSignup.classList.remove('active');
    nameGroup.style.display = 'none';
    roleGroup.style.display = 'none';
    submitBtn.textContent = 'Sign In';
  });

  tabSignup.addEventListener('click', () => {
    activeMode = 'register';
    tabSignup.classList.add('active');
    tabSignin.classList.remove('active');
    nameGroup.style.display = 'block';
    roleGroup.style.display = 'block';
    submitBtn.textContent = 'Get Started';
  });

  // Handle Mock Login Submit
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const nameVal = document.getElementById('auth-name').value || email.split('@')[0];
    const roleVal = document.getElementById('auth-role').value;

    currentUser = {
      name: nameVal,
      email: email,
      role: roleVal,
      isPremium: false
    };

    myProfile.name = nameVal;
    myProfile.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(nameVal)}&background=6366F1&color=fff`;

    // Swap layouts
    authScreen.style.display = 'none';
    appScreen.style.display = 'flex';

    // Set header profile details
    document.getElementById('user-name').textContent = myProfile.name;
    document.getElementById('user-avatar').src = myProfile.avatar;
    document.getElementById('user-role-label').innerHTML = `${currentUser.role} <span class="premium-tag" id="header-premium-tag" style="display: none;">PRO</span>`;

    // Render initial view
    renderActiveTab();
    renderNotifications();
  });

  // Social direct logins
  document.getElementById('social-google').addEventListener('click', () => {
    document.getElementById('auth-email').value = 'student@google.edu';
    authForm.dispatchEvent(new Event('submit'));
  });
  document.getElementById('social-github').addEventListener('click', () => {
    document.getElementById('auth-email').value = 'coder@github.edu';
    authForm.dispatchEvent(new Event('submit'));
  });
}

// ==========================================
// NAVIGATION & SIDEBAR LOGIC
// ==========================================
function setupSidebarNavigation() {
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      currentTab = item.getAttribute('data-tab');
      document.getElementById('view-title').textContent = currentTab;
      renderActiveTab();
    });
  });

  // Logout handler
  document.getElementById('logout-btn').addEventListener('click', () => {
    currentUser = null;
    document.getElementById('app').style.display = 'none';
    document.getElementById('auth-screen').style.display = 'flex';
  });
}

// ==========================================
// RENDER VIEWS COORDINATOR
// ==========================================
function renderActiveTab() {
  const viewport = document.getElementById('viewport');
  
  if (currentTab === 'dashboard') {
    viewport.innerHTML = renderDashboardView();
    bindDashboardTriggers();
  } else if (currentTab === 'cofounder') {
    viewport.innerHTML = renderCoFounderMatchingView();
    bindCoFounderTriggers();
  } else if (currentTab === 'projects') {
    viewport.innerHTML = renderProjectsView();
    bindProjectsTriggers();
  } else if (currentTab === 'mentors') {
    viewport.innerHTML = renderMentorshipView();
    bindMentorsTriggers();
  } else if (currentTab === 'internships') {
    viewport.innerHTML = renderInternshipsView();
    bindInternshipsTriggers();
  } else if (currentTab === 'chat') {
    viewport.innerHTML = renderChatView();
    bindChatTriggers();
  } else if (currentTab === 'ai') {
    viewport.innerHTML = renderAIView();
    bindAITriggers();
  } else if (currentTab === 'profile') {
    viewport.innerHTML = renderProfileView();
    bindProfileTriggers();
  }
}

// ==========================================
// NOTIFICATIONS UTILS
// ==========================================
function renderNotifications() {
  const countBadge = document.getElementById('notif-count');
  const container = document.getElementById('notif-items-container');

  if (myNotifications.length > 0) {
    countBadge.style.display = 'flex';
    countBadge.textContent = myNotifications.length;
  } else {
    countBadge.style.display = 'none';
  }

  container.innerHTML = myNotifications.map(n => `
    <div class="notif-item">
      <div class="notif-item-header">
        <span>${n.title}</span>
        <span class="notif-item-time">${n.time}</span>
      </div>
      <p class="notif-item-content">${n.content}</p>
    </div>
  `).join('');
}

function addNotification(title, content, type = 'SYSTEM') {
  myNotifications.unshift({
    id: `notif_${Date.now()}`,
    title,
    content,
    type,
    time: 'Just now'
  });
  renderNotifications();
}

// ==========================================
// TEMPLATES DEFINITIONS
// ==========================================

// 1. Dashboard View
function renderDashboardView() {
  return `
    <div class="dashboard-layout">
      <!-- Welcome Banner -->
      <div class="welcome-banner">
        <h2>Hello, ${myProfile.name}! 👋</h2>
        <p>Welcome back to the Campus Startup Ecosystem. You have matching candidates ready to review, active chat channels, and ongoing project milestones.</p>
        <div class="welcome-actions">
          <button class="btn btn-primary btn-goto-cofounder">Match Co-founders</button>
          <button class="btn btn-outline btn-goto-ai"><i class="fa-solid fa-sparkles"></i> Validate Startup Idea</button>
        </div>
        <div class="welcome-bg-rocket">
          <i class="fa-solid fa-rocket"></i>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-box">
          <i class="fa-solid fa-users color-indigo"></i>
          <h3>4</h3>
          <p>Matched Founders</p>
        </div>
        <div class="stat-box">
          <i class="fa-solid fa-layer-group color-teal"></i>
          <h3>${activeProjects.length}</h3>
          <p>Startup Projects</p>
        </div>
        <div class="stat-box">
          <i class="fa-solid fa-graduation-cap color-amber"></i>
          <h3>${activeMentors.length}</h3>
          <p>Verified Mentors</p>
        </div>
        <div class="stat-box">
          <i class="fa-solid fa-briefcase color-emerald"></i>
          <h3>${activeInternships.length}</h3>
          <p>Internships Posted</p>
        </div>
      </div>

      <!-- Feed Grid -->
      <div class="feed-grid">
        <div class="feed-main">
          <h3 class="section-subtitle-heading"><i class="fa-solid fa-compass color-indigo"></i> Trending Startup Projects</h3>
          <div class="projects-feed-list">
            ${activeProjects.map(proj => `
              <div class="project-card">
                <img src="${proj.logoUrl}" alt="Logo" class="project-card-logo">
                <div class="project-card-info">
                  <div class="project-card-header">
                    <h4 class="project-card-title">${proj.title}</h4>
                    <span class="project-card-tag">${proj.domain}</span>
                  </div>
                  <p class="project-card-tagline">${proj.tagline}</p>
                  <p class="project-card-desc">${proj.description}</p>
                  <div class="project-card-footer">
                    <span class="project-card-founder">Founder: <strong>${proj.creator.profile.name}</strong></span>
                    <span class="project-card-roles">Open Positions: <strong>${proj.roles.filter(r => !r.isFilled).length}</strong></span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="feed-sidebar">
          <h3 class="section-subtitle-heading"><i class="fa-solid fa-sparkles color-indigo"></i> Quick Recommendations</h3>
          <div class="recommendations-box">
            ${activeProfiles.slice(0, 3).map(prof => `
              <div class="recommendation-row">
                <div class="rec-user-info">
                  <img src="${prof.avatar}" alt="Avatar">
                  <div class="rec-user-text">
                    <h4>${prof.name}</h4>
                    <p>${prof.headline}</p>
                  </div>
                </div>
                <div class="rec-score-box">
                  <span class="rec-score-value">${calculateMatchScore(myProfile, prof)}% Match</span>
                  <button class="rec-action-btn btn-view-card-direct">View Card</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function bindDashboardTriggers() {
  document.querySelector('.btn-goto-cofounder').addEventListener('click', () => {
    document.querySelector('[data-tab="cofounder"]').click();
  });
  document.querySelector('.btn-goto-ai').addEventListener('click', () => {
    document.querySelector('[data-tab="ai"]').click();
  });
  const viewCardBtns = document.querySelectorAll('.btn-view-card-direct');
  viewCardBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('[data-tab="cofounder"]').click();
    });
  });
}

// 2. Co-Founder Matching View
function renderCoFounderMatchingView() {
  if (swipeIndex >= activeProfiles.length) {
    return `
      <div class="matching-deck-container" style="display: flex; align-items: center; justify-content: center;">
        <div class="glass-panel" style="padding: 40px; border-radius: var(--radius-lg); text-align: center;">
          <i class="fa-solid fa-circle-check color-teal" style="font-size: 4rem; margin-bottom: 20px;"></i>
          <h4 style="font-size: 1.25rem; font-weight: 800; color: #fff;">You've reached the end!</h4>
          <p style="color: var(--text-muted); font-size: 0.8rem; margin-top: 8px;">We'll notify you when new student profiles register matching your skills.</p>
          <button class="btn btn-primary btn-reset-deck" style="margin-top: 24px;">Restart Deck</button>
        </div>
      </div>
    `;
  }

  const candidate = activeProfiles[swipeIndex];
  const compatibility = calculateMatchScore(myProfile, candidate);

  return `
    <div class="matching-deck-container">
      <div class="matching-card">
        <div>
          <!-- Card Header -->
          <div class="matching-card-header">
            <div class="matching-card-avatar-box">
              <img src="${candidate.avatar}" alt="Avatar">
              <div>
                <h4>${candidate.name}</h4>
                <p>${candidate.headline}</p>
              </div>
            </div>
            <span class="matching-score-tag">
              <i class="fa-solid fa-sparkles"></i> ${compatibility}% Match
            </span>
          </div>

          <!-- Card Body -->
          <div class="matching-card-body">
            <div>
              <span class="matching-body-label">Bio</span>
              <p class="matching-body-text">${candidate.bio}</p>
            </div>

            <div>
              <span class="matching-body-label">Skills</span>
              <div class="tag-container">
                ${candidate.skills.map(s => `<span class="tag-item">${s}</span>`).join('')}
              </div>
            </div>

            <div>
              <span class="matching-body-label">Interests</span>
              <div class="tag-container">
                ${candidate.interests.map(i => `<span class="tag-item tag-item-primary">${i}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="matching-card-actions">
          <button class="btn btn-outline btn-swipe-pass">Pass</button>
          <button class="btn btn-primary btn-swipe-connect">Connect</button>
        </div>
      </div>
    </div>
  `;
}

function bindCoFounderTriggers() {
  const resetBtn = document.querySelector('.btn-reset-deck');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      swipeIndex = 0;
      renderActiveTab();
    });
    return;
  }

  document.querySelector('.btn-swipe-pass').addEventListener('click', () => {
    swipeIndex++;
    renderActiveTab();
  });

  document.querySelector('.btn-swipe-connect').addEventListener('click', () => {
    const candidate = activeProfiles[swipeIndex];
    myConnections.push(candidate);
    
    // Auto add Direct chat room
    const newRoom = {
      id: `room_${Date.now()}`,
      name: candidate.name,
      type: 'DIRECT',
      messages: [
        { sender: candidate.name, content: `Hey Jane! I saw we matched with ${calculateMatchScore(myProfile, candidate)}% compatibility score. I'd love to chat.`, time: 'Just now' }
      ]
    };
    chatRooms.push(newRoom);

    addNotification('New Connection Match!', `You matched with ${candidate.name}! Open Chat to coordinate.`, 'MATCH');
    alert(`Connected with ${candidate.name}! A new chat room has been created.`);

    swipeIndex++;
    renderActiveTab();
  });
}

// 3. Projects View
function renderProjectsView() {
  return `
    <div class="projects-layout-grid animate-fade-in">
      <!-- Create Project -->
      <div class="projects-form-box">
        <h3 class="projects-form-title font-heading mb-4 pb-2 border-b"><i class="fa-solid fa-plus icon-primary"></i> Launch Startup Idea</h3>
        <form id="create-project-form" class="space-y-4">
          <div class="form-group">
            <label>Project Name</label>
            <input type="text" id="new-proj-title" required placeholder="e.g. CampusCart">
          </div>
          <div class="form-group">
            <label>One-liner Tagline</label>
            <input type="text" id="new-proj-tagline" required placeholder="e.g. Peer-to-peer campus marketplace">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea id="new-proj-desc" rows="3" required placeholder="Explain problem, solution, and technology choices..."></textarea>
          </div>
          <div class="form-group">
            <label>Domain</label>
            <input type="text" id="new-proj-domain" required placeholder="e.g. E-commerce, EdTech, Web3">
          </div>
          <div class="form-group">
            <label>Required Roles (comma split)</label>
            <input type="text" id="new-proj-roles" placeholder="e.g. Backend Engineer, UI Designer">
          </div>
          <div class="form-group">
            <label>Milestones (comma split)</label>
            <input type="text" id="new-proj-milestones" placeholder="e.g. Design Wireframes, Deploy Beta">
          </div>
          <button type="submit" class="btn btn-primary w-100">Publish Project Listing</button>
        </form>
      </div>

      <!-- Projects Feed -->
      <div class="projects-feed-list">
        <h3 class="section-subtitle-heading">Active Project Listings</h3>
        ${activeProjects.map(proj => `
          <div class="project-card glass-panel" style="flex-direction: column;">
            <div class="project-card-header" style="width: 100%;">
              <div style="display: flex; gap: 16px; align-items: center;">
                <img src="${proj.logoUrl}" alt="Logo" class="project-card-logo" style="margin: 0;">
                <div>
                  <h4 class="project-card-title">${proj.title}</h4>
                  <p class="project-card-tagline" style="margin: 0;">${proj.tagline}</p>
                </div>
              </div>
              <span class="project-card-tag">${proj.domain}</span>
            </div>

            <p class="project-card-desc" style="margin-top: 16px;">${proj.description}</p>

            <!-- Recruiting Roles -->
            ${proj.roles.length > 0 ? `
              <div style="margin-top: 16px;">
                <span class="matching-body-label">Recruiting Roles:</span>
                <div class="tag-container" style="margin-top: 8px;">
                  ${proj.roles.map(r => `
                    <span class="role-badge-item ${r.isFilled ? 'role-badge-filled' : 'role-badge-open'}">
                      ${r.title}
                    </span>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Milestones -->
            ${proj.milestones.length > 0 ? `
              <div style="margin-top: 16px; border-top: 1px solid var(--border); padding-top: 16px;">
                <span class="matching-body-label">Project Milestones:</span>
                <div class="milestones-deck">
                  ${proj.milestones.map(m => `
                    <div class="milestones-deck-item">
                      <span class="milestone-dot ${m.isCompleted ? 'milestone-dot-completed' : ''}"></span>
                      <span class="milestone-deck-text">${m.title}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <div class="project-card-footer" style="margin-top: 16px; width: 100%;">
              <span>Initiator: <strong>${proj.creator.profile.name}</strong></span>
              <button class="btn btn-primary btn-apply-to-project" data-project-id="${proj.id}" style="padding: 6px 14px; border-radius: var(--radius-sm); font-size: 0.75rem;">Apply to Team</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function bindProjectsTriggers() {
  const form = document.getElementById('create-project-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('new-proj-title').value;
    const tagline = document.getElementById('new-proj-tagline').value;
    const desc = document.getElementById('new-proj-desc').value;
    const domain = document.getElementById('new-proj-domain').value;
    const rolesVal = document.getElementById('new-proj-roles').value;
    const milestonesVal = document.getElementById('new-proj-milestones').value;

    const newProj = {
      id: `p_${Date.now()}`,
      title,
      tagline,
      description: desc,
      domain,
      status: 'IDEA',
      logoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=random&color=fff`,
      creator: { profile: { name: myProfile.name } },
      members: [],
      roles: rolesVal.split(',').filter(r => r.trim()).map((r, i) => ({
        id: `role_${Date.now()}_${i}`,
        title: r.trim(),
        isFilled: false
      })),
      milestones: milestonesVal.split(',').filter(m => m.trim()).map((m, i) => ({
        id: `mile_${Date.now()}_${i}`,
        title: m.trim(),
        isCompleted: false
      }))
    };

    activeProjects.push(newProj);
    
    // Add Team Chat Room
    const newRoom = {
      id: `room_team_${Date.now()}`,
      name: `${title} Team Group`,
      type: 'TEAM',
      messages: [
        { sender: 'System', content: `Chat room initialized for ${title}.`, time: 'Just now' }
      ]
    };
    chatRooms.push(newRoom);

    alert(`Startup Listing "${title}" published! Team room created.`);
    renderActiveTab();
  });

  const applyBtns = document.querySelectorAll('.btn-apply-to-project');
  applyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-project-id');
      selectedProjectToApply = activeProjects.find(p => p.id === projId);

      // Open Apply Modal
      document.getElementById('apply-project-title').textContent = `Apply to ${selectedProjectToApply.title}`;
      const modal = document.getElementById('apply-modal');
      modal.classList.add('active');
    });
  });
}

// 4. Mentorship View
function renderMentorshipView() {
  return `
    <div class="mentors-layout-grid animate-fade-in">
      <!-- Session Bookings -->
      <div class="mentor-bookings-panel">
        <h3 class="font-heading mb-4 pb-2 border-b">My Mentorship Bookings</h3>
        <div class="bookings-list">
          ${myBookings.map(sess => `
            <div class="booking-row-item">
              <div class="booking-row-item-header">
                <h4>${sess.mentorName}</h4>
                <span class="booking-row-status-tag">${sess.status}</span>
              </div>
              <p class="booking-row-time">
                <i class="fa-solid fa-clock"></i> ${sess.date} @ ${sess.time}
              </p>
              <a href="${sess.link}" target="_blank" class="booking-row-meeting-btn">Join Video Session</a>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Mentors Catalog -->
      <div>
        <h3 class="section-subtitle-heading mb-4">Book Sessions with Experts</h3>
        <div class="mentors-catalog-grid">
          ${activeMentors.map(m => `
            <div class="mentor-card">
              <div class="mentor-card-header">
                <img src="${m.avatar}" alt="Avatar" class="mentor-card-avatar">
                <div>
                  <h4>${m.name}</h4>
                  <div class="mentor-card-stars">
                    <i class="fa-solid fa-star"></i> ${m.rating} (${m.sessionsCount} sessions)
                  </div>
                </div>
              </div>

              <p class="mentor-card-bio">${m.bio}</p>

              <div class="tag-container" style="margin-top: 12px;">
                ${m.expertise.map(exp => `<span class="tag-item">${exp}</span>`).join('')}
              </div>

              <div class="mentor-card-footer">
                <div class="mentor-card-rate">
                  <span>HOURLY RATE</span>
                  <strong>₹${m.hourlyRate}/hr</strong>
                </div>
                <button class="btn btn-primary btn-book-mentor-session" data-mentor-id="${m.id}" style="padding: 6px 14px; border-radius: var(--radius-sm); font-size: 0.75rem;">Schedule Booking</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function bindMentorsTriggers() {
  const bookBtns = document.querySelectorAll('.btn-book-mentor-session');
  bookBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mId = btn.getAttribute('data-mentor-id');
      selectedMentorToBook = activeMentors.find(m => m.id === mId);

      document.getElementById('book-mentor-title').textContent = `Book ${selectedMentorToBook.name}`;
      document.getElementById('book-mentor-subtitle').textContent = `Book 1 hour with mentor. Hourly Rate: ₹${selectedMentorToBook.hourlyRate}.`;
      document.getElementById('book-mentor-modal').classList.add('active');
    });
  });
}

// 5. Internships View
function renderInternshipsView() {
  return `
    <div class="projects-layout-grid animate-fade-in">
      <!-- Create Internship -->
      <div class="projects-form-box">
        <h3 class="projects-form-title font-heading mb-4 pb-2 border-b"><i class="fa-solid fa-briefcase icon-primary"></i> Post Internship Role</h3>
        <form id="create-intern-form" class="space-y-4">
          <div class="form-group">
            <label>Internship Title</label>
            <input type="text" id="new-intern-title" required placeholder="e.g. AI Systems Intern">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea id="new-intern-desc" rows="3" required placeholder="Outline tasks and expected milestones..."></textarea>
          </div>
          <div class="form-group">
            <label>Requirements (comma split)</label>
            <input type="text" id="new-intern-reqs" placeholder="e.g. Python, Docker, API integration">
          </div>
          <div class="form-group">
            <label>Monthly Stipend (INR)</label>
            <input type="number" id="new-intern-stipend" placeholder="e.g. 15000">
          </div>
          <button type="submit" class="btn btn-primary w-100">Publish Internship</button>
        </form>
      </div>

      <!-- Internship Listings -->
      <div class="projects-feed-list">
        <h3 class="section-subtitle-heading">Available Internship Positions</h3>
        ${activeInternships.map(item => `
          <div class="project-card glass-panel" style="flex-direction: column;">
            <div class="project-card-header" style="width: 100%;">
              <div style="display: flex; gap: 16px; align-items: center;">
                <img src="${item.logoUrl}" alt="Logo" class="project-card-logo" style="margin: 0;">
                <div>
                  <h4 class="project-card-title">${item.title}</h4>
                  <span class="project-card-tagline" style="margin: 0; font-weight: 800;">${item.projectTitle}</span>
                </div>
              </div>
              <span class="project-card-tag" style="background-color: rgba(16, 185, 129, 0.1); color: #10b981;">${item.location}</span>
            </div>

            <p class="project-card-desc" style="margin-top: 16px;">${item.description}</p>
            
            <div class="tag-container" style="margin-top: 12px;">
              ${item.requirements.map(req => `<span class="tag-item">${req}</span>`).join('')}
            </div>

            <div class="project-card-footer" style="margin-top: 16px; width: 100%;">
              <div style="display: flex; gap: 16px;">
                <span><i class="fa-solid fa-money-bill-wave" style="color: #10b981; margin-right: 4px;"></i> ₹${item.stipend}/mo</span>
                <span><i class="fa-solid fa-clock" style="color: var(--primary); margin-right: 4px;"></i> 3 months</span>
              </div>
              <button class="btn btn-primary btn-apply-intern" data-project="${item.projectTitle}" style="padding: 6px 14px; border-radius: var(--radius-sm); font-size: 0.75rem;">Quick Apply</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function bindInternshipsTriggers() {
  const form = document.getElementById('create-intern-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('new-intern-title').value;
    const desc = document.getElementById('new-intern-desc').value;
    const reqs = document.getElementById('new-intern-reqs').value;
    const stipend = document.getElementById('new-intern-stipend').value;

    const newInt = {
      id: `int_${Date.now()}`,
      projectTitle: activeProjects[0]?.title || 'My Startup',
      logoUrl: activeProjects[0]?.logoUrl || 'https://ui-avatars.com/api/?name=Startup&background=8B5CF6&color=fff',
      title,
      description: desc,
      requirements: reqs.split(',').map(r => r.trim()).filter(Boolean),
      stipend: stipend ? parseInt(stipend) : 0,
      location: 'REMOTE'
    };

    activeInternships.unshift(newInt);
    alert(`Internship role "${title}" posted to marketplace.`);
    renderActiveTab();
  });

  const applyBtns = document.querySelectorAll('.btn-apply-intern');
  applyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const proj = btn.getAttribute('data-project');
      alert(`Application submitted to ${proj}. We graded your matching resume score!`);
    });
  });
}

// 6. Chat View
function renderChatView() {
  const activeRoom = chatRooms.find(r => r.id === activeRoomId);

  return `
    <div class="chat-layout-container animate-fade-in">
      <!-- Chat sidebar -->
      <div class="chat-sidebar">
        <h3>Active Chats</h3>
        <div class="chat-rooms-list">
          ${chatRooms.map(room => `
            <button class="chat-room-row ${room.id === activeRoomId ? 'active' : ''}" data-room-id="${room.id}">
              <div class="room-row-info">
                <h4>${room.name}</h4>
                <p>${room.messages[room.messages.length - 1]?.content || 'Empty Chat'}</p>
              </div>
              <span class="room-row-time">${room.messages[room.messages.length - 1]?.time || ''}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Chat main messages -->
      <div class="chat-main">
        <div class="chat-header">
          <h4>${activeRoom ? activeRoom.name : 'Select Channel'}</h4>
        </div>

        <div class="chat-messages-viewport" id="chat-messages-container">
          ${activeRoom ? activeRoom.messages.map(msg => `
            <div class="chat-message-bubble ${msg.sender === myProfile.name ? 'sent' : 'received'}">
              <span class="chat-message-sender">${msg.sender}</span>
              <div class="chat-message-text">${msg.content}</div>
              <span class="chat-message-time">${msg.time}</span>
            </div>
          `).join('') : ''}
          <div id="chat-anchor"></div>
        </div>

        <form id="chat-input-form" class="chat-input-form">
          <input type="text" id="chat-input-message" required placeholder="Type a message...">
          <button type="submit" class="btn btn-primary" style="padding: 10px 16px;"><i class="fa-solid fa-paper-plane"></i></button>
        </form>
      </div>
    </div>
  `;
}

function bindChatTriggers() {
  // Chat Room switches
  const rows = document.querySelectorAll('.chat-room-row');
  rows.forEach(row => {
    row.addEventListener('click', () => {
      activeRoomId = row.getAttribute('data-room-id');
      renderActiveTab();
      scrollChatBottom();
    });
  });

  // Message submission
  const chatForm = document.getElementById('chat-input-form');
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('chat-input-message');
    if (!input.value.trim()) return;

    const newMsg = {
      sender: myProfile.name,
      content: input.value,
      time: 'Just now'
    };

    const activeRoom = chatRooms.find(r => r.id === activeRoomId);
    if (activeRoom) {
      activeRoom.messages.push(newMsg);
      input.value = '';
      renderActiveTab();
      scrollChatBottom();

      // Simulated instant chatbot response
      setTimeout(() => {
        const replyMsg = {
          sender: activeRoom.type === 'TEAM' ? 'Rohan Das' : activeRoom.name,
          content: activeRoom.type === 'TEAM' 
            ? "Got it! I am reviewing the project milestones dashboard now." 
            : "Sounds like a solid plan. Let's arrange a video session call on startiva Jitsi link soon!",
          time: 'Just now'
        };
        activeRoom.messages.push(replyMsg);
        renderActiveTab();
        scrollChatBottom();
      }, 1500);
    }
  });

  scrollChatBottom();
}

function scrollChatBottom() {
  const container = document.getElementById('chat-messages-container');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

// 7. AI Assistant View
function renderAIView() {
  return `
    <div class="ai-layout-grid animate-fade-in">
      <!-- AI Startup Idea Validator -->
      <div class="ai-panel">
        <h3 class="ai-panel-title"><i class="fa-solid fa-sparkles icon-primary"></i> AI Startup Idea Validator</h3>
        <textarea id="ai-idea-input" rows="4" placeholder="Enter your startup idea (e.g. A digital wallet platform allowing student clubs to easily pool funds for hackathons)..."></textarea>
        <button class="btn btn-primary w-100" id="btn-validate-idea">Validate Idea</button>

        <div id="ai-validation-report" class="ai-report-box" style="display: none;">
          <!-- Validation Report output -->
        </div>
      </div>

      <!-- Grader / Resume Fit -->
      <div class="space-y-6">
        <div class="ai-panel">
          <h3 class="ai-panel-title"><i class="fa-solid fa-microchip color-teal"></i> Profile & Resume Grader</h3>
          <p class="ai-report-text">Grades your skills list, portfolio headline, and availability against current venture funding priorities.</p>
          <button class="btn btn-outline w-100" id="btn-grade-profile">Analyze My Profile</button>
          
          <div id="ai-profile-grade-report" class="ai-report-box" style="display: none;">
            <!-- Profile report output -->
          </div>
        </div>

        <!-- Team health monitor -->
        <div class="ai-panel">
          <h3 class="ai-panel-title"><i class="fa-solid fa-users color-emerald"></i> AI Team Health Monitor</h3>
          <div style="display: flex; gap: 12px;">
            <select id="ai-health-project-select" style="flex: 1;">
              ${activeProjects.map(p => `<option value="${p.id}">${p.title}</option>`).join('')}
            </select>
            <button class="btn btn-primary" id="btn-audit-team">Audit</button>
          </div>

          <div id="ai-team-health-report" class="ai-report-box" style="display: none;">
            <!-- Team report output -->
          </div>
        </div>
      </div>
    </div>
  `;
}

function bindAITriggers() {
  // 1. Validator
  const validateBtn = document.getElementById('btn-validate-idea');
  validateBtn.addEventListener('click', () => {
    const input = document.getElementById('ai-idea-input').value;
    if (!input || input.length < 10) {
      alert('Please enter a descriptive startup idea (at least 10 characters).');
      return;
    }

    validateBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';
    validateBtn.disabled = true;

    setTimeout(() => {
      validateBtn.innerHTML = 'Validate Idea';
      validateBtn.disabled = false;

      const normalized = input.toLowerCase();
      let domain = 'General Startup';
      if (normalized.includes('health') || normalized.includes('clinic')) domain = 'HealthTech';
      else if (normalized.includes('learn') || normalized.includes('college')) domain = 'EdTech';
      else if (normalized.includes('money') || normalized.includes('pay')) domain = 'FinTech';
      else if (normalized.includes('shop') || normalized.includes('buy')) domain = 'E-commerce';
      else if (normalized.includes('ai') || normalized.includes('gpt')) domain = 'Artificial Intelligence';

      const reportBox = document.getElementById('ai-validation-report');
      reportBox.style.display = 'flex';
      reportBox.innerHTML = `
        <div>
          <span class="ai-report-label">Market Sizing</span>
          <div class="ai-report-text">
            TAM: USD 12.5 Billion global market for ${domain} platforms.<br>
            SAM: USD 1.8 Billion addressable regional campus/student audience.<br>
            SOM: USD 45 Million initial launch within partner colleges.
          </div>
        </div>
        <div>
          <span class="ai-report-label">SWOT Analysis</span>
          <div class="ai-swot-grid">
            <div class="swot-tag-box swot-box-strengths"><strong>Strengths</strong><br>Direct campus channels</div>
            <div class="swot-tag-box swot-box-weaknesses"><strong>Weaknesses</strong><br>Seasonal exam churn</div>
            <div class="swot-tag-box swot-box-opportunities"><strong>Opportunities</strong><br>Incubator grants</div>
            <div class="swot-tag-box swot-box-threats"><strong>Threats</strong><br>Competitor clones</div>
          </div>
        </div>
        <div>
          <span class="ai-report-label">Revenue Stream Suggestions</span>
          <p class="ai-report-text">Freemium matching dashboard access. $9/month premium options, 15% commission on paid mentor bookings.</p>
        </div>
      `;
    }, 1200);
  });

  // 2. Profile Grader
  const gradeBtn = document.getElementById('btn-grade-profile');
  gradeBtn.addEventListener('click', () => {
    gradeBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';
    gradeBtn.disabled = true;

    setTimeout(() => {
      gradeBtn.innerHTML = 'Analyze My Profile';
      gradeBtn.disabled = false;

      const reportBox = document.getElementById('ai-profile-grade-report');
      reportBox.style.display = 'flex';
      const skillsScore = 75 + Math.min(myProfile.skills.length * 3, 20);

      reportBox.innerHTML = `
        <div class="grader-scores-row">
          <div class="grader-score-card">
            <span class="grader-score-label">SKILLS VALUE</span>
            <span class="grader-score-num">${skillsScore}%</span>
          </div>
          <div class="grader-score-card">
            <span class="grader-score-label">STARTUP FIT</span>
            <span class="grader-score-num">${Math.min(skillsScore + 5, 96)}%</span>
          </div>
          <div class="grader-score-card">
            <span class="grader-score-label">INTERNSHIP READY</span>
            <span class="grader-score-num">${Math.min(skillsScore - 4, 98)}%</span>
          </div>
        </div>
        <div>
          <span class="ai-report-label">Suggested Improvements</span>
          <ul style="list-style: disc; list-style-position: inside; color: var(--text-muted); margin-top: 6px; line-height: 1.4;">
            <li>Add links to your active GitHub repositories or portfolio sites.</li>
            <li>Consider picking up container technologies like Docker to boost deployment skills.</li>
          </ul>
        </div>
      `;
    }, 1000);
  });

  // 3. Team health auditor
  const auditBtn = document.getElementById('btn-audit-team');
  auditBtn.addEventListener('click', () => {
    const projId = document.getElementById('ai-health-project-select').value;
    const project = activeProjects.find(p => p.id === projId);

    auditBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Audit';
    auditBtn.disabled = true;

    setTimeout(() => {
      auditBtn.innerHTML = 'Audit';
      auditBtn.disabled = false;

      const reportBox = document.getElementById('ai-team-health-report');
      reportBox.style.display = 'flex';

      const hasMembers = project.members.length > 0;
      reportBox.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; background-color: rgba(255,255,255,0.03); padding: 10px; border-radius: var(--radius-sm);">
          <span class="font-bold text-white">Project Health Score</span>
          <span class="font-black" style="color: ${hasMembers ? '#10b981' : '#f87171'}; font-size: 1.25rem;">${hasMembers ? '88%' : '45%'}</span>
        </div>
        <div>
          <span class="ai-report-label">Risks Identified</span>
          <p class="ai-report-text" style="color: #f87171;">
            ${hasMembers ? 'Skill Gap: The team lacks active expertise in frontend design frameworks.' : 'Solo Founder Risk: No active team members are added.'}
          </p>
        </div>
        <div>
          <span class="ai-report-label">Suggested Actions</span>
          <p class="ai-report-text" style="color: var(--primary);">
            ${hasMembers ? 'Hire a UI/UX Designer intern from the Internship marketplace.' : 'Add at least one co-founder using the swipe matching deck.'}
          </p>
        </div>
      `;
    }, 800);
  });
}

// 8. Profile View
function renderProfileView() {
  return `
    <div class="matching-deck-container animate-fade-in" style="max-width: 600px; margin-top: 20px;">
      <div class="projects-form-box space-y-6">
        <h3 class="font-heading mb-4 pb-2 border-b">Profile details Settings</h3>
        
        <div style="display: flex; gap: 16px; align-items: center;">
          <img src="${myProfile.avatar}" alt="Avatar" style="width: 64px; height: 64px; border-radius: 50%; border: 1px solid var(--primary);">
          <div>
            <h4 class="font-bold text-white">${myProfile.name}</h4>
            <p class="text-xs text-text-muted">${myProfile.headline}</p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="form-group">
            <label>Headline</label>
            <input type="text" id="profile-headline-input" value="${myProfile.headline}">
          </div>

          <div class="form-group">
            <label>Bio</label>
            <textarea id="profile-bio-input" rows="3">${myProfile.bio}</textarea>
          </div>

          <div class="form-group">
            <label>My Skills</label>
            <div class="profile-tags-box" id="profile-skills-container">
              <!-- Injected pills -->
            </div>
            <div style="display: flex; gap: 12px; margin-top: 8px;">
              <input type="text" id="profile-new-skill-input" placeholder="Add skill tag (e.g. PyTorch, SEO) and press Enter">
              <button class="btn btn-primary" id="btn-add-profile-skill" style="padding: 10px 16px;">Add</button>
            </div>
          </div>

          <div class="form-group">
            <label>Availability</label>
            <select id="profile-availability-select">
              <option value="FULL_TIME" ${myProfile.availability === 'FULL_TIME' ? 'selected' : ''}>Full Time (40 hrs/week)</option>
              <option value="PART_TIME" ${myProfile.availability === 'PART_TIME' ? 'selected' : ''}>Part Time (10-20 hrs/week)</option>
              <option value="NOT_AVAILABLE" ${myProfile.availability === 'NOT_AVAILABLE' ? 'selected' : ''}>Not Available</option>
            </select>
          </div>
        </div>

        <button class="btn btn-primary w-100" id="btn-save-profile-settings">Save Settings</button>
      </div>
    </div>
  `;
}

function bindProfileTriggers() {
  const container = document.getElementById('profile-skills-container');
  
  const renderSkillPills = () => {
    container.innerHTML = myProfile.skills.map((skill, index) => `
      <span class="profile-tag-pill">
        ${skill}
        <button class="btn-delete-profile-skill" data-index="${index}">&times;</button>
      </span>
    `).join('');

    // bind delete triggers
    const deleteBtns = document.querySelectorAll('.btn-delete-profile-skill');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        myProfile.skills.splice(idx, 1);
        renderSkillPills();
      });
    });
  };

  renderSkillPills();

  // Add Skill
  const addBtn = document.getElementById('btn-add-profile-skill');
  const input = document.getElementById('profile-new-skill-input');
  
  const triggerAdd = () => {
    const val = input.value.trim();
    if (val && !myProfile.skills.includes(val)) {
      myProfile.skills.push(val);
      input.value = '';
      renderSkillPills();
    }
  };

  addBtn.addEventListener('click', triggerAdd);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      triggerAdd();
    }
  });

  // Save Settings
  document.getElementById('btn-save-profile-settings').addEventListener('click', () => {
    myProfile.headline = document.getElementById('profile-headline-input').value;
    myProfile.bio = document.getElementById('profile-bio-input').value;
    myProfile.availability = document.getElementById('profile-availability-select').value;
    alert('Profile changes saved in temporary cache state.');
    renderActiveTab();
  });
}

// ==========================================
// MOCK CALCULATION CORE ALGORITHM
// ==========================================
function calculateMatchScore(profA, profB) {
  let score = 55;
  const skillsA = new Set(profA.skills.map(s => s.toLowerCase()));
  const skillsB = new Set(profB.skills.map(s => s.toLowerCase()));
  const intersection = [...skillsA].filter(x => skillsB.has(x));

  score += Math.min(intersection.length * 8, 20);

  const intA = new Set(profA.interests.map(i => i.toLowerCase()));
  const intB = new Set(profB.interests.map(i => i.toLowerCase()));
  const sharedInt = [...intA].filter(x => intB.has(x));

  score += Math.min(sharedInt.length * 10, 20);

  if (profA.availability === profB.availability) score += 10;
  
  return Math.min(score, 98);
}

// ==========================================
// MODALS TRIGGER REGISTER HANDLERS
// ==========================================
function setupGlobalModalTriggers() {
  // Closing modals
  const closeBtns = document.querySelectorAll('[data-close]');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      document.getElementById(modalId).classList.remove('active');
    });
  });

  // Submit project application
  document.getElementById('submit-application-btn').addEventListener('click', () => {
    const letter = document.getElementById('apply-letter').value;
    
    // Add member
    selectedProjectToApply.members.push({
      userId: 'me',
      roleName: 'Associate',
      user: { profile: { name: myProfile.name } }
    });

    // Add to chat room
    const teamRoom = chatRooms.find(r => r.projectId === selectedProjectToApply.id || r.name.includes(selectedProjectToApply.title));
    if (teamRoom) {
      teamRoom.messages.push({ sender: 'System', content: `Jane Doe joined the team room!`, time: 'Just now' });
    } else {
      chatRooms.push({
        id: `room_team_${Date.now()}`,
        name: `${selectedProjectToApply.title} Team Group`,
        type: 'TEAM',
        messages: [
          { sender: 'System', content: `You successfully joined ${selectedProjectToApply.title}!`, time: 'Just now' }
        ]
      });
    }

    addNotification('Application Successful', `You joined ${selectedProjectToApply.title}! Check project chat rooms.`, 'APPLICATION');
    
    // Close modal
    document.getElementById('apply-modal').classList.remove('active');
    document.getElementById('apply-letter').value = '';
    alert(`Application submitted! You have been added to the project team.`);
    renderActiveTab();
  });

  // Submit book mentor session
  const bookForm = document.getElementById('book-mentor-form');
  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = document.getElementById('book-date').value;
    const time = document.getElementById('book-time').value;

    selectedCheckoutPlan = `Mentorship with ${selectedMentorToBook.name}`;
    selectedCheckoutAmount = selectedMentorToBook.hourlyRate;

    // Trigger Razorpay Sandbox checkout modal
    document.getElementById('checkout-plan-name').textContent = selectedCheckoutPlan;
    document.getElementById('checkout-row-plan').textContent = selectedCheckoutPlan;
    document.getElementById('checkout-row-amount').textContent = `₹${selectedCheckoutAmount}.00`;
    
    // Close book modal and open Razorpay simulator
    document.getElementById('book-mentor-modal').classList.remove('active');
    document.getElementById('razorpay-modal').classList.add('active');

    // Save context to bind payments success
    window.pendingSession = {
      mentorName: selectedMentorToBook.name,
      date,
      time
    };
  });

  // Premium badge checkout modal trigger
  document.getElementById('go-premium-btn').addEventListener('click', () => {
    selectedCheckoutPlan = 'Startiva Lifetime Founder';
    selectedCheckoutAmount = 1999;

    document.getElementById('checkout-plan-name').textContent = selectedCheckoutPlan;
    document.getElementById('checkout-row-plan').textContent = selectedCheckoutPlan;
    document.getElementById('checkout-row-amount').textContent = `₹${selectedCheckoutAmount}.00`;

    document.getElementById('razorpay-modal').classList.add('active');
    
    window.pendingSession = null; // premium purchase flag
  });

  // Confirm sandbox payment
  document.getElementById('confirm-payment-btn').addEventListener('click', () => {
    document.getElementById('razorpay-modal').classList.remove('active');

    if (window.pendingSession) {
      const sess = window.pendingSession;
      myBookings.unshift({
        id: `sess_${Date.now()}`,
        mentorName: sess.mentorName,
        date: sess.date,
        time: sess.time,
        status: 'BOOKED',
        link: `https://meet.jit.si/startiva-mentor-${Math.random().toString(36).substring(2, 9)}`
      });
      alert(`Payment Successful! Mentor session with ${sess.mentorName} confirmed. Jitsi link created.`);
      window.pendingSession = null;
    } else {
      currentUser.isPremium = true;
      document.getElementById('header-premium-tag').style.display = 'inline-block';
      document.getElementById('go-premium-btn').style.display = 'none';
      alert('Payment Successful! Lifetime Founder Premium Badge unlocked.');
    }

    renderActiveTab();
  });
}
