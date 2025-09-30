// pages/api/debug-connection.js - API สำหรับ debug การเชื่อมต่อฐานข้อมูลแบบละเอียด
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const results = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    tests: []
  };

  // Test 1: Environment Variables
  const envTest = {
    name: 'Environment Variables Check',
    status: 'checking',
    details: {}
  };

  try {
    envTest.details = {
      DB_HOST: process.env.DB_HOST || 'NOT_SET',
      DB_PORT: process.env.DB_PORT || 'NOT_SET',
      DB_NAME: process.env.DB_NAME || 'NOT_SET',
      DB_USER: process.env.DB_USER || 'NOT_SET',
      DB_PASSWORD_LENGTH: process.env.DB_PASSWORD?.length || 0,
      DB_PASSWORD_SET: !!process.env.DB_PASSWORD
    };
    envTest.status = 'success';
  } catch (error) {
    envTest.status = 'error';
    envTest.error = error.message;
  }
  results.tests.push(envTest);

  // Test 2: MySQL Connection with detailed error
  const connectionTest = {
    name: 'MySQL Connection Test',
    status: 'checking',
    details: {}
  };

  try {
    const config = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: false,
      charset: 'utf8mb4'
    };

    connectionTest.details.config = {
      ...config,
      password: config.password ? '*'.repeat(config.password.length) : 'NOT_SET'
    };

    const connection = await mysql.createConnection(config);
    
    connectionTest.status = 'success';
    connectionTest.details.message = 'Successfully connected to MySQL';
    
    await connection.end();
    
  } catch (error) {
    connectionTest.status = 'error';
    connectionTest.error = error.message;
    connectionTest.details.errorCode = error.code;
    connectionTest.details.errorNumber = error.errno;
    connectionTest.details.sqlState = error.sqlState;
    
    // Specific error suggestions
    if (error.code === 'ENOTFOUND') {
      connectionTest.suggestions = [
        'ตรวจสอบ hostname ใน DB_HOST',
        'ลองใช้ localhost แทน IP address',
        'ตรวจสอบว่า MySQL server เปิดอยู่',
        'ตรวจสอบ DNS resolution'
      ];
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      connectionTest.suggestions = [
        'ตรวจสอบ username และ password',
        'ตรวจสอบ database permissions',
        'ตรวจสอบว่าผู้ใช้มีสิทธิ์เข้าถึงจาก external host'
      ];
    } else if (error.code === 'ECONNREFUSED') {
      connectionTest.suggestions = [
        'ตรวจสอบ port number',
        'ตรวจสอบว่า MySQL service เปิดอยู่',
        'ตรวจสอบ firewall settings'
      ];
    }
  }
  results.tests.push(connectionTest);

  // Test 3: Alternative connection methods
  const alternativeTest = {
    name: 'Alternative Connection Attempts',
    status: 'checking',
    attempts: []
  };

  const alternatives = [
    { host: 'localhost', port: 3306 },
    { host: '127.0.0.1', port: 3306 },
    { host: process.env.DB_HOST, port: 3306 },
    { host: process.env.DB_HOST, port: 3307 }
  ];

  for (const alt of alternatives) {
    const attempt = {
      config: alt,
      status: 'testing'
    };

    try {
      const config = {
        host: alt.host,
        port: alt.port,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: false,
        charset: 'utf8mb4'
      };

      const connection = await mysql.createConnection(config);
      await connection.end();
      
      attempt.status = 'success';
      attempt.message = 'Connection successful';
    } catch (error) {
      attempt.status = 'failed';
      attempt.error = error.code || error.message;
    }
    
    alternativeTest.attempts.push(attempt);
  }

  alternativeTest.status = alternativeTest.attempts.some(a => a.status === 'success') ? 'partial_success' : 'failed';
  results.tests.push(alternativeTest);

  // Overall status
  const hasSuccess = results.tests.some(test => test.status === 'success' || test.status === 'partial_success');
  results.overall_status = hasSuccess ? 'partial_success' : 'failed';

  return res.status(hasSuccess ? 200 : 500).json(results);
}