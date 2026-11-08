import type{Attempt,Diff,Result}from'./types';
/** Attempts must be newest-first. Aggregates the last 5 attempts by topic. */
export function analyze(attempts:Attempt[]){
  const t:Record<string,{c:number;n:number}>={};
  attempts.slice(0,5).forEach(a=>Object.entries(a.result.topics).forEach(([k,v])=>{const x=(t[k]??={c:0,n:0});x.c+=v.correct;x.n+=v.total;}));
  const stats=Object.entries(t).map(([topic,v])=>({topic,acc:v.c/v.n})).sort((a,b)=>a.acc-b.acc);
  const weak=stats.filter(s=>s.acc<0.7).slice(0,3).map(s=>s.topic);
  const last=attempts.slice(0,3);
  const avg=last.length?last.reduce((s,a)=>s+a.result.score/Math.max(a.result.total,1),0)/last.length:0.5;
  const difficulty:Diff=avg>0.8?'hard':avg>0.5?'medium':'easy';
  return{stats,weak,difficulty};
}
export function localReco(r:Result){
  const weak=Object.entries(r.topics).map(([k,v])=>({k,a:v.correct/v.total})).filter(x=>x.a<0.7).sort((x,y)=>x.a-y.a);
  const l=[weak.length?`• Revise: ${weak.map(x=>`${x.k} (${Math.round(x.a*100)}%)`).join(', ')}.`:'• Strong across all topics — try a harder exam.'];
  if(r.unattempted)l.push(`• ${r.unattempted} question(s) were left unattempted; practise pacing.`);
  if(r.wrong>r.correct)l.push('• Wrong answers cost negative marks; skip questions when unsure.');
  l.push('• Use "Practice weak areas" to generate a focused exam.');
  return l.join('\n');
}
