import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

const JWT_SECRET = env.JWT_SECRET;

export async function POST({ request, params }) {
  try {
    const { game } = params;
    const body = await request.json();
    const { rounds } = body; 
    
    // Extract new Aim Trainer metrics (if they exist)
    const hits = body.hits !== undefined ? parseInt(body.hits) : null;
    const accuracy = body.accuracy !== undefined ? parseFloat(body.accuracy) : null;

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = parseInt(decoded.userId);

    // 1. Check existing score first to ensure we only update if the NEW score is better
    const existing = await prisma.highscore.findUnique({
      where: { userId_game: { userId, game } }
    });

    if (!existing || rounds > existing.rounds) {
      // 2. Use upsert to create or update in one go
      const highscore = await prisma.highscore.upsert({
        where: { userId_game: { userId, game } },
        update: { 
          rounds, 
          ...(hits !== null && { hits }), 
          ...(accuracy !== null && { accuracy }),
          createdAt: new Date() 
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
    
    // Get user's personal best (including new hits/accuracy columns)
    const highscore = await prisma.highscore.findUnique({
      where: { userId_game: { userId, game } }
    });

    // Keep your global average logic
    const globalStats = await prisma.highscore.aggregate({
      where: { game: game },
      _avg: { rounds: true }
    });

    return json({ 
      highscore: highscore || { rounds: 0, hits: 0, accuracy: 0 },
      globalAvg: Math.round(globalStats._avg.rounds || 0)
    });
  } catch (err) {
    console.error('💥 User Highscore GET Crash:', err.message);
    return json({ error: 'Failed to fetch score' }, { status: 500 });
  }
}