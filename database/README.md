# วิธีการสร้างตาราง users ใน phpMyAdmin (Plesk)

## 📋 ขั้นตอนการสร้างตาราง users:

### **Step 1: เข้าสู่ phpMyAdmin**
1. เข้า **Plesk Control Panel**
2. ไปที่ **Databases**
3. คลิกที่ database `greendee_farm`
4. คลิก **"phpMyAdmin"** หรือ **"Webadmin"**

### **Step 2: รัน SQL Command**
1. ใน phpMyAdmin คลิกแท็บ **"SQL"**
2. คัดลอก SQL ข้างล่างนี้ไปวาง:

```sql
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

3. คลิก **"Go"** หรือ **"Execute"**

### **Step 3: ตรวจสอบการสร้างตาราง**
1. คลิกแท็บ **"Structure"** หรือ **"โครงสร้าง"**
2. ควรจะเห็นตาราง `users` พร้อมฟิลด์ต่างๆ
3. หรือใช้คำสั่ง SQL: `DESCRIBE users;`

## 🎯 โครงสร้างตาราง users:

| Field | Type | Description |
|-------|------|-------------|
| id | INT AUTO_INCREMENT PRIMARY KEY | รหัสผู้ใช้ (เลขที่เพิ่มอัตโนมัติ) |
| username | VARCHAR(50) UNIQUE | ชื่อผู้ใช้ (ไม่ซ้ำ) |
| email | VARCHAR(100) UNIQUE | อีเมล (ไม่ซ้ำ) |
| password_hash | VARCHAR(255) | รหัสผ่านเข้ารหัส |
| full_name | VARCHAR(100) | ชื่อ-นามสกุล |
| phone | VARCHAR(20) | เบอร์โทรศัพท์ |
| address | TEXT | ที่อยู่ |
| created_at | TIMESTAMP | วันที่สร้างบัญชี |
| updated_at | TIMESTAMP | วันที่อัปเดตล่าสุด |

## 🔧 คำสั่ง SQL เพิ่มเติม:

### ดูข้อมูลในตาราง:
```sql
SELECT * FROM users;
```

### ลบตาราง (ถ้าต้องการเริ่มใหม่):
```sql
DROP TABLE IF EXISTS users;
```

### เพิ่มข้อมูลทดสอบ:
```sql
INSERT INTO users (username, email, password_hash, full_name, phone) 
VALUES ('testuser', 'test@greendeefarm.com', '$2a$10$hash.example', 'ผู้ใช้ทดสอบ', '064-542-0333');
```

## ⚠️ หมายเหตุ:
- ใช้ `utf8mb4` charset เพื่อรองรับภาษาไทย
- ฟิลด์ `password_hash` จะเก็บรหัsผ่านที่เข้ารหัสด้วย bcrypt
- `created_at` และ `updated_at` จะอัปเดตอัตโนมัติ