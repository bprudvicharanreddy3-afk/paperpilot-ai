'use client';
import{useEffect,useRef,useState}from'react';
import{Flag,ChevronLeft,ChevronRight,Clock,Send}from'lucide-react';
import type{Draft,Answers}from'../lib/types';
import{Btn,Card,fmt}from'./ui';
export default function Exam({d,onChange,onSubmit}:{d:Draft;onChange:(d:Draft)=>void;onSubmit:(a:Answers,f:string[],s:number)=>void}){
  const{exam}=d,q=exam.questions[d.idx],total=exam.config.minutes*60;
  const[now,setNow]=useState(Date.now()),[ask,setAsk]=useState(false),done=useRef(false);
  const left=Math.max(0,total-Math.floor((now-d.startedAt)/1000));
  const submit=()=>{if(done.current)return;done.current=true;onSubmit(d.answers,d.flagged,Math.min(total,Math.floor((Date.now()-d.startedAt)/1000)));};
  useEffect(()=>{const t=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(t);},[]);
  useEffect(()=>{if(left===0)submit();});
  const cur=d.answers[q.id]||'',sel=cur.split(',').filter(Boolean);
  const set=(a:string)=>onChange({...d,answers:{...d.answers,[q.id]:a}});
  const pick=(i:number)=>{const s=String(i);if(q.type==='mcq')return set(sel[0]===s?'':s);set((sel.includes(s)?sel.filter(x=>x!==s):[...sel,s]).join(','));};
  const go=(i:number)=>onChange({...d,idx:Math.min(Math.max(i,0),exam.questions.length-1)});
  const flag=d.flagged.includes(q.id);
  const has=(id:string)=>!!(d.answers[id]||'').trim();
  const answered=exam.questions.filter(x=>has(x.id)).length;
  return <div className="mx-auto max-w-6xl p-4 md:p-8">
    <div className="mb-6 flex items-center justify-between gap-3">
      <div><h1 className="text-xl font-semibold tracking-tight">{exam.title}</h1><p className="text-xs text-muted">{answered}/{exam.questions.length} answered · autosaved</p></div>
      <div className="flex items-center gap-3"><span className={`flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 font-mono text-sm ${left<60?'text-red-500':''}`}><Clock size={15}/>{fmt(left)}</span><Btn onClick={()=>setAsk(true)}><Send size={15}/>Submit</Btn></div>
    </div>
    <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
      <Card key={q.id}>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted"><span>Question {d.idx+1} of {exam.questions.length}</span>·<span>{q.topic}</span>·<span className="capitalize">{q.difficulty}</span>·<span>+{exam.config.marks}{exam.config.negative>0&&` / −${exam.config.negative}`}</span></div>
        <h2 className="mb-5 text-lg font-medium leading-snug">{q.question}</h2>
        {q.type==='numeric'
          ?<input inputMode="decimal" value={cur} onChange={e=>set(e.target.value)} placeholder="Type your numeric answer" className="w-full rounded-xl border border-line bg-transparent px-4 py-3 outline-none focus:border-brand"/>
          :<div className="space-y-2">{q.type==='multi'&&<p className="text-xs text-muted">Select all that apply</p>}{q.options!.map((o,i)=>{const on=sel.includes(String(i));return <button key={i} onClick={()=>pick(i)} className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${on?'border-brand bg-brand/10':'border-line hover:bg-fg/5'}`}><span className={`grid size-6 shrink-0 place-items-center ${q.type==='mcq'?'rounded-full':'rounded-md'} border text-xs ${on?'border-brand bg-brand text-white':'border-line text-muted'}`}>{String.fromCharCode(65+i)}</span>{o}</button>;})}</div>}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2"><Btn v="ghost" onClick={()=>go(d.idx-1)} disabled={d.idx===0}><ChevronLeft size={16}/>Previous</Btn><Btn v="ghost" onClick={()=>go(d.idx+1)} disabled={d.idx===exam.questions.length-1}>Next<ChevronRight size={16}/></Btn></div>
          <div className="flex gap-2"><Btn v="ghost" onClick={()=>set('')} disabled={!cur}>Clear</Btn><Btn v="ghost" onClick={()=>onChange({...d,flagged:flag?d.flagged.filter(x=>x!==q.id):[...d.flagged,q.id]})} className={flag?'!border-amber-500 text-amber-500':''}><Flag size={15}/>{flag?'Marked':'Mark for review'}</Btn></div>
        </div>
      </Card>
      <Card><h3 className="mb-3 text-sm font-medium">Questions</h3>
        <div className="grid grid-cols-5 gap-2">{exam.questions.map((x,i)=><button key={x.id} onClick={()=>go(i)} className={`aspect-square rounded-lg border text-sm ${i===d.idx?'ring-2 ring-brand':''} ${d.flagged.includes(x.id)?'border-amber-500 bg-amber-500/15 text-amber-500':has(x.id)?'border-emerald-500/50 bg-emerald-500/15 text-emerald-500':'border-line text-muted'}`}>{i+1}</button>)}</div>
        <p className="mt-4 text-xs text-muted">Green answered · Amber marked for review</p>
      </Card>
    </div>
    {ask&&<div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"><Card className="w-full max-w-sm"><h3 className="text-lg font-semibold">Submit exam?</h3><p className="mt-2 text-sm text-muted">{answered} of {exam.questions.length} answered{exam.questions.length-answered>0&&` — ${exam.questions.length-answered} unattempted`}{d.flagged.length>0&&`, ${d.flagged.length} marked for review`}. This cannot be undone.</p><div className="mt-5 flex justify-end gap-2"><Btn v="ghost" onClick={()=>setAsk(false)}>Keep working</Btn><Btn onClick={submit}>Submit</Btn></div></Card></div>}
  </div>;
}
