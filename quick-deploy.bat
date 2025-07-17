@echo off
echo 🚀 Quick Deploy to GitHub Profile
echo.

echo 📦 Installing dependencies...
call npm install

echo.
echo 🧪 Running tests...
call node test.js

echo.
echo 📝 Updating content...
call node scripts/update-content.js

echo.
echo 📊 Updating statistics...
call node scripts/update-stats.js

echo.
echo 🚀 Deploying to GitHub...
git add .
git commit -m "🚀 Update GitHub profile README - %date% %time%"
git push origin main

echo.
echo ✅ Deployment complete!
echo 👀 Check your profile at: https://github.com/devcrypted
echo.
pause
