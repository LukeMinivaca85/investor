import { existsSync } from 'node:fs';
import { loadConfig } from './config';
import { createApp } from './app';
if(existsSync('.env'))process.loadEnvFile('.env');
const config=loadConfig(),{app,store}=createApp(config);
const port=Number(process.env.PORT??3001),host=process.env.HOST??'127.0.0.1';
const server=app.listen(port,host,()=>console.log(`Investor AI backend: http://${host}:${port} · company model access ${config.model.dataPolicy}`));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>{store.db.close();process.exit(0);}));
