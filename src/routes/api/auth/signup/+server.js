import { json } from '@sveltejs/kit';
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken';
import { prisma } from '$lib/server/prisma'; // 👈 FIXED: Removed /client
import { env } from '$env/dynamic/private';

const JWT_SECRET = env.JWT_SECRET;

export async function POST({ request }) {
  try {
    const { email, username, password } = await request.json();

    if (!email || !username || !password) {
      return json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() }, 
          { username: username }
        ]
      }
    });

    if (existing) {
      return json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash with 12 rounds for security
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { 
        email: email.toLowerCase(), 
        username, 
        password: hashedPassword 
      }
    });

    if (!JWT_SECRET) {
      console.error('❌ CRITICAL: JWT_SECRET is missing from .env');
      return json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Create token so the frontend can auto-login the user
    const token = jwt.sign(
      { userId: user.id, username: user.username }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    return json({
      message: 'User created successfully',
      token,
      user: { 
        id: user.id, 
        email: user.email, 
        username: user.username 
      }
    }, { status: 201 });

  } catch (err) {
    console.error('💥 Signup API Crash:', err.message);
    return json({ error: 'Internal server error', details: err.message }, { status: 500 });
  }
}