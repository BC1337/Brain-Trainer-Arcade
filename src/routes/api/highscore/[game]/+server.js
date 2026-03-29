import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export async function GET({ params }) {
  try {
    const { game } = params; // e.g., 'chimp-test'

    // 1. Find the absolute highest score across ALL users for this game
    const globalBest = await prisma.highscore.findFirst({
      where: { 
        game: game 
      },
      orderBy: { 
        rounds: 'desc' 
      },
      include: {
        user: {
          select: { 
            username: true 
          }
        }
      }
    });

    // 2. Get the global average and total player count for this game
    const stats = await prisma.highscore.aggregate({
      where: { game: game },
      _avg: { rounds: true },
      _count: { rounds: true }
    });

    return json({ 
      // Returns the top score and the person who got it
      highscore: globalBest || { rounds: 0, user: { username: 'N/A' } },
      globalAvg: Math.round(stats._avg.rounds || 0),
      totalPlayers: stats._count.rounds || 0
    });
  } catch (err) {
    console.error('💥 Global Highscore API Crash:', err.message);
    return json({ error: 'Failed to fetch global leaderboard' }, { status: 500 });
  }
}

// Note: POST is removed from here. 
// Scores should be sent to /api/user/highscore/[game] to ensure they are tied to a profile.