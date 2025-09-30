// pages/api/connection-debug.js - API สำหรับ debug การเชื่อมต่อแบบละเอียด
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    config: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      hasPassword: !!process.env.DB_PASSWORD
    },
    tests: []
  };

  // Test 1: Environment Variables
  debugInfo.tests.push({
    name: 'Environment Check',
    status: process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASSWORD ? 'OK' : 'MISSING',
    details: debugInfo.config
  });

  // Test 2: Different connection methods
  const connectionMethods = [
    { name: 'Current Config', host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT) || 3306 },
    { name: 'Localhost', host: 'localhost', port: 3306 },
    { name: 'IP Address', host: '103.30.127.13', port: 3306 },
    { name: 'Loopback', host: '127.0.0.1', port: 3306 }
  ];

  for (const method of connectionMethods) {
    const testResult = {
      name: method.name,
      config: method,
      status: 'TESTING'
    };

    try {
      const connection = await mysql.createConnection({
        host: method.host,
        port: method.port,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectTimeout: 5000
      });

      // Test basic query
      await connection.execute('SELECT 1 as test');
      await connection.end();

      testResult.status = 'SUCCESS';
      testResult.message = 'Connection successful';
    } catch (error) {
      testResult.status = 'FAILED';
      testResult.error = error.message;
      testResult.errorCode = error.code;
    }

    debugInfo.tests.push(testResult);
  }

  // Test 3: Check if database and table exist
  const workingConnection = debugInfo.tests.find(t => t.status === 'SUCCESS');
  if (workingConnection) {
    try {
      const connection = await mysql.createConnection({
        host: workingConnection.config.host,
        port: workingConnection.config.port,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      });

      // Check if users table exists
      const [tables] = await connection.execute(
        "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'",
        [process.env.DB_NAME]
      );

      debugInfo.databaseInfo = {
        usersTableExists: tables.length > 0,
        tableCount: tables.length
      };

      if (tables.length === 0) {
        debugInfo.recommendations = [
          '❌ ตาราง users ยังไม่มี - ต้องสร้างก่อน',
          '📋 ไปที่ phpMyAdmin และรัน SQL จาก create_users_table.sql',
          '🔗 Plesk → Databases → greendee_farm → phpMyAdmin'
        ];
      } else {
        debugInfo.recommendations = [
          '✅ ตาราง users พร้อมใช้งานแล้ว',
          '🧪 ลองทดสอบระบบ login/register ได้เลย'
        ];
      }

      await connection.end();
    } catch (error) {
      debugInfo.databaseInfo = {
        error: error.message,
        code: error.code
      };
    }
  }

  return res.status(200).json(debugInfo);
}