import { Response, NextFunction } from 'express';
import prisma from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { SocketService } from '../services/socketService.js';
import { AIService } from '../services/aiService.js';
import { ApplicationStatus } from '@prisma/client';

export class ProjectController {
  // ==========================================
  // Profile Controller Methods
  // ==========================================
  
  static async getMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const profile = await prisma.profile.findUnique({
        where: { userId },
        include: { user: { select: { email: true, role: true, isPremium: true } } },
      });
      res.json(profile);
    } catch (err) {
      next(err);
    }
  }

  static async updateMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const { name, avatar, bio, headline, skills, interests, availability, github, linkedin, portfolio, resumeUrl, startupIdea, personalityTraits } = req.body;

      const updated = await prisma.profile.update({
        where: { userId },
        data: {
          name, avatar, bio, headline, skills, interests, availability, github, linkedin, portfolio, resumeUrl, startupIdea, personalityTraits,
        },
      });

      res.json({ message: 'Profile updated successfully.', profile: updated });
    } catch (err) {
      next(err);
    }
  }

  static async getPublicProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const profile = await prisma.profile.findUnique({
        where: { userId },
        include: { user: { select: { email: true, role: true, isPremium: true } } },
      });

      if (!profile) {
        res.status(404).json({ error: 'User profile not found.' });
        return;
      }

      res.json(profile);
    } catch (err) {
      next(err);
    }
  }

  static async searchProfiles(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { skill, interest, availability } = req.query;

      const filters: any = {};
      if (skill) {
        filters.skills = { has: skill as string };
      }
      if (interest) {
        filters.interests = { has: interest as string };
      }
      if (availability) {
        filters.availability = availability;
      }

      const profiles = await prisma.profile.findMany({
        where: filters,
        include: { user: { select: { email: true, role: true } } },
      });

      res.json(profiles);
    } catch (err) {
      next(err);
    }
  }

  // ==========================================
  // Project Hub Controller Methods
  // ==========================================

  static async createProject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const creatorId = req.user?.id!;
      const { title, tagline, description, domain, status, logoUrl, pitchDeckUrl, roles, milestones } = req.body;

      if (!title || !tagline || !description || !domain) {
        res.status(400).json({ error: 'Title, tagline, description, and domain are required.' });
        return;
      }

      const project = await prisma.$transaction(async (tx) => {
        // Create project
        const newProj = await tx.project.create({
          data: {
            creatorId,
            title,
            tagline,
            description,
            domain,
            status: status || 'IDEA',
            logoUrl,
            pitchDeckUrl,
          },
        });

        // Add creator as member
        await tx.projectMember.create({
          data: {
            projectId: newProj.id,
            userId: creatorId,
            roleName: 'Founder / Initiator',
          },
        });

        // Add optional initial open roles
        if (roles && Array.isArray(roles)) {
          for (const role of roles) {
            await tx.projectRole.create({
              data: {
                projectId: newProj.id,
                title: role.title,
                description: role.description || '',
                skillsRequired: role.skillsRequired || [],
              },
            });
          }
        }

        // Add optional initial milestones
        if (milestones && Array.isArray(milestones)) {
          for (const m of milestones) {
            await tx.milestone.create({
              data: {
                projectId: newProj.id,
                title: m.title,
                description: m.description || '',
                dueDate: new Date(m.dueDate),
              },
            });
          }
        }

        // Auto-create chat room for project team
        await tx.chatRoom.create({
          data: {
            name: `${title} Team Room`,
            type: 'TEAM',
            projectId: newProj.id,
            members: {
              create: [{ userId: creatorId }]
            }
          }
        });

        return newProj;
      });

      res.status(201).json({ message: 'Startup project initialized successfully.', project });
    } catch (err) {
      next(err);
    }
  }

  static async getProjects(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { domain, status } = req.query;

      const filters: any = {};
      if (domain) filters.domain = domain as string;
      if (status) filters.status = status as any;

      const projects = await prisma.project.findMany({
        where: filters,
        include: {
          creator: { select: { profile: { select: { name: true, avatar: true } } } },
          members: { include: { user: { include: { profile: { select: { name: true, avatar: true } } } } } },
          roles: true,
          milestones: true,
        },
      });

      res.json(projects);
    } catch (err) {
      next(err);
    }
  }

  static async getProjectDetails(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          creator: { select: { profile: { select: { name: true, avatar: true } } } },
          members: { include: { user: { include: { profile: { select: { name: true, avatar: true } } } } } },
          roles: true,
          milestones: true,
          updates: { orderBy: { createdAt: 'desc' } },
        },
      });

      if (!project) {
        res.status(404).json({ error: 'Project not found.' });
        return;
      }

      res.json(project);
    } catch (err) {
      next(err);
    }
  }

  static async updateProject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { title, tagline, description, domain, status, logoUrl, pitchDeckUrl } = req.body;

      const project = await prisma.project.findUnique({ where: { id } });
      if (!project) {
        res.status(404).json({ error: 'Project not found.' });
        return;
      }

      if (project.creatorId !== userId) {
        res.status(403).json({ error: 'Unauthorized: Only the project founder can modify these settings.' });
        return;
      }

      const updated = await prisma.project.update({
        where: { id },
        data: { title, tagline, description, domain, status, logoUrl, pitchDeckUrl },
      });

      res.json({ message: 'Project settings updated.', project: updated });
    } catch (err) {
      next(err);
    }
  }

  // ==========================================
  // Team Applications Methods
  // ==========================================

  static async applyToRole(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const applicantId = req.user?.id!;
      const { projectId, roleId, coverLetter, resumeUrl } = req.body;

      if (!projectId) {
        res.status(400).json({ error: 'Project ID is required.' });
        return;
      }

      // 1. Double Application Check
      const existing = await prisma.application.findFirst({
        where: { projectId, applicantId, roleId, status: 'PENDING' },
      });

      if (existing) {
        res.status(400).json({ error: 'You have a pending application active for this role.' });
        return;
      }

      // Fetch student profile info for AI analysis
      const profile = await prisma.profile.findUnique({ where: { userId: applicantId } });
      let aiScore = 75; // default fallback
      let aiAnalysis = {};

      if (profile) {
        // Run AI evaluation on resume/profile
        const report = await AIService.analyzeResume(profile.skills, profile.bio || '', resumeUrl || profile.resumeUrl || undefined);
        aiScore = report.skillsScore;
        aiAnalysis = report;
      }

      const app = await prisma.application.create({
        data: {
          projectId,
          roleId,
          applicantId,
          coverLetter,
          resumeUrl: resumeUrl || profile?.resumeUrl,
          aiScore,
          aiAnalysis,
        },
      });

      // Fetch project owner to push notification
      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (project) {
        SocketService.sendNotification(
          project.creatorId,
          'New Applicant',
          `A student has applied to join your project: "${project.title}". Check dashboard compatibility rankings!`,
          'APPLICATION'
        );
      }

      res.status(201).json({ message: 'Application submitted successfully. Candidate match score processed.', application: app });
    } catch (err) {
      next(err);
    }
  }

  static async getProjectApplications(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const userId = req.user?.id;

      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project) {
        res.status(404).json({ error: 'Project not found.' });
        return;
      }

      if (project.creatorId !== userId) {
        res.status(403).json({ error: 'Unauthorized.' });
        return;
      }

      const applications = await prisma.application.findMany({
        where: { projectId },
        include: {
          applicant: { select: { email: true, profile: true } },
          role: true,
          internship: true,
        },
        orderBy: { aiScore: 'desc' }, // Rank candidates by AI score!
      });

      res.json(applications);
    } catch (err) {
      next(err);
    }
  }

  static async updateApplicationStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body; // ACCEPTED or REJECTED
      const userId = req.user?.id;

      if (!status || !Object.values(ApplicationStatus).includes(status)) {
        res.status(400).json({ error: 'Valid status is required (ACCEPTED/REJECTED).' });
        return;
      }

      const application = await prisma.application.findUnique({
        where: { id },
        include: { project: true, role: true, internship: true },
      });

      if (!application) {
        res.status(404).json({ error: 'Application record not found.' });
        return;
      }

      if (application.project.creatorId !== userId) {
        res.status(403).json({ error: 'Unauthorized: Only project founders can accept/reject team candidates.' });
        return;
      }

      const updated = await prisma.$transaction(async (tx) => {
        const app = await tx.application.update({
          where: { id },
          data: { status },
        });

        if (status === 'ACCEPTED') {
          // Add candidate to team members list
          await tx.projectMember.create({
            data: {
              projectId: application.projectId,
              userId: application.applicantId,
              roleName: application.role?.title || application.internship?.title || 'Team Associate',
            },
          });

          // Join active chat channel
          const chatRoom = await tx.chatRoom.findFirst({
            where: { projectId: application.projectId, type: 'TEAM' },
          });

          if (chatRoom) {
            await tx.chatMember.create({
              data: { roomId: chatRoom.id, userId: application.applicantId },
            });
          }

          // Mark project role filled
          if (application.roleId) {
            await tx.projectRole.update({
              where: { id: application.roleId },
              data: { isFilled: true },
            });
          }
        }

        return app;
      });

      // Send status change notification to applicant
      SocketService.sendNotification(
        application.applicantId,
        'Application Update',
        `Your application for "${application.project.title}" was ${status.toLowerCase()}!`,
        'APPLICATION'
      );

      res.json({ message: `Application status updated to ${status}.`, application: updated });
    } catch (err) {
      next(err);
    }
  }

  // ==========================================
  // Internship Marketplace Methods
  // ==========================================

  static async postInternship(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const creatorId = req.user?.id;
      const { projectId, title, description, requirements, stipend, duration, location } = req.body;

      if (!projectId || !title || !description) {
        res.status(400).json({ error: 'Project ID, title, and description are required.' });
        return;
      }

      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project || project.creatorId !== creatorId) {
        res.status(403).json({ error: 'Unauthorized: Only project creators can post internships.' });
        return;
      }

      const internship = await prisma.internship.create({
        data: {
          projectId, title, description, requirements: requirements || [], stipend, duration, location: location || 'REMOTE',
        },
      });

      res.status(201).json({ message: 'Internship position published successfully.', internship });
    } catch (err) {
      next(err);
    }
  }

  static async getInternships(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const internships = await prisma.internship.findMany({
        where: { isClosed: false },
        include: {
          project: { select: { title: true, logoUrl: true, domain: true } },
        },
      });
      res.json(internships);
    } catch (err) {
      next(err);
    }
  }
}
