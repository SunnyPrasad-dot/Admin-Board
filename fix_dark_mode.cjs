const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'pages');

const replacements = [
  { regex: /\bbg-white\b(?!\s*dark:bg-)/g, replacement: 'bg-white dark:bg-card' },
  { regex: /\btext-slate-900\b(?!\s*dark:text-)/g, replacement: 'text-slate-900 dark:text-foreground' },
  { regex: /\btext-slate-800\b(?!\s*dark:text-)/g, replacement: 'text-slate-800 dark:text-foreground' },
  { regex: /\btext-slate-700\b(?!\s*dark:text-)/g, replacement: 'text-slate-700 dark:text-muted-foreground' },
  { regex: /\btext-slate-600\b(?!\s*dark:text-)/g, replacement: 'text-slate-600 dark:text-muted-foreground' },
  { regex: /\btext-slate-500\b(?!\s*dark:text-)/g, replacement: 'text-slate-500 dark:text-muted-foreground' },
  { regex: /\btext-slate-400\b(?!\s*dark:text-)/g, replacement: 'text-slate-400 dark:text-muted-foreground/70' },
  { regex: /\bbg-slate-50\b(?!\s*dark:bg-)/g, replacement: 'bg-slate-50 dark:bg-slate-900/50' },
  { regex: /\bbg-slate-100\b(?!\s*dark:bg-)/g, replacement: 'bg-slate-100 dark:bg-slate-800' },
  { regex: /\bborder-slate-100\b(?!\s*dark:border-)/g, replacement: 'border-slate-100 dark:border-border' },
  { regex: /\bborder-slate-200\b(?!\s*dark:border-)/g, replacement: 'border-slate-200 dark:border-border/60' },
  { regex: /\bdivide-slate-50\b(?!\s*dark:divide-)/g, replacement: 'divide-slate-50 dark:divide-border/60' },
  { regex: /\bdivide-slate-100\b(?!\s*dark:divide-)/g, replacement: 'divide-slate-100 dark:divide-border' },
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
// Also update Login.jsx directly if it has bg-slate-50 root
let loginPath = path.join(directoryPath, 'Login.jsx');
if (fs.existsSync(loginPath)) {
  let loginContent = fs.readFileSync(loginPath, 'utf8');
  loginContent = loginContent.replace('min-h-screen flex bg-slate-50', 'min-h-screen flex bg-slate-50 dark:bg-background');
  loginContent = loginContent.replace('h-20 bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-slate-100', 'h-20 bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-slate-100 dark:to-slate-900');
  fs.writeFileSync(loginPath, loginContent, 'utf8');
}

console.log('Done!');
