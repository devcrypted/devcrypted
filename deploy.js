#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function deployProfile() {
  console.log('🚀 GitHub Profile README Deployment Guide\n');
  
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
  const username = config.github.username;
  
  console.log('📋 To deploy your GitHub profile README, follow these steps:\n');
  
  console.log('1️⃣ CREATE REPOSITORY:');
  console.log(`   - Go to: https://github.com/new`);
  console.log(`   - Repository name: ${username}`);
  console.log(`   - Make it PUBLIC (required for profile READMEs)`);
  console.log(`   - Don't initialize with README (we'll add our own)\n`);
  
  console.log('2️⃣ CLONE AND SETUP:');
  console.log(`   git clone https://github.com/${username}/${username}.git`);
  console.log(`   cd ${username}`);
  console.log(`   # Copy all files from this project to the new repository\n`);
  
  console.log('3️⃣ DEPLOY:');
  console.log(`   git add .`);
  console.log(`   git commit -m "🚀 Add automated GitHub profile README"`);
  console.log(`   git push origin main\n`);
  
  console.log('4️⃣ ENABLE ACTIONS:');
  console.log(`   - Go to: https://github.com/${username}/${username}/settings/actions`);
  console.log(`   - Enable "Allow all actions and reusable workflows"`);
  console.log(`   - The README will auto-update daily at 6:00 AM UTC\n`);
  
  console.log('5️⃣ VERIFY:');
  console.log(`   - Your profile will be live at: https://github.com/${username}`);
  console.log(`   - Check the Actions tab for automation status\n`);
  
  console.log('⚠️  IMPORTANT NOTES:');
  console.log('   - Repository name MUST match your username exactly');
  console.log('   - Repository MUST be public');
  console.log('   - Files will be auto-updated by GitHub Actions');
  console.log('   - First run might take a few minutes to activate\n');
  
  console.log('🎉 Once deployed, your profile will feature:');
  console.log('   ✅ Real-time GitHub statistics');
  console.log('   ✅ Latest blog posts from kamal.sh');
  console.log('   ✅ YouTube videos (when configured)');
  console.log('   ✅ Achievement badges and trophies');
  console.log('   ✅ Daily automatic updates');
  
  // Check if we're in a git repository
  try {
    const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    if (remoteUrl.includes(username)) {
      console.log(`\n✅ You're already in the correct repository: ${remoteUrl}`);
      console.log('Run: git add . && git commit -m "Update profile README" && git push');
    }
  } catch (error) {
    console.log('\n💡 This directory is not a git repository yet. Follow the steps above to set it up.');
  }
}

// Run the deployment guide
deployProfile();
