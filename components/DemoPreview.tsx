'use client';
import{useState}from'react';
import{demoQuestions}from'../lib/demo';
export default function DemoPreview(){
  const q=demoQuestions()[0],[s,setS]=useState<number|null>(null);
  return <div className="mx-auto max-w-xl rounded-2xl border border-line bg-card p-6 text-left shadow-2xl shadow-brand/10">
    <div className="mb-3 text-xs text-muted">Sample · {q.topic} · {q.difficulty}</div>
    <h3 className="mb-4 font-medium">{q.question}</h3>
    <div className="space-y-2">{q.options!.map((o,i)=>{const good=q.correct!.includes(i);return <button key={i} onClick={()=>setS(i)} className={`block w-full rounded-xl border px-4 py-2.5 text-left text-sm transition ${s===null?'border-line hover:bg-fg/5':good?'border-emerald-500 bg-emerald-500/10':s===i?'border-red-500 bg-red-500/10':'border-line opacity-60'}`}>{o}</button>;})}</div>
    {s!==null&&<p className="mt-4 text-sm text-muted">{q.explanation}</p>}
  </div>;
}
