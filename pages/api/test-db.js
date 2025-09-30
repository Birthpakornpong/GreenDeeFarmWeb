// pages/api/test-db.js - API สำหรับทดสอบการเชื่อมต่อฐานข้อมูล
import { testConnection } from '../../lib/mysql';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('🧪 Testing database connection...');
    
    // แสดงข้อมูล config (โดยไม่แสดง password)
    const config = {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      hasPassword: !!process.env.DB_PASSWORD,
      passwordLength: process.env.DB_PASSWORD?.length || 0
    };
    
    console.log('📋 Database config:', config);
    
    const isConnected = await testConnection();
    
    if (isConnected) {
      return res.status(200).json({
        success: true,
        message: '✅ Database connection successful!',
        config: config
      });
    } else {
      return res.status(500).json({
        success: false,
        message: '❌ Database connection failed',
        config: config,
        suggestions: [
          '1. ตรวจสอบว่า MySQL Server เปิดอยู่',
          '2. ตรวจสอบ hostname/IP address',
          '3. ตรวจสอบ port (ปกติคือ 3306)',
          '4. ตรวจสอบ username และ password',
          '5. ตรวจสอบ database name',
          '6. ตรวจสอบ firewall settings',
          '7. สำหรับ Plesk: ดูใน Databases > ข้อมูลการเชื่อมต่อ'
        ]
      });
    }
    
  } catch (error) {
    console.error('💥 Database test error:', error);
    return res.status(500).json({
      success: false,
      message: 'Database test failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}