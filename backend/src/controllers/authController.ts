import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey123!';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'supersecretrefreshkey456!';

const generateTokens = (user: { id: string; email: string; role: Role; isPremium: boolean }) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role, isPremium: user.isPremium },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export class AuthController {
  /**
   * Register new user
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, name, role } = req.body;

      if (!email || !password || !name) {
        res.status(400).json({ error: 'Name, email, and password are required fields.' });
        return;
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(400).json({ error: 'An account with this email address already exists.' });
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const assignedRole = (role && Object.values(Role).includes(role)) ? (role as Role) : Role.STUDENT;

      // Create user & blank profile inside transaction
      const user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email,
            passwordHash,
            role: assignedRole,
            verificationToken: `verify_${Math.random().toString(36).substring(2, 15)}`,
          },
        });

        await tx.profile.create({
          data: {
            userId: newUser.id,
            name,
            skills: [],
            interests: [],
            personalityTraits: [],
          },
        });

        // If user registers as a Mentor, create MentorProfile
        if (assignedRole === Role.MENTOR) {
          await tx.mentorProfile.create({
            data: {
              userId: newUser.id,
              expertise: [],
              bio: `Expert mentor ready to guide campus startup projects.`,
              availabilityWindow: {},
            },
          });
        }

        return newUser;
      });

      const { accessToken, refreshToken } = generateTokens({
        id: user.id,
        email: user.email,
        role: user.role,
        isPremium: user.isPremium,
      });

      // Save refresh token
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      res.status(201).json({
        message: 'Account registered successfully. Please check your inbox for verification code.',
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.email, role: user.role, name },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Login
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { email },
        include: { profile: true },
      });

      if (!user) {
        res.status(401).json({ error: 'Invalid email or password.' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid email or password.' });
        return;
      }

      const { accessToken, refreshToken } = generateTokens({
        id: user.id,
        email: user.email,
        role: user.role,
        isPremium: user.isPremium,
      });

      // Update refresh token in database
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      res.json({
        message: 'Logged in successfully.',
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.profile?.name || 'User',
          isPremium: user.isPremium,
          avatar: user.profile?.avatar,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Refresh token
   */
  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({ error: 'Refresh token is required.' });
        return;
      }

      const user = await prisma.user.findFirst({
        where: { refreshToken },
      });

      if (!user) {
        res.status(401).json({ error: 'Invalid or revoked refresh token.' });
        return;
      }

      try {
        jwt.verify(refreshToken, JWT_REFRESH_SECRET);

        const tokens = generateTokens({
          id: user.id,
          email: user.email,
          role: user.role,
          isPremium: user.isPremium,
        });

        // Save new refresh token in DB
        await prisma.user.update({
          where: { id: user.id },
          data: { refreshToken: tokens.refreshToken },
        });

        res.json({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      } catch (err) {
        res.status(401).json({ error: 'Expired refresh token. Please log in again.' });
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * Verify email
   */
  static async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;

      if (!token) {
        res.status(400).json({ error: 'Verification token is required.' });
        return;
      }

      const user = await prisma.user.findFirst({
        where: { verificationToken: token },
      });

      if (!user) {
        res.status(400).json({ error: 'Invalid or expired verification token.' });
        return;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          verificationToken: null,
        },
      });

      res.json({ message: 'Email address verified successfully. You can now build setups.' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Mock Forgot Password
   */
  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      
      if (!user) {
        res.status(404).json({ error: 'No user account found with this email address.' });
        return;
      }

      const token = Math.random().toString(36).substring(2, 15);
      const expires = new Date();
      expires.setHours(expires.getHours() + 1); // 1 hour expiry

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: token,
          resetTokenExpires: expires,
        },
      });

      console.log(`[SMTP SIMULATION] Reset link sent to ${email}: http://localhost/reset-password?token=${token}`);

      res.json({ message: 'Password reset instructions have been dispatched to your work email.' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Mock Reset Password
   */
  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        res.status(400).json({ error: 'Reset token and new password are required.' });
        return;
      }

      const user = await prisma.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpires: { gt: new Date() },
        },
      });

      if (!user) {
        res.status(400).json({ error: 'Reset token is invalid or has expired.' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          resetToken: null,
          resetTokenExpires: null,
        },
      });

      res.json({ message: 'Password updated successfully. You can now sign in.' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Log out
   */
  static async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user) {
        await prisma.user.update({
          where: { id: req.user.id },
          data: { refreshToken: null },
        });
      }
      res.json({ message: 'Logged out successfully.' });
    } catch (err) {
      next(err);
    }
  }
}
