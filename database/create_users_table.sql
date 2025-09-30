-- SQL สำหรับสร้างตาราง users ใน MySQL Database
-- นำไฟล์นี้ไปรันใน phpMyAdmin ของ Plesk

-- สร้างตาราง users สำหรับระบบ Authentication
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL COMMENT 'ชื่อผู้ใช้ (ไม่ซ้ำกัน)',
  email VARCHAR(100) UNIQUE NOT NULL COMMENT 'อีเมล (ไม่ซ้ำกัน)',
  password_hash VARCHAR(255) NOT NULL COMMENT 'รหัสผ่านที่เข้ารหัสแล้ว',
  full_name VARCHAR(100) COMMENT 'ชื่อ-นามสกุล',
  phone VARCHAR(20) COMMENT 'เบอร์โทรศัพท์',
  address TEXT COMMENT 'ที่อยู่',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้างบัญชี',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'วันที่อัปเดตล่าสุด'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางข้อมูลผู้ใช้ Green Dee Farm';

-- สร้าง Index เพื่อเพิ่มประสิทธิภาพการค้นหา
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- แสดงโครงสร้างตารางที่สร้างแล้ว
DESCRIBE users;

-- ตัวอย่างการเพิ่มข้อมูลทดสอบ (ไม่บังคับ)
-- INSERT INTO users (username, email, password_hash, full_name, phone, address) 
-- VALUES ('admin', 'admin@greendeefarm.com', '$2a$10$example.hash.here', 'ผู้ดูแลระบบ', '064-542-0333', 'ฟาร์ม Green Dee Farm');

-- คำสั่งดูข้อมูลในตาราง
-- SELECT * FROM users;

-- คำสั่งลบตาราง (ใช้เมื่อต้องการเริ่มใหม่)
-- DROP TABLE IF EXISTS users;