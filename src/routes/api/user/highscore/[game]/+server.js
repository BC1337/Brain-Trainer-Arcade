import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

const JWT_SECRET = env.JWT_SECRET;

export async function POST({ request, params }) {
  try {
    const { game } = params;
    const { rounds } = await request.json();
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = parseInt(decoded.userId);

    // 1. Fetch the current personal best for this game
    const existing = await prisma.highscore.findUnique({
      where: {
        userId_game: {
          userId: userId,
          game: game
        }
      }
    });

    let highscore;

    if (!existing) {
      // First time playing: Create a new record
      highscore = await prisma.highscore.create({
        data: { userId, game, rounds }
      });
    } else if (rounds > existing.rounds) {
      // Beat old score: Update record
      highscore = await prisma.highscore.update({
        where: {
          userId_game: { userId, game }
        },
        data: { 
          rounds: rounds,
          createdAt: new Date() 
        }
      });
    } else {
      // Lower score: Don't overwrite the personal best
      highscore = existing;
    }

    return json({ message: 'Score processed', highscore });

  } catch (err) {
    console.error('💥 User Highscore POST Crash:', err.message);
    return json({ error: 'Failed to save score' }, { status: 500 });
  }
}

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
    
    // Get user's personal best
    const highscore = await prisma.highscore.findUnique({
      where: {
        userId_game: {
          userId: userId,
          game: game
        }
      }
    });

    // Get the global average across ALL players for this game
    const globalStats = await prisma.highscore.aggregate({
      where: { game: game },
      _avg: { rounds: true }
    });

    return json({ 
      highscore: highscore || { rounds: 0 },
      globalAvg: Math.round(globalStats._avg.rounds || 0)
    });
  } catch (err) {
    console.error('💥 User Highscore GET Crash:', err.message);
    return json({ error: 'Failed to fetch score' }, { status: 500 });
  }
}