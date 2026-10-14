const $ = (id) => document.getElementById(id);
const paths = {
  narration:"../data/audio-production.json",
  effects:"../data/sound-design.json",
  exports:"../data/final-exports.json"
};
const formats={
  wide:{label:"Horizontal · 16:9",ratio:"16x9"},
  vertical:{label:"Vertical · 9:16",ratio:"9x16"},
  portrait:{label:"Feed retrato · 4:5",ratio:"4x5"},
  square:{label:"Quadrado · 1:1",ratio:"1x1"}
};
const state={step:0,format:"wide",voice:"elevenlabs",music:true,musicVolume:0.16,sfx:true,sfxVolume:0.75};
let narration=null,effects=null,deliveries=null,localUrl=null,localFile=null;
const stageIds=["motion","narration","sounds","review"];
const stageLabels=["Motion","Narração","Sons","Finalizar"];
const copyText=(value)=>navigator.clipboard.writeText(value).catch(()=>window.prompt("Copie o texto:",value));
const readJson=async url=>{const r=await fetch(url,{cache:"no-store"});if(!r.ok)throw new Error(url+" HTTP "+r.status);return r.json();};
function savePreferences(){
  try{localStorage.setItem("climax.production-wizard.v1",JSON.stringify({...state,step:0}));}catch{}
}
function restorePreferences(){
  try{
    const saved=JSON.parse(localStorage.getItem("climax.production-wizard.v1")||"null");
    if(!saved)return;
    if(formats[saved.format])state.format=saved.format;
    if(["elevenlabs","recorded","silent"].includes(saved.voice))state.voice=saved.voice;
    for(const key of ["music","sfx"])if(typeof saved[key]==="boolean")state[key]=saved[key];
    if(Number.isFinite(saved.musicVolume)&&saved.musicVolume>=0.04&&saved.musicVolume<=0.3)state.musicVolume=saved.musicVolume;
    if(Number.isFinite(saved.sfxVolume)&&saved.sfxVolume>=0.1&&saved.sfxVolume<=1)state.sfxVolume=saved.sfxVolume;
  }catch{}
}
function filenameDownload(name,data,mime="application/json"){
 const blob=new Blob([data],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),5000);
}
function formatToPreview(format){
 return "../motion-production/source/motion-source.html?clip=intro&format="+formats[format].ratio;
}
function syncSummary(){
 $("summaryFormat").textContent=formats[state.format].label;
 $("summaryVoice").textContent=({elevenlabs:"ElevenLabs",recorded:"Voz gravada",silent:"Sem narração"})[state.voice];
 $("summaryMusic").textContent=state.music?"Ambiente suave · "+Math.round(state.musicVolume*100)+"%":"Desativada";
 $("summarySfx").textContent=state.sfx?"Contextuais · "+Math.round(state.sfxVolume*100)+"%":"Desativados";
 $("musicSettings").hidden=!state.music;
 $("sfxSettings").hidden=!state.sfx;
 $("musicValue").textContent=Math.round(state.musicVolume*100)+"%";
 $("sfxValue").textContent=Math.round(state.sfxVolume*100)+"%";
 document.querySelectorAll("[data-format]").forEach(el=>{
  const selected=el.dataset.format===state.format;
  el.classList.toggle("selected",selected);el.setAttribute("aria-pressed",String(selected));
 });
 document.querySelectorAll("[name=voiceMode]").forEach(input=>input.checked=input.value===state.voice);
 $("musicEnabled").checked=state.music;$("sfxEnabled").checked=state.sfx;
 $("musicVolume").value=String(state.musicVolume);$("sfxVolume").value=String(state.sfxVolume);
 $("motionScreen").dataset.format=state.format;
 const source=formatToPreview(state.format);
 if($("motionFrame").getAttribute("src")!==source)$("motionFrame").src=source;
}
function changeStep(next){
 if(!narration||!effects||!deliveries)return;
 state.step=Math.max(0,Math.min(3,next));
 document.querySelectorAll("[data-panel]").forEach(panel=>panel.hidden=Number(panel.dataset.panel)!==state.step);
 document.querySelectorAll("[data-go]").forEach(button=>{
  const i=Number(button.dataset.go),active=i===state.step;
  button.classList.toggle("current",active);button.classList.toggle("visited",i<state.step);
  if(active)button.setAttribute("aria-current","step");else button.removeAttribute("aria-current");
 });
 $("previous").hidden=state.step===0;
 $("next").hidden=state.step===3;
 $("next").textContent=state.step<3?"Continuar: "+stageLabels[state.step+1]+" →":"";
 $("stepHint").textContent="Etapa "+(state.step+1)+" de 4";
 if(state.step===3)renderReview();
 savePreferences();
 if(window.matchMedia("(max-width:800px)").matches)$("app").scrollIntoView({behavior:"auto",block:"start"});
}
function paintScenes(){
 const box=$("sceneOverview");
 narration.scenes.forEach((s,i)=>{
  const tag=document.createElement("span");tag.textContent=String(i+1).padStart(2,"0")+" · "+s.title;box.append(tag);
  $("voiceScene").append(new Option(String(i+1).padStart(2,"0")+" — "+s.title,String(i)));
 });
 $("voiceScene").addEventListener("change",event=>{
  $("voiceScript").textContent=narration.scenes[Number(event.target.value)].text;
 });
 $("voiceScript").textContent=narration.scenes[0].text;
 $("downloadVoice").addEventListener("click",()=>filenameDownload("CLIMAX-VOICE-PROJECT.json",JSON.stringify(narration,null,2)));
}
function paintEffects(){
 $("sfxCount").textContent="· "+effects.assets.length+" efeitos";
 const box=$("effects");
 effects.assets.forEach(e=>{
  const row=document.createElement("div"),label=document.createElement("b"),detail=document.createElement("small");
  label.textContent=e.title;detail.textContent=e.scene;
  row.append(label,detail);box.append(row);
 });
}
function renderCommands(){
 const commands=[];
 if(state.voice==="elevenlabs"){
  commands.push({label:"Gerar a narração (consome créditos ElevenLabs)",command:"npm run voice:generate -- --all --generate",help:"Requer ELEVENLABS_API_KEY e ELEVENLABS_VOICE_ID configurados no terminal."});
 }else if(state.voice==="recorded"){
  commands.push({label:"Preparar a narração gravada",command:"npm run audio:check -- --stems",help:"Coloque os oito arquivos MP3 de voz na pasta public/audio/voice, usando os nomes do roteiro."});
 }else{
  commands.push({label:"Preparar vídeo sem narração",command:null,help:"O fluxo sem locução precisa de renderização sem vozes. O comando final usa o modo de áudio silencioso."});
 }
 if(state.sfx){
  commands.push({label:"Gerar efeitos contextuais (consome créditos ElevenLabs)",command:"npm run sfx:generate -- --all --generate",help:"Ou coloque os nove MP3s licenciados em public/audio/sfx."});
 }
 if(state.music){
  commands.push({label:"Criar música ambiente original",command:"npm run music:generate",help:"A trilha será mixada suavemente, com redução de volume durante as falas."});
 }
 const finalArgs=[
  "--format="+state.format,
  "--mode="+(state.voice==="silent"?"silent":"stems"),
  "--music="+(state.music?"original":"off"),
  "--music-volume="+state.musicVolume.toFixed(2),
  "--sfx="+(state.sfx?"on":"off"),
  "--sfx-volume="+state.sfxVolume.toFixed(2)
 ];
 commands.push({label:"Gerar o MP4 final",command:"npm run final:render -- "+finalArgs.join(" "),help:"O arquivo sai em motion/remotion/out. Escute e revise antes de divulgar."});
 return commands;
}
function reviewRow(title,details){
 const div=document.createElement("div");div.className="review-item";
 const left=document.createElement("div"),strong=document.createElement("strong"),small=document.createElement("small");
 strong.textContent=title;small.textContent=details;left.append(strong,small);
 const icon=document.createElement("span");icon.className="review-icon";icon.textContent="✓";
 div.append(left,icon);return div;
}
function renderReview(){
 const list=$("review");list.replaceChildren();
 list.append(reviewRow("Motion institucional",formats[state.format].label+" · 68,4 segundos"));
 list.append(reviewRow("Narração",({elevenlabs:"Gerar com ElevenLabs · 8 cenas",recorded:"Usar gravação própria · 8 cenas",silent:"Sem narração"})[state.voice]));
 list.append(reviewRow("Música",state.music?"Ambiente suave · "+Math.round(state.musicVolume*100)+"%":"Sem música"));
 list.append(reviewRow("Efeitos",state.sfx?effects.assets.length+" efeitos planejados · intensidade "+Math.round(state.sfxVolume*100)+"%":"Sem efeitos"));
 const box=$("instructions");box.replaceChildren();
 renderCommands().forEach(command=>{
  const li=document.createElement("li"),name=document.createElement("strong");name.textContent=command.label;li.append(name);
  if(command.command){const code=document.createElement("code");code.textContent=command.command;li.append(code);}
  const desc=document.createElement("div");desc.textContent=command.help;li.append(desc);box.append(li);
 });
 $("deliveryStatus").textContent=localFile?"Arquivo local carregado. Revise o vídeo no player antes de baixar.":publishedUrl()?"MP4 já publicado. Você pode assistir e baixar.":"O MP4 ainda não foi renderizado/publicado. Siga os comandos e selecione o arquivo final.";
 updateDownload();
}
function publishedUrl(){
 const u=deliveries?.formats?.[state.format]?.url;
 if(typeof u!=="string")return null;
 try{const url=new URL(u);if(url.protocol==="https:"&&url.pathname.toLowerCase().endsWith(".mp4"))return url.href;}catch{}
 return null;
}
function clearLocal(){
 if(localUrl)URL.revokeObjectURL(localUrl);
 localUrl=null;localFile=null;
 $("localVideo").value="";
 const video=$("finalPlayer");video.pause();video.removeAttribute("src");video.hidden=true;video.load();
}
function updateDownload(){
 const destination=localUrl||publishedUrl(),button=$("downloadVideo"),video=$("finalPlayer");
 button.disabled=!destination;
 if(!localUrl&&publishedUrl()){if(video.src!==publishedUrl())video.src=publishedUrl();video.hidden=false;}
 if(!destination){video.hidden=true;}
}
async function chooseLocal(event){
 const file=event.target.files?.[0];if(!file)return;
 clearLocal();
 if(file.size<10000||!(file.type==="video/mp4"||file.name.toLowerCase().endsWith(".mp4"))){
  $("deliveryStatus").textContent="Escolha um MP4 válido.";return;
 }
 const url=URL.createObjectURL(file),probe=document.createElement("video");probe.preload="metadata";probe.src=url;
 try{
  await new Promise((resolve,reject)=>{probe.onloadedmetadata=resolve;probe.onerror=()=>reject(new Error("Não foi possível ler esse vídeo."));});
  const expected=deliveries.formats[state.format];
  if(expected&&(probe.videoWidth!==expected.width||probe.videoHeight!==expected.height))throw new Error("O vídeo está em "+probe.videoWidth+" × "+probe.videoHeight+". O formato escolhido pede "+expected.width+" × "+expected.height+".");
  localUrl=url;localFile=file;$("finalPlayer").src=url;$("finalPlayer").hidden=false;
  $("deliveryStatus").textContent="Vídeo carregado. Ouça e confira narração, música e efeitos antes de baixar.";
  updateDownload();
 }catch(error){URL.revokeObjectURL(url);$("deliveryStatus").textContent=error.message;updateDownload();}
}
function downloadFinal(){
 if(localUrl&&localFile){
  const a=document.createElement("a");a.href=localUrl;a.download=localFile.name;document.body.append(a);a.click();a.remove();return;
 }
 if(publishedUrl())window.location.assign(publishedUrl());
}
function listen(){
 document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>changeStep(Number(b.dataset.go))));
 $("previous").addEventListener("click",()=>changeStep(state.step-1));
 $("next").addEventListener("click",()=>changeStep(state.step+1));
 document.querySelectorAll("[data-format]").forEach(b=>b.addEventListener("click",()=>{
  if(b.dataset.format===state.format)return;
  state.format=b.dataset.format;clearLocal();syncSummary();renderReview();savePreferences();
 }));
 document.querySelectorAll("[name=voiceMode]").forEach(b=>b.addEventListener("change",()=>{state.voice=b.value;syncSummary();savePreferences();}));
 for(const [id,key] of [["musicEnabled","music"],["sfxEnabled","sfx"]]){
  $(id).addEventListener("change",e=>{state[key]=e.target.checked;syncSummary();savePreferences();});
 }
 for(const [id,key] of [["musicVolume","musicVolume"],["sfxVolume","sfxVolume"]]){
  $(id).addEventListener("input",e=>{state[key]=Number(e.target.value);syncSummary();savePreferences();});
 }
 $("copyInstructions").addEventListener("click",async()=>{
  const content=["cd motion/remotion","npm install",...renderCommands().filter(c=>c.command).map(c=>c.command)].join("\n");
  await copyText(content);
  $("copyInstructions").textContent="Comandos copiados ✓";
 });
 $("localVideo").addEventListener("change",chooseLocal);
 $("downloadVideo").addEventListener("click",downloadFinal);
 window.addEventListener("pagehide",()=>{if(localUrl)URL.revokeObjectURL(localUrl);});
}
async function init(){
 restorePreferences();
 try{
  [narration,effects,deliveries]=await Promise.all([readJson(paths.narration),readJson(paths.effects),readJson(paths.exports)]);
  if(narration.scenes.length!==8||effects.assets.length!==9)throw new Error("Manifesto de produção incompleto.");
  paintScenes();paintEffects();listen();syncSummary();
  const query=new URLSearchParams(location.search);
  const wanted=stageIds.indexOf(query.get("step"));
  changeStep(wanted<0?0:wanted);
 }catch(error){
  console.error(error);$("loadError").hidden=false;$("next").disabled=true;
 }
}
init();
