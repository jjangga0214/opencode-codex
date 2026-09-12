# Releasing the fork

The npm package is `@jjangga0214/opencode-codex`. The initial prepared release
is `2.0.0`.

## One-time package setup

1. Authenticate to npm with the `jjangga0214` account and confirm that it owns
   the `@jjangga0214` scope.
2. Run `npm run release:check` and `npm run verify`.
3. Inspect the package with `npm pack --dry-run`, then run
   `npm run package:smoke`. The smoke test packs and installs the tarball in a
   temporary directory and initializes both the server and TUI entry points.

For the first publish, authenticate to npm with an account that owns the chosen
scope and run:

```sh
npm publish --access public
```

After the package exists, configure npm Trusted Publishing for the GitHub
repository `jjangga0214/opencode-codex` and workflow `publish.yml`. Later
releases are created by pushing a SemVer tag such as `v2.0.1`; the workflow
sets the package version from the tag, validates, tests, packs, and publishes
with provenance.

## Release checklist

- Update `CHANGELOG.md` and move the relevant entries out of **Unreleased**.
- Run `npm run verify`.
- Run `npm pack --dry-run` and inspect the file list.
- Run `npm run package:smoke`.
- Smoke-test the packed tarball with one OpenCode config directory only.
- Confirm `/codex-accounts`, `/codex-quota`, sidebar quota, and account scope
  selection in the TUI.
- Confirm the tag version is not already published.
- Push the tag and verify the GitHub Actions provenance publish completes.
