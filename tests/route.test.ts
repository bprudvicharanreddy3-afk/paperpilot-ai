import{describe,it,expect,vi,afterEach}from'vitest';
import{GET,POST}from'../app/api/ai/route';
const post=(b:object)=>POST(new Request('http://x/api/ai',{method:'POST',body:JSON.stringify(b)}));
const material='Photosynthesis converts light energy into chemical energy. '.repeat(10);
const good=[{type:'mcq',question:'Q?',options:['a','b'],correct:[0],explanation:'E',topic:'T',difficulty:'easy',source:'S'}];
const gem=(text:string)=>vi.fn().mockResolvedValue(new Response(JSON.stringify({candidates:[{content:{parts:[{text}]}}]})));
afterEach(()=>{vi.unstubAllGlobals();vi.unstubAllEnvs();});
describe('/api/ai',()=>{
  it('defaults to gemini-3.8-flash',async()=>{vi.stubEnv('GEMINI_API_KEY','k');vi.stubEnv('GEMINI_MODEL','');expect(await(await GET()).json()).toEqual({configured:true,model:'gemini-3.8-flash'});});
  it('sends the right request: new model, key in header only, no sampling params',async()=>{
    vi.stubEnv('GEMINI_API_KEY','secret');vi.stubEnv('GEMINI_MODEL','');
    const f=gem(JSON.stringify(good));vi.stubGlobal('fetch',f);
    const r=await post({action:'generate',text:material,config:{count:1,types:['mcq'],difficulty:'easy'}});
    expect(r.status).toBe(200);expect((await r.json()).questions).toHaveLength(1);
    const[url,init]=f.mock.calls[0];
    expect(url).toContain('/models/gemini-3.8-flash:generateContent');expect(url).not.toContain('secret');
    expect(init.headers['x-goog-api-key']).toBe('secret');
    expect(JSON.parse(init.body).generationConfig).toEqual({responseMimeType:'application/json'});
  });
  it('returns 503 without a key',async()=>{vi.stubEnv('GEMINI_API_KEY','');expect((await post({action:'recommend',title:'t',result:{}})).status).toBe(503);});
  it('rejects invalid AI output with 502',async()=>{vi.stubEnv('GEMINI_API_KEY','k');vi.stubGlobal('fetch',gem('[{"bad":1}]'));expect((await post({action:'generate',text:material,config:{types:['mcq']}})).status).toBe(502);});
  it('rejects too-short material',async()=>{vi.stubEnv('GEMINI_API_KEY','k');expect((await post({action:'generate',text:'short',config:{types:['mcq']}})).status).toBe(400);});
});
