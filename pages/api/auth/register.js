// pages/api/auth/register.js - Registration API with Supabase
import { userOperations } from '../../../lib/supabase';
import { hashPassword, isValidEmail, isValidPassword, isValidUsername } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, email, password, full_name, phone, address } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน (username, email, password)' 
      });
    }

    if (!isValidUsername(username)) {
      return res.status(400).json({ 
        message: 'Username ต้องมี 3-20 ตัวอักษร และใช้ได้เฉพาะ a-z, A-Z, 0-9, _, -' 
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        message: 'รูปแบบ email ไม่ถูกต้อง' 
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ 
        message: 'Password ต้องมีอย่างน้อย 6 ตัวอักษร' 
      });
    }

    // ตรวจสอบว่า username ซ้ำหรือไม่
    const existingUsername = await userOperations.findUserByUsername(username);
    if (existingUsername.success && existingUsername.data) {
      return res.status(400).json({ 
        message: 'Username นี้ถูกใช้งานแล้ว' 
      });
    }

    // ตรวจสอบว่า email ซ้ำหรือไม่
    const existingEmail = await userOperations.findUserByEmail(email);
    if (existingEmail.success && existingEmail.data) {
      return res.status(400).json({ 
        message: 'Email นี้ถูกใช้งานแล้ว' 
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // สร้างผู้ใช้ใหม่
    const userData = {
      username,
      email,
      password: hashedPassword,
      full_name: full_name || '',
      phone: phone || '',
      address: address || ''
    };

    const result = await userOperations.createUser(userData);

    if (result.success) {
      // ลบ password ออกจาก response
      const { password: _, ...userResponse } = result.data;
      
      return res.status(201).json({
        message: 'สมัครสมาชิกสำเร็จ!',
        user: userResponse
      });
    } else {
      console.error('Database error:', result.error);
      return res.status(500).json({ 
        message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' 
      });
    }

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์' 
    });
  }
}