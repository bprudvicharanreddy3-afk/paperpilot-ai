'use client';
import{useEffect,useRef,useState}from'react';
import{Upload,FileText,Trash2,Sparkles,Play,Target,Trophy,BookOpen,FlaskConical,Eye}from'lucide-react';
import type{Attempt,Doc,Exam,Diff,QType,Draft,Question,Setter}from'../lib/types';
import{Card,Btn,Spin,Stat,Empty,DemoBadge,Chart,fmt,pct}from'./ui';
import{extractPdf}from'../lib/pdf';
import{DEMO_TEXT,demoQuestions}from'../lib/demo';
import{analyze}from'../lib/adaptive';
import{api}from'../lib/api';
const when=(t:number)=>new Date(t).toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'});

export function Dashboard({attempts,docs,draft,go,onAdaptive,onOpen}:{attempts:Attempt[];docs:Doc[];draft:Draft|null;go:(v:any)=>void;onAdaptive:()=>void;onOpen:(a:Attempt)=>void}){
  const avg=attempts.length?Math.round(attempts.reduce((s,a)=>s+pct(a),0)/attempts.length):0;
  return <div className="space-y-6">
    <div><h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1><p className="text-muted">Turn study material into exams and track your progress.</p></div>
    {draft&&<Card className="flex items-center justify-between gap-3 !border-brand/60"><div><b>Exam in progress</b><div className="text-sm text-muted">{draft.exam.title}</div></div><Btn onClick={()=>go('exam')}><Play size={16}/>Resume</Btn></Card>}
    <div className="grid gap-4 sm:grid-cols-3"><Stat icon={<Trophy size={20}/>} label="Examinations taken" value={attempts.length}/><Stat icon={<Target size={20}/>} label="Average score" value={`${avg}%`}/><Stat icon={<BookOpen size={20}/>} label="Study materials" value={docs.length}/></div>
    <div className="flex flex-wrap gap-3"><Btn onClick={()=>go('upload')}><Upload size={16}/>Upload material</Btn><Btn onClick={()=>go('gen')}><Sparkles size={16}/>New exam</Btn><Btn v="ghost" disabled={!attempts.length} onClick={onAdaptive}><Target size={16}/>Practice weak areas</Btn></div>
    <div className="grid gap-4 lg:grid-cols-2">
      <Card><h2 className="mb-3 font-medium">Performance</h2><Chart data={[...attempts].reverse().map(pct)}/></Card>
      <Card><h2 className="mb-3 font-medium">Recent examinations</h2>{attempts.length?<div className="space-y-1">{attempts.slice(0,5).map(a=><button key={a.id} onClick={()=>onOpen(a)} className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm hover:bg-fg/5"><span className="flex items-center gap-2 truncate">{a.exam.title}<DemoBadge demo={a.exam.source==='demo'}/></span><b>{pct(a)}%</b></button>)}</div>:<p className="py-8 text-center text-sm text-muted">No examinations yet. Generate your first one!</p>}</Card>
    </div>
  </div>;
}

export function UploadView({docs,setDocs}:{docs:Doc[];setDocs:Setter<Doc[]>}){
  const[busy,setBusy]=useState(''),[err,setErr]=useState(''),[open,setOpen]=useState<string|null>(null),ref=useRef<HTMLInputElement>(null);
  const add=(d:Omit<Doc,'id'|'addedAt'>)=>setDocs(p=>[{...d,id:crypto.randomUUID(),addedAt:Date.now()},...p]);
  async function onFile(f?:File){
    if(!f)return;setErr('');
    if(!/\.pdf$/i.test(f.name))return setErr('Please choose a PDF file.');
    if(f.size>30*1024*1024)return setErr('That file is over 30 MB. Split it and try again.');
    try{setBusy('Extracting text…');const r=await extractPdf(f,(n,t)=>setBusy(`Extracting page ${n} of ${t}…`));add({name:f.name,pages:r.pages,text:r.text,truncated:r.truncated});}
    catch(e:any){setErr(e.message||'Could not read this PDF.');}finally{setBusy('');if(ref.current)ref.current.value='';}
  }
  return <div className="space-y-6"><h1 className="text-3xl font-semibold tracking-tight">Study materials</h1>
    <Card><div onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();onFile(e.dataTransfer.files[0]);}} className="grid place-items-center gap-3 rounded-xl border-2 border-dashed border-line p-10 text-center">
      <Upload className="text-brand"/><p className="text-sm text-muted">Drag a PDF here or choose a file (max 30 MB, text-based PDFs)</p>
      <input ref={ref} type="file" accept="application/pdf,.pdf" hidden onChange={e=>onFile(e.target.files?.[0])}/>
      <div className="flex gap-2"><Btn onClick={()=>ref.current?.click()} disabled={!!busy}>{busy?<><Spin/>{busy}</>:'Choose PDF'}</Btn><Btn v="ghost" onClick={()=>add({name:'Demo sample: Photosynthesis & Newton’s Laws',pages:1,text:DEMO_TEXT,demo:true})}><FlaskConical size={16}/>Load sample material</Btn></div>
      {err&&<p role="alert" className="text-sm text-red-500">{err}</p>}
    </div></Card>
    {docs.length?<div className="space-y-3">{docs.map(d=><Card key={d.id}><div className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><FileText className="shrink-0 text-brand"/><div className="min-w-0"><div className="truncate font-medium">{d.name}</div><div className="text-xs text-muted">{d.pages} page{d.pages>1&&'s'} · {d.text.length.toLocaleString()} characters{d.truncated&&' (truncated for size)'}</div></div></div>
      <div className="flex gap-2"><Btn v="ghost" onClick={()=>setOpen(open===d.id?null:d.id)}><Eye size={15}/>Preview</Btn><Btn v="ghost" aria-label="Delete" onClick={()=>setDocs(p=>p.filter(x=>x.id!==d.id))}><Trash2 size={15}/></Btn></div></div>
      {open===d.id&&<pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-fg/5 p-4 text-xs leading-relaxed">{d.text.slice(0,4000)}{d.text.length>4000&&'\n…'}</pre>}</Card>)}</div>
    :<Empty title="No materials yet" hint="Upload a PDF or load the sample material to get started."/>}
  </div>;
}

export function GenerateView({docs,attempts,adaptive,onStart,goUpload}:{docs:Doc[];attempts:Attempt[];adaptive:boolean;onStart:(e:Exam)=>void;goUpload:()=>void}){
  const an=analyze(attempts),last=attempts[0],ad=adaptive&&an.weak.length>0;
  const[useAd,setUseAd]=useState(ad),[docId,setDocId]=useState(()=>(ad&&docs.find(d=>d.id===last?.exam.docId)?.id)||docs[0]?.id||'');
  const[cfg,setCfg]=useState({title:ad?`Adaptive practice: ${an.weak.join(', ')}`:'',count:10,difficulty:(ad?an.difficulty:'medium') as Diff,types:['mcq','multi','numeric'] as QType[],marks:4,negative:1,minutes:20});
  const[key,setKey]=useState<boolean|null>(null),[busy,setBusy]=useState(false),[err,setErr]=useState('');
  useEffect(()=>{fetch('/api/ai').then(r=>r.json()).then(d=>setKey(!!d.configured)).catch(()=>setKey(false));},[]);
  const doc=docs.find(d=>d.id===docId);
  const make=(source:'ai'|'demo',questions:Question[],d?:Doc)=>onStart({id:crypto.randomUUID(),title:cfg.title.trim()||(source==='demo'?'Demo examination':'Untitled exam'),createdAt:Date.now(),docId:d?.id,docName:source==='demo'?'Demo sample':d?.name||'',source,questions,config:{marks:cfg.marks,negative:cfg.negative,minutes:cfg.minutes,difficulty:cfg.difficulty}});
  async function gen(){setErr('');setBusy(true);try{const r=await api('generate',{text:doc!.text,config:{count:cfg.count,difficulty:cfg.difficulty,types:cfg.types},weak:useAd?an.weak:[]});make('ai',r.questions,doc);}catch(e:any){setErr(e.message);}finally{setBusy(false);}}
  const num=(k:'count'|'marks'|'negative'|'minutes',label:string,min:number,max:number,step=1)=><label className="text-sm"><span className="mb-1 block text-muted">{label}</span><input type="number" min={min} max={max} step={step} value={cfg[k]} onChange={e=>setCfg({...cfg,[k]:Math.min(max,Math.max(min,+e.target.value||min))})} className="w-full rounded-xl border border-line bg-transparent px-3 py-2 outline-none focus:border-brand"/></label>;
  const tgl=(t:QType)=>setCfg({...cfg,types:cfg.types.includes(t)?cfg.types.filter(x=>x!==t):[...cfg.types,t]});
  return <div className="space-y-6"><h1 className="text-3xl font-semibold tracking-tight">New examination</h1>
    {key===false&&<Card className="!border-amber-500/50 text-sm"><b className="text-amber-500">Demo mode</b> — no <code>GEMINI_API_KEY</code> is configured, so live AI generation is unavailable. You can still take the pre-generated demo exam below (clearly labelled “Demo”).</Card>}
    {ad&&<Card className="flex flex-wrap items-center justify-between gap-2 !border-brand/50 text-sm"><span>Adaptive: focusing on <b>{an.weak.join(', ')}</b> at <b>{an.difficulty}</b> difficulty.</span><Btn v="ghost" onClick={()=>setUseAd(!useAd)}>{useAd?'Turn off':'Turn on'}</Btn></Card>}
    <Card className="space-y-5">
      <label className="block text-sm"><span className="mb-1 block text-muted">Examination title</span><input value={cfg.title} onChange={e=>setCfg({...cfg,title:e.target.value})} placeholder="e.g. Chapter 3 mock test" className="w-full rounded-xl border border-line bg-transparent px-3 py-2 outline-none focus:border-brand"/></label>
      <label className="block text-sm"><span className="mb-1 block text-muted">Study material</span>{docs.length?<select value={docId} onChange={e=>setDocId(e.target.value)} className="w-full rounded-xl border border-line bg-card px-3 py-2">{docs.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select>:<span className="text-muted">None yet. <button className="text-brand underline" onClick={goUpload}>Upload a PDF</button></span>}</label>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{num('count','Questions',1,30)}{num('marks','Marks / question',1,10)}{num('negative','Negative marking',0,10,0.25)}{num('minutes','Duration (min)',1,300)}</div>
      <div className="flex flex-wrap gap-6"><div><span className="mb-2 block text-sm text-muted">Difficulty</span><div className="flex gap-2">{(['easy','medium','hard'] as Diff[]).map(d=><Btn key={d} v={cfg.difficulty===d?'primary':'ghost'} className="capitalize" onClick={()=>setCfg({...cfg,difficulty:d})}>{d}</Btn>)}</div></div>
        <div><span className="mb-2 block text-sm text-muted">Question types</span><div className="flex gap-2">{([['mcq','MCQ'],['multi','Multiple-select'],['numeric','Numerical']] as [QType,string][]).map(([t,l])=><Btn key={t} v={cfg.types.includes(t)?'primary':'ghost'} onClick={()=>tgl(t)}>{l}</Btn>)}</div></div></div>
      {err&&<p role="alert" className="text-sm text-red-500">{err}</p>}
      <div className="flex flex-wrap gap-3"><Btn onClick={gen} disabled={busy||!doc||!cfg.types.length||key===false}>{busy?<><Spin/>Generating…</>:<><Sparkles size={16}/>Generate with AI</>}</Btn><Btn v="ghost" onClick={()=>make('demo',demoQuestions(useAd?an.weak:[]).slice(0,cfg.count))}><FlaskConical size={16}/>Use pre-generated demo exam</Btn></div>
    </Card></div>;
}

export function HistoryView({attempts,onOpen}:{attempts:Attempt[];onOpen:(a:Attempt)=>void}){
  return <div className="space-y-6"><h1 className="text-3xl font-semibold tracking-tight">History</h1>
    {attempts.length?<><Card><h2 className="mb-3 font-medium">Score trend</h2><Chart data={[...attempts].reverse().map(pct)}/></Card>
    <div className="space-y-3">{attempts.map(a=><Card key={a.id} className="flex items-center justify-between gap-3"><div className="min-w-0"><div className="flex items-center gap-2 font-medium"><span className="truncate">{a.exam.title}</span><DemoBadge demo={a.exam.source==='demo'}/></div><div className="text-xs text-muted">{when(a.submittedAt)} · {fmt(a.timeTaken)} · {a.result.score}/{a.result.total}</div></div><div className="flex items-center gap-3"><b className="text-lg">{pct(a)}%</b><Btn v="ghost" onClick={()=>onOpen(a)}>Review</Btn></div></Card>)}</div></>
    :<Empty title="No attempts yet" hint="Completed examinations appear here with scores and trends."/>}
  </div>;
}

export function SettingsView({theme,setTheme,onClearHistory,onClearDocs}:{theme:string;setTheme:(t:string)=>void;onClearHistory:()=>void;onClearDocs:()=>void}){
  const[st,setSt]=useState<{configured:boolean;model:string}|null>(null);
  useEffect(()=>{fetch('/api/ai').then(r=>r.json()).then(setSt).catch(()=>{});},[]);
  const sure=(m:string,f:()=>void)=>()=>{if(confirm(m))f();};
  return <div className="space-y-6"><h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
    <Card><h2 className="mb-3 font-medium">Theme</h2><div className="flex gap-2">{['dark','light'].map(t=><Btn key={t} v={theme===t?'primary':'ghost'} className="capitalize" onClick={()=>setTheme(t)}>{t}</Btn>)}</div></Card>
    <Card><h2 className="mb-3 font-medium">AI configuration</h2><p className="text-sm">Status: {st?st.configured?<b className="text-emerald-500">Gemini connected ({st.model})</b>:<b className="text-amber-500">No API key — demo mode</b>:'checking…'}</p>
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-muted"><li>Create a key at aistudio.google.com/apikey.</li><li>Copy <code>.env.example</code> to <code>.env.local</code> and set <code>GEMINI_API_KEY</code> (optionally <code>GEMINI_MODEL</code>).</li><li>Restart the server. On Vercel, add the variables in Project Settings → Environment Variables.</li></ol><p className="mt-3 text-xs text-muted">The key is read only by the server route and never reaches the browser.</p></Card>
    <Card><h2 className="mb-3 font-medium">Data</h2><p className="mb-3 text-sm text-muted">Everything is stored in this browser’s localStorage.</p><div className="flex flex-wrap gap-2"><Btn v="danger" onClick={sure('Delete all examination history?',onClearHistory)}>Clear examination history</Btn><Btn v="ghost" onClick={sure('Delete all uploaded materials?',onClearDocs)}>Clear materials</Btn></div></Card>
  </div>;
}
