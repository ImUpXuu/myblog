const fs = require('fs');
const content = fs.readFileSync('src/layouts/Layout.astro', 'utf-8');
const start = content.indexOf('<script>', 7800);
const end = content.indexOf('</script>', start);
let codeStart = start + 8;
const code = content.substring(codeStart, end).trim();
const lines = code.split('\n');

// Search for the heading render line
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Find the problematic template literal with </h
    if (line.includes('</h')) {
        console.log('Line ' + (i+1) + ': ' + line.substring(0, 250));
    }
}

console.log('---');
// Search for renderInlineMd start
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('function renderInlineMd')) {
        console.log('renderInlineMd starts at line ' + (i+1));
        // Show lines around it
        for (let j = i; j < Math.min(i + 5, lines.length); j++) {
            console.log('  ' + (j+1) + ': ' + lines[j].substring(0, 100));
        }
    }
    if (lines[i].includes('function renderFullMd')) {
        console.log('renderFullMd starts at line ' + (i+1));
    }
}

console.log('---');
// Search for all template literals with complex expressions
let matchCount = 0;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('${') && lines[i].includes('?')) {
        console.log('Template with ternary at line ' + (i+1) + ': ' + lines[i].substring(0, 180));
        matchCount++;
        if (matchCount > 5) break;
    }
}
