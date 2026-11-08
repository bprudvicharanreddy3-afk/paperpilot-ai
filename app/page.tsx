import Link from'next/link';
import{FileText,Sparkles,Timer,BarChart3,Target,FlaskConical,Plane,ArrowRight}from'lucide-react';
import DemoPreview from'../components/DemoPreview';
const steps=[['Upload','Drop in a PDF. Text is extracted privately in your browser.'],['Generate','Gemini writes exam questions grounded strictly in your material.'],['Practice & improve','Take timed exams, review solutions, and let adaptive AI target your weak topics.']];
const feats=[[FileText,'PDF extraction','Page counts, text preview and graceful handling of large or scanned files.'],[Sparkles,'AI exam generator','MCQ, multi-select and numerical questions, validated before you see them.'],[Timer,'Real exam interface','Timer, review marks, question palette and local autosave.'],[BarChart3,'Deep analytics','Topic-wise performance, trends and detailed solutions.'],[Target,'Adaptive practice','Weak topics and recent scores shape your next exam.'],[FlaskConical,'Demo mode','Explore everything without an API key.']] as const;
export default function Landing(){
  return <main className="relative overflow-hidden">
    <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[520px]"/>
    <header className="relative mx-auto flex max-w-6xl items-center justify-between p-5"><span className="flex items-center gap-2 font-semibold"><Plane className="text-brand"/>PaperPilot AI</span><Link href="/app" className="rounded-xl border border-line px-4 py-2 text-sm hover:bg-fg/5">Open app</Link></header>
    <section className="relative mx-auto max-w-4xl px-5 pb-20 pt-16 text-center fade">
      <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">Turn any study material into a <span className="grad">real exam</span></h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">Upload a PDF. PaperPilot AI writes a timed, graded examination from it, then adapts to your weak spots.</p>
      <Link href="/app" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand2 px-6 py-3 font-medium text-white hover:opacity-90">Get Started<ArrowRight size={18}/></Link>
    </section>
    <section className="relative px-5 pb-20"><p className="mb-4 text-center text-sm text-muted">Try a sample question</p><DemoPreview/></section>
    <section className="relative mx-auto max-w-6xl px-5 pb-20"><h2 className="mb-8 text-center text-3xl font-semibold tracking-tight">How it works</h2>
      <div className="grid gap-4 md:grid-cols-3">{steps.map(([t,d],i)=><div key={t} className="rounded-2xl border border-line bg-card p-6"><div className="grad text-4xl font-semibold">0{i+1}</div><h3 className="mt-3 font-medium">{t}</h3><p className="mt-1 text-sm text-muted">{d}</p></div>)}</div></section>
    <section className="relative mx-auto max-w-6xl px-5 pb-24"><h2 className="mb-8 text-center text-3xl font-semibold tracking-tight">Everything you need to practise</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{feats.map(([I,t,d])=><div key={t} className="rounded-2xl border border-line bg-card p-6 transition hover:-translate-y-1 hover:border-brand/60"><I className="text-brand"/><h3 className="mt-3 font-medium">{t}</h3><p className="mt-1 text-sm text-muted">{d}</p></div>)}</div></section>
    <footer className="border-t border-line py-8 text-center text-sm text-muted">PaperPilot AI</footer>
  </main>;
}
