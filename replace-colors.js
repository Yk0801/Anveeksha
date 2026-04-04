const fs = require('fs');
const path = require('path');
const dir = 'd:/Developer_Profile/anveeksha/src';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.css') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk(dir);
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content
    .replace(/#0D9488/g, '#F97316')  // teal -> orange
    .replace(/#0f766e/g, '#ea580c')  // hover teal -> hover orange
    // we also have occasional teal-50 etc. 
    .replace(/teal-50/g, 'orange-50')
    .replace(/teal-100/g, 'orange-100')
    .replace(/bg-teal/g, 'bg-orange')
    .replace(/text-teal/g, 'text-orange')
    .replace(/border-teal/g, 'border-orange')
    .replace(/--primary: 173 83% 31%/g, '--primary: 24 95% 53%') // HSL teal to orange
    .replace(/--ring: 173 83% 31%/g, '--ring: 24 95% 53%')
    .replace(/--sidebar-primary: 173 83% 31%/g, '--sidebar-primary: 24 95% 53%')
    .replace(/--sidebar-ring: 173 83% 31%/g, '--sidebar-ring: 24 95% 53%');
    
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated ' + file);
  }
});
