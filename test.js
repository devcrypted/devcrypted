#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function testSetup() {
  console.log('🧪 Testing GitHub Profile README Setup...\n');
  
  const errors = [];
  const warnings = [];
  
  // Test 1: Check if required files exist
  const requiredFiles = [
    'README.md',
    'package.json',
    'config.json',
    '.github/workflows/update-readme.yml',
    'scripts/update-stats.js',
    'scripts/update-content.js'
  ];
  
  console.log('📁 Checking required files...');
  requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ ${file} missing`);
      errors.push(`Missing file: ${file}`);
    }
  });
  
  // Test 2: Check package.json
  console.log('\n📦 Checking package.json...');
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    if (packageJson.dependencies) {
      console.log('✅ Dependencies defined');
    } else {
      warnings.push('No dependencies defined in package.json');
    }
  } catch (error) {
    errors.push('Invalid package.json format');
  }
  
  // Test 3: Check config.json
  console.log('\n⚙️ Checking config.json...');
  try {
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
    if (config.github && config.github.username) {
      console.log('✅ GitHub username configured');
    } else {
      warnings.push('GitHub username not configured');
    }
    
    if (config.social && config.social.youtube && config.social.youtube.channelId) {
      if (config.social.youtube.channelId === 'YOUR_CHANNEL_ID') {
        warnings.push('YouTube channel ID not configured (using placeholder)');
      } else {
        console.log('✅ YouTube channel ID configured');
      }
    } else {
      warnings.push('YouTube channel ID not configured');
    }
  } catch (error) {
    errors.push('Invalid config.json format');
  }
  
  // Test 4: Check README.md structure
  console.log('\n📝 Checking README.md structure...');
  try {
    const readmeContent = fs.readFileSync(path.join(__dirname, 'README.md'), 'utf8');
    
    const requiredSections = [
      '<!-- YOUTUBE:START -->',
      '<!-- YOUTUBE:END -->',
      '<!-- BLOG:START -->',
      '<!-- BLOG:END -->',
      '<!-- DATE:START -->',
      '<!-- DATE:END -->'
    ];
    
    requiredSections.forEach(section => {
      if (readmeContent.includes(section)) {
        console.log(`✅ ${section} found`);
      } else {
        warnings.push(`Missing section marker: ${section}`);
      }
    });
  } catch (error) {
    errors.push('Cannot read README.md');
  }
  
  // Test 5: Check GitHub Actions workflow
  console.log('\n⚡ Checking GitHub Actions workflow...');
  try {
    const workflowContent = fs.readFileSync(path.join(__dirname, '.github/workflows/update-readme.yml'), 'utf8');
    
    if (workflowContent.includes('schedule:')) {
      console.log('✅ Schedule configured');
    } else {
      warnings.push('No schedule configured in workflow');
    }
    
    if (workflowContent.includes('node scripts/update-stats.js')) {
      console.log('✅ Stats update script referenced');
    } else {
      warnings.push('Stats update script not referenced in workflow');
    }
    
    if (workflowContent.includes('node scripts/update-content.js')) {
      console.log('✅ Content update script referenced');
    } else {
      warnings.push('Content update script not referenced in workflow');
    }
  } catch (error) {
    errors.push('Cannot read GitHub Actions workflow');
  }
  
  // Test 6: Check scripts syntax
  console.log('\n🔧 Checking scripts syntax...');
  try {
    require(path.join(__dirname, 'scripts/update-stats.js'));
    console.log('✅ update-stats.js syntax valid');
  } catch (error) {
    errors.push(`update-stats.js has syntax errors: ${error.message}`);
  }
  
  try {
    require(path.join(__dirname, 'scripts/update-content.js'));
    console.log('✅ update-content.js syntax valid');
  } catch (error) {
    errors.push(`update-content.js has syntax errors: ${error.message}`);
  }
  
  // Summary
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${requiredFiles.length - errors.length}/${requiredFiles.length} files`);
  console.log(`⚠️  Warnings: ${warnings.length}`);
  console.log(`❌ Errors: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log('\n❌ Errors found:');
    errors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  if (errors.length === 0) {
    console.log('\n🎉 Setup test passed! Your GitHub profile README is ready to deploy.');
    console.log('\nNext steps:');
    console.log('1. Run: npm install');
    console.log('2. Run: node setup.js (to configure your details)');
    console.log('3. Push to GitHub repository named after your username');
    console.log('4. Enable GitHub Actions in repository settings');
  } else {
    console.log('\n❌ Setup test failed. Please fix the errors above.');
  }
}

// Run the test
testSetup().catch(console.error);
