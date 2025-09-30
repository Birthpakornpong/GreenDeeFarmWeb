# Production Deployment Checklist for Green Dee Farm

## 🔐 Security & Environment
- [ ] อัปเดต NEXTAUTH_SECRET ด้วย strong secret key
- [ ] อัปเดต JWT_SECRET ด้วย production key
- [ ] ตั้งค่า NODE_ENV=production
- [ ] เปิดใช้ HTTPS บน hosting

## 🗄️ Database (Supabase)
- [ ] ตรวจสอบ Supabase Project URL และ API Key
- [ ] ตั้งค่า RLS (Row Level Security) policies
- [ ] เพิ่ม Site URL: https://www.greendeefarm.com
- [ ] ทดสอบการเชื่อมต่อจาก production domain

## 🌐 Domain & DNS
- [ ] ตั้งค่า DNS ให้ชี้ไปที่ hosting
- [ ] ติดตั้ง SSL Certificate
- [ ] ตรวจสอบ NEXTAUTH_URL ให้ตรงกับ domain

## 🚀 Deployment Commands
```bash
# Build for production
npm run build

# Deploy to hosting (depends on your hosting provider)
# For Vercel:
vercel --prod

# For other providers:
# Upload dist/build files to hosting
```

## ✅ Post-Deployment Testing
- [ ] ทดสอบการเข้าถึงเว็บไซต์
- [ ] ทดสอบการสมัครสมาชิก
- [ ] ทดสอบการเข้าสู่ระบบ
- [ ] ทดสอบ Dashboard
- [ ] ทดสอบ API endpoints
- [ ] ตรวจสอบ Console errors

## 🔧 Troubleshooting
หากมีปัญหา:
1. ตรวจสอบ Environment Variables ใน hosting panel
2. ดู Console logs สำหรับ errors
3. ตรวจสอบ Supabase logs
4. ทดสอบ API endpoints โดยตรง

## 📞 Emergency Contacts
- Supabase Support: https://supabase.com/support
- Hosting Provider Support
- DNS Provider Support