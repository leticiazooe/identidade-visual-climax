import React from "react";
import {AbsoluteFill,Img,interpolate,interpolateColors,spring,staticFile,useCurrentFrame,useVideoConfig} from "remotion";
import {TransitionSeries,linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {slide} from "@remotion/transitions/slide";
import manifest from "../film.config.json";
import {font} from "./fonts";

type Variant="wide"|"vertical"|"portrait"|"square";
export type FilmProps={variant:Variant};
type SceneProps={variant:Variant};
const C={navy:"#021F33",navy2:"#052D53",blue:"#0B5BA5",ice:"#8DE8F7",white:"#F1F2F2",mist:"#E9F3FC",ink:"#18222C"};
const sequenceFrames=manifest.scenes.map(s=>s.frames);

function useLayout(variant:Variant){
 const {width,height,fps}=useVideoConfig();
 const vertical=variant==="vertical"||variant==="portrait";
 const story=variant==="vertical";
 const side=story?85:variant==="portrait"?76:variant==="square"?70:115;
 const scale=variant==="wide"?1:variant==="vertical"?1.12:variant==="portrait"?.93:.79;
 return {width,height,fps,vertical,story,side,scale};
}
function reveal(frame:number,offset:number,fps:number){
 const local=Math.max(0,frame-offset);
 const entrance=spring({frame:local,fps,config:{damping:200,stiffness:85}});
 return {opacity:interpolate(frame,[offset,offset+22],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}),transform:"translateY("+((1-entrance)*42)+"px)"};
}
function Bg({light=false,accent=false}:{light?:boolean;accent?:boolean}){
 const frame=useCurrentFrame();const {width,height}=useVideoConfig();
 const drift=Math.sin(frame/64)*40;
 const background=light?"linear-gradient(150deg,#FFFFFF 3%,#F1F7FC 50%,#D9EEF8)":accent?"linear-gradient(130deg,#0B5BA5 0%,#074876 64%,#021F33)":"linear-gradient(132deg,#021F33,#052D53 58%,#0B5BA5)";
 return <AbsoluteFill style={{background,overflow:"hidden"}}>
  <div style={{position:"absolute",width:width*.8,height:width*.8,borderRadius:"100%",right:-width*.28+drift,top:-width*.37,background:"radial-gradient(circle,rgba(141,232,247,.2),transparent 65%)"}}/>
  {[0,1,2].map(i=><div key={i} style={{position:"absolute",width:width*(.32+i*.15),height:height*(.4+i*.13),borderRadius:"50%",border:"2px solid "+(light?"rgba(11,91,165,.11)":"rgba(141,232,247,.10)"),right:-width*(.08+i*.05)+drift*(.35+i*.2),top:height*(.13+i*.17),transform:"rotate(-16deg)"}}/>)}
  <div style={{position:"absolute",inset:0,opacity:.15,backgroundImage:"linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)",backgroundSize:"90px 90px"}}/>
 </AbsoluteFill>;
}
function Header({light=false}:{light?:boolean}){
 const frame=useCurrentFrame(); const {side,scale}=useLayout("wide");
 return <div style={{position:"absolute",top:65,left:75,right:75,display:"flex",alignItems:"center",justifyContent:"space-between",zIndex:15,opacity:interpolate(frame,[0,18],[0,1],{extrapolateRight:"clamp"})}}>
  <Img src={staticFile("assets/logos/"+(light?"ESCRITA AZUL PNG.png":"ESCRITA BRANCA PNG.png"))} style={{width:300,maxHeight:95,objectFit:"contain",objectPosition:"left"}}/>
  <div style={{fontFamily:font.body,color:light?C.blue:C.ice,fontSize:16,fontWeight:800,letterSpacing:3}}>CLIMAX / HVAC</div>
 </div>;
}
function Emblem({size=340,blue=false}:{size?:number;blue?:boolean}){
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 const value=spring({frame,fps,config:{damping:200,stiffness:65}});
 const rotation=Math.sin(frame/70)*4;
 return <div style={{width:size,height:size,display:"grid",placeItems:"center",border:"2px solid "+(blue?"rgba(11,91,165,.2)":"rgba(141,232,247,.24)"),borderRadius:"50%",transform:"scale("+(0.90+.1*value)+") rotate("+rotation+"deg)",boxShadow:"0 0 100px rgba(141,232,247,.07)"}}>
  <div style={{width:"76%",height:"76%",borderRadius:"50%",border:"1px dashed "+(blue?"#7DBFE0":"#8DE8F7"),display:"grid",placeItems:"center"}}>
   <span style={{fontFamily:font.display,fontSize:size*.31,lineHeight:1,color:blue?C.blue:C.white,fontWeight:800}}>C<span style={{color:C.ice}}>·</span></span>
  </div>
 </div>;
}
function Airflow({amount=8,bright=false}:{amount?:number;bright?:boolean}){
 const frame=useCurrentFrame(),{width,height}=useVideoConfig();
 return <AbsoluteFill style={{pointerEvents:"none",zIndex:3}}>
 {Array.from({length:amount},(_,i)=>{
  const phase=(frame*2.4+i*90)%(width+450);
  const y=height*(.30+(i%5)*.10)+Math.sin(frame/24+i)*30;
  return <div key={i} style={{position:"absolute",top:y,left:phase-220,width:240,height:60,borderTop:"3px solid "+(bright?"rgba(11,91,165,.27)":"rgba(141,232,247,.33)"),borderRadius:"50%",transform:"rotate("+(Math.sin(frame/38+i)*12)+"deg)",opacity:Math.sin(Math.PI*phase/(width+450))*.8}}/>;
 })}
 </AbsoluteFill>;
}
function AC({size=620}:{size?:number}){
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 const appear=spring({frame,fps,config:{damping:200,stiffness:70}});
 return <div style={{width:size,height:size*.40,position:"relative",transform:"translateY("+((1-appear)*65)+"px)",filter:"drop-shadow(0 38px 45px rgba(1,20,32,.27))"}}>
 <svg width="100%" height="100%" viewBox="0 0 700 300" fill="none">
  <rect x="30" y="25" width="640" height="196" rx="36" fill="#F8FCFF" stroke="#D8E6EF" strokeWidth="6"/>
  <path d="M65 55 H635" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round"/>
  <rect x="85" y="177" width="530" height="19" rx="9" fill="#D7E7F1"/>
  <rect x="492" y="71" width="117" height="13" rx="6" fill="#A6D9EA" opacity=".60"/>
  <path d="M85 221 Q350 270 615 221" stroke="#E4F2FA" strokeWidth="18" strokeLinecap="round"/>
  <circle cx="102" cy="83" r="9" fill="#0B5BA5"/>
 </svg></div>;
}
function Kinetic({lines,light=false,offset=0,size=92,align="left"}:{lines:string[];light?:boolean;offset?:number;size?:number;align?:"left"|"center"}){
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 return <div style={{textAlign:align,fontFamily:font.display,fontWeight:800,lineHeight:.93,letterSpacing:-2.5}}>
 {lines.map((line,i)=><div key={line+i} style={{...reveal(frame,offset+i*12,fps),fontSize:size,color:light?C.navy2:i===lines.length-1?C.ice:C.white,textTransform:"uppercase",marginBottom:12}}>{line}</div>)}
 </div>;
}
function SceneShell({variant,children,light=false,accent=false}:{variant:Variant;children:React.ReactNode;light?:boolean;accent?:boolean}){
 const l=useLayout(variant);
 return <AbsoluteFill style={{overflow:"hidden"}}><Bg light={light} accent={accent}/>
 <div style={{position:"absolute",top:l.story?240:l.vertical?80:50,left:l.side,right:l.side,bottom:l.story?240:50,zIndex:5}}>{children}</div>
 <div style={{position:"absolute",bottom:l.story?160:40,left:l.side,right:l.side,display:"flex",justifyContent:"space-between",zIndex:10,color:light?C.navy2:C.ice,fontFamily:font.body,fontWeight:700,fontSize:l.vertical?23:16,letterSpacing:1.3}}>
 <span>CLIMAX REFRIGERAÇÃO</span><span>CONFORTO · CLIMATIZAÇÃO</span></div>
 </AbsoluteFill>;
}
function Signature({variant}:SceneProps){
 const frame=useCurrentFrame();const l=useLayout(variant);
 const grow=interpolate(frame,[0,130],[.88,1.06],{extrapolateRight:"clamp"});
 return <SceneShell variant={variant}><Airflow amount={6}/>
 <div style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",textAlign:"center",gap:55}}>
 <div style={{transform:"scale("+grow+")"}}><Emblem size={l.vertical?440:340}/></div>
 <div style={reveal(frame,25,l.fps)}><Img src={staticFile("assets/logos/ESCRITA BRANCA PNG.png")} style={{width:l.vertical?760:650,maxWidth:"100%",objectFit:"contain"}}/></div>
 <div style={{...reveal(frame,70,l.fps),font: "600 "+(l.vertical?31:25)+"px "+font.body,color:"#CFEAF6",letterSpacing:3}}>O CONFORTO TEM UMA NOVA PRESENÇA.</div>
 </div></SceneShell>;
}
function Problem({variant}:SceneProps){
 const frame=useCurrentFrame(),l=useLayout(variant);
 return <SceneShell variant={variant} accent><Airflow amount={5}/>
 <div style={{height:"100%",display:"flex",flexDirection:"column",justifyContent:"center",gap:45}}>
  <span style={{...reveal(frame,0,l.fps),color:C.ice,fontSize:24,letterSpacing:5,fontFamily:font.body,fontWeight:800}}>O INÍCIO DE TUDO</span>
  <Kinetic lines={["Quando o calor","interrompe sua","rotina."]} size={l.vertical?111:115} offset={12}/>
  <p style={{...reveal(frame,75,l.fps),maxWidth:850,color:"#D9ECF5",fontSize:l.vertical?39:29,lineHeight:1.45,fontFamily:font.body}}>Conforto não é luxo. É parte de um ambiente que funciona bem, todos os dias.</p>
  <div style={{position:"absolute",right:l.vertical?-80:0,bottom:l.vertical?70:90,opacity:.4}}><AC size={l.vertical?600:480}/></div>
 </div></SceneShell>;
}
function Diagnosis({variant}:SceneProps){
 const frame=useCurrentFrame(),l=useLayout(variant);
 const cards=["01 / ENTENDER O AMBIENTE","02 / AVALIAR O EQUIPAMENTO","03 / DEFINIR A SOLUÇÃO"];
 return <SceneShell variant={variant} light>
 <div style={{height:"100%",display:"flex",flexDirection:"column",justifyContent:"center",gap:35}}>
 <span style={{color:C.blue,fontSize:24,fontFamily:font.body,fontWeight:800,letterSpacing:4}}>DIAGNÓSTICO TÉCNICO</span>
 <Kinetic lines={["Precisão antes","da solução."]} size={l.vertical?108:115} light offset={10}/>
 <p style={{...reveal(frame,50,l.fps),maxWidth:910,color:"#4B6574",fontFamily:font.body,fontSize:l.vertical?37:30}}>Cada necessidade merece avaliação, planejamento e uma resposta técnica clara.</p>
 <div style={{display:"grid",gridTemplateColumns:l.vertical?"1fr":"repeat(3,1fr)",gap:18,marginTop:30}}>
 {cards.map((text,i)=><div key={text} style={{...reveal(frame,90+i*12,l.fps),background:"#FFF",border:"2px solid #D8E8F1",borderRadius:19,padding:l.vertical?40:25,font: "800 "+(l.vertical?30:21)+"px "+font.display,color:C.navy2,boxShadow:"0 16px 42px rgba(4,45,83,.05)"}}>{text}</div>)}</div>
 </div></SceneShell>;
}
function Care({variant}:SceneProps){
 const frame=useCurrentFrame(),l=useLayout(variant);
 return <SceneShell variant={variant}>
 <div style={{height:"100%",display:"flex",flexDirection:l.vertical?"column":"row",alignItems:"center",justifyContent:"space-between",gap:30}}>
  <div style={{width:l.vertical?"100%":"60%",zIndex:4}}>
  <span style={{color:C.ice,font: "800 24px "+font.body,letterSpacing:4}}>MANUTENÇÃO PREVENTIVA</span>
  <Kinetic lines={["Cuidar hoje.","Evitar imprevistos","amanhã."]} size={l.vertical?98:90} offset={16}/>
  <div style={{display:"grid",gap:15,marginTop:55}}>
  {["Mais eficiência","Atenção aos sinais","Vida útil preservada"].map((x,i)=><div key={x} style={{...reveal(frame,75+i*14,l.fps),font:"700 "+(l.vertical?33:26)+"px "+font.body,color:C.white,borderLeft:"5px solid "+C.ice,paddingLeft:20}}>{x}</div>)}
  </div></div>
  <Img src={staticFile("assets/mascotes/06-mascote-com-manifold.png")} style={{position:l.vertical?"absolute":"relative",right:l.vertical?20:0,bottom:l.vertical?80:0,maxWidth:l.vertical?"68%":"42%",maxHeight:l.vertical?"55%":"90%",objectFit:"contain",objectPosition:"center bottom",filter:"drop-shadow(0 35px 40px rgba(0,0,0,.12))",opacity:interpolate(frame,[15,60],[0,1],{extrapolateRight:"clamp"}),transform:"translateY("+(Math.sin(frame/35)*13)+"px)"}}/>
 </div></SceneShell>;
}
function Flow({variant}:SceneProps){
 const frame=useCurrentFrame(),l=useLayout(variant);
 return <SceneShell variant={variant} light>
  <Airflow amount={15} bright/>
  <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:48,textAlign:"center"}}>
   <Kinetic lines={["Mais equilíbrio.","Mais conforto."]} size={l.vertical?105:115} light align="center" offset={5}/>
   <AC size={l.vertical?800:690}/>
   <p style={{...reveal(frame,80,l.fps),font:"500 "+(l.vertical?36:28)+"px/1.4 "+font.body,color:"#456779",maxWidth:980}}>Fluxo de ar, instalação e funcionamento exigem soluções adequadas a cada ambiente.</p>
  </div></SceneShell>;
}
function Solutions({variant}:SceneProps){
 const frame=useCurrentFrame(),l=useLayout(variant);
 const services=[["01","INSTALAÇÃO","O projeto começa na escolha certa."],["02","MANUTENÇÃO","Prevenção com atenção técnica."],["03","SUPORTE","Orientação em cada necessidade."]];
 return <SceneShell variant={variant} accent>
  <div style={{height:"100%",display:"flex",flexDirection:"column",justifyContent:"center",gap:60}}>
  <Kinetic lines={["Soluções que","acompanham você."]} size={l.vertical?104:106}/>
  <div style={{display:"grid",gridTemplateColumns:l.vertical?"1fr":"repeat(3,1fr)",gap:22}}>
   {services.map(([n,title,description],i)=><div key={n} style={{...reveal(frame,70+i*20,l.fps),minHeight:l.vertical?200:280,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.3)",borderRadius:24,padding:l.vertical?35:28,backdropFilter:"blur(10px)"}}>
     <div style={{color:C.ice,font:"800 32px "+font.display}}>{n}</div>
     <h3 style={{font:"800 "+(l.vertical?48:34)+"px "+font.display,color:"#FFF",margin:"23px 0 14px"}}>{title}</h3>
     <p style={{font:"500 "+(l.vertical?27:22)+"px/1.4 "+font.body,color:"#DAF0F6"}}>{description}</p>
    </div>)}
  </div>
  </div></SceneShell>;
}
function Proof({variant}:SceneProps){
 const frame=useCurrentFrame(),l=useLayout(variant);
 return <SceneShell variant={variant} light>
 <div style={{height:"100%",display:"flex",flexDirection:l.vertical?"column":"row",alignItems:"center",justifyContent:"space-between",gap:30}}>
  <div style={{width:l.vertical?"100%":"62%",zIndex:5}}>
  <span style={{color:C.blue,font:"800 24px "+font.body,letterSpacing:4}}>COMPROMISSO CLIMAX</span>
  <Kinetic lines={["Técnica.","Organização.","Confiança."]} size={l.vertical?125:117} light/>
  <p style={{...reveal(frame,92,l.fps),font:"500 "+(l.vertical?34:28)+"px/1.4 "+font.body,color:"#4E687A",maxWidth:830}}>Do primeiro contato aos cuidados recorrentes, uma experiência profissional e próxima.</p>
  </div>
  <Img src={staticFile("assets/mascotes/08-mascote-positivo.png")} style={{position:l.vertical?"absolute":"relative",right:l.vertical?20:0,bottom:l.vertical?80:0,maxWidth:l.vertical?"68%":"42%",maxHeight:l.vertical?"53%":"88%",objectFit:"contain",objectPosition:"bottom",opacity:interpolate(frame,[24,64],[0,1],{extrapolateRight:"clamp"}),transform:"translateY("+(Math.sin(frame/40)*10)+"px)"}}/>
 </div></SceneShell>;
}
function Outro({variant}:SceneProps){
 const frame=useCurrentFrame(),l=useLayout(variant);
 return <SceneShell variant={variant}>
 <Airflow amount={5}/>
 <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",gap:42}}>
  <div style={reveal(frame,8,l.fps)}><Img src={staticFile("assets/logos/ESCRITA BRANCA PNG.png")} style={{width:l.vertical?790:720,maxWidth:"100%",objectFit:"contain"}}/></div>
  <Kinetic lines={["Seu conforto","é a nossa missão."]} size={l.vertical?94:100} align="center" offset={25}/>
  <div style={{...reveal(frame,82,l.fps),background:C.blue,color:"#FFF",borderRadius:100,padding:"24px 56px",font:"800 "+(l.vertical?31:25)+"px "+font.body,boxShadow:"0 25px 60px rgba(0,0,0,.20)"}}>SOLICITE SEU ORÇAMENTO  →</div>
  <span style={{...reveal(frame,100,l.fps),color:"#D6EDF7",font:"500 "+(l.vertical?29:22)+"px "+font.body}}>CLIMAX Refrigeração · Seu ambiente merece conforto.</span>
 </div></SceneShell>;
}
const scenes=[Signature,Problem,Diagnosis,Care,Flow,Solutions,Proof,Outro];
export const ClimaxFilm:React.FC<FilmProps>=({variant})=>{
 return <AbsoluteFill>
  <TransitionSeries>
  {scenes.flatMap((Scene,i)=>{
    const sequence=<TransitionSeries.Sequence key={"scene-"+i} durationInFrames={sequenceFrames[i]}><Scene variant={variant}/></TransitionSeries.Sequence>;
    if(i===scenes.length-1)return [sequence];
    const transition=<TransitionSeries.Transition key={"transition-"+i} presentation={i%3===0?slide({direction:"from-right"}):fade()} timing={linearTiming({durationInFrames:manifest.transitionFrames})}/>;
    return [sequence,transition];
  })}
  </TransitionSeries>
 </AbsoluteFill>;
};
