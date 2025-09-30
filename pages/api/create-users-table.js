// pages/api/create-users-table.js - API สำหรับสร้างตาราง users ใน Supabase
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST to create table.' 
    });
  }

  try {
    const { supabase } = await import('../../lib/supabase.js');
    
    console.log('🏗️ Creating users table in Supabase...');

    // สร้างตาราง users ด้วย SQL
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        phone VARCHAR(20),
        address TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- สร้าง index สำหรับ performance
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

      -- สร้าง function สำหรับ auto-update updated_at
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- สร้าง trigger สำหรับ auto-update updated_at
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
          BEFORE UPDATE ON users
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    `;

    // Execute SQL
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: createTableSQL 
    });

    if (error) {
      console.error('❌ Create table error:', error);
      
      // หาก RPC exec_sql ไม่มี ให้ใช้วิธีอื่น
      if (error.code === '42883') { // function exec_sql does not exist
        return res.status(200).json({
          success: false,
          message: 'Need to create table manually in Supabase Dashboard',
          instructions: [
            '1. ไปที่ Supabase Dashboard → SQL Editor',
            '2. รันคำสั่ง SQL ต่อไปนี้:',
            createTableSQL,
            '3. หรือไปที่ Table Editor → Create new table → users',
            '4. เพิ่ม columns ตามที่กำหนด'
          ],
          manualSteps: {
            tableName: 'users',
            columns: [
              { name: 'id', type: 'int8', primary: true, autoIncrement: true },
              { name: 'username', type: 'varchar(50)', unique: true, nullable: false },
              { name: 'email', type: 'varchar(100)', unique: true, nullable: false },
              { name: 'password', type: 'varchar(255)', nullable: false },
              { name: 'full_name', type: 'varchar(100)', nullable: true },
              { name: 'phone', type: 'varchar(20)', nullable: true },
              { name: 'address', type: 'text', nullable: true },
              { name: 'created_at', type: 'timestamptz', default: 'now()' },
              { name: 'updated_at', type: 'timestamptz', default: 'now()' }
            ]
          }
        });
      }

      return res.status(500).json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details
      });
    }

    console.log('✅ Users table created successfully');

    // ทดสอบการเขียนข้อมูล
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count(*)', { count: 'exact', head: true });

    return res.status(200).json({
      success: true,
      message: 'Users table created successfully!',
      data: data,
      testResult: {
        canRead: !testError,
        error: testError?.message || null
      },
      nextSteps: [
        'ตาราง users ถูกสร้างเรียบร้อยแล้ว',
        'สามารถทดสอบการสมัครสมาชิกได้แล้ว',
        'หากมี RLS (Row Level Security) ให้ปรับ policies'
      ]
    });

  } catch (error) {
    console.error('❌ Create table exception:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to create users table',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}