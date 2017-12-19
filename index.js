const {parse} = require('url');
const GitHubApi = require('github');
const parseGithubUrl = require('parse-github-url');
const SemanticReleaseError = require('@semantic-release/error');
const resolveConfig = require('./lib/resolve-config');

module.exports = async function(pluginConfig, {options: {branch, repositoryUrl}}) {
  const {githubToken, githubUrl, githubApiPathPrefix} = resolveConfig(pluginConfig);
  if (!process.env.SOLANO_PROFILE_NAME) {
    throw new SemanticReleaseError(
      'semantic-release didn’t run on Solano CI and therefore a new version won’t be published.\nYou can customize this behavior using "verifyConditions" plugins: git.io/sr-plugins',
      'ENOSOLANO'
    );
  }

  if (process.env.TDDIUM_PR_ID) {
    throw new SemanticReleaseError(
      'This test run was triggered by a pull request and therefore a new version won’t be published.',
      'EPULLREQUEST'
    );
  }

  if (branch !== process.env.TDDIUM_CURRENT_BRANCH) {
    throw new SemanticReleaseError(
      `This test run was triggered on the branch ${
        process.env.TDDIUM_CURRENT_BRANCH
      }, while semantic-release is configured to only publish from ${branch}.\nYou can customize this behavior using the "branch" option: git.io/sr-options`,
      'EBRANCHMISMATCH'
    );
  }

  const {name: repo, owner} = parseGithubUrl(repositoryUrl);
  if (!owner || !repo) {
    throw new SemanticReleaseError(
      `The git repository URL ${repositoryUrl} is not a valid Github URL.`,
      'EINVALIDGITURL'
    );
  }

  let {port, protocol, hostname: host} = githubUrl ? parse(githubUrl) : {};
  protocol = (protocol || '').split(':')[0] || null;

  const github = new GitHubApi({port, protocol, host, pathPrefix: githubApiPathPrefix});
  github.authenticate({type: 'token', token: githubToken});

  await github.repos.get({owner, repo});
};
