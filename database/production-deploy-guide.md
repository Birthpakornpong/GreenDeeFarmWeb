# 🚀 คำแนะนำการ Deploy Database สำหรับ Green Dee Farm

## 📋 สิ่งที่ต้องตั้งค่าเมื่อ Deploy:

### 1. 🗄️ **Database Settings ใน Plesk (Production)**

#### A) Remote Access Control:
```
Plesk Control Panel → Databases → greendee_farm → Access control
```

**สำหรับ Production ให้เพิ่ม:**
- `localhost` (สำหรับ same server)
- `127.0.0.1` (localhost IP)
- **IP ของ hosting service** (ถ้า deploy ที่อื่น)
- **Domain ของเว็บไซต์** (greendeefarm.com)

#### B) SSL/Security:
- เปิด SSL connection ถ้าจำเป็น
- ตรวจสอบ firewall settings

---

### 2. ⚙️ **Environment Variables**

#### A) สำหรับ Vercel Deploy:
```bash
# ไปที่ Vercel Dashboard → Project → Settings → Environment Variables
# เพิ่มตัวแปรเหล่านี้:

NEXTAUTH_URL=https://www.greendeefarm.com
NEXTAUTH_SECRET=production-secret-key-123
DB_HOST=localhost
DB_PORT=3306
DB_NAME=greendee_farm
DB_USER=greendee_farm
DB_PASSWORD=Bird993546*
JWT_SECRET=production-jwt-secret-456
NODE_ENV=production
```

#### B) สำหรับ Netlify Deploy:
```bash
# ไปที่ Netlify Dashboard → Site → Settings → Environment Variables
# เพิ่มตัวแปรเดียวกัน
```

#### C) สำหรับ Hosting อื่นๆ (cPanel, DirectAdmin):
สร้างไฟล์ `.env.production` ใน root directory

---

### 3. 🌐 **Database Connection Options สำหรับ Production**

#### Option 1: Same Server (แนะนำ)
```env
DB_HOST=localhost
DB_PORT=3306
```

#### Option 2: Remote Connection
```env
DB_HOST=103.30.127.13
DB_PORT=3306
```

#### Option 3: MySQL Hostname
```env
DB_HOST=mysql.yourdomain.com
DB_PORT=3306
```

---

### 4. 🔒 **Security Settings สำหรับ Production**

#### A) Update JWT Secrets:
```env
JWT_SECRET=production-jwt-secret-very-long-and-secure-2025
NEXTAUTH_SECRET=nextauth-production-secret-very-secure-2025
```

#### B) Database User Permissions:
- สร้าง database user เฉพาะสำหรับ production
- จำกัดสิทธิ์เฉพาะที่จำเป็น (SELECT, INSERT, UPDATE, DELETE)
- ไม่ให้สิทธิ์ DROP, ALTER ใน production

#### C) Plesk Access Control:
**อย่าใช้ `%` ใน production** แต่ระบุ IP/domain เฉพาะ:
```
localhost
127.0.0.1
yourdomain.com
192.168.1.100  # IP ของ hosting
```

---

### 5. 📊 **Database Monitoring**

#### A) Connection Pool Settings:
```javascript
// lib/mysql.js - Production settings
const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectionLimit: 10,  // เพิ่มสำหรับ production
  queueLimit: 0,
  ssl: process.env.NODE_ENV === 'production',  // เปิด SSL ใน production
  charset: 'utf8mb4'
};
```

#### B) Error Handling:
```env
DB_DEBUG=false  # ปิด debug ใน production
```

---

### 6. 🧪 **Testing Production Database**

#### A) Test Endpoints:
สร้าง API เฉพาะสำหรับทดสอบ production:
```
/api/health-check
/api/db-status
```

#### B) Database Backup:
- ตั้งค่า automated backup ใน Plesk
- Export ข้อมูลสำคัญก่อน deploy

---

### 7. 📝 **Deployment Checklist**

#### ก่อน Deploy:
- [ ] ตรวจสอบ `.env` variables
- [ ] Update NEXTAUTH_URL เป็น production domain
- [ ] เปลี่ยน JWT secrets
- [ ] ตั้งค่า Plesk database access control
- [ ] Backup database

#### หลัง Deploy:
- [ ] ทดสอบการเชื่อมต่อฐานข้อมูล
- [ ] ทดสอบ login/register system
- [ ] ตรวจสอบ error logs
- [ ] Monitor database performance

---

### 8. 🔧 **Troubleshooting**

#### ถ้าเชื่อมต่อฐานข้อมูลไม่ได้ใน Production:

1. **ตรวจสอบ Environment Variables**
2. **เช็ค Plesk Access Control**
3. **ลอง DB_HOST ต่างๆ:**
   - `localhost`
   - `127.0.0.1`  
   - IP address ของ server
   - MySQL hostname จาก Plesk

4. **ตรวจสอบ Firewall**
5. **เช็ค SSL requirements**

---

## 🎯 Platform-Specific Instructions:

### Vercel:
- Environment Variables → Add all DB variables
- Build Command: `npm run build`
- Framework Preset: Next.js

### Netlify:
- Environment Variables → Add all DB variables  
- Build Command: `npm run build`
- Publish Directory: `.next`

### cPanel/DirectAdmin:
- Upload files ผ่าน File Manager
- สร้าง `.env.production` ในโฟลเดอร์ root
- ตั้งค่า Node.js app ใน control panel