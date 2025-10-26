// fix-titles.js (ES Module version)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'src', 'routes', 'connections', 'wordSets.js');

try {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Remove "YELLOW: ", "GREEN: ", "BLUE: ", "PURPLE: " from titles
  content = content.replace(
    /^( *)title: ['"](YELLOW|GREEN|BLUE|PURPLE): ?(.*)['"],?$/gm,
    '$1title: \'$3\','
  );

  fs.writeFileSync(filePath, content, 'utf-8');

  console.log('All puzzle titles cleaned! Color prefixes removed from 300+ puzzles.');
  console.log('Safe to delete this file: rm fix-titles.js');
} catch (err) {
  console.error('Error:', err.message);
}