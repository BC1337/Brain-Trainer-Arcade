import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

const JWT_SECRET = env.JWT_SECRET;

// --- POST: Save New Scores ---
export async function POST({ request, params }) {
  try {
    const { game } = params;
    const body = await request.json();
    const { rounds } = body; 
    
    const hits = body.hits !== undefined ? parseInt(body.hits) : null;
    const accuracy = body.accuracy !== undefined ? parseFloat(body.accuracy) : null;

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = parseInt(decoded.userId);

    const existing = await prisma.highscore.findUnique({
      where: { userId_game: { userId, game } }
    });

    if (!existing || rounds > existing.rounds) {
      const highscore = await prisma.highscore.upsert({
        where: { userId_game: { userId, game } },
        update: { 
          rounds, 
          ...(hits !== null && { hits }), 
          ...(accuracy !== null && { accuracy }),
          createdAt: new Date() // Updates the "updated_at" logic effectively
        },
        create: { 
          userId, 
          game, 
          rounds, 
          hits, 
          accuracy 
        }
      });
      return json({ message: 'New Personal Best!', highscore });
    }

    return json({ message: 'Score processed', highscore: existing });

  } catch (err) {
    console.error('💥 User Highscore POST Crash:', err.message);
    return json({ error: 'Failed to save score' }, { status: 500 });
  }
}

// --- GET: Fetch Personal Best + Global Rank ---
export async function GET({ request, params }) {
  try {
    const { game } = params;
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = parseInt(decoded.userId);
    
    // 1. Get user's personal best
    const highscore = await prisma.highscore.findUnique({
      where: { userId_game: { userId, game } }
    });

    // 2. DYNAMIC RANK CALCULATION
    let rank = null;
    if (highscore && highscore.rounds > 0) {
      // Count how many UNIQUE users have a score higher than yours
      const countHigher = await prisma.highscore.count({
        where: {
          game: game,
          rounds: {
            gt: highscore.rounds // gt = Greater Than
          }
        }
      });
      // Rank is (People better than you) + 1
      rank = countHigher + 1;
    }

    // 3. Global Stats
    const globalStats = await prisma.highscore.aggregate({
      where: { game: game },
      _avg: { rounds: true }
    });

    return json({ 
      highscore: highscore || { rounds: 0, hits: 0, accuracy: 0 },
      rank: rank, // Sending this to the dashboard
      globalAvg: Math.round(globalStats._avg.rounds || 0)
    });
  } catch (err) {
    console.error('💥 User Highscore GET Crash:', err.message);
    return json({ error: 'Failed to fetch score' }, { status: 500 });
  }
}