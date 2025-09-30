// pages/api/auth/me.js - Get current user API
import { verifyToken } from '../../../lib/auth';
import { userOperations } from '../../../lib/mysql';

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
    const userResult = await userOperations.findById(decoded.id);
    
    if (!userResult.success || userResult.data.length === 0) {
      return res.status(404).json({ 
        message: 'ไม่พบผู้ใช้' 
      });
    }

    const user = userResult.data[0];

    return res.status(200).json({
      user: user
    });

  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์' 
    });
  }
}