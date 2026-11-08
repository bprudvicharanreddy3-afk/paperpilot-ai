import{describe,it,expect}from'vitest';
import{scoreExam,isCorrect}from'../lib/scoring';
import{demoQuestions}from'../lib/demo';
import type{Exam}from'../lib/types';
const exam:Exam={id:'e',title:'t',createdAt:0,docName:'d',source:'demo',questions:demoQuestions(),config:{marks:4,negative:1,minutes:10,difficulty:'easy'}};
describe('isCorrect',()=>{
  it('matches mcq',()=>expect(isCorrect(exam.questions[0],'1')).toBe(true));
  it('requires exact multi-select set',()=>{expect(isCorrect(exam.questions[1],'2,0,1')).toBe(true);expect(isCorrect(exam.questions[1],'0,1')).toBe(false);});
  it('accepts numeric within 1%',()=>{expect(isCorrect(exam.questions[4],'4')).toBe(true);expect(isCorrect(exam.questions[4],'4.5')).toBe(false);});
  it('treats blank as incorrect',()=>expect(isCorrect(exam.questions[0],' ')).toBe(false));
});
describe('scoreExam',()=>{
  it('applies marks and negative marking',()=>{
    const r=scoreExam(exam,{q1:'1',q2:'0,1,2',q3:'3',q5:'4'});
    expect(r).toMatchObject({correct:3,wrong:1,unattempted:4,score:11,total:32,accuracy:75});
  });
  it('tracks topic performance',()=>{const r=scoreExam(exam,{q1:'1'});expect(r.topics.Photosynthesis).toEqual({correct:1,total:4});});
  it('handles an empty attempt',()=>expect(scoreExam(exam,{})).toMatchObject({score:0,accuracy:0,unattempted:8}));
});
