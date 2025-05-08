import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export async function GET({ params }) {
  const { game } = params;

  try {
    const highscores = await prisma.highscore.findMany({
      where: { game },
      orderBy: { rounds: 'desc' }, // Changed from 'score' to 'rounds'
      take: 10,
      include: {
        user: {
          select: { username: true }
        }
      }
    });

    return json({ highscores });
  } catch (err) {
    console.error('❌ Error fetching highscores:', err);
    return json({ error: 'Server error fetching highscores' }, { status: 500 });
  }
}
