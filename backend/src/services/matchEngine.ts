import prisma from '../config/db.js';
import { Profile, Availability, User } from '@prisma/client';

export interface MatchCandidate {
  user: User;
  profile: Profile;
  compatibilityScore: number;
}

export class MatchEngine {
  /**
   * Calculate compatibility score between two user profiles (0 to 100)
   */
  static calculateScore(profileA: Profile, profileB: Profile): number {
    let score = 0;

    // 1. Skills overlap & complementarity (40 points)
    const skillsA = new Set(profileA.skills.map(s => s.toLowerCase()));
    const skillsB = new Set(profileB.skills.map(s => s.toLowerCase()));

    const intersection = new Set([...skillsA].filter(x => skillsB.has(x)));
    
    // Complementary points (e.g. if A has tech skills and B has marketing/business skills, score increases)
    const techKeywords = ['developer', 'engineer', 'react', 'node', 'code', 'python', 'java', 'frontend', 'backend'];
    const businessKeywords = ['marketing', 'sales', 'growth', 'finance', 'business', 'mba', 'pitch', 'product'];

    const A_hasTech = [...skillsA].some(s => techKeywords.some(t => s.includes(t)));
    const B_hasTech = [...skillsB].some(s => techKeywords.some(t => s.includes(t)));
    const A_hasBiz = [...skillsA].some(s => businessKeywords.some(t => s.includes(t)));
    const B_hasBiz = [...skillsB].some(s => businessKeywords.some(t => s.includes(t)));

    if (intersection.size > 0) {
      // Shared interests/skills (up to 20 points)
      score += Math.min(intersection.size * 5, 20);
    }

    if ((A_hasTech && B_hasBiz) || (A_hasBiz && B_hasTech)) {
      // Complementary technical-business match (20 points)
      score += 20;
    } else if (A_hasTech && B_hasTech) {
      // Dual tech developers (12 points)
      score += 12;
    } else if (A_hasBiz && B_hasBiz) {
      // Dual business partners (8 points)
      score += 8;
    } else {
      score += 5;
    }

    // 2. Domain Interests Overlap (30 points)
    const interestsA = new Set(profileA.interests.map(i => i.toLowerCase()));
    const interestsB = new Set(profileB.interests.map(i => i.toLowerCase()));
    const sharedInterests = new Set([...interestsA].filter(x => interestsB.has(x)));

    if (sharedInterests.size > 0) {
      score += Math.min(sharedInterests.size * 10, 30);
    }

    // 3. Availability Alignment (15 points)
    if (profileA.availability === profileB.availability) {
      score += 15;
    } else if (
      (profileA.availability === Availability.FULL_TIME && profileB.availability === Availability.PART_TIME) ||
      (profileA.availability === Availability.PART_TIME && profileB.availability === Availability.FULL_TIME)
    ) {
      score += 8;
    }

    // 4. Personality alignment (15 points)
    const traitsA = new Set((profileA.personalityTraits || []).map(t => t.toLowerCase()));
    const traitsB = new Set((profileB.personalityTraits || []).map(t => t.toLowerCase()));
    const sharedTraits = new Set([...traitsA].filter(x => traitsB.has(x)));

    if (sharedTraits.size > 0) {
      score += Math.min(sharedTraits.size * 5, 10);
    }
    // Boost score if they have complementary traits (e.g. Visionary + Executor)
    const A_hasVisionary = traitsA.has('visionary');
    const B_hasExecutor = traitsB.has('executor') || traitsB.has('analytical');
    const B_hasVisionary = traitsB.has('visionary');
    const A_hasExecutor = traitsA.has('executor') || traitsA.has('analytical');

    if ((A_hasVisionary && B_hasExecutor) || (B_hasVisionary && A_hasExecutor)) {
      score += 5;
    }

    return Math.min(score, 100);
  }

  /**
   * Get matching co-founders recommendations for a user
   */
  static async getRecommendations(userId: string, limit: number = 10): Promise<MatchCandidate[]> {
    const userProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!userProfile) {
      return [];
    }

    // Fetch all profiles excluding the current user
    const otherProfiles = await prisma.profile.findMany({
      where: {
        userId: { not: userId },
      },
      include: {
        user: true,
      },
    });

    // Compute matching scores
    const candidates = otherProfiles.map(targetProfile => {
      const compatibilityScore = this.calculateScore(userProfile, targetProfile);
      return {
        user: targetProfile.user,
        profile: targetProfile,
        compatibilityScore,
      };
    });

    // Sort by compatibility score in descending order and slice
    return candidates
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, limit);
  }
}
