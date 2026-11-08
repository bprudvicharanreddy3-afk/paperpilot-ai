import type{Question,QType,Diff}from'./types';
const TYPES:QType[]=['mcq','multi','numeric'],DIFFS:Diff[]=['easy','medium','hard'];
const str=(v:unknown)=>typeof v==='string'?v.trim():'';
/** Returns a clean Question or null if the raw AI item is malformed. */
export function validateQuestion(r:any,i=0):Question|null{
  if(!r||typeof r!=='object'||!TYPES.includes(r.type))return null;
  const question=str(r.question),explanation=str(r.explanation),topic=str(r.topic),source=str(r.source);
  if(!question||!explanation||!topic||!source)return null;
  const q:Question={id:`q${i+1}`,type:r.type,question,explanation,topic,source,difficulty:DIFFS.includes(r.difficulty)?r.difficulty:'medium'};
  if(q.type==='numeric'){const n=typeof r.numeric==='number'?r.numeric:parseFloat(r.numeric);if(!Number.isFinite(n))return null;q.numeric=n;return q;}
  const opts:string[]=Array.isArray(r.options)?r.options.map(str):[];
  if(opts.length<2||opts.length>6||opts.some(o=>!o)||new Set(opts).size!==opts.length)return null;
  const idx=[...new Set((Array.isArray(r.correct)?r.correct:[r.correct]).map(Number))] as number[];
  if(!idx.length||idx.some(n=>!Number.isInteger(n)||n<0||n>=opts.length)||(q.type==='mcq'&&idx.length!==1))return null;
  q.options=opts;q.correct=idx.sort((a,b)=>a-b);return q;
}
export function validateQuestions(raw:unknown):Question[]{
  const arr=Array.isArray(raw)?raw:(raw as any)?.questions;
  if(!Array.isArray(arr))throw new Error('AI response was not a list of questions');
  const out=arr.map((r,i)=>validateQuestion(r,i)).filter((q):q is Question=>!!q);
  if(!out.length)throw new Error('The AI returned no valid questions. Try again or use a longer excerpt.');
  return out.map((q,i)=>({...q,id:`q${i+1}`}));
}
