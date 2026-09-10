import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ACCOUNTS_SLASH_NAME,
  QUOTA_SLASH_NAME,
} from '../dist/tui/commands.js';

test('namespaces Codex-specific TUI commands', () => {
  assert.equal(ACCOUNTS_SLASH_NAME, 'codex-accounts');
  assert.equal(QUOTA_SLASH_NAME, 'codex-quota');
});
