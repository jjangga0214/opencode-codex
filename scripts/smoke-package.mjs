import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const temp = await mkdtemp(path.join(os.tmpdir(), 'opencode-codex-package-'));
const packageJson = JSON.parse(
  await readFile(path.join(root, 'package.json'), 'utf8'),
);

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? root,
    env: { ...process.env, ...options.env },
    encoding: 'utf8',
    stdio: options.stdio ?? 'pipe',
  });
  if (result.status !== 0) {
    throw new Error(
      [
        `${command} ${args.join(' ')} failed`,
        result.stdout,
        result.stderr,
      ]
        .filter(Boolean)
        .join('\n'),
    );
  }
  return result.stdout.trim();
}

const smoke = `
const name = process.env.PACKAGE_UNDER_TEST;
const serverModule = await import(name);
const hooks = await serverModule.default.server({});
if (!hooks.auth?.loader || !hooks['chat.headers']) {
  throw new Error('server entry did not initialize');
}

const tuiModule = await import(name + '/tui');
const commands = [];
const disposers = [];
const api = {
  slots: { register() {} },
  keymap: { registerLayer(layer) { commands.push(...layer.commands); } },
  route: { current: {} },
  kv: { get(_key, fallback) { return fallback; }, set() {} },
  event: { on() { return () => {}; } },
  lifecycle: { onDispose(fn) { disposers.push(fn); } },
};
await tuiModule.tui(api);
for (const dispose of disposers) dispose();

const slashNames = commands.map((command) => command.slashName);
for (const expected of ['codex-accounts', 'codex-quota']) {
  if (!slashNames.includes(expected)) {
    throw new Error('missing packaged command: ' + expected);
  }
}
console.log('packed server + TUI initialized: ' + slashNames.join(', '));
`;

try {
  const tarball = run('npm', ['pack', '--pack-destination', temp])
    .split('\n')
    .at(-1);
  if (!tarball) throw new Error('npm pack did not return a tarball name');

  run('npm', ['init', '--yes'], { cwd: temp });
  run('npm', ['install', path.join(temp, tarball)], { cwd: temp });
  const output = run(
    process.execPath,
    ['--input-type=module', '--eval', smoke],
    {
      cwd: temp,
      env: {
        PACKAGE_UNDER_TEST: packageJson.name,
        XDG_DATA_HOME: path.join(temp, 'data'),
      },
    },
  );
  console.log(output);
} finally {
  await rm(temp, { recursive: true, force: true });
}
