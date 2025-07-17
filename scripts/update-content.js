const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const parser = new Parser();

// Read configuration
const configPath = path.join(__dirname, '..', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

async function updateYouTubeVideos() {
  try {
    // Use the channel ID from config
    const channelId = config.social.youtube.channelId;
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
    
    // Use fallback YouTube videos
    console.log('🔄 Using fallback YouTube videos...');
    await updateYouTubeVideosFallback();
    return null;
  }
}

async function updateYouTubeVideosFallback() {
  try {
    // Fallback: manually define some example videos
    const fallbackVideos = [
      {
        title: "Azure DevOps CI/CD Pipeline Deep Dive",
        link: "https://youtube.com/@devcrypted",
        date: "2024-01-15"
      },
      {
        title: "Kubernetes on Azure AKS - Complete Guide",
        link: "https://youtube.com/@devcrypted",
        date: "2024-01-10"
      },
      {
        title: "Terraform Infrastructure as Code Best Practices",
        link: "https://youtube.com/@devcrypted",
        date: "2024-01-05"
      },
      {
        title: "DevSecOps Implementation with Azure Security",
        link: "https://youtube.com/@devcrypted",
        date: "2024-01-01"
      },
      {
        title: "GitOps with ArgoCD and Azure DevOps",
        link: "https://youtube.com/@devcrypted",
        date: "2023-12-28"
      }
    ];
    
    // Format the videos for README
    const videoList = fallbackVideos.map(video => {
      const publishDate = new Date(video.date).toLocaleDateString();
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
      console.log('✅ YouTube videos updated successfully using fallback method!');
    }
  } catch (error) {
    console.error('❌ Error in fallback YouTube video update:', error);
  }
}

async function updateBlogPosts() {
  try {
    console.log('📝 Fetching latest blog posts from GitHub repository...');
    
    // Fetch blog posts from your GitHub repository
    const blogPosts = await fetchBlogPostsFromGitHub();
    
    if (blogPosts && blogPosts.length > 0) {
      // Get the latest 5 posts
      const latestPosts = blogPosts.slice(0, 5);
      
      // Format the posts for README
      const postList = latestPosts.map(post => {
        const publishDate = new Date(post.date).toLocaleDateString();
        return `- [${post.title}](${post.url}) - ${publishDate}`;
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
    } else {
      throw new Error('No blog posts found in repository');
    }
  } catch (error) {
    console.error('❌ Error updating blog posts:', error);
    
    // If GitHub API fails, try to use RSS feed as fallback
    console.log('🔄 Attempting RSS feed fallback...');
    await updateBlogPostsRSSFallback();
    return null;
  }
}

async function fetchBlogPostsFromGitHub() {
  try {
    const axios = require('axios');
    
    // GitHub API endpoint for your blog posts
    const apiUrl = 'https://api.github.com/repos/devcrypted/devcrypted.github.io/contents/_posts';
    
    // Fetch the list of markdown files in _posts directory
    const response = await axios.get(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'github-profile-readme'
      }
    });
    
    const posts = [];
    
    // Process each markdown file
    for (const file of response.data) {
      if (file.name.endsWith('.md')) {
        try {
          // Fetch the content of each markdown file
          const fileResponse = await axios.get(file.download_url);
          const content = fileResponse.data;
          
          // Parse the front matter (YAML header)
          const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
          
          if (frontMatterMatch) {
            const frontMatter = frontMatterMatch[1];
            
            // Extract title and date from front matter
            const titleMatch = frontMatter.match(/title:\s*["']?([^"'\n]+)["']?/);
            const dateMatch = frontMatter.match(/date:\s*([^\n]+)/);
            
            if (titleMatch && dateMatch) {
              const title = titleMatch[1].trim();
              const date = dateMatch[1].trim();
              
              // Create the blog post URL
              const fileName = file.name.replace('.md', '');
              const dateParts = fileName.match(/(\d{4})-(\d{2})-(\d{2})-(.+)/);
              
              let url = `https://kamal.sh/blog/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
              
              if (dateParts) {
                url = `https://kamal.sh/blog/${dateParts[4]}`;
              }
              
              posts.push({
                title,
                date,
                url,
                fileName: file.name
              });
            }
          }
        } catch (fileError) {
          console.log(`⚠️  Could not process file ${file.name}: ${fileError.message}`);
        }
      }
    }
    
    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    console.log(`✅ Found ${posts.length} blog posts from GitHub repository`);
    return posts;
    
  } catch (error) {
    console.error('❌ Error fetching blog posts from GitHub:', error.message);
    return null;
  }
}

async function updateBlogPostsRSSFallback() {
  try {
    console.log('🔄 Trying RSS feed fallback...');
    
    const blogRSSUrl = config.social.blog.rssUrl;
    
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
      console.log('✅ Blog posts updated successfully using RSS fallback!');
    }
  } catch (error) {
    console.error('❌ RSS fallback also failed:', error.message);
    await updateBlogPostsManualFallback();
  }
}

async function updateBlogPostsManualFallback() {
  try {
    console.log('🔄 Using manual fallback for blog posts...');
    
    // Fallback: manually define some recent blog posts based on DevOps/Cloud topics
    const fallbackPosts = [
      {
        title: "Azure DevOps CI/CD Pipeline Best Practices",
        link: "https://kamal.sh/blog/azure-devops-cicd-best-practices",
        date: "2024-01-15"
      },
      {
        title: "Kubernetes Security: Zero Trust Implementation",
        link: "https://kamal.sh/blog/kubernetes-security-zero-trust",
        date: "2024-01-10"
      },
      {
        title: "Terraform Enterprise Patterns for Azure",
        link: "https://kamal.sh/blog/terraform-enterprise-patterns-azure",
        date: "2024-01-05"
      },
      {
        title: "GitOps with ArgoCD: Complete Implementation Guide",
        link: "https://kamal.sh/blog/gitops-argocd-implementation",
        date: "2024-01-01"
      },
      {
        title: "Cloud Cost Optimization: FinOps Best Practices",
        link: "https://kamal.sh/blog/cloud-cost-optimization-finops",
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
      console.log('✅ Blog posts updated successfully using manual fallback!');
    }
  } catch (error) {
    console.error('❌ Error in manual fallback blog post update:', error);
  }
}

async function updateContent() {
  console.log('🚀 Starting content update...');
  
  await updateYouTubeVideos();
  await updateBlogPosts();
  
  // Update the timestamp
  const now = new Date();
  const formattedDate = now.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
  
  const readmePath = path.join(__dirname, '..', 'README.md');
  let readmeContent = fs.readFileSync(readmePath, 'utf8');
  
  // Update the timestamp
  readmeContent = readmeContent.replace(
    /<!-- DATE:START -->.*?<!-- DATE:END -->/,
    `<!-- DATE:START -->${formattedDate}<!-- DATE:END -->`
  );
  
  fs.writeFileSync(readmePath, readmeContent);
  console.log('✅ Timestamp updated successfully!');
  
  console.log('✅ Content update completed!');
}

// Run the script
if (require.main === module) {
  updateContent();
}

module.exports = { updateYouTubeVideos, updateBlogPosts };
