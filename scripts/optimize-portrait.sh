#!/usr/bin/env bash
# Regenerate display assets from the unchanged original portrait.
set -euo pipefail
site_root="$(cd "$(dirname "$0")/.." && pwd)"
portrait_source="$site_root/images/bio-photo-new.jpg"
portrait_temp="$(mktemp -d "${TMPDIR:-/tmp}/homepage-portrait.XXXXXX")"

for width in 320 680 1024; do
  cwebp -quiet -preset photo -q 84 -m 6 -sharp_yuv -metadata icc \
    -resize "$width" 0 "$portrait_source" \
    -o "$site_root/images/bio-photo-$width.webp"
done
for width in 680 1024; do
  sips -s format jpeg -s formatOptions 84 --resampleWidth "$width" \
    "$portrait_source" --out "$portrait_temp/portrait-$width.jpg" >/dev/null
  jpegtran -copy none -optimize -progressive \
    -outfile "$site_root/images/bio-photo-$width.jpg" "$portrait_temp/portrait-$width.jpg"
done
ffmpeg -hide_banner -loglevel error -y -i "$portrait_source" \
  -vf 'scale=64:64:force_original_aspect_ratio=decrease:flags=lanczos,pad=64:64:(ow-iw)/2:(oh-ih)/2:color=white' \
  -frames:v 1 -update 1 "$site_root/images/bio-photo-icon-64.png"
printf 'Portrait assets generated. JPEG intermediates: %s\n' "$portrait_temp"
