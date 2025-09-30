// lib/mysql.js - MySQL Database Connection
import mysql from 'mysql2/promise';

// Configuration optimized for Plesk localhost connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  ssl: false, // Disable SSL for local connections
  charset: 'utf8mb4',
  timezone: '+00:00',
  // Support for UNIX socket connection (Plesk default)
  socketPath: process.env.DB_HOST?.startsWith('/') ? process.env.DB_HOST : undefined
};

// Log connection details for debugging (without password)
console.log('🔌 MySQL Connection Config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  hasPassword: !!dbConfig.password,
  passwordLength: dbConfig.password?.length
});

// สร้าง connection pool
const pool = mysql.createPool(dbConfig);

// Test connection with detailed error handling
export async function testConnection() {
  try {
    console.log('🔍 Testing MySQL connection...');
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database successfully');
    
    // Test if database exists
    await connection.query(`USE ${process.env.DB_NAME}`);
    console.log(`✅ Database '${process.env.DB_NAME}' is accessible`);
    
    connection.release();
    return { success: true, message: 'Connected successfully' };
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    
    // Provide specific error messages
    let errorMessage = 'Unknown database error';
    let suggestions = [];
    
    if (error.code === 'ECONNREFUSED') {
      errorMessage = 'MySQL server refused connection';
      suggestions = [
        'ตรวจสอบว่า MySQL service เปิดอยู่',
        'ตรวจสอบ hostname และ port ใน Plesk',
        'ลองใช้ localhost แทน IP address',
        'ตรวจสอบ firewall settings'
      ];
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      errorMessage = 'Access denied - wrong username/password';
      suggestions = [
        'ตรวจสอบ username และ password ใน Plesk',
        'ตรวจสอบสิทธิ์การเข้าถึงฐานข้อมูล',
        'ตรวจสอบการเชื่อมต่อจาก external host'
      ];
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      errorMessage = 'Database does not exist';
      suggestions = [
        'สร้างฐานข้อมูล greendee_farm ใน Plesk',
        'ตรวจสอบชื่อฐานข้อมูลให้ถูกต้อง'
      ];
    }
    
    return { 
      success: false, 
      error: errorMessage, 
      code: error.code,
      suggestions,
      originalError: error.message 
    };
  }
}

// Execute query with better error handling
export async function executeQuery(query, params = []) {
  try {
    if (process.env.DB_DEBUG === 'true') {
      console.log('🔍 Executing query:', query.substring(0, 100) + '...');
    }
    
    const [results] = await pool.execute(query, params);
    
    if (process.env.DB_DEBUG === 'true') {
      console.log('✅ Query executed successfully');
    }
    
    return { success: true, data: results };
  } catch (error) {
    console.error('❌ Database query error:', error);
    console.error('Query:', query);
    console.error('Params:', params);
    
    return { 
      success: false, 
      error: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage 
    };
  }
}

// User operations
export const userOperations = {
  // สร้างผู้ใช้ใหม่
  async createUser(userData) {
    const { username, email, password, full_name, phone, address } = userData;
    const query = `
      INSERT INTO users (username, email, password, full_name, phone, address) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    return await executeQuery(query, [username, email, password, full_name, phone, address]);
  },

  // หาผู้ใช้ด้วย username
  async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    return await executeQuery(query, [username]);
  },

  // หาผู้ใช้ด้วย email
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    return await executeQuery(query, [email]);
  },

  // หาผู้ใช้ด้วย ID
  async findById(id) {
    const query = 'SELECT id, username, email, full_name, phone, address, created_at FROM users WHERE id = ?';
    return await executeQuery(query, [id]);
  },

  // อัปเดตข้อมูลผู้ใช้
  async updateUser(id, userData) {
    const fields = [];
    const values = [];
    
    Object.keys(userData).forEach(key => {
      if (userData[key] !== undefined && key !== 'id') {
        fields.push(`${key} = ?`);
        values.push(userData[key]);
      }
    });
    
    if (fields.length === 0) {
      return { success: false, error: 'No fields to update' };
    }
    
    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    return await executeQuery(query, values);
  }
};

export default pool;