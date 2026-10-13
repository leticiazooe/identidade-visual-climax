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

let deliveryRegistry=null,localFinalUrl=null,localFinalFile=null;
let soundDesign=null,sfxSelected=0,sfxUrl=null;
const finalFormatInfo={wide:"16x9",vertical:"9x16",portrait:"4x5",square:"1x1"};
const playback=$("finalPreview");
function clearLocalFinal(){
 if(localFinalUrl)URL.revokeObjectURL(localFinalUrl);
 localFinalUrl=null;localFinalFile=null;
 $("finalLocalFile").value="";playback.pause();playback.removeAttribute("src");playback.hidden=true;playback.load();
}
function finalCommand(){
 const fmt=$("finalFormat").value,vol=Number($("finalMusicVolume").value).toFixed(2);
 return "npm run final:render -- --format="+fmt+" --music=original --music-volume="+vol+" --sfx=on --sfx-volume="+(Number($("sfxMaster").value).toFixed(2));
}
function publishedFinal(){
 const format=$("finalFormat").value;
 const item=deliveryRegistry?.formats?.[format];
 if(!item||typeof item.url!=="string")return null;
 try{const target=new URL(item.url);return target.protocol==="https:"&&target.pathname.toLowerCase().endsWith(".mp4")?target.href:null;}catch{return null;}
}
function updateFinalButton(){
 const ready=Boolean(localFinalUrl||publishedFinal());
 $("finalDownload").disabled=!ready;
 $("finalStatus").textContent=localFinalUrl?"MP4 local carregado. Ouça o vídeo e confirme voz e trilha antes de baixar.":
 publishedFinal()?"Versão final publicada. Você pode reproduzir e baixar o MP4.":
 "Aguardando a geração e publicação do MP4 com narração e música.";
 $("finalMusicLabel").textContent="Suave · "+Math.round(Number($("finalMusicVolume").value)*100)+"%";
 $("finalCommand").title=finalCommand();
 if(!localFinalUrl&&publishedFinal()){
  playback.src=publishedFinal();playback.hidden=false;$("finalPlaceholder").hidden=true;
 }else if(!localFinalUrl){
  playback.removeAttribute("src");playback.hidden=true;$("finalPlaceholder").hidden=false;
 }
}
function bindDelivery(){
 $("finalFormat").addEventListener("change",()=>{clearLocalFinal();updateFinalButton();});
 $("finalMusicVolume").addEventListener("input",updateFinalButton);
 $("finalCommand").addEventListener("click",()=>navigator.clipboard.writeText(finalCommand())
  .then(()=>{$("finalStatus").textContent="Comando copiado! Execute em motion/remotion após gerar as locuções.";})
  .catch(()=>{$("finalStatus").textContent="Cópia bloqueada. Comando: "+finalCommand();}));
 $("finalLocalFile").addEventListener("change",async event=>{
  const chosen=event.target.files?.[0];if(!chosen)return;
  if(localFinalUrl){URL.revokeObjectURL(localFinalUrl);localFinalUrl=null;}
  if(chosen.size<10000||!chosen.name.toLowerCase().endsWith(".mp4")){
   $("finalStatus").textContent="Selecione um MP4 válido, já renderizado.";event.target.value="";updateFinalButton();return;
  }
  const url=URL.createObjectURL(chosen);
  const probe=document.createElement("video");probe.preload="metadata";probe.src=url;
  try{
   await new Promise((resolve,reject)=>{
    probe.onloadedmetadata=resolve;probe.onerror=()=>reject(new Error("Não foi possível ler o MP4."));
   });
   const f=deliveryRegistry?.formats?.[$("finalFormat").value];
   if(f&&(probe.videoWidth!==f.width||probe.videoHeight!==f.height))throw new Error("O arquivo tem "+probe.videoWidth+"×"+probe.videoHeight+"; o formato escolhido requer "+f.width+"×"+f.height+".");
   localFinalUrl=url;localFinalFile=chosen;playback.src=url;playback.hidden=false;$("finalPlaceholder").hidden=true;
   updateFinalButton();
  }catch(error){URL.revokeObjectURL(url);localFinalUrl=null;localFinalFile=null;event.target.value="";updateFinalButton();$("finalStatus").textContent=error.message;}
 });
 $("finalDownload").addEventListener("click",()=>{
  if(localFinalUrl&&localFinalFile){
   const a=document.createElement("a");a.href=localFinalUrl;a.download=localFinalFile.name;document.body.append(a);a.click();a.remove();return;
  }
  const url=publishedFinal();
  if(url)window.location.assign(url);
 });
}
async function initDelivery(){
 bindDelivery();
 try{
  const response=await fetch("../data/final-exports.json",{cache:"no-store"});
  if(!response.ok)throw new Error("Catálogo ainda não foi publicado.");
  deliveryRegistry=await response.json();
 }catch(error){console.warn("Catálogo de MP4 final indisponível:",error.message);}
 updateFinalButton();
}
initDelivery();

