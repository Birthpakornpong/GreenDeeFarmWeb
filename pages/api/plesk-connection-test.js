// pages/api/plesk-connection-test.js - ทดสอบการเชื่อมต่อ Plesk MySQL แบบละเอียด  
import { testConnection } from '../../lib/mysql';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const testResults = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    connectionConfig: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      hasPassword: !!process.env.DB_PASSWORD,
      passwordLength: process.env.DB_PASSWORD?.length || 0
    },
    pleskInfo: {
      expectedPath: 'Plesk Control Panel → Databases → greendee_farm → phpMyAdmin',
      connectionInfo: 'ดูข้อมูลการเชื่อมต่อใน Plesk → Databases → Connection Info'
    }
  };

  console.log('🧪 Starting Plesk MySQL connection test...');
  console.log('📋 Config:', testResults.connectionConfig);

  try {
    const connectionResult = await testConnection();
    
    if (connectionResult.success) {
      return res.status(200).json({
        success: true,
        message: '✅ เชื่อมต่อ Plesk MySQL สำเร็จ!',
        ...testResults,
        connectionResult,
        nextSteps: [
          '1. ✅ การเชื่อมต่อฐานข้อมูลสำเร็จแล้ว',
          '2. 📋 ไปสร้างตาราง users ใน phpMyAdmin',
          '3. 🔐 ทดสอบระบบ login/register',
          '4. 🎉 ระบบพร้อมใช้งาน!'
        ]
      });
    } else {
      return res.status(500).json({
        success: false,
        message: '❌ ไม่สามารถเชื่อมต่อ Plesk MySQL ได้',
        ...testResults,
        connectionResult,
        troubleshooting: {
          step1: {
            title: '🔍 ตรวจสอบข้อมูลใน Plesk',
            instructions: [
              'เข้า Plesk Control Panel',
              'ไปที่ "Databases"',
              'เลือกฐานข้อมูล "greendee_farm"',
              'ดูส่วน "Connection Info" หรือ "External Connections"',
              'คัดลอก Host, Port, Database Name, Username'
            ]
          },
          step2: {
            title: '⚙️ อัปเดตไฟล์ .env.local',
            instructions: [
              'แก้ไข DB_HOST ให้ตรงกับใน Plesk',
              'แก้ไข DB_PORT ถ้าไม่ใช่ 3306',
              'ตรวจสอบ DB_NAME และ DB_USER',
              'ตรวจสอบ DB_PASSWORD'
            ]
          },
          step3: {
            title: '🔄 ลองตัวเลือกการเชื่อมต่อ',
            options: [
              'localhost (สำหรับ shared hosting)',
              'IP address ของ server',
              'MySQL hostname จาก Plesk',
              'Port อื่นๆ เช่น 3307, 3308'
            ]
          }
        }
      });
    }
  } catch (error) {
    console.error('💥 Plesk connection test failed:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการทดสอบ',
      error: error.message,
      ...testResults
    });
  }
}