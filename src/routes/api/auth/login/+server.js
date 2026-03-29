import { json } from '@sveltejs/kit';
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken';
import { prisma } from '$lib/server/prisma'; 
import { env } from '$env/dynamic/private'; 

const JWT_SECRET = env.JWT_SECRET;

export async function POST({ request }) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return json({ error: 'Missing email or password' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() }, 
          { username: email }
        ]
      }
    });

    if (!user) {
      return json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!JWT_SECRET) {
      console.error('❌ JWT_SECRET missing from .env!');
      return json({ error: 'Server config error' }, { status: 500 });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    return json({ 
      token, 
      user: { id: user.id, email: user.email, username: user.username } 
    });
  } catch (err) {
    console.error('💥 Login API Crash:', err.message);
    return json({ error: 'Server error', details: err.message }, { status: 500 });
  }
}