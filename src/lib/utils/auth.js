// src/lib/utils/auth.js
export function isTokenExpired(token) {
    if (!token) return true;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      return Date.now() >= exp * 1000;
    } catch (e) {
      console.error('Token decoding failed:', e);
      return true;
    }
  }
  