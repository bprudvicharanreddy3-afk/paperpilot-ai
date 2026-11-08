export type QType='mcq'|'multi'|'numeric';
export type Diff='easy'|'medium'|'hard';
export type Setter<T>=(v:T|((p:T)=>T))=>void;
export interface Question{id:string;type:QType;question:string;options?:string[];correct?:number[];numeric?:number;explanation:string;topic:string;difficulty:Diff;source:string}
export interface ExamConfig{marks:number;negative:number;minutes:number;difficulty:Diff}
export interface Exam{id:string;title:string;createdAt:number;docId?:string;docName:string;source:'ai'|'demo';questions:Question[];config:ExamConfig}
/** Answers: option indexes joined by comma ("0,2") for mcq/multi, or the typed number for numeric. */
export type Answers=Record<string,string>;
export interface Result{score:number;total:number;correct:number;wrong:number;unattempted:number;accuracy:number;topics:Record<string,{correct:number;total:number}>}
export interface Attempt{id:string;exam:Exam;answers:Answers;flagged:string[];timeTaken:number;submittedAt:number;result:Result;reco?:{text:string;ai:boolean}}
export interface Draft{exam:Exam;answers:Answers;flagged:string[];idx:number;startedAt:number}
export interface Doc{id:string;name:string;pages:number;text:string;truncated?:boolean;demo?:boolean;addedAt:number}
