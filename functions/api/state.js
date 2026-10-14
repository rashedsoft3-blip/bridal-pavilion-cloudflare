import { json, requireAuth } from '../_lib/auth.js';
export async function onRequestGet({request,env}){
  const denied=await requireAuth(request,env);if(denied)return denied;
  const row=await env.DB.prepare('SELECT state_json, revision, updated_at FROM app_state WHERE id = 1').first();
  if(!row)return json({state:null,revision:0,updatedAt:null});
  let state;try{state=JSON.parse(row.state_json)}catch{return json({error:'Stored state JSON is corrupted.'},500)}
  return json({state,revision:Number(row.revision),updatedAt:row.updated_at});
}
export async function onRequestPut({request,env}){
  const denied=await requireAuth(request,env);if(denied)return denied;
  let body;try{body=await request.json()}catch{return json({error:'Invalid JSON.'},400)}
  if(!body||!body.state||!Array.isArray(body.state.invoices))return json({error:'Invalid studio state.'},400);
  const raw=JSON.stringify(body.state);if(raw.length>2_000_000)return json({error:'Backup exceeds 2 MB.'},413);
  const expected=Number(body.revision);if(!Number.isInteger(expected)||expected<0)return json({error:'Invalid revision.'},400);
  const now=new Date().toISOString();
  const row=await env.DB.prepare('SELECT revision FROM app_state WHERE id = 1').first();
  if(!row){
    if(expected!==0)return json({error:'Cloud revision changed. Reload before syncing.'},409);
    const ins=await env.DB.prepare('INSERT OR IGNORE INTO app_state (id,state_json,revision,updated_at) VALUES (1,?,1,?)').bind(raw,now).run();
    if(!ins.meta?.changes)return json({error:'Cloud was initialized on another device. Reload and try again.'},409);
    return json({ok:true,revision:1,updatedAt:now});
  }
  if(Number(row.revision)!==expected)return json({error:'Cloud data changed on another device. Reload before syncing to avoid overwriting it.'},409);
  const upd=await env.DB.prepare('UPDATE app_state SET state_json=?, revision=revision+1, updated_at=? WHERE id=1 AND revision=?').bind(raw,now,expected).run();
  if(!upd.meta?.changes)return json({error:'Cloud data changed on another device. Reload before syncing.'},409);
  return json({ok:true,revision:expected+1,updatedAt:now});
}
