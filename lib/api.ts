export async function api(action:string,body:object){
  const r=await fetch('/api/ai',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action,...body})});
  const d=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(d.error||`Request failed (${r.status})`);
  return d;
}
