import type{Exam,Answers,Question,Result}from'./types';
export const attempted=(a?:string)=>!!a&&a.trim()!=='';
export function isCorrect(q:Question,a?:string):boolean{
  if(!attempted(a))return false;
  if(q.type==='numeric'){const n=parseFloat(a!);return Number.isFinite(n)&&Math.abs(n-q.numeric!)<=Math.max(1e-6,Math.abs(q.numeric!)*0.01);}
  return a!.split(',').filter(Boolean).map(Number).sort((x,y)=>x-y).join()===[...q.correct!].sort((x,y)=>x-y).join();
}
export function scoreExam(exam:Exam,answers:Answers):Result{
  let correct=0,wrong=0,unattempted=0;const topics:Result['topics']={};
  for(const q of exam.questions){
    const t=(topics[q.topic]??={correct:0,total:0});t.total++;
    if(!attempted(answers[q.id])){unattempted++;continue;}
    if(isCorrect(q,answers[q.id])){correct++;t.correct++;}else wrong++;
  }
  const{marks,negative}=exam.config;
  return{score:Math.round((correct*marks-wrong*negative)*100)/100,total:exam.questions.length*marks,correct,wrong,unattempted,accuracy:correct+wrong?Math.round(correct/(correct+wrong)*100):0,topics};
}
