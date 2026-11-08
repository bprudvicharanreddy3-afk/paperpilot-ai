export async function extractPdf(file:File,onProgress?:(n:number,t:number)=>void){
  const pdfjs=await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc=new URL('pdfjs-dist/build/pdf.worker.min.mjs',import.meta.url).toString();
  let pdf;
  try{pdf=await pdfjs.getDocument({data:await file.arrayBuffer()}).promise;}
  catch(e:any){throw new Error(e?.name==='PasswordException'?'This PDF is password protected.':'Could not read this PDF — it may be corrupted.');}
  const MAX_PAGES=300,CAP=100_000;let text='',truncated=pdf.numPages>MAX_PAGES;
  for(let i=1;i<=Math.min(pdf.numPages,MAX_PAGES);i++){
    onProgress?.(i,Math.min(pdf.numPages,MAX_PAGES));
    const c=await(await pdf.getPage(i)).getTextContent();
    text+=c.items.map((x:any)=>x.str??'').join(' ')+'\n\n';
    if(text.length>CAP){text=text.slice(0,CAP);truncated=true;break;}
  }
  text=text.replace(/[ \t]+/g,' ').trim();
  if(text.length<50)throw new Error('No selectable text found. Scanned/image-only PDFs are not supported.');
  return{text,pages:pdf.numPages,truncated};
}