function sfxSelectedAsset(){return soundDesign?.assets?.[sfxSelected]||null;}
function sfxLayout(){
 const list=$("sfxList");list.replaceChildren();
 soundDesign.assets.forEach((asset,i)=>{
  const b=document.createElement("button");b.type="button";b.className=i===sfxSelected?"active":"";
  b.textContent=String(i+1).padStart(2,"0")+" · "+asset.title;
  b.addEventListener("click",()=>selectSfx(i));list.append(b);
 });
 $("sfxCount").textContent=soundDesign.assets.length+" efeitos · "+soundDesign.cues.length+" momentos sonoros";
}
function selectSfx(i){
 sfxSelected=i;const asset=sfxSelectedAsset();if(!asset)return;
 sfxLayout();$("sfxSceneTag").textContent=asset.scene.toUpperCase()+" / "+asset.id;
 $("sfxName").textContent=asset.title;$("sfxPrompt").value=asset.prompt;
 $("sfxDuration").value=asset.durationSeconds;$("sfxGain").value=asset.volume;
 const cueList=soundDesign.cues.filter(c=>c.assetId===asset.id);
 $("sfxCueInfo").textContent=cueList.length+" entrada(s) de áudio na timeline, nos frames "+cueList.map(c=>c.offsetFrames).join(", ")+" da(s) cena(s).";
}
function sfxDownload(name,content,type){
 const url=URL.createObjectURL(new Blob([content],{type}));
 const link=document.createElement("a");link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);
}
function bindSfx(){
 $("sfxPrompt").addEventListener("input",e=>{if(sfxSelectedAsset())sfxSelectedAsset().prompt=e.target.value;});
 $("sfxDuration").addEventListener("change",e=>{
  const a=sfxSelectedAsset(),n=Number(e.target.value);if(!a)return;
  if(!Number.isFinite(n)||n<.5||n>30){e.target.value=a.durationSeconds;return;}
  a.durationSeconds=n;
 });
 $("sfxGain").addEventListener("change",e=>{
  const a=sfxSelectedAsset(),n=Number(e.target.value);if(!a)return;
  if(!Number.isFinite(n)||n<0||n>.25){e.target.value=a.volume;return;}
  a.volume=n;
 });
 $("sfxMaster").addEventListener("input",()=>{
  $("sfxMasterLabel").textContent=Math.round(Number($("sfxMaster").value)*100)+"%";
  updateFinalButton();
 });
 $("downloadSfxManifest").addEventListener("click",()=>sfxDownload("CLIMAX-SOUND-DESIGN.json",JSON.stringify(soundDesign,null,2),"application/json"));
 const copy=(text)=>navigator.clipboard.writeText(text).catch(()=>alert("Copie o comando manualmente: "+text));
 $("copySfxPlan").addEventListener("click",()=>copy("npm run sfx:plan"));
 $("copySfxGenerate").addEventListener("click",()=>{const asset=sfxSelectedAsset();if(asset)copy("npm run sfx:generate -- --asset="+asset.id+" --generate");});
 $("sfxLocalFile").addEventListener("change",e=>{
  if(sfxUrl)URL.revokeObjectURL(sfxUrl);
  const file=e.target.files?.[0];if(!file)return;
  sfxUrl=URL.createObjectURL(file);
  const player=$("sfxAudio");player.src=sfxUrl;player.hidden=false;
 });
}
async function initSfx(){
 try{
  const response=await fetch("../data/sound-design.json",{cache:"no-store"});
  if(!response.ok)throw new Error("Roteiro sonoro indisponível");
  soundDesign=await response.json();
  bindSfx();selectSfx(0);
 }catch(error){$("sfxCount").textContent="Não foi possível carregar os efeitos.";console.error(error);}
}
initSfx();
