import { DatabaseSync } from 'node:sqlite';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { buildChecklist, type FinancialRecord, type Source, type Evidence, type Criterion } from '../shared/domain';
export type Workspace={companyId:string;name:string;market:string|null;segment:string;domicile:string;venue:string;financialSourceId?:string;records:FinancialRecord[];sources:Source[];evidence:Evidence[];criteria:Criterion[];documents:{id:string;title:string;text:string;sourceId:string;createdAt:string}[];connections:{id:string;name:string;kind:string;status:string;permissions:string[];consentedAt:string}[]};
export class Store {
 db:DatabaseSync; key:Buffer;
 constructor(path:string,key:Buffer){this.key=key;if(path!==':memory:')mkdirSync(dirname(path),{recursive:true,mode:0o700});this.db=new DatabaseSync(path);this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT UNIQUE,password TEXT,company TEXT,role TEXT); CREATE TABLE IF NOT EXISTS sessions(hash TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id),csrf TEXT,expires INTEGER); CREATE TABLE IF NOT EXISTS workspaces(company TEXT PRIMARY KEY,payload TEXT); CREATE TABLE IF NOT EXISTS audit(id TEXT PRIMARY KEY,company TEXT,actor TEXT,action TEXT,detail TEXT,created_at TEXT);`);}
 encrypt(value:unknown){const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',this.key,iv),data=Buffer.concat([cipher.update(JSON.stringify(value)),cipher.final()]);return Buffer.concat([iv,cipher.getAuthTag(),data]).toString('base64');}
 decrypt<T>(value:string):T{const b=Buffer.from(value,'base64'),d=createDecipheriv('aes-256-gcm',this.key,b.subarray(0,12));d.setAuthTag(b.subarray(12,28));return JSON.parse(Buffer.concat([d.update(b.subarray(28)),d.final()]).toString());}
 get(company:string):Workspace{const row=this.db.prepare('SELECT payload FROM workspaces WHERE company=?').get(company) as {payload:string}|undefined;return row?this.decrypt(row.payload):{companyId:company,name:'Your company',market:null,segment:'',domicile:'',venue:'',records:[],sources:[],evidence:[],criteria:[],documents:[],connections:[]};}
 save(w:Workspace){this.db.prepare('INSERT INTO workspaces(company,payload) VALUES(?,?) ON CONFLICT(company) DO UPDATE SET payload=excluded.payload').run(w.companyId,this.encrypt(w));}
 setMarket(w:Workspace,id:string,segment:string,domicile:string,venue:string){w.market=id;w.segment=segment;w.domicile=domicile;w.venue=venue;w.criteria=buildChecklist(id);this.save(w);}
 audit(company:string,actor:string,action:string,detail:Record<string,unknown>={}){this.db.prepare('INSERT INTO audit VALUES(?,?,?,?,?,?)').run(crypto.randomUUID(),company,actor,action,this.encrypt(detail),new Date().toISOString());}
}
