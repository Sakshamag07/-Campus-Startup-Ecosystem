import { Response, NextFunction } from 'express';
import prisma from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { ChatRoomType } from '@prisma/client';

export class ChatController {
  /**
   * Get all active rooms for the logged-in user
   */
  static async getMyRooms(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id!;

      const rooms = await prisma.chatRoom.findMany({
        where: {
          members: {
            some: { userId },
          },
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  profile: {
                    select: { name: true, avatar: true, headline: true },
                  },
                },
              },
            },
          },
          project: {
            select: { title: true, logoUrl: true },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      res.json(rooms);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Fetch chat logs history for a specific room
   */
  static async getRoomMessages(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { roomId } = req.params;
      const userId = req.user?.id!;

      // Verify user is member of room
      const membership = await prisma.chatMember.findUnique({
        where: {
          roomId_userId: { roomId, userId },
        },
      });

      if (!membership) {
        res.status(403).json({ error: 'Access Denied: You are not authorized to view messages in this channel.' });
        return;
      }

      const messages = await prisma.message.findMany({
        where: { roomId },
        include: {
          sender: {
            select: {
              id: true,
              email: true,
              profile: {
                select: { name: true, avatar: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      res.json(messages);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Create direct chat room with another user
   */
  static async createDirectRoom(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const creatorId = req.user?.id!;
      const { targetUserId } = req.body;

      if (!targetUserId) {
        res.status(400).json({ error: 'Target User ID is required.' });
        return;
      }

      // Check if a direct room already exists between these users
      const existingRoom = await prisma.chatRoom.findFirst({
        where: {
          type: ChatRoomType.DIRECT,
          AND: [
            { members: { some: { userId: creatorId } } },
            { members: { some: { userId: targetUserId } } },
          ],
        },
      });

      if (existingRoom) {
        res.json(existingRoom);
        return;
      }

      // Create new direct room
      const room = await prisma.chatRoom.create({
        data: {
          type: ChatRoomType.DIRECT,
          members: {
            create: [
              { userId: creatorId },
              { userId: targetUserId },
            ],
          },
        },
      });

      res.status(201).json(room);
    } catch (err) {
      next(err);
    }
  }
}
