import { json } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '$lib/server/prisma';


const JWT_SECRET = process.env.JWT_SECRET;

export async function POST({ request }) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return json({ error: 'Missing email or password' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username: email }]
      }
    });

    console.log('🔍 User found:', user); // 👈 ADD THIS
    console.log('🔑 Password hash:', user?.password); // correct field name

    if (!user) {
      return json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);




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