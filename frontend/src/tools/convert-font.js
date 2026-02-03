import fs from 'fs';
import path from 'path';

const fontDir = 'D:/Downloads/Be_Vietnam_Pro'; // Thư mục chứa các file .ttf
const outputDir = './src/assets/fonts';

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const files = fs.readdirSync(fontDir).filter(f => f.endsWith('.ttf'));

files.forEach(file => {
    const fontBuffer = fs.readFileSync(path.join(fontDir, file));
    const base64 = fontBuffer.toString('base64');
    const variableName = file.replace(/-/g, '').replace('.ttf', ''); // VD: BeVietnamProBlack
    
    const content = `export const ${variableName} = '${base64}';`;
    fs.writeFileSync(path.join(outputDir, `${file.replace('.ttf', '.js')}`), content);
    console.log(`✓ Converted: ${file}`);
});