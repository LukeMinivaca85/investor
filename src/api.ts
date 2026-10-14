export let csrf='';
export function setCsrf(value:string){csrf=value;}
const apiBase=(import.meta.env.VITE_API_BASE_URL??'').replace(/\/$/,'');
export async function api<T=any>(path:string,body?:unknown):Promise<T>{const response=await fetch(`${apiBase}/api/${path}`,{method:body===undefined?'GET':'POST',credentials:'include',headers:body===undefined?{}:{'Content-Type':'application/json','X-CSRF-Token':csrf},body:body===undefined?undefined:JSON.stringify(body)});let data;try{data=await response.json();}catch{throw new Error('The Investor AI backend is unavailable. Start or configure the backend to use your company workspace.');}if(!response.ok)throw new Error(data.error??'The request could not be completed.');return data;}
