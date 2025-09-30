// pages/api/find-db-config.js - หาการตั้งค่า database ที่ถูกต้อง
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const results = {
    timestamp: new Date().toISOString(),
    message: 'กำลังค้นหาการตั้งค่า database ที่เหมาะสม...',
    attempts: [],
    recommendation: null
  };

  // รายการการตั้งค่าที่จะทดสอบ
  const configurations = [
    { 
      name: 'Server IP (103.30.127.13)', 
      host: '103.30.127.13', 
      port: 3306,
      description: 'IP address ของ server จาก Plesk URL' 
    },
    { 
      name: 'Localhost', 
      host: 'localhost', 
      port: 3306,
      description: 'Local connection - ใช้ได้กับ same server' 
    },
    { 
      name: 'Loopback (127.0.0.1)', 
      host: '127.0.0.1', 
      port: 3306,
      description: 'IP localhost - alternative ของ localhost' 
    },
    { 
      name: 'Alternative Port 3307', 
      host: '103.30.127.13', 
      port: 3307,
      description: 'ลอง port อื่น บาง hosting ใช้ port ต่างกัน' 
    },
    { 
      name: 'Alternative Port 3308', 
      host: '103.30.127.13', 
      port: 3308,
      description: 'ลอง port อื่น สำหรับ hosting แบบ shared' 
    }
  ];

  for (const config of configurations) {
    const attempt = {
      name: config.name,
      host: config.host,
      port: config.port,
      description: config.description,
      status: 'testing',
      startTime: Date.now()
    };

    try {
      // ทดสอบการเชื่อมต่อ
      const connection = await mysql.createConnection({
        host: config.host,
        port: config.port,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectTimeout: 8000,
        acquireTimeout: 8000
      });

      // ทดสอบ query พื้นฐาน
      const [result] = await connection.execute('SELECT 1 as test, NOW() as current_time');
      
      // ทดสอบดูว่าฐานข้อมูลมีตาราง users หรือไม่
      let tableExists = false;
      try {
        const [tables] = await connection.execute(
          "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'",
          [process.env.DB_NAME]
        );
        tableExists = tables.length > 0;
      } catch (tableError) {
        // ignore table check error
      }

      await connection.end();

      attempt.status = 'success';
      attempt.responseTime = Date.now() - attempt.startTime;
      attempt.details = {
        testQuery: result[0],
        usersTableExists: tableExists
      };

      // ถ้าเป็นการเชื่อมต่อแรกที่สำเร็จ ให้ตั้งเป็น recommendation
      if (!results.recommendation) {
        results.recommendation = {
          host: config.host,
          port: config.port,
          name: config.name,
          envConfig: `DB_HOST=${config.host}\nDB_PORT=${config.port}`,
          nextSteps: tableExists ? [
            '✅ ฐานข้อมูลพร้อมใช้งาน',
            '🔄 อัปเดต .env.local ด้วยการตั้งค่านี้',
            '🧪 ทดสอบระบบ login/register'
          ] : [
            '⚠️ ต้องสร้างตาราง users ก่อน',
            '🔄 อัปเดต .env.local ด้วยการตั้งค่านี้',
            '📋 รัน SQL จาก create_users_table.sql ใน phpMyAdmin',
            '🧪 ทดสอบระบบ login/register'
          ]
        };
      }

    } catch (error) {
      attempt.status = 'failed';
      attempt.responseTime = Date.now() - attempt.startTime;
      attempt.error = {
        message: error.message,
        code: error.code,
        errno: error.errno
      };

      // ให้คำแนะนำตาม error code
      if (error.code === 'ECONNREFUSED') {
        attempt.suggestion = 'MySQL service ไม่เปิดบน port นี้ หรือ firewall block';
      } else if (error.code === 'ENOTFOUND') {
        attempt.suggestion = 'ไม่พบ hostname นี้ ตรวจสอบ DNS หรือ IP address';
      } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        attempt.suggestion = 'Username/Password ผิด หรือไม่มีสิทธิ์เข้าถึง';
      } else if (error.code === 'ETIMEDOUT') {
        attempt.suggestion = 'Connection timeout - server ช้าหรือ network มีปัญหา';
      }
    }

    results.attempts.push(attempt);
  }

  // สรุปผลลัพธ์
  const successfulConnections = results.attempts.filter(a => a.status === 'success');
  
  if (successfulConnections.length > 0) {
    results.summary = {
      status: 'success',
      message: `พบการตั้งค่าที่ใช้งานได้ ${successfulConnections.length} แบบ`,
      fastestConnection: successfulConnections.reduce((fastest, current) => 
        current.responseTime < fastest.responseTime ? current : fastest
      )
    };
  } else {
    results.summary = {
      status: 'failed',
      message: 'ไม่พบการตั้งค่าที่ใช้งานได้',
      suggestions: [
        '🔍 ตรวจสอบ MySQL service ใน Plesk ว่าเปิดอยู่หรือไม่',
        '🔧 ตรวจสอบ database credentials ใน Plesk',
        '🌐 ตรวจสอบ Access Control ใน Plesk Database settings',
        '📞 ติดต่อผู้ให้บริการ hosting เพื่อขอข้อมูลการเชื่อมต่อ MySQL',
        '🔒 ตรวจสอบ firewall settings'
      ]
    };
  }

  return res.status(successfulConnections.length > 0 ? 200 : 500).json(results);
}