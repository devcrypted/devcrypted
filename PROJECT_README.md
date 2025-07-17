# 🚀 GitHub Profile README Generator

A beautiful, automatically updating GitHub profile README that showcases your coding journey with real-time statistics, latest YouTube videos, and blog posts.

## ✨ Features

- 📊 **Real-time GitHub Statistics** - Stars, forks, commits, and more
- 🎥 **YouTube Integration** - Latest videos from your channel
- 📝 **Blog Posts** - Recent articles from your website
- 📈 **Coding Metrics** - Lines of code, contributions, streaks
- 🏆 **Achievement Badges** - Trophies and accomplishments
- 🔄 **Auto-Updates** - Refreshes daily at 6:00 AM UTC
- 🎨 **Beautiful Design** - Modern, responsive, and customizable

## 🎯 Preview

![GitHub Profile README Preview](https://via.placeholder.com/800x600/1a1a1a/ffffff?text=Your+Beautiful+GitHub+Profile)

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone https://github.com/devcrypted/github-profile.git
cd github-profile
npm install
```

### 2. Configure Your Profile
```bash
node setup.js
```

This will guide you through configuring:
- GitHub username
- YouTube channel ID
- Blog RSS feed
- Social media links
- Email and website

### 3. Deploy to GitHub
1. Create a new repository with **your GitHub username** as the repository name
2. Push this code to that repository
3. Enable GitHub Actions in repository settings
4. Watch your profile update automatically!

## 📁 Project Structure

```
github-profile/
├── 📄 README.md                    # Your profile README
├── ⚙️ config.json                  # Configuration file
├── 📦 package.json                 # Dependencies
├── 🔧 setup.js                     # Setup wizard
├── 🧪 test.js                      # Test script
├── 📚 DOCUMENTATION.md             # Detailed documentation
├── .github/workflows/
│   └── 🔄 update-readme.yml        # GitHub Actions workflow
└── scripts/
    ├── 📊 update-stats.js           # GitHub statistics
    └── 📝 update-content.js         # YouTube & blog content
```

## 🛠️ Configuration

### Basic Configuration
Edit `config.json` to customize your profile:

```json
{
  "github": {
    "username": "your-username"
  },
  "social": {
    "website": "https://your-website.com",
    "youtube": {
      "channelId": "YOUR_CHANNEL_ID"
    },
    "blog": {
      "rssUrl": "https://your-website.com/rss.xml"
    }
  }
}
```

### Advanced Configuration
- **Update Schedule**: Modify `.github/workflows/update-readme.yml`
- **Themes**: Change theme in README.md GitHub stats URLs
- **Content**: Customize sections in README.md
- **Statistics**: Add new metrics in `scripts/update-stats.js`

## 📊 Statistics Included

### Current Year Metrics
- 🔥 Total Lines of Code Written
- 📝 Commits Made
- 🏆 Repositories Created
- ⭐ Stars Received
- 🤝 Pull Requests
- 📊 Issues Resolved

### Historical Data
- 🎯 Total Contributions
- 📚 Active Coding Days
- 🚀 Longest Streak
- 📦 Most Used Languages

## 🎥 Content Sources

### YouTube Integration
- Automatically fetches latest videos from your channel
- Shows video titles, links, and publish dates
- Fallback handling for API failures

### Blog Integration
- Pulls recent posts from your RSS feed
- Compatible with most blogging platforms
- Manual fallback for custom setups

## 🔧 Testing

Run the test script to verify your setup:

```bash
node test.js
```

This will check:
- ✅ Required files exist
- ✅ Configuration is valid
- ✅ Scripts have proper syntax
- ✅ GitHub Actions workflow is configured
- ✅ README structure is correct

## 🎨 Customization

### Themes
Choose from multiple themes:
- `radical` (default)
- `dark`
- `github`
- `vue`
- `tokyonight`
- `dracula`
- `synthwave`

### Colors
Customize badge colors and styles in README.md:
```markdown
![Badge](https://img.shields.io/badge/Label-Message-Color)
```

### Sections
Add or remove sections by editing README.md and corresponding scripts.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `node test.js`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Inspired by amazing developers:
- [thmsgbrt](https://github.com/thmsgbrt/thmsgbrt)
- [mokkapps](https://github.com/mokkapps/mokkapps)

Built with:
- [GitHub Stats API](https://github.com/anuraghazra/github-readme-stats)
- [GitHub Trophies](https://github.com/ryo-ma/github-profile-trophy)
- [Streak Stats](https://github.com/DenverCoder1/github-readme-streak-stats)

## 📞 Support

Need help? 
- 📖 Read the [DOCUMENTATION.md](DOCUMENTATION.md)
- 🐛 Open an [issue](https://github.com/devcrypted/github-profile/issues)
- 💬 Contact: contact@devcrypted.com

---

<p align="center">
  Made with ❤️ by <a href="https://devcrypted.com">DevCrypted</a>
</p>

<p align="center">
  <a href="https://github.com/devcrypted/github-profile/stargazers">
    <img src="https://img.shields.io/github/stars/devcrypted/github-profile?style=social" alt="Stars">
  </a>
  <a href="https://github.com/devcrypted/github-profile/network/members">
    <img src="https://img.shields.io/github/forks/devcrypted/github-profile?style=social" alt="Forks">
  </a>
  <a href="https://github.com/devcrypted/github-profile/issues">
    <img src="https://img.shields.io/github/issues/devcrypted/github-profile" alt="Issues">
  </a>
  <a href="https://github.com/devcrypted/github-profile/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/devcrypted/github-profile" alt="License">
  </a>
</p>
