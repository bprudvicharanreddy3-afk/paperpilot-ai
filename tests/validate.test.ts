import{describe,it,expect}from'vitest';
import{validateQuestion,validateQuestions}from'../lib/validate';
const base={question:'Q?',explanation:'E',topic:'T',source:'S',difficulty:'easy'};
describe('validateQuestion',()=>{
  it('accepts a valid MCQ',()=>expect(validateQuestion({...base,type:'mcq',options:['a','b'],correct:[1]})?.correct).toEqual([1]));
  it('accepts a scalar correct index',()=>expect(validateQuestion({...base,type:'mcq',options:['a','b'],correct:0})?.correct).toEqual([0]));
  it('rejects out-of-range answers',()=>expect(validateQuestion({...base,type:'mcq',options:['a','b'],correct:[2]})).toBeNull());
  it('rejects MCQ with several answers',()=>expect(validateQuestion({...base,type:'mcq',options:['a','b'],correct:[0,1]})).toBeNull());
  it('accepts multi with several answers',()=>expect(validateQuestion({...base,type:'multi',options:['a','b','c'],correct:[2,0]})?.correct).toEqual([0,2]));
  it('rejects duplicate options',()=>expect(validateQuestion({...base,type:'mcq',options:['a','a'],correct:[0]})).toBeNull());
  it('requires a finite numeric answer',()=>{expect(validateQuestion({...base,type:'numeric',numeric:'4.5'})?.numeric).toBe(4.5);expect(validateQuestion({...base,type:'numeric',numeric:'x'})).toBeNull();});
  it('requires explanation and source',()=>expect(validateQuestion({...base,source:'',type:'numeric',numeric:1})).toBeNull());
});
describe('validateQuestions',()=>{
  it('drops invalid items and renumbers',()=>{const r=validateQuestions({questions:[{bad:1},{...base,type:'numeric',numeric:2}]});expect(r).toHaveLength(1);expect(r[0].id).toBe('q1');});
  it('throws when nothing is valid',()=>expect(()=>validateQuestions([{}])).toThrow());
  it('throws on non-list',()=>expect(()=>validateQuestions('nope')).toThrow());
});
