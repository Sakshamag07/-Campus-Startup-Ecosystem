import { Response, NextFunction } from 'express';
import prisma from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { SocketService } from '../services/socketService.js';
import { PaymentService } from '../services/paymentService.js';
import { PaymentType, SessionStatus } from '@prisma/client';

export class MentorController {
  static async listMentors(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { expertise } = req.query;
      
      const filters: any = {};
      if (expertise) {
        filters.expertise = { has: expertise as string };
      }

      const mentors = await prisma.mentorProfile.findMany({
        where: filters,
        include: {
          user: {
            select: {
              email: true,
              profile: {
                select: { name: true, avatar: true, headline: true }
              }
            }
          }
        }
      });

      res.json(mentors);
    } catch (err) {
      next(err);
    }
  }

  static async bookSession(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = req.user?.id!;
      const { mentorId, scheduledAt, durationMinutes } = req.body;

      if (!mentorId || !scheduledAt) {
        res.status(400).json({ error: 'Mentor ID and session schedule time are required.' });
        return;
      }

      const mentor = await prisma.mentorProfile.findUnique({
        where: { id: mentorId },
        include: { user: true }
      });

      if (!mentor) {
        res.status(404).json({ error: 'Mentor profile not found.' });
        return;
      }

      // Calculate cost
      const sessionCost = mentor.hourlyRate * ((durationMinutes || 60) / 60);

      // 1. Create order
      const orderDetails = await PaymentService.createOrder(
        studentId,
        sessionCost,
        PaymentType.MENTOR_SESSION
      );

      // 2. Setup pending session entry
      const session = await prisma.mentorSession.create({
        data: {
          mentorId,
          studentId,
          scheduledAt: new Date(scheduledAt),
          durationMinutes: durationMinutes || 60,
          status: SessionStatus.BOOKED,
          meetingLink: `https://meet.jit.si/startiva-mentorship-${Math.random().toString(36).substring(2, 12)}`,
        }
      });

      res.json({
        message: 'Mentorship order created successfully. Complete authorization check to finalize session.',
        session,
        paymentOrder: orderDetails
      });
    } catch (err) {
      next(err);
    }
  }

  static async getMentorDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const mentorProfile = await prisma.mentorProfile.findUnique({
        where: { userId },
        include: {
          sessions: {
            include: {
              student: { select: { profile: { select: { name: true, avatar: true } } } },
              payment: true
            }
          }
        }
      });

      if (!mentorProfile) {
        res.status(404).json({ error: 'Mentor profile not found for this account.' });
        return;
      }

      // Calculate simple dashboard aggregates
      const completedSessions = mentorProfile.sessions.filter(s => s.status === SessionStatus.COMPLETED);
      const totalEarnings = completedSessions.reduce((acc, curr) => acc + (curr.payment?.amount || 0), 0);

      res.json({
        profile: mentorProfile,
        earnings: totalEarnings,
        sessionsCount: completedSessions.length,
        upcomingSessions: mentorProfile.sessions.filter(s => s.status === SessionStatus.BOOKED),
        pastSessions: completedSessions,
      });
    } catch (err) {
      next(err);
    }
  }

  static async submitReview(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Fixed: Explicit type casting prevents string | string[] type mismatches across lines 138 and 148
      const sessionId = req.params.sessionId as string;
      const { rating, reviewText } = req.body;
      const studentId = req.user?.id;

      if (!rating || rating < 1 || rating > 5) {
        res.status(400).json({ error: 'Provide a valid integer review score (1 to 5 stars).' });
        return;
      }

      const session = await prisma.mentorSession.findUnique({
        where: { id: sessionId },
        include: { mentor: true }
      });

      if (!session || session.studentId !== studentId) {
        res.status(404).json({ error: 'Session booking not found or unauthorized.' });
        return;
      }

      const updatedSession = await prisma.mentorSession.update({
        where: { id: sessionId },
        data: {
          reviewRating: rating,
          reviewText,
          status: SessionStatus.COMPLETED
        }
      });

      // Recalculate Mentor aggregate rating score
      const allMentorReviews = await prisma.mentorSession.findMany({
        where: { mentorId: session.mentorId, reviewRating: { not: null } },
        select: { reviewRating: true }
      });

      const avg = allMentorReviews.reduce((sum, curr) => sum + (curr.reviewRating || 0), 0) / allMentorReviews.length;

      await prisma.mentorProfile.update({
        where: { id: session.mentorId },
        data: {
          rating: parseFloat(avg.toFixed(1)),
          sessionsCount: allMentorReviews.length
        }
      });

      res.json({ message: 'Mentor session review recorded.', session: updatedSession });
    } catch (err) {
      next(err);
    }
  }
}