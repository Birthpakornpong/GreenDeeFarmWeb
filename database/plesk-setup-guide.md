# คำแนะนำการตั้งค่า Remote Access ใน Plesk Database

## 🎯 ปัญหาที่พบ:
จากภาพ Access control ตั้งค่า "Allow remote connections from" แต่มีเพียง `http://localhost:3000/` 
ซึ่งไม่ใช่รูปแบบ hostname/IP address ที่ถูกต้อง

## ✅ วิธีแก้ไข:

### ขั้นตอนที่ 1: แก้ไข Access Control ใน Plesk
1. เข้า Plesk Control Panel → Databases → greendee_farm
2. ในส่วน **"Access control"** เลือก **"Allow remote connections from"**
3. ในช่องข้อความให้ใส่:

```
localhost
127.0.0.1
%
::1
```

**คำอธิบาย:**
- `localhost` = การเชื่อมต่อจาก localhost
- `127.0.0.1` = IP address ของ localhost  
- `%` = อนุญาตทุก IP (ใช้สำหรับ development เท่านั้น)
- `::1` = IPv6 localhost

### ขั้นตอนที่ 2: กด Apply หรือ OK

### ขั้นตอนที่ 3: ทดสอบการเชื่อมต่อ
```
http://localhost:3001/api/plesk-connection-test
```

## 🔍 ตัวอย่าง Host Patterns ที่ถูกต้อง:
- `localhost` - เชื่อมต่อจาก localhost
- `127.0.0.1` - IP localhost
- `192.168.1.100` - IP address เฉพาะ
- `192.168.1.%` - ทุก IP ใน subnet 192.168.1.x
- `%.yourdomain.com` - ทุก subdomain
- `%` - ทุก IP (ไม่ปลอดภัย สำหรับ dev เท่านั้น)

## ⚠️ สำคัญ:
- **อย่าใส่ `http://`** ใน host pattern
- ใส่เฉพาะ hostname หรือ IP address เท่านั้น
- สำหรับ production ไม่ควรใช้ `%` เพื่อความปลอดภัย

## 🧪 ทดสอบหลังแก้ไข:
1. กด OK/Apply ใน Plesk
2. รอ 1-2 นาที ให้การตั้งค่ามีผล
3. เข้า http://localhost:3001/connection-status
4. ดูผลการทดสอบ

หากยังไม่ได้ ลองเปลี่ยน DB_HOST ใน .env.local เป็น:
- `127.0.0.1`
- `103.30.127.13` (IP จาก URL ที่มีใน Plesk)