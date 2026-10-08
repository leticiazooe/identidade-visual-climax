const $=id=>document.getElementById(id);
let base=null,editing=null,selected=0,audioUrl=null;
const toStamp=frame=>{const sec=Math.floor(frame/30);return String(Math.floor(sec/60)).padStart(2,"0")+":"+String(sec%60).padStart(2,"0");};
const clone=x=>JSON.parse(JSON.stringify(x));
const file=(name,blob)=>{const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2500);};
function positions(){let cursor=0;return editing.scenes.map((scene,i)=>{const row={start:cursor,end:cursor+scene.frames};cursor+=scene.frames-(i===editing.scenes.length-1?0:editing.transitionFrames);return row;});}
function drawList(){
 const list=$("scenes"),timeline=$("timeline");list.replaceChildren();timeline.replaceChildren();
 editing.scenes.forEach((s,i)=>{
  const row=document.createElement("button");row.className=i===selected?"selected":"";row.type="button";row.setAttribute("aria-pressed",String(i===selected));
  const t=document.createElement("b");t.textContent=String(i+1).padStart(2,"0")+" / "+s.title;
  const d=document.createElement("small");d.textContent=toStamp(positions()[i].start)+" · "+(s.frames/30).toFixed(1)+"s";row.append(t,d);
  row.onclick=()=>choose(i);list.append(row);
  const track=document.createElement("button");track.type="button";track.className=i===selected?"active":"";track.style.setProperty("--frames",String(s.frames));
  const n=document.createElement("span");n.textContent=String(i+1).padStart(2,"0");track.append(n,document.createTextNode(s.title));track.onclick=()=>choose(i);timeline.append(track);
 });
 $("timelineStatus").textContent=editing.scenes.length+" cenas · "+(positions().at(-1).end/30).toFixed(1)+"s";
}
function fit(){
 const scene=editing.scenes[selected],available=(scene.frames-editing.leadInFrames-18)/30;
 const words=scene.text.trim().split(/\s+/).filter(Boolean).length,estimate=words/2.6;
 $("count").textContent=scene.text.length+" caracteres / "+words+" palavras";
 $("readTime").textContent="Leitura estimada: "+estimate.toFixed(1)+"s";
 $("fitStatus").textContent=estimate>available?"Revisar duração":"Cabe na janela estimada";
 $("fitStatus").className=estimate>available?"warn":"ok";
}
function choose(index){
 selected=index;drawList();
 const scene=editing.scenes[index];$("sceneTitle").textContent=scene.title;$("selectedId").textContent=String(index+1).padStart(2,"0")+" / "+scene.id.toUpperCase();
 $("sceneText").value=scene.text;$("sceneDirection").value=scene.direction;$("sceneTime").textContent=toStamp(positions()[index].start);fit();
}
function bind(){
 $("sceneText").addEventListener("input",e=>{editing.scenes[selected].text=e.target.value;fit();});
 $("sceneDirection").addEventListener("input",e=>{editing.scenes[selected].direction=e.target.value;});
 $("resetBtn").onclick=()=>{if(!confirm("Restaurar o roteiro original e descartar edições locais?"))return;editing=clone(base);choose(selected);};
 $("downloadBtn").onclick=()=>file("CLIMAX-VOICE-PROJECT.json",new Blob([JSON.stringify(editing,null,2)],{type:"application/json"}));
 $("csvBtn").onclick=()=>{
  const lines=[["Cena","Início (s)","Duração total (s)","Texto","Direção"].join(",")];
  positions().forEach((row,i)=>{const s=editing.scenes[i],col=[s.id,(row.start/30).toFixed(3),(s.frames/30).toFixed(3),s.text,s.direction].map(v=>'"'+String(v).replaceAll('"','""')+'"');lines.push(col.join(","));});
  file("CLIMAX-AUDITION-CUE-SHEET.csv",new Blob([lines.join("\n")],{type:"text/csv;charset=utf-8"}));
 };
 $("copyCommand").onclick=()=>navigator.clipboard.writeText("npm run voice:generate -- --all --generate").then(()=>$("copyCommand").textContent="Copiado").catch(()=>$("copyCommand").textContent="Não disponível");
 $("sampleInput").addEventListener("change",e=>{
  if(audioUrl)URL.revokeObjectURL(audioUrl);const f=e.target.files?.[0];if(!f)return;
  audioUrl=URL.createObjectURL(f);$("localAudio").src=audioUrl;$("localAudio").hidden=false;
 });
}
async function init(){
 try{
  const response=await fetch("../data/audio-production.json");
  if(!response.ok)throw new Error("Manifest não encontrado");
  base=await response.json();editing=clone(base);bind();choose(0);
 }catch(error){$("timelineStatus").textContent="Não foi possível abrir o roteiro: "+error.message;console.error(error);}
}
init();
