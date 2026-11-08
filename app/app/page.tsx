'use client';
import{useEffect,useState}from'react';
import Link from'next/link';
import{LayoutDashboard,FileUp,Sparkles,History as Hist,Settings as Cog,Plane}from'lucide-react';
import type{Attempt,Doc,Draft,Exam,Answers}from'../../lib/types';
import{useLS}from'../../lib/store';
import{scoreExam}from'../../lib/scoring';
import{Dashboard,UploadView,GenerateView,HistoryView,SettingsView}from'../../components/Views';
import Exam_ from'../../components/Exam';
import Results from'../../components/Results';
import{Spin}from'../../components/ui';
type View='dash'|'upload'|'gen'|'exam'|'result'|'history'|'settings';
const NAV=[['dash','Dashboard',LayoutDashboard],['upload','Materials',FileUp],['gen','New exam',Sparkles],['history','History',Hist],['settings','Settings',Cog]] as const;
export default function AppShell(){
  const[view,setView]=useState<View>('dash'),[docs,setDocs]=useLS<Doc[]>('pp_docs',[]),[attempts,setAttempts,ready]=useLS<Attempt[]>('pp_attempts',[]),[draft,setDraft]=useLS<Draft|null>('pp_draft',null),[theme,setTheme]=useLS('pp_theme','dark');
  const[viewing,setViewing]=useState<Attempt|null>(null),[adaptive,setAdaptive]=useState(false);
  useEffect(()=>{document.documentElement.dataset.theme=theme;},[theme]);
  const go=(v:View)=>{setAdaptive(false);setView(v);};
  const open=(a:Attempt)=>{setViewing(a);setView('result');};
  const start=(exam:Exam)=>{setDraft({exam,answers:{},flagged:[],idx:0,startedAt:Date.now()});setView('exam');};
  const finish=(answers:Answers,flagged:string[],sec:number)=>{
    if(!draft)return;
    const a:Attempt={id:crypto.randomUUID(),exam:draft.exam,answers,flagged,timeTaken:sec,submittedAt:Date.now(),result:scoreExam(draft.exam,answers)};
    setAttempts(p=>[a,...p]);setDraft(null);open(a);
  };
  if(!ready)return <div className="grid min-h-screen place-items-center"><Spin/></div>;
  if(view==='exam'&&draft)return <Exam_ d={draft} onChange={setDraft} onSubmit={finish}/>;
  return <div className="min-h-screen md:flex">
    <nav className="flex gap-1 overflow-x-auto border-b border-line p-3 md:sticky md:top-0 md:h-screen md:w-60 md:flex-col md:border-b-0 md:border-r md:p-4">
      <Link href="/" className="hidden items-center gap-2 px-3 pb-4 pt-2 font-semibold md:flex"><Plane className="text-brand" size={20}/>PaperPilot AI</Link>
      {NAV.map(([k,l,I])=><button key={k} onClick={()=>go(k)} className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${view===k||(k==='history'&&view==='result')?'bg-brand/15 text-brand':'text-muted hover:bg-fg/5'}`}><I size={17}/>{l}</button>)}
    </nav>
    <main className="mx-auto w-full max-w-5xl flex-1 p-4 md:p-8">
      {view==='dash'&&<Dashboard attempts={attempts} docs={docs} draft={draft} go={go} onAdaptive={()=>{setAdaptive(true);setView('gen');}} onOpen={open}/>}
      {view==='upload'&&<UploadView docs={docs} setDocs={setDocs}/>}
      {view==='gen'&&<GenerateView docs={docs} attempts={attempts} adaptive={adaptive} onStart={start} goUpload={()=>go('upload')}/>}
      {view==='history'&&<HistoryView attempts={attempts} onOpen={open}/>}
      {view==='settings'&&<SettingsView theme={theme} setTheme={setTheme} onClearHistory={()=>setAttempts([])} onClearDocs={()=>setDocs([])}/>}
      {view==='result'&&(viewing?<Results key={viewing.id} a={viewing} onBack={()=>go('history')} onAdaptive={()=>{setAdaptive(true);setView('gen');}} onReco={reco=>{setAttempts(p=>p.map(x=>x.id===viewing.id?{...x,reco}:x));setViewing(v=>v&&{...v,reco});}}/>:null)}
    </main>
  </div>;
}
