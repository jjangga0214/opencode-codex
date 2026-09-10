# Changelog

## Unreleased

### Added

- Capacity-weighted pooled quota with configurable Pro 5x and Pro 20x tiers.
- `/codex-quota` for configuring effective Pro quota capacity.
- Per-session account selection with **All sessions**, **This session + new
  sessions**, and **This session only** scopes.
- Quota refreshes on startup, account changes, new sessions, new user messages,
  completed responses, and the five-minute fallback interval.

### Changed

- Renamed the account picker command from `/accounts` to `/codex-accounts` to
  avoid collisions in multi-provider OpenCode setups.
- Built TUI JSX against OpenTUI's Solid runtime so async state changes render
  reactively.
