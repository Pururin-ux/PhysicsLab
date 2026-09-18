#!/usr/bin/env bash
# Восстанавливает headless-Chromium для скриншотов после очистки /tmp.
# Chromium ставится во временную директорию и не попадает ни в git, ни в снапшот.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)/../.."
WEB="$ROOT/apps/web"

if [ ! -x /tmp/chromium-extracted ]; then
  mkdir -p /tmp/shot-env && cd /tmp/shot-env
  [ -d node_modules/@sparticuz/chromium ] || npm install --silent @sparticuz/chromium@latest
  node -e '
const fs = require("fs"), zlib = require("zlib");
const bin = "/tmp/shot-env/node_modules/@sparticuz/chromium/bin";
fs.mkdirSync("/tmp/al2023/lib", { recursive: true });
fs.writeFileSync("/tmp/al2023.tar", zlib.brotliDecompressSync(fs.readFileSync(bin + "/al2023.tar.br")));
fs.writeFileSync("/tmp/chromium-extracted", zlib.brotliDecompressSync(fs.readFileSync(bin + "/chromium.br")));
fs.chmodSync("/tmp/chromium-extracted", 0o755);
'
  tar -xf /tmp/al2023.tar -C /tmp/al2023
fi

cat > /tmp/shot.mjs << 'EOF'
import { chromium } from '/home/user/PhysicsLab/apps/web/node_modules/playwright-core/index.mjs';

const url = process.argv[2];
const out = process.argv[3];
const width = parseInt(process.argv[4] || '1440');
const height = parseInt(process.argv[5] || '900');
const fullPage = process.argv[6] === 'full';
const waitMs = parseInt(process.argv[7] || '2500');

const browser = await chromium.launch({
  executablePath: '/tmp/chromium-extracted',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--hide-scrollbars'],
  env: { ...process.env, LD_LIBRARY_PATH: '/tmp/al2023/lib' },
});
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(e => console.error('goto:', e.message));
await page.waitForTimeout(waitMs);
await page.screenshot({ path: out, fullPage });
await browser.close();
console.log('saved', out);
EOF

mkdir -p /tmp/audit
echo "shot-stack ready: node /tmp/shot.mjs <url> <out.png> [w] [h] [full] [waitMs]"
