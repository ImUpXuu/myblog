import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
const content = readFileSync('src/layouts/Layout.astro', 'utf-8');
const start = content.indexOf('<script>', 7500);
const end = content.indexOf('</script>', start);
const code = content.substring(start + 8, end);
writeFileSync('tmp_script_virtual.mjs', code, 'utf-8');
console.log('Virtual module lines:', code.split('\n').length);

try {
  const result = execSync(
    'node_modules/.pnpm/@esbuild+win32-x64@0.25.10/node_modules/@esbuild/win32-x64/esbuild.exe tmp_script_virtual.mjs --target=esnext',
    { stdio: 'pipe', timeout: 15000, shell: true }
  );
  console.log('esbuild: OK');
} catch (e) {
  console.log('esbuild error:', e.stderr ? e.stderr.toString().substring(0, 500) : e.message);
}
