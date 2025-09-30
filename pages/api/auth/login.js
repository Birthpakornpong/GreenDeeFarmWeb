// pages/api/auth/login.js - Login API
import { userOperations } from '../../../lib/mysql';
import { verifyPassword, generateToken } from '../../../lib/auth';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'กรุณากรอก username และ password' 
      });
    }

    // หาผู้ใช้ในฐานข้อมูล
    const userResult = await userOperations.findByUsername(username);
    
    if (!userResult.success || userResult.data.length === 0) {
      return res.status(401).json({ 
        message: 'Username หรือ password ไม่ถูกต้อง' 
      });
    }

    const user = userResult.data[0];

    // ตรวจสอบ password
    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Username หรือ password ไม่ถูกต้อง' 
      });
    }

    // สร้าง JWT token
    const token = generateToken(user);

    // ลบ password ออกจาก response
    const { password: _, ...userResponse } = user;

    // ตั้งค่า cookie
    const cookie = serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    res.setHeader('Set-Cookie', cookie);

    return res.status(200).json({
      message: 'เข้าสู่ระบบสำเร็จ!',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์' 
    });
  }
}