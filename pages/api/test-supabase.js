// pages/api/test-supabase.js - API endpoint สำหรับทดสอบการเชื่อมต่อ Supabase
import { testSupabaseConnection } from '../../lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    console.log('🔧 Starting Supabase connection test...');
    
    // Test basic connection
    const connectionTest = await testSupabaseConnection();
    console.log('Supabase connection test result:', connectionTest);

    if (!connectionTest.success) {
      return res.status(500).json({
        success: false,
        message: 'Supabase connection failed',
        error: connectionTest.error,
        code: connectionTest.code,
        details: connectionTest.details,
        setup_instructions: [
          '1. ไป https://supabase.com และสร้าง account',
          '2. สร้าง New Project',
          '3. ไปที่ Settings → API',
          '4. คัดลอก Project URL และ anon public key',
          '5. เพิ่มใน .env.local file'
        ]
      });
    }

    // Additional tests
    let tableExists = false;
    try {
      const { supabase } = await import('../../lib/supabase.js');
      const { data, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      tableExists = !error;
    } catch (error) {
      console.log('Table check failed (this is OK if table doesn\'t exist yet)');
    }

    // Prepare response
    const response = {
      success: true,
      message: '✅ Supabase connection successful!',
      tests: {
        connection: connectionTest,
        tableExists: tableExists
      },
      config: connectionTest.config,
      next_steps: tableExists ? [
        'ตาราง users มีอยู่แล้ว ✅',
        'สามารถใช้งาน authentication ได้'
      ] : [
        'ต่อไป: สร้างตาราง users ใน Supabase Dashboard',
        'ไปที่ Table Editor → Create new table → users',
        'เพิ่ม columns: id, username, email, password, full_name, phone, address, created_at, updated_at'
      ]
    };

    console.log('🎉 Supabase test completed successfully');
    return res.status(200).json(response);

  } catch (error) {
    console.error('❌ Supabase test failed:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Supabase test failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      troubleshooting: [
        'ตรวจสอบว่า NEXT_PUBLIC_SUPABASE_URL และ NEXT_PUBLIC_SUPABASE_ANON_KEY ถูกต้อง',
        'ตรวจสอบว่า Supabase project ยังใช้งานได้',
        'ลอง refresh .env.local variables โดยรีสตาร์ท development server'
      ]
    });
  }
}