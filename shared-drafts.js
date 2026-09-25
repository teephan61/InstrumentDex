import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import {supabaseConfig} from './supabase-config.js';

const playgroundEmails=Object.freeze({tester:'tester@instrumentdex.demo'});
export const supabase=createClient(supabaseConfig.url,supabaseConfig.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
function incorrectCredentials(){const error=new Error('Incorrect username or password.');error.kind='authentication';return error;}
const isInvalidRefreshSession=error=>['refresh_token_not_found','invalid_refresh_token','invalid_grant'].includes(error?.code)||(error?.status===400&&/refresh(?:_| )token|invalid grant/i.test(error?.message||''));

export async function clearLocalSession(){
 const {error}=await supabase.auth.signOut({scope:'local'});
 if(error)throw error;
}

export async function getTesterSession(){
 const {data,error}=await supabase.auth.getSession();
 if(error){
  if(isInvalidRefreshSession(error)){
   await clearLocalSession().catch(()=>{});
   return null;
  }
  throw error;
 }
 return data.session;
}
export async function signInTester(username,password){
 const email=playgroundEmails[String(username||'').trim().toLowerCase()];
 if(!email)throw incorrectCredentials();
 const {data,error}=await supabase.auth.signInWithPassword({email,password});
 if(error){
  if(error.status===400||error.status===401||error.code==='invalid_credentials')throw incorrectCredentials();
  throw error;
 }
 if(!data.session)throw incorrectCredentials();
 return data.session;
}
export async function signOut(){
 await clearLocalSession();
}
export async function loadSharedDrafts(){
 const {data,error}=await supabase.rpc('list_playground_instruments');
 if(error)throw error;
 return data||[];
}
export async function saveSharedDraft(payload){
 const {data,error}=await supabase.rpc('create_playground_instrument_draft',{payload});
 if(error)throw error;
 return data;
}
export function onAuthChange(callback){return supabase.auth.onAuthStateChange((event,session)=>callback(event,session));}
