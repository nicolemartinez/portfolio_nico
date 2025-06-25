const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const QUALITY = 85;
const MAX_WIDTH = 2400;
const MAX_HEIGHT = 2400;

async function optimizeImage(inputPath, outputPath) {
  try {
    const metadata = await sharp(inputPath).metadata();
    console.log(`Processing: ${path.basename(inputPath)} (${metadata.width}x${metadata.height}, ${(fs.statSync(inputPath).size / 1024 / 1024).toFixed(2)}MB)`);
    
    let pipeline = sharp(inputPath);
    
    // Resize if larger than max dimensions
    if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
      pipeline = pipeline.resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Convert to appropriate format and compress
    if (metadata.format === 'png') {
      await pipeline
        .png({ quality: QUALITY, compressionLevel: 9 })
        .toFile(outputPath);
    } else if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
      await pipeline
        .jpeg({ quality: QUALITY, progressive: true })
        .toFile(outputPath);
    } else {
      // For other formats, convert to JPEG
      await pipeline
        .jpeg({ quality: QUALITY, progressive: true })
        .toFile(outputPath.replace(/\.[^.]+$/, '.jpg'));
    }
    
    const newSize = fs.statSync(outputPath).size;
    const reduction = ((1 - newSize / fs.statSync(inputPath).size) * 100).toFixed(1);
    console.log(`  ✓ Optimized: ${(newSize / 1024 / 1024).toFixed(2)}MB (${reduction}% reduction)`);
  } catch (error) {
    console.error(`  ✗ Error processing ${inputPath}:`, error.message);
  }
}

async function optimizeDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await optimizeDirectory(filePath);
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      const backupPath = filePath + '.backup';
      
      // Create backup if it doesn't exist
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(filePath, backupPath);
      }
      
      // Optimize the image
      const tempPath = filePath + '.temp';
      await optimizeImage(filePath, tempPath);
      
      // Replace original with optimized version
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);
      }
    }
  }
}

async function main() {
  console.log('Starting image optimization...\n');
  
  // Optimize all images in public directory
  const publicDir = path.join(__dirname, '..', 'public');
  await optimizeDirectory(publicDir);
  
  console.log('\n✓ Image optimization complete!');
  console.log('Note: Original images have been backed up with .backup extension');
}

main().catch(console.error); 