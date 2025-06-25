const fs = require('fs');
const path = require('path');

function removeBackups(dir) {
  const files = fs.readdirSync(dir);
  let count = 0;
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      count += removeBackups(filePath);
    } else if (file.endsWith('.backup')) {
      fs.unlinkSync(filePath);
      console.log(`Removed: ${filePath}`);
      count++;
    }
  }
  
  return count;
}

const publicDir = path.join(__dirname, '..', 'public');
console.log('Removing backup files...\n');
const removedCount = removeBackups(publicDir);
console.log(`\n✓ Removed ${removedCount} backup files.`); 