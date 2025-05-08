// src/routes/api/user/highscore/+server.js
import { json } from '@sveltejs/kit';
import { verifyJWT } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma/client'; 

export async function POST({ request }) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  const decoded = await verifyJWT(token);
  if (!decoded || !decoded.userId) {
    console.error('❌ Invalid or missing user ID in token:', decoded);
    return json({ error: 'Invalid token or user not found' }, { status: 401 });
  }

  const { game, rounds } = await request.json();

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      console.error('❌ User not found in DB');
      return json({ error: 'User not found' }, { status: 404 });
    }

    const existing = await prisma.highscore.findUnique({
      where: {
        userId_game: {
          userId: decoded.userId,
          game
        }
      }
    });

    if (!existing) {
      // First score → create
      await prisma.highscore.create({
        data: {
          userId: decoded.userId,
          game,
          rounds
        }
      });
      console.log('✅ First highscore saved');
    } else if (rounds > existing.rounds) {
      // New highscore → update
      await prisma.highscore.update({
        where: {
          userId_game: {
            userId: decoded.userId,
            game
          }
        },
        data: {
          rounds
        }
      });
      console.log('🔥 Highscore updated!');
    } else {
      console.log('🔁 Score not higher, no update');
    }

    return json({ success: true });
  } catch (error) {
    console.error('❌ Error saving highscore:', error);
    return json({ error: 'Failed to save highscore' }, { status: 500 });
  }
}

export async function GET({ request }) {
  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return json({ error: 'Authorization required' }, { status: 401 });
  }

  try {
    const decoded = await verifyJWT(token);

    if (!decoded || typeof decoded.userId === 'undefined') {
      return json({ error: 'Invalid token or user not found' }, { status: 401 });
    }

    const userId = parseInt(decoded.userId);
    if (isNaN(userId)) {
      return json({ error: 'Invalid user ID' }, { status: 401 });
    }

    // Get the user's highscore
    const userHighscore = await prisma.highscore.findFirst({
      where: { userId, game: 'Chimp Test' },
      orderBy: { rounds: 'desc' }
    });

    // Get the global average score for the game
    const globalAvg = await prisma.highscore.aggregate({
      where: { game: 'Chimp Test' },
      _avg: {
        rounds: true
      }
    });

    return json({
      userHighscore,
      globalAvg: globalAvg._avg.rounds || 0 // Default to 0 if no scores exist
    });
  } catch (err) {
    console.error('❌ Error fetching highscore:', err);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}
