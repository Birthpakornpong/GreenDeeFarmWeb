# 🌱 Green Dee Farm Website Deployment Instructions

## 📦 Files Ready for Deployment

Your website has been successfully built and is ready for deployment! All files are located in the `out/` directory.

## 🚀 Deployment to Shared Hosting (Plesk/cPanel)

### Step 1: Prepare Files
1. Navigate to the `out/` folder in your project directory
2. Select ALL files and folders inside the `out/` directory
3. Create a ZIP file containing all these files

### Step 2: Upload to Shared Hosting
1. Login to your hosting control panel (Plesk/cPanel)
2. Navigate to **File Manager** 
3. Go to your domain's **public_html** folder (or **httpdocs** in Plesk)
4. **IMPORTANT**: Remove any existing files in public_html first
5. Upload the ZIP file to public_html
6. Extract/Unzip the files in public_html

### Step 3: Configure URL Rewriting
1. Copy the `.htaccess` file from your project root to public_html
2. This file handles URL routing and security headers

## 🔧 Alternative Manual Upload Method

If you prefer manual upload:

1. **Copy from**: `C:\Users\Lenovo\Desktop\farm\out\*`
2. **Copy to**: Your hosting's `public_html` folder
3. **Include**: Copy `.htaccess` from project root to public_html

## ✅ Verification Steps

After deployment:
1. Visit your domain URL
2. Check these pages work correctly:
   - Homepage (/)
   - News page (/news)
   - Individual news articles (/news/1, /news/2, etc.)
   - About page (/about)
   - Contact page (/contact)

## 🌿 Green Dee Farm Features Deployed

✅ Complete farm branding and theme
✅ Organic vegetable content and images  
✅ Contact information (064-542-0333)
✅ Social media links (Line: birhids)
✅ News system with farm articles
✅ Mobile-responsive layout
✅ SEO optimized pages

## 🆘 Troubleshooting

**If pages show 404 errors:**
- Ensure .htaccess file is uploaded to public_html
- Check if mod_rewrite is enabled on your server
- Contact your hosting provider to enable URL rewriting

**If images don't load:**
- Verify all files from out/ folder were uploaded
- Check the static/ folder contains all assets

## 📞 Support

Your Green Dee Farm website is now ready! 

**Business Contact:**
- 📱 Phone: 064-542-0333
- 💬 Line: birhids
- 🌱 Service Areas: Phuket, Phang Nga, Krabi

---
*Deployment completed successfully! Your organic vegetable delivery website is live.* 🎉