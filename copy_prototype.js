const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Admin\\Desktop\\fortune-crm.jsx', 'utf8');
fs.mkdirSync('src/app/prototype', { recursive: true });
fs.writeFileSync('src/app/prototype/page.jsx', "'use client';\n" + content);
