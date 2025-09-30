// pages/api/debug-login.js - Debug login process
import { userOperations } from '../../lib/supabase.js';
import { verifyPassword } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST with username and password.' 
    });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing username or password'
      });
    }

    console.log('🔍 Debug login process for:', username);

    // Step 1: Find user
    console.log('Step 1: Finding user...');
    const userResult = await userOperations.findUserByUsername(username);
    
    console.log('User search result:', {
      success: userResult.success,
      hasData: !!userResult.data,
      error: userResult.error
    });

    if (!userResult.success) {
      return res.status(500).json({
        success: false,
        step: 'find_user',
        error: userResult.error
      });
    }

    if (!userResult.data) {
      return res.status(404).json({
        success: false,
        step: 'find_user',
        error: 'User not found'
      });
    }

    // Step 2: Verify password
    console.log('Step 2: Verifying password...');
    const user = userResult.data;
    
    console.log('User data:', {
      id: user.id,
      username: user.username,
      email: user.email,
      hasPassword: !!user.password
    });

    const isValidPassword = await verifyPassword(password, user.password);
    console.log('Password verification result:', isValidPassword);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        step: 'verify_password',
        error: 'Invalid password'
      });
    }

    // Success
    const { password: _, ...safeUser } = user;
    
    return res.status(200).json({
      success: true,
      message: 'Login debug successful',
      user: safeUser,
      steps: {
        find_user: 'OK',
        verify_password: 'OK'
      }
    });

  } catch (error) {
    console.error('❌ Debug login error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}