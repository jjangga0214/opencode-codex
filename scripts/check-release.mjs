import { readFile } from 'node:fs/promises';

const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
const readme = await readFile('README.md', 'utf8');
const errors = [];

if (packageJson.private === true) {
  errors.push('remove `private: true` after choosing the npm package name');
}
if (packageJson.name !== '@jjangga0214/opencode-codex') {
  errors.push('set the npm package name to @jjangga0214/opencode-codex');
}
if (!packageJson.version || packageJson.version === '0.0.0') {
  errors.push('set a release version (the tag workflow does this automatically)');
}
for (const placeholder of ['<npm-package-name>', '<version>']) {
  if (readme.includes(placeholder)) {
    errors.push(`replace ${placeholder} in README.md`);
  }
}

if (errors.length > 0) {
  console.error('Release metadata is incomplete:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`${packageJson.name}@${packageJson.version} is ready to publish.`);
}
