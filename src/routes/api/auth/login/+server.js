import { json } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '$lib/server/prisma/client'; // ✅ CORRECT


const JWT_SECRET = process.env.JWT_SECRET;

export async function POST({ request }) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return json({ error: 'Missing email or password' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '7d'
    });

    return json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch (err) {
    console.error('Login error:', err);
    return json({ error: 'Server error' }, { status: 500 });
  }
}
