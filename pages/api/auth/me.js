// pages/api/auth/me.js - Get current user API with Supabase
import { verifyToken } from '../../../lib/auth';
import { userOperations } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // ดึง token จาก cookie หรือ Authorization header
    const token = req.cookies.auth_token || 
                  (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
      return res.status(401).json({ 
        message: 'ไม่พบ token การยืนยันตัวตน' 
      });
    }

    // ตรวจสอบ token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ 
        message: 'Token ไม่ถูกต้องหรือหมดอายุ' 
      });
    }

    // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
    const userResult = await userOperations.findUserById(decoded.id);
    
    if (!userResult.success || !userResult.data) {
      return res.status(404).json({ 
        message: 'ไม่พบผู้ใช้' 
      });
    }

    const user = userResult.data;
    // ลบ password ออกจาก response
    const { password, ...safeUser } = user;

    return res.status(200).json({
      user: safeUser
    });

  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์' 
    });
  }
}