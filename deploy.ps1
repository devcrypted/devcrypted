# GitHub Profile README Deployment Script for Windows
# Run this script in PowerShell

Write-Host "🚀 GitHub Profile README Deployment Guide" -ForegroundColor Green
Write-Host ""

# Read config
$config = Get-Content "config.json" | ConvertFrom-Json
$username = $config.github.username

Write-Host "📋 To deploy your GitHub profile README, follow these steps:" -ForegroundColor Yellow
Write-Host ""

Write-Host "1️⃣ CREATE REPOSITORY:" -ForegroundColor Cyan
Write-Host "   - Go to: https://github.com/new" -ForegroundColor White
Write-Host "   - Repository name: $username" -ForegroundColor White
Write-Host "   - Make it PUBLIC (required for profile READMEs)" -ForegroundColor White
Write-Host "   - Don't initialize with README (we'll add our own)" -ForegroundColor White
Write-Host ""

Write-Host "2️⃣ CLONE AND SETUP:" -ForegroundColor Cyan
Write-Host "   git clone https://github.com/$username/$username.git" -ForegroundColor White
Write-Host "   cd $username" -ForegroundColor White
Write-Host "   # Copy all files from this project to the new repository" -ForegroundColor White
Write-Host ""

Write-Host "3️⃣ DEPLOY:" -ForegroundColor Cyan
Write-Host "   git add ." -ForegroundColor White
Write-Host "   git commit -m `"🚀 Add automated GitHub profile README`"" -ForegroundColor White
Write-Host "   git push origin main" -ForegroundColor White
Write-Host ""

Write-Host "4️⃣ ENABLE ACTIONS:" -ForegroundColor Cyan
Write-Host "   - Go to: https://github.com/$username/$username/settings/actions" -ForegroundColor White
Write-Host "   - Enable `"Allow all actions and reusable workflows`"" -ForegroundColor White
Write-Host "   - The README will auto-update daily at 6:00 AM UTC" -ForegroundColor White
Write-Host ""

Write-Host "5️⃣ VERIFY:" -ForegroundColor Cyan
Write-Host "   - Your profile will be live at: https://github.com/$username" -ForegroundColor White
Write-Host "   - Check the Actions tab for automation status" -ForegroundColor White
Write-Host ""

Write-Host "⚠️  IMPORTANT NOTES:" -ForegroundColor Red
Write-Host "   - Repository name MUST match your username exactly" -ForegroundColor White
Write-Host "   - Repository MUST be public" -ForegroundColor White
Write-Host "   - Files will be auto-updated by GitHub Actions" -ForegroundColor White
Write-Host "   - First run might take a few minutes to activate" -ForegroundColor White
Write-Host ""

Write-Host "🎉 Once deployed, your profile will feature:" -ForegroundColor Green
Write-Host "   ✅ Real-time GitHub statistics" -ForegroundColor White
Write-Host "   ✅ Latest blog posts from kamal.sh" -ForegroundColor White
Write-Host "   ✅ YouTube videos (when configured)" -ForegroundColor White
Write-Host "   ✅ Achievement badges and trophies" -ForegroundColor White
Write-Host "   ✅ Daily automatic updates" -ForegroundColor White

# Check if we're in a git repository
try {
    $remoteUrl = git remote get-url origin 2>$null
    if ($remoteUrl -and $remoteUrl.Contains($username)) {
        Write-Host ""
        Write-Host "✅ You're already in the correct repository: $remoteUrl" -ForegroundColor Green
        Write-Host "Run: git add . && git commit -m `"Update profile README`" && git push" -ForegroundColor White
    }
} catch {
    Write-Host ""
    Write-Host "💡 This directory is not a git repository yet. Follow the steps above to set it up." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
