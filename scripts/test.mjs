import { build } from 'esbuild';
import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
const files=(await readdir('tests')).filter(f=>f.endsWith('.test.ts'));
await build({entryPoints:files.map(f=>`tests/${f}`),outdir:'.test-build',outExtension:{'.js':'.mjs'},bundle:true,platform:'node',format:'esm',packages:'external',target:'node22'});
const result=spawnSync(process.execPath,['--test',...files.map(f=>`.test-build/${f.replace('.ts','.mjs')}`)],{stdio:'inherit'});process.exit(result.status??1);
