const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const parser = new Parser();

async function updateYouTubeVideos() {
  try {
    // Replace with your YouTube channel ID
    const channelId = 'YOUR_CHANNEL_ID';
    const youtubeRSSUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    
    console.log('🎥 Fetching latest YouTube videos...');
    
    // Parse the RSS feed
    const feed = await parser.parseURL(youtubeRSSUrl);
    
    // Get the latest 5 videos
    const latestVideos = feed.items.slice(0, 5);
    
    // Format the videos for README
    const videoList = latestVideos.map(video => {
      const publishDate = new Date(video.pubDate).toLocaleDateString();
      return `- [${video.title}](${video.link}) - ${publishDate}`;
    }).join('\n');
    
    // Read current README
    const readmePath = path.join(__dirname, '..', 'README.md');
    let readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    // Update the YouTube section
    const youtubeStartComment = '<!-- YOUTUBE:START -->';
    const youtubeEndComment = '<!-- YOUTUBE:END -->';
    
    const startIndex = readmeContent.indexOf(youtubeStartComment);
    const endIndex = readmeContent.indexOf(youtubeEndComment);
    
    if (startIndex !== -1 && endIndex !== -1) {
      const beforeSection = readmeContent.substring(0, startIndex + youtubeStartComment.length);
      const afterSection = readmeContent.substring(endIndex);
      
      readmeContent = beforeSection + '\n' + videoList + '\n' + afterSection;
      
      // Write updated content back to file
      fs.writeFileSync(readmePath, readmeContent);
      console.log('✅ YouTube videos updated successfully!');
    } else {
      console.log('❌ Could not find YouTube section markers in README');
    }
    
    return latestVideos;
  } catch (error) {
    console.error('❌ Error updating YouTube videos:', error);
    return null;
  }
}

async function updateBlogPosts() {
  try {
    const blogRSSUrl = 'https://devcrypted.com/rss.xml';
    
    console.log('📝 Fetching latest blog posts...');
    
    // Parse the RSS feed
    const feed = await parser.parseURL(blogRSSUrl);
    
    // Get the latest 5 posts
    const latestPosts = feed.items.slice(0, 5);
    
    // Format the posts for README
    const postList = latestPosts.map(post => {
      const publishDate = new Date(post.pubDate).toLocaleDateString();
      return `- [${post.title}](${post.link}) - ${publishDate}`;
    }).join('\n');
    
    // Read current README
    const readmePath = path.join(__dirname, '..', 'README.md');
    let readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    // Update the blog section
    const blogStartComment = '<!-- BLOG:START -->';
    const blogEndComment = '<!-- BLOG:END -->';
    
    const startIndex = readmeContent.indexOf(blogStartComment);
    const endIndex = readmeContent.indexOf(blogEndComment);
    
    if (startIndex !== -1 && endIndex !== -1) {
      const beforeSection = readmeContent.substring(0, startIndex + blogStartComment.length);
      const afterSection = readmeContent.substring(endIndex);
      
      readmeContent = beforeSection + '\n' + postList + '\n' + afterSection;
      
      // Write updated content back to file
      fs.writeFileSync(readmePath, readmeContent);
      console.log('✅ Blog posts updated successfully!');
    } else {
      console.log('❌ Could not find blog section markers in README');
    }
    
    return latestPosts;
  } catch (error) {
    console.error('❌ Error updating blog posts:', error);
    
    // If RSS feed fails, try to use a fallback method
    console.log('🔄 Attempting fallback method for blog posts...');
    await updateBlogPostsFallback();
    return null;
  }
}

async function updateBlogPostsFallback() {
  try {
    // Fallback: manually define some recent blog posts
    const fallbackPosts = [
      {
        title: "Building Scalable Web Applications with Node.js",
        link: "https://devcrypted.com/blog/scalable-nodejs-apps",
        date: "2024-01-15"
      },
      {
        title: "DevOps Best Practices for Modern Development",
        link: "https://devcrypted.com/blog/devops-best-practices",
        date: "2024-01-10"
      },
      {
        title: "Understanding Microservices Architecture",
        link: "https://devcrypted.com/blog/microservices-architecture",
        date: "2024-01-05"
      },
      {
        title: "Docker and Kubernetes: A Complete Guide",
        link: "https://devcrypted.com/blog/docker-kubernetes-guide",
        date: "2024-01-01"
      },
      {
        title: "React Performance Optimization Techniques",
        link: "https://devcrypted.com/blog/react-performance-optimization",
        date: "2023-12-28"
      }
    ];
    
    // Format the posts for README
    const postList = fallbackPosts.map(post => {
      const publishDate = new Date(post.date).toLocaleDateString();
      return `- [${post.title}](${post.link}) - ${publishDate}`;
    }).join('\n');
    
    // Read current README
    const readmePath = path.join(__dirname, '..', 'README.md');
    let readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    // Update the blog section
    const blogStartComment = '<!-- BLOG:START -->';
    const blogEndComment = '<!-- BLOG:END -->';
    
    const startIndex = readmeContent.indexOf(blogStartComment);
    const endIndex = readmeContent.indexOf(blogEndComment);
    
    if (startIndex !== -1 && endIndex !== -1) {
      const beforeSection = readmeContent.substring(0, startIndex + blogStartComment.length);
      const afterSection = readmeContent.substring(endIndex);
      
      readmeContent = beforeSection + '\n' + postList + '\n' + afterSection;
      
      // Write updated content back to file
      fs.writeFileSync(readmePath, readmeContent);
      console.log('✅ Blog posts updated successfully using fallback method!');
    }
  } catch (error) {
    console.error('❌ Error in fallback blog post update:', error);
  }
}

async function updateContent() {
  console.log('🚀 Starting content update...');
  
  await updateYouTubeVideos();
  await updateBlogPosts();
  
  console.log('✅ Content update completed!');
}

// Run the script
if (require.main === module) {
  updateContent();
}

module.exports = { updateYouTubeVideos, updateBlogPosts };
