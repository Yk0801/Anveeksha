const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src');

function walk(directory) {
  let results = [];
  const list = fs.readdirSync(directory);
  list.forEach(file => {
    file = path.join(directory, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(dir);

let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  let newContent = content
    // Hex code replacements
    .replace(/#F97316/gi, '#d4af37')  // Orange to Gold
    .replace(/#ea580c/gi, '#c49e29')  // Orange hover to Gold hover
    .replace(/#4F46E5/gi, '#0c2340')  // Indigo to Navy
    
    // Class suffix replacements
    .replace(/text-orange(-\w+)?/g, 'text-gold$1')
    .replace(/bg-orange(-\w+)?/g, 'bg-gold$1')
    .replace(/border-orange(-\w+)?/g, 'border-gold$1')
    
    .replace(/text-coral(-\w+)?/g, 'text-gold$1')
    .replace(/bg-coral(-\w+)?/g, 'bg-gold$1')
    .replace(/border-coral(-\w+)?/g, 'border-gold$1')
    
    .replace(/text-indigo(-\w+)?/g, 'text-navy$1')
    .replace(/bg-indigo(-\w+)?/g, 'bg-navy$1')
    .replace(/border-indigo(-\w+)?/g, 'border-navy$1')
    
    .replace(/text-teal(-\w+)?/g, 'text-navy$1')
    .replace(/bg-teal(-\w+)?/g, 'bg-navy$1')
    .replace(/border-teal(-\w+)?/g, 'border-navy$1')
    
    // Specific standard classes
    .replace(/orange-50/g, 'slate-50')
    .replace(/coral-50/g, 'slate-50')
    .replace(/teal-50/g, 'slate-50')
    .replace(/indigo-50/g, 'slate-50')
    
    // Gradient and shadows
    .replace(/from-orange(-[0-9]+)?/g, 'from-gold$1')
    .replace(/to-orange(-[0-9]+)?/g, 'to-gold$1')
    .replace(/from-indigo(-[0-9]+)?/g, 'from-navy$1')
    .replace(/to-indigo(-[0-9]+)?/g, 'to-navy$1')
    .replace(/from-teal(-[0-9]+)?/g, 'from-navy$1')
    .replace(/to-teal(-[0-9]+)?/g, 'to-navy$1')
    
    // Special utility
    .replace(/bg-orange-brand/g, 'bg-gold-brand')
    .replace(/bg-indigo-brand/g, 'bg-navy-brand')
    .replace(/text-indigo-brand/g, 'text-navy-brand');
    
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedFiles++;
    console.log('Updated: ' + path.relative(__dirname, file));
  }
});

console.log(`\nTheme replacement complete! Modified ${changedFiles} files.`);
