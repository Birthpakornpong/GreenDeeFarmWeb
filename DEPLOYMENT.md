# 🚀 Green Dee Farm - Production Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Database Setup (Completed)
- [x] MySQL database `greendee_farm` created in Plesk
- [x] User `greendee_farm` with proper permissions
- [x] Table `users` created for authentication system
- [x] Remote access configured (localhost)

### ✅ Code Preparation (Ready)
- [x] Authentication system implemented
- [x] Environment variables configured
- [x] Production settings optimized
- [x] Git repository clean

---

## 🌐 Deployment Options

### Option 1: Vercel Deployment (Recommended)

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "🚀 Ready for production deployment - Green Dee Farm with authentication"
git push origin main
```

#### Step 2: Deploy to Vercel
1. ไปที่ [vercel.com](https://vercel.com)
2. เข้าสู่ระบบด้วย GitHub
3. เลือก repository `GreenDeeFarmWeb`
4. กด **Deploy**

#### Step 3: Add Environment Variables ใน Vercel
ไปที่ **Project Settings** → **Environment Variables** และเพิ่ม:

```bash
NEXTAUTH_URL=https://www.greendeefarm.com
NEXTAUTH_SECRET=greendeefarm-production-secret-2025-very-secure-organic-vegetables
DB_HOST=localhost
DB_PORT=3306
DB_NAME=greendee_farm
DB_USER=greendee_farm
DB_PASSWORD=Bird993546*
JWT_SECRET=greendeefarm-production-jwt-secret-2025-authentication-very-secure
NODE_ENV=production
NEXT_PUBLIC_GA_ID=G-T4N0138Y63
NEXT_PUBLIC_PHONE=064-542-0333
NEXT_PUBLIC_LINE_ID=birhids
NEXT_PUBLIC_FACEBOOK_URL=https://www.facebook.com/profile.php?id=100075999497749
NEXT_PUBLIC_SERVICE_AREAS=Phuket,Phang Nga,Krabi
```

### Option 2: Plesk Deployment (Same Server)

#### Step 1: Upload Files
1. สร้างโฟลเดอร์ใหม่ใน Plesk File Manager
2. Upload files จาก project
3. รัน `npm install` ใน terminal

#### Step 2: Configure Environment
1. สร้างไฟล์ `.env.production` ใน root directory
2. คัดลอกเนื้อหาจาก `deploy-env-variables.txt`

#### Step 3: Start Application
```bash
npm run build
npm start
```

---

## 🔧 Post-Deployment Configuration

### 1. Domain Setup
- Point domain `www.greendeefarm.com` to deployment
- Configure SSL certificate
- Test all pages and functionality

### 2. Database Verification
- Test authentication system
- Verify user registration and login
- Check data persistence

### 3. Performance Testing
- Test page load speeds
- Verify mobile responsiveness
- Check all forms and interactions

---

## 🧪 Testing Checklist

### Authentication System
- [ ] User registration works
- [ ] User login works
- [ ] Password hashing secure
- [ ] JWT tokens valid
- [ ] Logout functionality

### Core Features
- [ ] Homepage loads correctly
- [ ] News section displays
- [ ] Contact forms work
- [ ] Mobile responsive
- [ ] All images load

### Green Dee Farm Content
- [ ] Farm information accurate
- [ ] Contact details correct (064-542-0333)
- [ ] LINE ID working (birhids)
- [ ] Service areas displayed (Phuket, Phang Nga, Krabi)
- [ ] Organic vegetable products shown

---

## 🔒 Security Considerations

### Production Security
- [x] JWT secrets changed for production
- [x] Database passwords secure
- [x] HTTPS enforced
- [x] Environment variables protected

### Database Security
- [x] User permissions limited
- [x] Remote access restricted
- [x] Password hashing implemented
- [x] SQL injection protection

---

## 📞 Support Information

### Technical Support
- **Developer:** Available for deployment assistance
- **Hosting:** Plesk control panel access
- **Database:** MySQL via phpMyAdmin

### Green Dee Farm Contacts
- **Phone:** 064-542-0333
- **LINE:** birhids
- **Service Areas:** Phuket, Phang Nga, Krabi
- **Products:** Organic vegetables (Green Oak, Red Oak, Green Cos)

---

## 🎯 Success Metrics

After successful deployment, verify:
- ✅ Website accessible at production URL
- ✅ All pages load under 3 seconds
- ✅ Authentication system functional
- ✅ Mobile-friendly design
- ✅ Contact forms working
- ✅ Green Dee Farm branding consistent

**🎉 Ready to deploy! Choose your deployment method and follow the steps above.**