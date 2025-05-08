// src/routes/api/user/highscore/[game]/+server.js
import { json } from '@sveltejs/kit';
import { verifyJWT } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';

export async function POST({ request, params }) {
  const { game } = params;
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return json({ error: 'Missing token' }, { status: 401 });
  }

  const user = await verifyJWT(token);
  if (!user) {
    return json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  const body = await request.json();
  const { score, rounds, timestamp } = body;

  if (!score || !timestamp || rounds === undefined) {
    return json({ error: 'Invalid score data' }, { status: 400 });
  }

  try {
    await prisma.highscore.upsert({
      where: {
        userId_game: {
          userId: user.userId,
          game: game
        }
      },
      update: {
        score,
        rounds,
        createdAt: new Date()
      },
      create: {
        userId: user.userId,
        game,
        score,
        rounds
      }
    });

    return json({ success: true });
  } catch (err) {
    console.error('❌ Failed to save highscore:', err);
    return json({ error: 'Server error saving highscore' }, { status: 500 });
  }
}

export async function GET({ request, params }) {
  const { game } = params;
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return json({ error: 'Missing token' }, { status: 401 });
  }

  const user = await verifyJWT(token);
  if (!user) {
    return json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  try {
    const userHighscore = await prisma.highscore.findUnique({
      where: {
        userId_game: {
          userId: user.userId,
          game
        }
      }
    });

    return json({ highscore: userHighscore || null });
  } catch (err) {
    console.error('❌ Failed to fetch user highscore:', err);
    return json({ error: 'Server error fetching highscore' }, { status: 500 });
  }
}
