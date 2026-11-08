import type{Question,QType,Diff}from'./types';
export const DEMO_TEXT=`Photosynthesis. Photosynthesis is the process by which green plants convert light energy into chemical energy. It occurs in chloroplasts, where chlorophyll absorbs mainly red and blue light. The light reactions take place in the thylakoid membranes and produce ATP, NADPH and oxygen. The Calvin cycle takes place in the stroma and uses ATP and NADPH to fix carbon dioxide into glucose. The overall equation is 6CO2 + 6H2O + light -> C6H12O6 + 6O2.

Newton's Laws of Motion. The first law states that an object remains at rest or in uniform motion unless acted on by a net external force. The second law states that force equals mass times acceleration (F = ma). The third law states that for every action there is an equal and opposite reaction. Momentum is the product of mass and velocity, and it is conserved in a closed system. A 5 kg body acted on by a net force of 20 N has an acceleration of 4 m/s2.`;
type T=[QType,string,Diff,string,string[]|number,number[]|null,string,string];
const RAW:T[]=[
['mcq','Photosynthesis','easy','Where do the light reactions of photosynthesis take place?',['Stroma','Thylakoid membranes','Mitochondria','Cell wall'],[1],'Light reactions occur in the thylakoid membranes; the Calvin cycle occurs in the stroma.','The light reactions take place in the thylakoid membranes'],
['multi','Photosynthesis','medium','Which are products of the light reactions?',['ATP','NADPH','Oxygen','Glucose'],[0,1,2],'Glucose is made later, in the Calvin cycle.','produce ATP, NADPH and oxygen'],
['mcq','Photosynthesis','easy','Which pigment absorbs mainly red and blue light?',['Chlorophyll','Haemoglobin','Melanin','Keratin'],[0],'Chlorophyll in chloroplasts absorbs mainly red and blue light.','chlorophyll absorbs mainly red and blue light'],
['mcq','Photosynthesis','medium','What does the Calvin cycle fix into glucose?',['Carbon dioxide','Oxygen','Nitrogen','Hydrogen'],[0],'The Calvin cycle uses ATP and NADPH to fix CO2 into glucose.','uses ATP and NADPH to fix carbon dioxide into glucose'],
['numeric',"Newton's Laws",'medium','A 5 kg body is acted on by a net force of 20 N. What is its acceleration (m/s²)?',4,null,'a = F/m = 20/5 = 4 m/s².','A 5 kg body acted on by a net force of 20 N has an acceleration of 4 m/s2'],
['mcq',"Newton's Laws",'easy',"Which expression states Newton's second law?",['F = m/a','F = ma','F = m + a','F = a/m'],[1],'Force equals mass times acceleration.','force equals mass times acceleration (F = ma)'],
['multi',"Newton's Laws",'hard','Which statements agree with the material?',['An object stays in uniform motion unless a net force acts','Action and reaction are equal and opposite','Momentum is conserved in a closed system','Heavier objects always accelerate faster under the same force'],[0,1,2],'Under the same force, a heavier object accelerates less (F = ma).','Momentum is the product of mass and velocity, and it is conserved in a closed system'],
['numeric',"Newton's Laws",'medium','What is the momentum (kg·m/s) of a 3 kg body moving at 6 m/s?',18,null,'Momentum = mass × velocity = 3 × 6 = 18.','Momentum is the product of mass and velocity'],
];
export function demoQuestions(topics:string[]=[]):Question[]{
  let list=RAW;
  const f=RAW.filter(r=>topics.includes(r[1]));if(f.length>=3)list=f;
  return list.map(([type,topic,difficulty,question,o,correct,explanation,source],i)=>({id:`q${i+1}`,type,topic,difficulty,question,explanation,source,...(type==='numeric'?{numeric:o as number}:{options:o as string[],correct:correct!})}));
}
