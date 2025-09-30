// pages/api/auth/logout.js - Logout API
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // ลบ cookie
    const cookie = serialize('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // ลบทันที
      path: '/'
    });

    res.setHeader('Set-Cookie', cookie);

    return res.status(200).json({
      message: 'ออกจากระบบสำเร็จ!'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์' 
    });
  }
}