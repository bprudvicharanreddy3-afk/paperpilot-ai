'use client';
import{useEffect}from'react';
import{CheckCircle2,XCircle,MinusCircle,Sparkles,ArrowLeft,Target}from'lucide-react';
import type{Attempt,Question}from'../lib/types';
import{isCorrect,attempted}from'../lib/scoring';
import{localReco}from'../lib/adaptive';
import{api}from'../lib/api';
import{Btn,Card,Stat,Bar,DemoBadge,Spin,fmt}from'./ui';
const show=(q:Question,a?:string)=>q.type==='numeric'?(a||'—'):((a||'').split(',').filter(Boolean).map(i=>`${String.fromCharCode(65+ +i)}. ${q.options![+i]}`).join('; ')||'—');
const right=(q:Question)=>q.type==='numeric'?String(q.numeric):q.correct!.map(i=>`${String.fromCharCode(65+i)}. ${q.options![i]}`).join('; ');
export default function Results({a,onReco,onAdaptive,onBack}:{a:Attempt;onReco:(r:{text:string;ai:boolean})=>void;onAdaptive:()=>void;onBack:()=>void}){
  const r=a.result,demo=a.exam.source==='demo';
  useEffect(()=>{
    if(a.reco)return;let off=false;
    (async()=>{try{if(demo)throw new Error('demo');const d=await api('recommend',{title:a.exam.title,result:r});if(!off)onReco({text:d.text,ai:true});}catch{if(!off)onReco({text:localReco(r),ai:false});}})();
    return()=>{off=true};
  },[a.id]);// eslint-disable-line
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><Btn v="ghost" onClick={onBack} className="mb-3"><ArrowLeft size={15}/>Back</Btn><h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">{a.exam.title}<DemoBadge demo={demo}/></h1>{demo&&<p className="text-sm text-amber-500">Demo result: scored from pre-generated sample questions, not live AI output.</p>}</div><Btn onClick={onAdaptive}><Target size={16}/>Practice weak areas</Btn></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Stat icon={<Sparkles size={20}/>} label="Total score" value={`${r.score} / ${r.total}`}/>
      <Stat icon={<CheckCircle2 size={20}/>} label="Correct" value={r.correct}/>
      <Stat icon={<XCircle size={20}/>} label="Incorrect" value={r.wrong}/>
      <Stat icon={<MinusCircle size={20}/>} label="Unattempted" value={r.unattempted}/>
      <Stat icon={<Target size={20}/>} label="Accuracy (of attempted)" value={`${r.accuracy}%`}/>
      <Stat icon={<Sparkles size={20}/>} label="Time taken" value={fmt(a.timeTaken)}/>
    </div>
    <div className="grid gap-4 lg:grid-cols-2">
      <Card><h2 className="mb-4 font-medium">Topic-wise performance</h2><div className="space-y-4">{Object.entries(r.topics).map(([t,v])=><div key={t}><div className="mb-1 flex justify-between text-sm"><span>{t}</span><span className="text-muted">{v.correct}/{v.total}</span></div><Bar v={Math.round(v.correct/v.total*100)}/></div>)}</div></Card>
      <Card><h2 className="mb-3 flex items-center gap-2 font-medium">Improvement recommendations{a.reco&&<span className="rounded-full bg-fg/10 px-2 py-0.5 text-[10px] uppercase text-muted">{a.reco.ai?'AI-generated':'Rule-based'}</span>}</h2>{a.reco?<p className="whitespace-pre-line text-sm leading-relaxed">{a.reco.text}</p>:<Spin/>}</Card>
    </div>
    <h2 className="text-lg font-semibold">Detailed solutions</h2>
    <div className="space-y-4">{a.exam.questions.map((q,i)=>{const ans=a.answers[q.id],ok=isCorrect(q,ans),at=attempted(ans);return <Card key={q.id}>
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted">{ok?<CheckCircle2 size={16} className="text-emerald-500"/>:at?<XCircle size={16} className="text-red-500"/>:<MinusCircle size={16}/>}Q{i+1}·{q.topic}·<span className="capitalize">{q.difficulty}</span>{a.flagged.includes(q.id)&&<span className="text-amber-500">· marked for review</span>}</div>
      <p className="font-medium">{q.question}</p>
      <p className="mt-3 text-sm"><span className="text-muted">Your answer: </span>{show(q,ans)}</p>
      <p className="text-sm"><span className="text-muted">Correct answer: </span><span className="text-emerald-500">{right(q)}</span></p>
      <p className="mt-3 text-sm leading-relaxed">{q.explanation}</p>
      <blockquote className="mt-3 border-l-2 border-brand pl-3 text-xs italic text-muted">{q.source}</blockquote>
    </Card>;})}</div>
  </div>;
}
