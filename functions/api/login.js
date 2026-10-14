import { json, makeToken } from '../_lib/auth.js';
export async function onRequestPost({request,env}){
  if(!env.BP_APP_PASSWORD||!env.BP_SESSION_SECRET)return json({error:'Cloudflare environment secrets are not configured.'},500);
  let body;try{body=await request.json()}catch{return json({error:'Invalid JSON.'},400)}
  const password=String(body?.password||'');if(!password||password!==env.BP_APP_PASSWORD)return json({error:'Password সঠিক নয়।'},401);
  return json({token:await makeToken(env),expiresIn:604800});
}
