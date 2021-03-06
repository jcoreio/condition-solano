module.exports = ({githubToken, githubUrl, githubApiPathPrefix}) => ({
  githubToken: githubToken || process.env.GH_TOKEN || process.env.GITHUB_TOKEN,
  githubUrl: githubUrl || process.env.GH_URL || process.env.GITHUB_URL,
  githubApiPathPrefix: githubApiPathPrefix || process.env.GH_PREFIX || process.env.GITHUB_PREFIX,
});
