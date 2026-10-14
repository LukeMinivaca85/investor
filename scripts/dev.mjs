import { spawn } from 'node:child_process';
import { createServer } from 'vite';
await import('./build-server.mjs');
const api=spawn(process.execPath,['dist-server/index.mjs'],{stdio:'inherit'});
const vite=await createServer({server:{host:'127.0.0.1'}});await vite.listen();vite.printUrls();
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{api.kill(signal);await vite.close();process.exit(0);});
