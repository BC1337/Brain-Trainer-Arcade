// src/lib/server/auth.js
import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

const JWT_SECRET = env.JWT_SECRET;

export async function verifyJWT(token) {
  try {
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Decoded JWT:', decoded);

    return decoded;
  } catch (error) {
    console.error('❌ JWT verification failed:', error.message);
    if (error.name === 'TokenExpiredError') {
      console.error('❌ JWT has expired');
    }
    return null;
  }
}
