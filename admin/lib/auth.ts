import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AdminPayload {
  id: string;
  email: string;
  role: string;
}

export function verifyAdminToken(req: NextRequest): AdminPayload | null {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as AdminPayload;
  } catch {
    return null;
  }
}

export function signAdminToken(payload: Omit<AdminPayload, 'role'>): string {
  return jwt.sign(
    { ...payload, role: 'admin' },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
}
