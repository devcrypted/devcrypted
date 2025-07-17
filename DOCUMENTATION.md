# GitHub Profile README Documentation

## Overview

This repository contains an automated GitHub profile README that updates daily with:
- 📊 Real-time GitHub statistics
- 🎥 Latest YouTube videos from your channel
- 📝 Recent blog posts from your website
- 📈 Lines of code written, commits, and other metrics
- 🏆 Achievement badges and trophies

## Features

### ✨ Dynamic Content Updates
- **GitHub Statistics**: Stars, forks, repositories, followers
- **Coding Metrics**: Lines of code written, commits made, active days
- **YouTube Integration**: Latest videos from your channel
- **Blog Integration**: Recent posts from your website RSS feed
- **Auto-refresh**: Updates every day at 6:00 AM UTC

### 🎨 Visual Elements
- Beautiful badges and shields
- GitHub stats cards with themes
- Trophy showcase
- Streak statistics
- Profile view counter
- Typing animation header

### 🔧 Customization Options
- Easy configuration through `config.json`
- Multiple theme options
- Customizable update schedule
- Enable/disable specific features

## Setup Instructions

### 1. Repository Setup
1. Create a new repository with the same name as your GitHub username
2. Clone this repository to your local machine
3. Copy all files to your new repository

### 2. Configuration
Run the setup script to configure your profile:

```bash
node setup.js
```

This will ask for:
- GitHub username
- YouTube channel ID
- Blog RSS URL
- Website URL
- Email address
- Social media profiles

### 3. Manual Configuration (Optional)
Edit `config.json` to customize:

```json
{
  "github": {
    "username": "your-username",
    "repositoryName": "your-username"
  },
  "social": {
    "website": "https://your-website.com",
    "youtube": {
      "channelId": "YOUR_CHANNEL_ID",
      "channelUrl": "https://youtube.com/@your-channel"
    },
    "blog": {
      "rssUrl": "https://your-website.com/rss.xml",
      "blogUrl": "https://your-website.com/blog"
    }
  }
}
```

### 4. GitHub Actions Setup
1. Push the repository to GitHub
2. Go to your repository settings
3. Navigate to "Actions" → "General"
4. Enable GitHub Actions
5. Add required secrets (if any) in "Secrets and variables"

### 5. Required Secrets
Add these secrets in your repository settings:

- `GITHUB_TOKEN`: Automatically provided by GitHub Actions
- `YOUTUBE_API_KEY`: (Optional) For enhanced YouTube integration
- `BLOG_API_KEY`: (Optional) If your blog requires authentication

## File Structure

```
github-profile/
├── .github/
│   └── workflows/
│       └── update-readme.yml    # GitHub Actions workflow
├── scripts/
│   ├── update-stats.js          # GitHub statistics updater
│   └── update-content.js        # Content fetcher (YouTube/Blog)
├── README.md                    # Your profile README
├── config.json                  # Configuration file
├── package.json                 # Dependencies
└── setup.js                     # Setup script
```

## Customization Guide

### Changing Update Schedule
Edit `.github/workflows/update-readme.yml`:

```yaml
schedule:
  # Change this cron expression
  - cron: '0 6 * * *'  # 6:00 AM UTC daily
```

### Adding New Statistics
Edit `scripts/update-stats.js` to add new metrics:

```javascript
// Add your custom statistic
const customStat = await getCustomStatistic();

// Update README with new stat
readmeContent = readmeContent.replace(
  /- 🎯 \*\*Custom Metric\*\*: `Loading\.\.\.`/,
  `- 🎯 **Custom Metric**: \`${customStat}\``
);
```

### Changing Theme
Available themes for GitHub stats:
- `radical` (default)
- `dark`
- `github`
- `vue`
- `tokyonight`
- `onedark`
- `cobalt`
- `synthwave`
- `highcontrast`
- `dracula`

Update in README.md:
```markdown
![GitHub Stats](https://github-readme-stats.vercel.app/api?username=yourusername&theme=radical)
```

### Adding New Sections
1. Add the section to `README.md`
2. Create update logic in appropriate script
3. Add HTML comments for content replacement:
   ```markdown
   <!-- SECTION_NAME:START -->
   Default content
   <!-- SECTION_NAME:END -->
   ```

## Statistics Included

### Current Year
- 🔥 Total Lines of Code Written
- 📝 Commits Made
- 🏆 Repositories Created
- ⭐ Stars Received
- 🤝 Pull Requests
- 📊 Issues Resolved

### Previous Year
- 🎯 Total Contributions
- 📚 Active Days
- 🚀 Biggest Streak
- 📦 Most Used Language

## Content Sources

### YouTube Videos
- Fetched from YouTube RSS feed
- Updates with latest 5 videos
- Shows title, link, and publish date
- Fallback handling for API failures

### Blog Posts
- Fetched from your website's RSS feed
- Updates with latest 5 posts
- Shows title, link, and publish date
- Fallback to manual post list

### GitHub Statistics
- Real-time data from GitHub API
- Includes public and private repositories
- Comprehensive commit analysis
- Language usage statistics

## Troubleshooting

### Common Issues

1. **GitHub Actions not running**
   - Check if Actions are enabled in repository settings
   - Verify the workflow file syntax
   - Check for any error messages in Actions tab

2. **Statistics not updating**
   - Ensure GitHub token has proper permissions
   - Check API rate limits
   - Verify the username in configuration

3. **YouTube videos not showing**
   - Verify YouTube channel ID is correct
   - Check if RSS feed is accessible
   - Ensure proper XML parsing

4. **Blog posts not updating**
   - Verify RSS feed URL is correct and accessible
   - Check RSS feed format compatibility
   - Fallback posts will be used if RSS fails

### Debug Mode
Run scripts locally to debug:

```bash
# Test statistics update
node scripts/update-stats.js

# Test content update
node scripts/update-content.js
```

## Contributing

Feel free to contribute improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review GitHub Actions logs
3. Open an issue in the repository
4. Contact: contact@devcrypted.com

## Inspiration

This project was inspired by:
- [thmsgbrt/thmsgbrt](https://github.com/thmsgbrt/thmsgbrt)
- [mokkapps/mokkapps](https://github.com/mokkapps/mokkapps)

## Credits

- GitHub Stats API: [github-readme-stats](https://github.com/anuraghazra/github-readme-stats)
- GitHub Trophies: [github-profile-trophy](https://github.com/ryo-ma/github-profile-trophy)
- Streak Stats: [github-readme-streak-stats](https://github.com/DenverCoder1/github-readme-streak-stats)
- Blog Post Workflow: [blog-post-workflow](https://github.com/gautamkrishnar/blog-post-workflow)

---

Made with ❤️ by [DevCrypted](https://devcrypted.com)
