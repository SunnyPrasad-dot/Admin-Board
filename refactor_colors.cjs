const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'pages');

const replacements = [
  { regex: /\bbg-indigo-600\b/g, replacement: 'bg-primary' },
  { regex: /\bhover:bg-indigo-700\b/g, replacement: 'hover:bg-primary/90' },
  { regex: /\btext-indigo-600\b/g, replacement: 'text-primary' },
  { regex: /\btext-indigo-700\b/g, replacement: 'text-primary' },
  { regex: /\btext-indigo-500\b/g, replacement: 'text-primary' },
  { regex: /\bbg-indigo-50\b/g, replacement: 'bg-primary/10' },
  { regex: /\bbg-indigo-100\b/g, replacement: 'bg-primary/20' },
  { regex: /\bbg-indigo-500\/10\b/g, replacement: 'bg-primary/10' },
  { regex: /\bbg-indigo-500\/20\b/g, replacement: 'bg-primary/20' },
  { regex: /\bborder-indigo-200\b/g, replacement: 'border-primary/20' },
  { regex: /\bborder-indigo-100\b/g, replacement: 'border-primary/10' },
  { regex: /\bhover:bg-indigo-50\/40\b/g, replacement: 'hover:bg-primary/10' },
  { regex: /\bring-indigo-200\b/g, replacement: 'ring-primary/20' },
  { regex: /\bhover:text-indigo-700\b/g, replacement: 'hover:text-primary/90' },
  { regex: /\bhover:text-indigo-600\b/g, replacement: 'hover:text-primary/90' },
  { regex: /\bhover:bg-indigo-500\/10\b/g, replacement: 'hover:bg-primary/10' },
  { regex: /\bhover:bg-indigo-500\/90\b/g, replacement: 'hover:bg-primary/90' },
  { regex: /\bring-indigo-500\/30\b/g, replacement: 'ring-primary/30' },
  { regex: /\bring-indigo-500\b/g, replacement: 'ring-primary' },
  { regex: /\bborder-indigo-400\b/g, replacement: 'border-primary/40' },
  { regex: /\bfrom-indigo-600\b/g, replacement: 'from-primary' },
  { regex: /\bfrom-indigo-500\/10\b/g, replacement: 'from-primary/10' },
  { regex: /\bto-indigo-400\b/g, replacement: 'to-primary/60' },
  { regex: /\btext-indigo-400\b/g, replacement: 'text-primary/70' },
  { regex: /\bbg-indigo-400\b/g, replacement: 'bg-primary' },
  { regex: /\bhover:bg-indigo-50\b/g, replacement: 'hover:bg-primary/10' },
  { regex: /\bvia-violet-500\/10\b/g, replacement: 'via-primary/5' },
  { regex: /\bvia-violet-500\b/g, replacement: 'via-primary/80' }
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

walkDir(directoryPath);
console.log('Done!');
