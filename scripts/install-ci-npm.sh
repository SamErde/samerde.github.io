#!/usr/bin/env bash
set -euo pipefail

# Update the version and reviewed tarball digest together.
npm_version='12.2.0'
npm_sha512='66c2632a94e796649738b2d7894d710c2cc2e1696893823066687f6b0d8a52e5f2b54eeaeaa32ffdc513ecca1e49ff794a5c2ec3f9515d879f1b3182b291cf35'
archive="${RUNNER_TEMP:?RUNNER_TEMP must be set}/npm-${npm_version}.tgz"

curl --fail --silent --show-error --location --retry 3 \
  "https://registry.npmjs.org/npm/-/npm-${npm_version}.tgz" \
  --output "$archive"

printf '%s  %s\n' "$npm_sha512" "$archive" | sha512sum --check --status
npm install --global --ignore-scripts --no-audit --no-fund "$archive"
test "$(npm --version)" = "$npm_version"
