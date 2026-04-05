import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

const JWT_SECRET = env.JWT_SECRET;

const GAME_KEYS = [
  'chimp-test', 'aim-trainer', 'reaction-timer', 'memory-trainer',
  'type-racer', 'simon-says', 'connections', 'word-game'
];

export async function GET({ request }) {
  try {
    const authHeader = request.headers.get('Authorization');

    // 1. Global bests — one query for all games
    const globalRaw = await prisma.highscore.findMany({
      where: { game: { in: GAME_KEYS } },
      orderBy: { rounds: 'desc' },
      distinct: ['game'],
      include: { user: { select: { username: true } } }
    });

    const globalBests = Object.fromEntries(
      globalRaw.map(h => [h.game, h])
    );

    // 2. User scores — only if logged in
    let userScores = {};
    let userRanks = {};

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = parseInt(decoded.userId);

      // One query for all personal bests
      const personalBests = await prisma.highscore.findMany({
        where: { userId, game: { in: GAME_KEYS } }
      });

      // Rank queries in parallel — one count per game the user has a score in
      const rankedBests = await Promise.all(
        personalBests.map(async (score) => {
          const countHigher = await prisma.highscore.count({
            where: { game: score.game, rounds: { gt: score.rounds } }
          });
          return { ...score, rank: countHigher + 1 };
        })
      );

      userScores = Object.fromEntries(
        rankedBests.map(h => [h.game, h])
      );
    }

    return json({ globalBests, userScores });

  } catch (err) {
    console.error('💥 Dashboard API Crash:', err.message);
    return json({ error: 'Failed to load dashboard' }, { status: 500 });
  }
}