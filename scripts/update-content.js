const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config();

const parser = new Parser();

// Read configuration
const configPath = path.join(__dirname, '..', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

async function fetchWebPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        resolve(data);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function scrapeBlogPostsFromArchives() {
  try {
    console.log('📝 Scraping blog posts from devcrypted.com/archives...');
    
    const archivesUrl = 'https://devcrypted.com/archives/';
    const html = await fetchWebPage(archivesUrl);
    
    // Parse the HTML to extract blog posts
    const blogPosts = [];
    
    // Look for the specific pattern from the archives page
    const postPattern = /(\d{1,2}\s+\w+)\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    
    // Find all posts
    while ((match = postPattern.exec(html)) !== null) {
      const [, dateStr, title, url] = match;
      
      // Determine the year based on where we are in the HTML
      let year = '2024';
      const beforeMatch = html.substring(0, match.index);
      if (beforeMatch.lastIndexOf('2025') > beforeMatch.lastIndexOf('2024')) {
        year = '2025';
      }
      
      // Convert date format
      const date = new Date(`${dateStr} ${year}`);
      
      if (!isNaN(date.getTime())) {
        blogPosts.push({
          title: title.trim(),
          url: url.trim(),
          date: date.toLocaleDateString(),
          rawDate: date
        });
      }
    }
    
    // Sort by date (newest first) and take top 5
    blogPosts.sort((a, b) => b.rawDate - a.rawDate);
    
    console.log(`📰 Found ${blogPosts.length} blog posts`);
    
    return blogPosts.slice(0, 5);
  } catch (error) {
    console.error('❌ Error scraping blog posts:', error);
    return [];
  }
}

async function fetchYouTubeVideos() {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = config.social.youtube.channelId;
    
    if (!apiKey) {
      console.log('⚠️  No YouTube API key found in environment variables');
      console.log('💡 Please set YOUTUBE_API_KEY in your .env file');
      console.log('💡 Get your API key from: https://console.developers.google.com/');
      return null;
    }
    
    if (!channelId || channelId === "" || channelId === "UCYourChannelId" || channelId === "UCdevcrypted") {
      console.log('⚠️  No valid YouTube channel ID configured');
      console.log('💡 Update config.json with your actual YouTube channel ID');
      console.log('💡 You can find your channel ID at: https://www.youtube.com/account_advanced');
      return null;
    }
    
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=5&type=video`;
    
    console.log('🎥 Fetching latest YouTube videos using YouTube API...');
    
    return new Promise((resolve, reject) => {
      https.get(apiUrl, (response) => {
        let data = '';
        
        response.on('data', (chunk) => {
          data += chunk;
        });
        
        response.on('end', () => {
          try {
            const result = JSON.parse(data);
            
            if (result.error) {
              console.error('❌ YouTube API Error:', result.error.message);
              reject(new Error(result.error.message));
              return;
            }
            
            if (!result.items || result.items.length === 0) {
              console.log('⚠️  No videos found for this channel');
              resolve([]);
              return;
            }
            
            const videos = result.items.map(item => ({
              title: item.snippet.title,
              videoId: item.id.videoId,
              url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              publishedAt: item.snippet.publishedAt,
              thumbnail: item.snippet.thumbnails.medium.url
            }));
            
            console.log(`✅ Found ${videos.length} videos from YouTube API`);
            resolve(videos);
          } catch (parseError) {
            console.error('❌ Error parsing YouTube API response:', parseError);
            reject(parseError);
          }
        });
      }).on('error', (error) => {
        console.error('❌ HTTP Error fetching YouTube videos:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('❌ Error in fetchYouTubeVideos:', error);
    return null;
  }
}

async function updateYouTubeVideos() {
  try {
    // Try to fetch real videos using YouTube API
    const videos = await fetchYouTubeVideos();
    
    if (videos && videos.length > 0) {
      // Format the videos for README
      const videoList = videos.map(video => {
        const publishDate = new Date(video.publishedAt).toLocaleDateString();
        return `- [${video.title}](${video.url}) - ${publishDate}`;
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
        console.log('✅ YouTube videos updated successfully using YouTube API!');
      } else {
        console.log('❌ Could not find YouTube section markers in README');
      }
      
      return videos;
    } else {
      // Use fallback if API fails or no videos found
      console.log('🔄 Using fallback YouTube videos...');
      await updateYouTubeVideosFallback();
      return null;
    }
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
    // Fallback: Show placeholder videos indicating channel is coming soon
    const fallbackVideos = [
      {
        title: "Azure DevOps CI/CD Pipeline Deep Dive - Coming Soon!",
        link: "https://youtube.com/@devcrypted",
        date: "2025-01-15"
      },
      {
        title: "Kubernetes on Azure AKS - Complete Guide - Coming Soon!", 
        link: "https://youtube.com/@devcrypted",
        date: "2025-01-10"
      },
      {
        title: "Terraform Infrastructure as Code Best Practices - Coming Soon!",
        link: "https://youtube.com/@devcrypted",
        date: "2025-01-05"
      },
      {
        title: "DevSecOps Implementation with Azure Security - Coming Soon!",
        link: "https://youtube.com/@devcrypted",
        date: "2025-01-01"
      },
      {
        title: "GitOps with ArgoCD and Azure DevOps - Coming Soon!",
        link: "https://youtube.com/@devcrypted",
        date: "2024-12-28"
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
    console.log('📝 Fetching latest blog posts from devcrypted.com/archives...');
    
    // Scrape blog posts from the archives page
    const blogPosts = await scrapeBlogPostsFromArchives();
    
    if (blogPosts && blogPosts.length > 0) {
      // Format the posts for README
      const postList = blogPosts.map(post => {
        return `- [${post.title}](${post.url}) - ${post.date}`;
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
        console.log(`📰 Found ${blogPosts.length} blog posts`);
      } else {
        console.log('❌ Could not find blog section markers in README');
      }
      
      return blogPosts;
    } else {
      throw new Error('No blog posts found');
    }
  } catch (error) {
    console.error('❌ Error updating blog posts:', error);
    // Use fallback
    await updateBlogPostsManualFallback();
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
        title: "Unlock the Power of Winget: Master Windows Package Management",
        link: "https://devcrypted.com/everything-about-winget",
        date: "2025-01-23"
      },
      {
        title: "Windows 11 Setup - Clean & Minimal",
        link: "https://devcrypted.com/desktop-setup",
        date: "2024-12-22"
      },
      {
        title: "4 Ways To Create Azure Resources",
        link: "https://devcrypted.com/4-ways-to-create-azure-resource",
        date: "2024-12-22"
      },
      {
        title: "Azure Pricing Explained | Day 2 of Cloud Engineering",
        link: "https://devcrypted.com/azure-pricing-explained",
        date: "2024-11-27"
      },
      {
        title: "How Microsoft Azure is Structured? | Day 1 of Cloud Engineering",
        link: "https://devcrypted.com/introduction-to-azure-building-blocks",
        date: "2024-11-21"
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
  
  // Check if features are enabled
  if (config.features.enableYouTubeUpdates) {
    await updateYouTubeVideos();
  } else {
    console.log('⚠️  YouTube updates disabled in config');
  }
  
  if (config.features.enableBlogUpdates) {
    await updateBlogPosts();
  }
  
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
