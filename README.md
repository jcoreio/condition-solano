# @jcoreio/condition-solano

[semantic-release](https://github.com/semantic-release/semantic-release) plugin to check [Solano CI](https://solanolabs.com/) environment before publishing.

[![Travis](https://img.shields.io/travis/jcoreio/condition-travis.svg)](https://travis-ci.org/jcoreio/condition-travis)
[![Codecov](https://img.shields.io/codecov/c/github/jcoreio/condition-solano.svg)](https://codecov.io/gh/jcoreio/condition-solano)
[![Greenkeeper badge](https://badges.greenkeeper.io/jcoreio/condition-solano.svg)](https://greenkeeper.io/)

Verify that `semantic-release` is running:
-   on Solano CI
-   on the right git branch and not on a PR build

### Options

| Option                | Description                                                          | Default                                                |
| --------------------- | -------------------------------------------------------------------- | ------------------------------------------------------ |
| `githubToken`         | **Required.** The Github token used to authenticate with Travis API. | `process.env.GH_TOKEN` or `process.env.GITHUB_TOKEN`   |
| `githubUrl`           | The GitHub Enterprise endpoint.                                      | `process.env.GH_URL` or `process.env.GITHUB_URL`       |
| `githubApiPathPrefix` | The GitHub Enterprise API prefix.                                    | `process.env.GH_PREFIX` or `process.env.GITHUB_PREFIX` |

## Configuration

The plugin is used by default by [semantic-release](https://github.com/semantic-release/semantic-release) so no specific configuration is required if `githubToken`, `githubUrl`, and `githubApiPathPrefix` are set via environment variable.

Always run `semantic-release` in a `post_build` hook so that it runs after all workers in the build matrix succeed.

```yml
nodejs:
  version: '8.9'

hooks:
  post_build: npm run semantic-release
```
