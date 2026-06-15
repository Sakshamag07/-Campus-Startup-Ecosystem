import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { AIService } from '../services/aiService.js';
import { MatchEngine } from '../services/matchEngine.js';
import prisma from '../config/db.js';

export class AIController {
  /**
   * AI Startup Idea Validator
   */
  static async validateIdea(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id!;
      const { ideaText } = req.body;

      if (!ideaText || ideaText.trim().length < 10) {
        res.status(400).json({ error: 'Please enter a descriptive startup idea (minimum 10 characters).' });
        return;
      }

      // Run analysis
      const analysis = await AIService.validateIdea(ideaText);

      // Save database log - Fixed casing to match Prisma schema
      const log = await prisma.aIValidatorResult.create({
        data: {
          userId,
          ideaText,
          marketAnalysis: analysis.marketAnalysis,
          competitorAnalysis: analysis.competitorAnalysis,
          swotAnalysis: analysis.swotAnalysis,
          revenueModel: analysis.revenueModel,
          risks: analysis.risks,
          growthOpportunities: analysis.growthOpportunities,
        },
      });

      res.status(201).json(log);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Fetch past validated idea logs
   */
  static async getPastValidations(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      // Fixed casing to match Prisma schema
      const history = await prisma.aIValidatorResult.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      res.json(history);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Grader for Resume details
   */
  static async analyzeProfileResume(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const profile = await prisma.profile.findUnique({ where: { userId } });

      if (!profile) {
        res.status(404).json({ error: 'Configure your profile settings before requesting AI grading.' });
        return;
      }

      const analysis = await AIService.analyzeResume(profile.skills, profile.bio || '', profile.resumeUrl || undefined);
      res.json(analysis);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Monitor Project Team Health
   */
  static async getProjectTeamHealth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Fixed: Explicit type casting prevents string | string[] compilation errors
      const projectId = req.params.projectId as string;
      const userId = req.user?.id;

      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project) {
        res.status(404).json({ error: 'Startup project not found.' });
        return;
      }

      if (project.creatorId !== userId) {
        res.status(403).json({ error: 'Unauthorized: Health reports can only be requested by project founders.' });
        return;
      }

      const metrics = await AIService.monitorTeamHealth(projectId);
      res.json(metrics);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Calculate Matching Co-founders
   */
  static async getCoFounderMatches(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id!;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const recommendations = await MatchEngine.getRecommendations(userId, limit);
      res.json(recommendations);
    } catch (err) {
      next(err);
    }
  }
}