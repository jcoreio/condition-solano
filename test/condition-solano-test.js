import test from 'ava';
import SemanticReleaseError from '@semantic-release/error';
import nock from 'nock';
import authenticate from './helpers/mock-github';

// Save the current process.env
const envBackup = Object.assign({}, process.env);

test.beforeEach(() => {
  // Delete env variables in case they are on the machine running the tests
  delete process.env.GH_TOKEN;
  delete process.env.GITHUB_TOKEN;
  delete process.env.GH_URL;
  delete process.env.GITHUB_URL;
  delete process.env.GH_PREFIX;
  delete process.env.GITHUB_PREFIX;
  delete process.env.SOLANO_PROFILE_NAME;
  delete process.env.TDDIUM_CURRENT_BRANCH;
  delete process.env.TDDIUM_PR_ID;
});

test.afterEach.always(() => {
  // Restore process.env
  process.env = envBackup;
  // Reset nock
  nock.cleanAll();
});

test.serial('Only runs on solano', async t => {
  const condition = require('../');

  const error = await t.throws(condition({}, {options: {}}));

  t.true(error instanceof SemanticReleaseError);
  t.is(error.code, 'ENOSOLANO');
});

test.serial('Not running on pull requests', async t => {
  const condition = require('../');
  process.env.SOLANO_PROFILE_NAME = 'default';
  process.env.TDDIUM_PR_ID = '105';

  const error = await t.throws(condition({}, {options: {}}));

  t.true(error instanceof SemanticReleaseError);
  t.is(error.code, 'EPULLREQUEST');
});

test.serial('Does not run on non-master branch by default', async t => {
  const condition = require('../');
  process.env.SOLANO_PROFILE_NAME = 'default';
  process.env.TDDIUM_CURRENT_BRANCH = 'notmaster';

  const error = await t.throws(condition({}, {options: {branch: 'master'}}));

  t.true(error instanceof SemanticReleaseError);
  t.is(error.code, 'EBRANCHMISMATCH');
});

test.serial('Does not run on master if branch configured as "foo"', async t => {
  const condition = require('../');
  process.env.SOLANO_PROFILE_NAME = 'default';
  process.env.TDDIUM_CURRENT_BRANCH = 'master';

  const error = await t.throws(condition({}, {options: {branch: 'foo'}}));

  t.true(error instanceof SemanticReleaseError);
  t.is(error.code, 'EBRANCHMISMATCH');
});

test.serial('Runs otherwise', async t => {
  const condition = require('../');
  process.env.SOLANO_PROFILE_NAME = 'default';
  process.env.TDDIUM_CURRENT_BRANCH = 'master';

  const owner = 'test_user';
  const repo = 'test_repo';
  const githubToken = 'github_token';
  const pro = false;
  const github = authenticate({githubToken})
    .get(`/repos/${owner}/${repo}`)
    .reply(200, {private: pro});

  const result = await condition(
    {githubToken},
    {options: {branch: 'master', repositoryUrl: `git+https://github.com/${owner}/${repo}.git`}}
  );

  t.falsy(result);
  t.true(github.isDone());
});
