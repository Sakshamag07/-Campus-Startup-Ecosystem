import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { ProjectController } from '../controllers/projectController.js';
import { MentorController } from '../controllers/mentorController.js';
import { AIController } from '../controllers/aiController.js';
import { ChatController } from '../controllers/chatController.js';
import { PaymentController } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// ==========================================
// Authentication Routes
// ==========================================
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/refresh', AuthController.refreshToken);
router.post('/auth/verify-email', AuthController.verifyEmail);
router.post('/auth/forgot-password', AuthController.forgotPassword);
router.post('/auth/reset-password', AuthController.resetPassword);
router.post('/auth/logout', authenticate as any, AuthController.logout as any);

// ==========================================
// Profile Routes
// ==========================================
router.get('/profiles/me', authenticate as any, ProjectController.getMyProfile as any);
router.put('/profiles/me', authenticate as any, ProjectController.updateMyProfile as any);
router.get('/profiles/search', authenticate as any, ProjectController.searchProfiles as any);
router.get('/profiles/:userId', authenticate as any, ProjectController.getPublicProfile as any);

// ==========================================
// Project Hub & Applications Routes
// ==========================================
router.post('/projects', authenticate as any, ProjectController.createProject as any);
router.get('/projects', authenticate as any, ProjectController.getProjects as any);
router.get('/projects/:id', authenticate as any, ProjectController.getProjectDetails as any);
router.put('/projects/:id', authenticate as any, ProjectController.updateProject as any);

router.post('/applications/apply', authenticate as any, ProjectController.applyToRole as any);
router.get('/projects/:projectId/applications', authenticate as any, ProjectController.getProjectApplications as any);
router.put('/applications/:id/status', authenticate as any, ProjectController.updateApplicationStatus as any);

// ==========================================
// Internship Marketplace Routes
// ==========================================
router.post('/projects/internships', authenticate as any, ProjectController.postInternship as any);
router.get('/projects/internships/all', authenticate as any, ProjectController.getInternships as any);

// ==========================================
// Mentorship Routes
// ==========================================
router.get('/mentorship/mentors', authenticate as any, MentorController.listMentors as any);
router.post('/mentorship/book', authenticate as any, MentorController.bookSession as any);
router.get('/mentorship/dashboard', authenticate as any, MentorController.getMentorDashboard as any);
router.post('/mentorship/sessions/:sessionId/review', authenticate as any, MentorController.submitReview as any);

// ==========================================
// Chat Routes
// ==========================================
router.get('/chat/rooms', authenticate as any, ChatController.getMyRooms as any);
router.post('/chat/rooms', authenticate as any, ChatController.createDirectRoom as any);
router.get('/chat/rooms/:roomId/messages', authenticate as any, ChatController.getRoomMessages as any);

// ==========================================
// AI Features Routes
// ==========================================
router.post('/ai/validate-idea', authenticate as any, AIController.validateIdea as any);
router.get('/ai/history', authenticate as any, AIController.getPastValidations as any);
router.post('/ai/analyze-resume', authenticate as any, AIController.analyzeProfileResume as any);
router.get('/ai/team-health/:projectId', authenticate as any, AIController.getProjectTeamHealth as any);
router.get('/ai/recommendations', authenticate as any, AIController.getCoFounderMatches as any);

// ==========================================
// Payment Routes
// ==========================================
router.post('/payments/create-order', authenticate as any, PaymentController.createCheckoutOrder as any);
router.post('/payments/verify', authenticate as any, PaymentController.confirmPayment as any);

export default router;
