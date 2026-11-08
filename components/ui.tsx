import{Loader2,Inbox}from'lucide-react';
import type{ReactNode,ButtonHTMLAttributes}from'react';
import type{Attempt}from'../lib/types';
export const fmt=(s:number)=>`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
export const pct=(a:Attempt)=>Math.max(0,Math.round(a.result.score/Math.max(a.result.total,1)*100));
export const Card=({children,className=''}:{children:ReactNode;className?:string})=><div className={`fade rounded-2xl border border-line bg-card p-5 ${className}`}>{children}</div>;
export function Btn({v='primary',className='',...p}:ButtonHTMLAttributes<HTMLButtonElement>&{v?:'primary'|'ghost'|'danger'}){
  const c={primary:'bg-gradient-to-r from-brand to-brand2 text-white hover:opacity-90',ghost:'border border-line hover:bg-fg/5',danger:'bg-red-500 text-white hover:bg-red-600'}[v];
  return <button {...p} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50 ${c} ${className}`}/>;
}
export const Spin=()=><Loader2 className="animate-spin" size={16}/>;
export const Stat=({icon,label,value}:{icon:ReactNode;label:string;value:ReactNode})=><Card className="flex items-center gap-4"><div className="grid size-11 place-items-center rounded-xl bg-brand/15 text-brand">{icon}</div><div><div className="text-2xl font-semibold tracking-tight">{value}</div><div className="text-xs text-muted">{label}</div></div></Card>;
export const Empty=({title,hint,children}:{title:string;hint:string;children?:ReactNode})=><Card className="grid place-items-center gap-2 py-10 text-center"><Inbox className="text-muted"/><div className="font-medium">{title}</div><p className="max-w-sm text-sm text-muted">{hint}</p>{children}</Card>;
export const DemoBadge=({demo}:{demo:boolean})=><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${demo?'bg-amber-500/15 text-amber-500':'bg-emerald-500/15 text-emerald-500'}`}>{demo?'Demo':'AI'}</span>;
export const Bar=({v}:{v:number})=><div className="h-2 rounded-full bg-fg/10"><div className="h-2 rounded-full bg-gradient-to-r from-brand to-brand2 transition-all" style={{width:`${v}%`}}/></div>;
export function Chart({data}:{data:number[]}){
  if(data.length<2)return <p className="py-8 text-center text-sm text-muted">Complete at least two exams to see a trend.</p>;
  const pts=data.map((v,i)=>[i*(300/(data.length-1)),100-v]);
  return <svg viewBox="-8 -8 316 116" className="w-full"><polyline fill="none" stroke="var(--brand)" strokeWidth="2.5" points={pts.map(p=>p.join(',')).join(' ')}/>{pts.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="var(--brand2)"><title>{data[i]}%</title></circle>)}</svg>;
}
