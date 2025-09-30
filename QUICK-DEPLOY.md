# Green Dee Farm - Quick Deploy Commands

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Commit และ Push
```bash
git add .
git commit -m "🚀 Production ready: Green Dee Farm with MySQL authentication system"
git push origin main
```

### Step 2: Deploy ใน Vercel Dashboard
1. ไปที่ https://vercel.com/dashboard
2. Import `GreenDeeFarmWeb` repository  
3. Add Environment Variables จาก `deploy-env-variables.txt`
4. Deploy!

## ⚙️ Environment Variables สำหรับ Vercel

คัดลอกไปวางใน Vercel → Project Settings → Environment Variables:

```
NEXTAUTH_URL=https://www.greendeefarm.com
NEXTAUTH_SECRET=greendeefarm-production-secret-2025-very-secure-organic-vegetables
DB_HOST=localhost
DB_PORT=3306
DB_NAME=greendee_farm
DB_USER=greendee_farm
DB_PASSWORD=Bird993546*
JWT_SECRET=greendeefarm-production-jwt-secret-2025-authentication-very-secure
NODE_ENV=production
```

## 🔧 สำหรับ Plesk Deployment

หากต้องการ deploy บน Plesk server เดียวกัน:

```bash
npm run build
npm run start
```

## ✅ หลัง Deploy แล้ว

ทดสอบ:
- https://www.greendeefarm.com
- https://www.greendeefarm.com/auth/register
- https://www.greendeefarm.com/auth/login
- https://www.greendeefarm.com/dashboard