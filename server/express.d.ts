// Narrow types for the Express surface used by this service.
declare module 'express' {
 import type { IncomingMessage,ServerResponse,Server } from 'node:http';
 export interface Request extends IncomingMessage {body:any;cookies:Record<string,string>;params:Record<string,string>;path:string;secure:boolean;ip?:string;get(name:string):string|undefined;}
 export interface Response extends ServerResponse {status(code:number):Response;json(body:unknown):Response;cookie(name:string,value:string,options:Record<string,unknown>):Response;clearCookie(name:string,options:Record<string,unknown>):Response;}
 export type NextFunction=(error?:unknown)=>void;
 type Handler=(req:Request,res:Response,next:NextFunction)=>unknown;
 type ErrorHandler=(error:unknown,req:Request,res:Response,next:NextFunction)=>unknown;
 export interface Application {set(name:string,value:unknown):void;disable(name:string):void;use(...handlers:(string|Handler|ErrorHandler)[]):void;get(path:string,...handlers:Handler[]):void;post(path:string,...handlers:Handler[]):void;listen(port:number,host:string,callback?:()=>void):Server;}
 interface Express {():Application;json(options?:Record<string,unknown>):Handler;static(path:string,options?:Record<string,unknown>):Handler;}
 const express:Express;export default express;
}
