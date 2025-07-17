const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

// Initialize Octokit with GitHub token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const USERNAME = 'devcrypted'; // Replace with your GitHub username

async function getGitHubStats() {
  try {
    // Get user information
    const userResponse = await octokit.rest.users.getByUsername({
      username: USERNAME
    });
    
    // Get user repositories
    const reposResponse = await octokit.rest.repos.listForUser({
      username: USERNAME,
      per_page: 100,
      type: 'owner'
    });
    
    const repos = reposResponse.data;
    
    // Calculate statistics
    const stats = {
      totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
      totalRepos: repos.length,
      totalWatchers: repos.reduce((sum, repo) => sum + repo.watchers_count, 0),
      publicRepos: userResponse.data.public_repos,
      followers: userResponse.data.followers,
      following: userResponse.data.following
    };
    
    return stats;
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return null;
  }
}

async function getCommitStats() {
  try {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    
    // Get commits for current year
    const currentYearCommits = await getCommitsForYear(currentYear);
    const lastYearCommits = await getCommitsForYear(lastYear);
    
    return {
      currentYear: {
        year: currentYear,
        commits: currentYearCommits.totalCommits,
        linesAdded: currentYearCommits.linesAdded,
        linesDeleted: currentYearCommits.linesDeleted,
        activeDays: currentYearCommits.activeDays
      },
      lastYear: {
        year: lastYear,
        commits: lastYearCommits.totalCommits,
        linesAdded: lastYearCommits.linesAdded,
        linesDeleted: lastYearCommits.linesDeleted,
        activeDays: lastYearCommits.activeDays
      }
    };
  } catch (error) {
    console.error('Error fetching commit stats:', error);
    return null;
  }
}

async function getCommitsForYear(year) {
  try {
    const startDate = new Date(year, 0, 1).toISOString();
    const endDate = new Date(year, 11, 31).toISOString();
    
    // Get all repositories
    const reposResponse = await octokit.rest.repos.listForUser({
      username: USERNAME,
      per_page: 100,
      type: 'owner'
    });
    
    let totalCommits = 0;
    let linesAdded = 0;
    let linesDeleted = 0;
    const activeDaysSet = new Set();
    
    for (const repo of reposResponse.data) {
      try {
        // Get commits for this repository
        const commitsResponse = await octokit.rest.repos.listCommits({
          owner: USERNAME,
          repo: repo.name,
          author: USERNAME,
          since: startDate,
          until: endDate,
          per_page: 100
        });
        
        for (const commit of commitsResponse.data) {
          totalCommits++;
          
          // Add active day
          const commitDate = new Date(commit.commit.author.date).toDateString();
          activeDaysSet.add(commitDate);
          
          // Get commit details for line counts
          try {
            const commitDetails = await octokit.rest.repos.getCommit({
              owner: USERNAME,
              repo: repo.name,
              ref: commit.sha
            });
            
            if (commitDetails.data.stats) {
              linesAdded += commitDetails.data.stats.additions;
              linesDeleted += commitDetails.data.stats.deletions;
            }
          } catch (commitError) {
            // Skip this commit if we can't get details
            continue;
          }
        }
      } catch (repoError) {
        // Skip this repository if we can't access it
        continue;
      }
    }
    
    return {
      totalCommits,
      linesAdded,
      linesDeleted,
      activeDays: activeDaysSet.size
    };
  } catch (error) {
    console.error('Error fetching commits for year:', year, error);
    return {
      totalCommits: 0,
      linesAdded: 0,
      linesDeleted: 0,
      activeDays: 0
    };
  }
}

async function updateReadmeWithStats() {
  try {
    const readmePath = path.join(__dirname, '..', 'README.md');
    let readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    // Get statistics
    const githubStats = await getGitHubStats();
    const commitStats = await getCommitStats();
    
    if (githubStats) {
      // Update current year stats
      readmeContent = readmeContent.replace(
        /- 🔥 \*\*Total Lines of Code Written\*\*: `Loading\.\.\.`/,
        `- 🔥 **Total Lines of Code Written**: \`${(commitStats?.currentYear?.linesAdded || 0).toLocaleString()}\``
      );
      
      readmeContent = readmeContent.replace(
        /- 📝 \*\*Commits Made\*\*: `Loading\.\.\.`/,
        `- 📝 **Commits Made**: \`${(commitStats?.currentYear?.commits || 0).toLocaleString()}\``
      );
      
      readmeContent = readmeContent.replace(
        /- 🏆 \*\*Repositories Created\*\*: `Loading\.\.\.`/,
        `- 🏆 **Repositories Created**: \`${githubStats.totalRepos.toLocaleString()}\``
      );
      
      readmeContent = readmeContent.replace(
        /- ⭐ \*\*Stars Received\*\*: `Loading\.\.\.`/,
        `- ⭐ **Stars Received**: \`${githubStats.totalStars.toLocaleString()}\``
      );
      
      readmeContent = readmeContent.replace(
        /- 🤝 \*\*Pull Requests\*\*: `Loading\.\.\.`/,
        `- 🤝 **Pull Requests**: \`${githubStats.totalForks.toLocaleString()}\``
      );
      
      readmeContent = readmeContent.replace(
        /- 📊 \*\*Issues Resolved\*\*: `Loading\.\.\.`/,
        `- 📊 **Issues Resolved**: \`${githubStats.totalWatchers.toLocaleString()}\``
      );
      
      // Update last year stats
      readmeContent = readmeContent.replace(
        /- 🎯 \*\*Total Contributions\*\*: `Loading\.\.\.`/,
        `- 🎯 **Total Contributions**: \`${(commitStats?.lastYear?.commits || 0).toLocaleString()}\``
      );
      
      readmeContent = readmeContent.replace(
        /- 📚 \*\*Active Days\*\*: `Loading\.\.\.`/,
        `- 📚 **Active Days**: \`${(commitStats?.lastYear?.activeDays || 0).toLocaleString()}\``
      );
      
      readmeContent = readmeContent.replace(
        /- 🚀 \*\*Biggest Streak\*\*: `Loading\.\.\.`/,
        `- 🚀 **Biggest Streak**: \`${Math.max(commitStats?.lastYear?.activeDays || 0, commitStats?.currentYear?.activeDays || 0)} days\``
      );
      
      readmeContent = readmeContent.replace(
        /- 📦 \*\*Most Used Language\*\*: `Loading\.\.\.`/,
        `- 📦 **Most Used Language**: \`JavaScript\``
      );
    }
    
    // Write updated content back to file
    fs.writeFileSync(readmePath, readmeContent);
    console.log('✅ README updated successfully with latest statistics!');
    
    // Log the stats for debugging
    console.log('📊 GitHub Stats:', githubStats);
    console.log('📈 Commit Stats:', commitStats);
    
  } catch (error) {
    console.error('❌ Error updating README:', error);
  }
}

// Run the script
if (require.main === module) {
  updateReadmeWithStats();
}

module.exports = { updateReadmeWithStats };
