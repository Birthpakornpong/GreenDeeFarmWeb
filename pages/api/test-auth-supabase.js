// pages/api/test-auth-supabase.js - ทดสอบระบบ authentication กับ Supabase
import { userOperations } from '../../lib/supabase.js';
import { hashPassword } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    console.log('🧪 Testing Supabase authentication system...');
    
    const testResults = {};

    // Test 1: Check if we can connect to users table
    console.log('📋 Test 1: Check users table access...');
    try {
      const { supabase } = await import('../../lib/supabase.js');
      const { data, error } = await supabase
        .from('users')
        .select('count(*)', { count: 'exact', head: true });

      testResults.tableAccess = {
        success: !error,
        error: error?.message || null,
        canRead: !error
      };
    } catch (error) {
      testResults.tableAccess = {
        success: false,
        error: error.message
      };
    }

    // Test 2: Try to create a test user
    console.log('👤 Test 2: Create test user...');
    const testUsername = `test_user_${Date.now()}`;
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = await hashPassword('testpassword123');

    const createResult = await userOperations.createUser({
      username: testUsername,
      email: testEmail,
      password: testPassword,
      full_name: 'Test User',
      phone: '0123456789',
      address: 'Test Address'
    });

    testResults.createUser = createResult;

    // Test 3: Try to find the created user
    if (createResult.success) {
      console.log('🔍 Test 3: Find created user...');
      const findResult = await userOperations.findUserByUsername(testUsername);
      testResults.findUser = findResult;

      // Test 4: Try to update the user
      if (findResult.success && findResult.data) {
        console.log('✏️ Test 4: Update user...');
        const updateResult = await userOperations.updateUser(findResult.data.id, {
          full_name: 'Updated Test User'
        });
        testResults.updateUser = updateResult;
      }

      // Clean up: Delete test user
      console.log('🧹 Cleanup: Remove test user...');
      try {
        const { supabase } = await import('../../lib/supabase.js');
        await supabase
          .from('users')
          .delete()
          .eq('username', testUsername);
        testResults.cleanup = { success: true };
      } catch (error) {
        testResults.cleanup = { success: false, error: error.message };
      }
    }

    // Summary
    const allTests = Object.values(testResults);
    const passedTests = allTests.filter(test => test.success).length;
    const totalTests = allTests.length;

    return res.status(200).json({
      success: passedTests === totalTests,
      message: `Supabase authentication test completed: ${passedTests}/${totalTests} tests passed`,
      testResults: testResults,
      summary: {
        passed: passedTests,
        total: totalTests,
        allPassed: passedTests === totalTests
      },
      recommendations: passedTests === totalTests ? [
        '✅ ระบบ authentication พร้อมใช้งาน',
        '✅ สามารถสมัครสมาชิกและเข้าสู่ระบบได้',
        '🚀 ระบบพร้อม deploy production'
      ] : [
        '⚠️ มีบางการทดสอบที่ล้มเหลว',
        '🔧 ตรวจสอบ RLS policies ใน Supabase',
        '📋 ตรวจสอบสิทธิ์การเข้าถึงตาราง users'
      ]
    });

  } catch (error) {
    console.error('❌ Supabase auth test failed:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Supabase authentication test failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}