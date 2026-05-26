import { readFileSync } from 'fs';
const content = readFileSync('src/layouts/Layout.astro', 'utf-8');
let pos = 0; let idx = 0;
while ((pos = content.indexOf('<script', pos)) !== -1) {
    const openEnd = content.indexOf('>', pos);
    const tagContent = content.substring(pos + 7, openEnd);
    const closeStart = content.indexOf('</script>', pos);
    const scriptContent = content.substring(openEnd + 1, closeStart);
    if (tagContent.includes('is:inline') || tagContent.includes('src=') || tagContent.includes('defer')) {
        console.log(`Skip ${idx}: ${tagContent.substring(0, 60).trim()}...`);
    } else {
        console.log(`Script ${idx}: ${tagContent.substring(0, 60).trim()}, len=${scriptContent.length}`);
    }
    idx++;
    pos = closeStart + 9;
}
