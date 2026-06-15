import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import prisma from '../config/db.js';

export class SocketService {
  private static io: Server | null = null;
  private static userSocketMap = new Map<string, string>(); // userId -> socketId

  static init(server: HttpServer): Server {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket: Socket) => {
      const userId = socket.handshake.query.userId as string;
      
      if (userId) {
        this.userSocketMap.set(userId, socket.id);
        console.log(`🔌 Socket Connected: User ${userId} joined on socket ${socket.id}`);
      }

      // Join chat room
      socket.on('join_room', (roomId: string) => {
        socket.join(roomId);
        console.log(`👥 Socket: Socket ${socket.id} joined room ${roomId}`);
      });

      // Leave chat room
      socket.on('leave_room', (roomId: string) => {
        socket.leave(roomId);
        console.log(`🚪 Socket: Socket ${socket.id} left room ${roomId}`);
      });

      // Sending messages
      socket.on('send_message', async (data: {
        roomId: string;
        senderId: string;
        content: string;
        fileUrl?: string;
        fileType?: string;
      }) => {
        try {
          // Save message to DB
          const message = await prisma.message.create({
            data: {
              roomId: data.roomId,
              senderId: data.senderId,
              content: data.content,
              fileUrl: data.fileUrl,
              fileType: data.fileType,
            },
            include: {
              sender: {
                select: {
                  id: true,
                  email: true,
                  profile: {
                    select: {
                      name: true,
                      avatar: true,
                    },
                  },
                },
              },
            },
          });

          // Broadcast to everyone in room
          this.io?.to(data.roomId).emit('receive_message', message);
          
          // Send push notifications to offline room members
          const roomMembers = await prisma.chatMember.findMany({
            where: { roomId: data.roomId, userId: { not: data.senderId } },
            select: { userId: true }
          });

          for (const member of roomMembers) {
            const socketId = this.userSocketMap.get(member.userId);
            if (!socketId) {
              // Create offline DB notification
              await prisma.notification.create({
                data: {
                  userId: member.userId,
                  title: 'New Message',
                  content: `You received a new message in chat.`,
                  type: 'MESSAGE',
                }
              });
            } else {
              // Direct emit real-time message notification
              this.io?.to(socketId).emit('notification', {
                title: 'New Message',
                content: `You received a new message in chat.`,
                type: 'MESSAGE',
                createdAt: new Date(),
              });
            }
          }
        } catch (err) {
          console.error('Socket message save failed:', err);
        }
      });

      // User disconnected
      socket.on('disconnect', () => {
        if (userId) {
          this.userSocketMap.delete(userId);
          console.log(`🔌 Socket Disconnected: User ${userId}`);
        }
      });
    });

    return this.io;
  }

  /**
   * Send real-time notification to user
   */
  static sendNotification(userId: string, title: string, content: string, type: 'MATCH' | 'APPLICATION' | 'MESSAGE' | 'SESSION' | 'SYSTEM'): void {
    const socketId = this.userSocketMap.get(userId);
    
    // Save to Database
    prisma.notification.create({
      data: { userId, title, content, type }
    }).then(dbNotification => {
      if (socketId && this.io) {
        this.io.to(socketId).emit('notification', dbNotification);
      }
    }).catch(err => {
      console.error('Failed to save notification to DB:', err);
    });
  }
}
