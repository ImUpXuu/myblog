const fs = require('fs');
const content = fs.readFileSync('src/layouts/Layout.astro', 'utf-8');
const start = content.indexOf('<script>', 7800);
const end = content.indexOf('</script>', start);
let codeStart = start + 8;
const code = content.substring(codeStart, end).trim();
const lines = code.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<h') && lines[i].includes('\')) {
        console.log('Line ' + (i+1) + ': ' + lines[i].substring(0, 200));
    }
}
console.log('---');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('renderInlineMd') || lines[i].includes('renderFullMd')) {
        console.log('Line ' + (i+1) + ': ' + lines[i].substring(0, 120));
    }
}
