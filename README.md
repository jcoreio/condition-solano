# @jcoreio/condition-solano

[semantic-release](https://github.com/semantic-release/semantic-release) plugin to check [Solano CI](https://solanolabs.com/) environment before publishing.

[![Travis](https://img.shields.io/travis/jcoreio/condition-solano.svg)](https://travis-ci.org/jcoreio/condition-solano)
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

If you are building with multiple versions of node, use Solano build `profiles` and check the `$SOLANO_PROFILE_NAME` in
the `post_build` hook to make sure you only run `semantic-release` on the desired version of node.

```yml
plan:
  - node_4
  - node_6
  - node_8
profiles:
  node_4:
    nodejs:
      version: '4.4'
  node_6:
    nodejs:
      version: '6.11.5'
  node_8:
    nodejs:
      version: '8.9.0'

hooks:
  post_build: |
    # Only publish if all tests have passed
    if [[ "passed" != "$TDDIUM_BUILD_STATUS" ]]; then
      echo "\$TDDIUM_BUILD_STATUS = $TDDIUM_BUILD_STATUS"
      echo "Will only publish on passed builds"
      exit
    fi
    # Only publish on 'node_8' profile
    if [[ "node_8" != "$SOLANO_PROFILE_NAME" ]]; then
      echo "Will only publish on 'node_8' profile"
      exit
    fi
    npm run semantic-release
