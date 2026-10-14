import { json, requireAuth } from '../_lib/auth.js';
export async function onRequestPost({request,env}){
  const denied=await requireAuth(request,env);if(denied)return denied;
  let body;try{body=await request.json()}catch{return json({error:'Invalid JSON.'},400)}
  const backup=body?.backup;if(!backup||!Array.isArray(backup.invoices))return json({error:'This is not a BRIDAL PAVILION JSON backup.'},400);
  const existing=await env.DB.prepare('SELECT revision FROM app_state WHERE id=1').first();
  if(existing)return json({error:'Cloud data already exists. Import is disabled to protect existing data.'},409);
  const state={version:4,build:backup.build||'BRIDAL PAVILION Cloudflare Edition',savedAt:backup.savedAt||backup.exportDate||backup.exportedAt||new Date().toISOString(),
    branding:backup.branding||{},invoices:backup.invoices||[],expenses:backup.expenses||[],teamPayments:backup.teamPayments||[],teamMembers:backup.teamMembers||[],
    deliveryRecords:backup.deliveryRecords||{},freelanceJobs:backup.freelanceJobs||[],freelanceCompanyBalances:backup.freelanceCompanyBalances||{},
    freelanceExpenses:backup.freelanceExpenses||[],personalExpenses:backup.personalExpenses||[]};
  const raw=JSON.stringify(state);if(raw.length>2_000_000)return json({error:'Backup exceeds 2 MB.'},413);
  const now=new Date().toISOString();const r=await env.DB.prepare('INSERT OR IGNORE INTO app_state (id,state_json,revision,updated_at) VALUES (1,?,1,?)').bind(raw,now).run();
  if(!r.meta?.changes)return json({error:'Cloud data was initialized simultaneously. No data was replaced.'},409);
  return json({ok:true,revision:1,invoiceCount:state.invoices.length,freelanceCount:state.freelanceJobs.length});
}
