#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function setup() {
  console.log('🚀 Welcome to GitHub Profile README Setup!\n');
  
  try {
    // Read current config
    const configPath = path.join(__dirname, 'config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    // Ask for GitHub username
    const githubUsername = await askQuestion('Enter your GitHub username: ');
    if (githubUsername.trim()) {
      config.github.username = githubUsername.trim();
    }
    
    // Ask for YouTube channel ID
    const youtubeChannelId = await askQuestion('Enter your YouTube channel ID (optional): ');
    if (youtubeChannelId.trim()) {
      config.social.youtube.channelId = youtubeChannelId.trim();
      config.social.youtube.channelUrl = `https://youtube.com/@${youtubeChannelId.trim()}`;
    }
    
    // Ask for blog RSS URL
    const blogRssUrl = await askQuestion('Enter your blog RSS URL (optional): ');
    if (blogRssUrl.trim()) {
      config.social.blog.rssUrl = blogRssUrl.trim();
    }
    
    // Ask for website URL
    const websiteUrl = await askQuestion('Enter your website URL (optional): ');
    if (websiteUrl.trim()) {
      config.social.website = websiteUrl.trim();
    }
    
    // Ask for email
    const email = await askQuestion('Enter your email address (optional): ');
    if (email.trim()) {
      config.social.email = email.trim();
    }
    
    // Ask for Twitter username
    const twitterUsername = await askQuestion('Enter your Twitter username (optional): ');
    if (twitterUsername.trim()) {
      config.social.twitter = `https://twitter.com/${twitterUsername.trim()}`;
    }
    
    // Ask for LinkedIn profile
    const linkedinProfile = await askQuestion('Enter your LinkedIn profile URL (optional): ');
    if (linkedinProfile.trim()) {
      config.social.linkedin = linkedinProfile.trim();
    }
    
    // Save updated config
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('\n✅ Configuration saved successfully!');
    
    // Update README with new configuration
    await updateReadmeWithConfig(config);
    
    console.log('\n🎉 Setup completed! Your GitHub profile README is ready.');
    console.log('\nNext steps:');
    console.log('1. Push this repository to GitHub');
    console.log('2. Go to your GitHub profile settings');
    console.log('3. Enable GitHub Actions for your repository');
    console.log('4. Add any required secrets (like API keys) in repository settings');
    console.log('5. The README will update automatically every day at 6:00 AM UTC');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    rl.close();
  }
}

async function updateReadmeWithConfig(config) {
  try {
    const readmePath = path.join(__dirname, 'README.md');
    let readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    // Update GitHub username in stats URLs
    readmeContent = readmeContent.replace(
      /username=devcrypted/g,
      `username=${config.github.username}`
    );
    
    // Update social links
    if (config.social.youtube.channelUrl) {
      readmeContent = readmeContent.replace(
        /https:\/\/youtube\.com\/@devcrypted/g,
        config.social.youtube.channelUrl
      );
    }
    
    if (config.social.website) {
      readmeContent = readmeContent.replace(
        /https:\/\/devcrypted\.com/g,
        config.social.website
      );
    }
    
    if (config.social.email) {
      readmeContent = readmeContent.replace(
        /contact@devcrypted\.com/g,
        config.social.email
      );
    }
    
    if (config.social.twitter) {
      readmeContent = readmeContent.replace(
        /https:\/\/twitter\.com\/devcrypted/g,
        config.social.twitter
      );
    }
    
    if (config.social.linkedin) {
      readmeContent = readmeContent.replace(
        /https:\/\/linkedin\.com\/in\/kamal-singh-devcrypted/g,
        config.social.linkedin
      );
    }
    
    // Write updated README
    fs.writeFileSync(readmePath, readmeContent);
    console.log('✅ README updated with your configuration!');
    
  } catch (error) {
    console.error('❌ Error updating README:', error);
  }
}

// Run setup
setup();
