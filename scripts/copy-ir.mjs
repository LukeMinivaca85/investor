import { cp, mkdir } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'favicon.png', 'annuals', 'Lukintosh_Annual_Report.pdf', 'Lukintosh_Form_10K.pdf']) await cp(file, `dist/${file}`, { recursive: true });
