import './globals.css';
import type{Metadata}from'next';
export const metadata:Metadata={title:'PaperPilot AI — Turn study material into exams',description:'Upload a PDF and practise with AI-generated, adaptive examinations.'};
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:`try{document.documentElement.dataset.theme=JSON.parse(localStorage.getItem('pp_theme')||'"dark"')}catch(e){}`}}/></head><body className="antialiased">{children}</body></html>;
}
