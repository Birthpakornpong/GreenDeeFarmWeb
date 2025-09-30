# วิธีแก้ปัญหา ECONNREFUSED - ลองทีละขั้นตอน

## ขั้นตอนที่ 1: ตรวจสอบผลจาก API
1. ไปที่ http://localhost:3000/api/find-db-config
2. ดูว่ามีการตั้งค่าไหนที่ success หรือไม่
3. ถ้ามี ให้คัดลอกการตั้งค่านั้นไปใส่ใน .env.local

## ขั้นตอนที่ 2: ถ้าทุกการตั้งค่า failed
อัปเดต .env.local ลองทีละตัว:

### ตัวเลือกที่ 1 (กำลังใช้อยู่):
```
DB_HOST=103.30.127.13
DB_PORT=3306
```

### ตัวเลือกที่ 2:
```
DB_HOST=localhost  
DB_PORT=3306
```

### ตัวเลือกที่ 3:
```
DB_HOST=127.0.0.1
DB_PORT=3306  
```

### ตัวเลือกที่ 4:
```
DB_HOST=103.30.127.13
DB_PORT=3307
```

## ขั้นตอนที่ 3: ตรวจสอบใน Plesk
1. Plesk → Services → MySQL → Start (ถ้า stopped)
2. Plesk → Databases → greendee_farm → ดู "Connection Info"
3. คัดลอกข้อมูลที่ถูกต้องมาใส่ใน .env.local

## ขั้นตอนที่ 4: ติดต่อ Hosting Provider  
ถ้าทุกวิธีไม่ได้ ให้ถาม hosting provider:
- MySQL hostname ที่ถูกต้อง
- MySQL port ที่ใช้
- การตั้งค่า remote access ที่จำเป็น
- Firewall settings ที่ต้องเปลี่ยน