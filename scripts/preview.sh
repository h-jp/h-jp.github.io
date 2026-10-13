#!/usr/bin/env bash
set -euo pipefail
HJP_SITE_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$HJP_SITE_ROOT"
if [[ -x /Users/hjp/.rbenv/versions/3.3.6/bin/ruby ]]; then
  export PATH="/Users/hjp/.rbenv/versions/3.3.6/bin:$PATH"
fi
bundle check
exec bundle exec jekyll serve --safe --host 127.0.0.1 --port "${HJP_PREVIEW_PORT:-4000}"
