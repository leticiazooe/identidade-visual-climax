import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {spawnSync} from "node:child_process";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=(p)=>fs.readFileSync(path.join(root,p),"utf8");
const json=(p)=>JSON.parse(read(p));
const fail=(message)=>{throw new Error(message);};
const posts=json("brand-center/post-studio/posts.json").posts;
const formats=json("brand-center/post-studio/formats.json").formats;
const brand=json("brand.config.json");
const config=json("brand-center/post-studio/brand.config.json");
const motion=json("motion/remotion/film.config.json");
const html=read("brand-center/post-studio/index.html");
const master=read("brand-center/index.html");

if(posts.length!==14)fail("Esperados 14 modelos.");
if(new Set(posts.map(p=>p.id)).size!==posts.length)fail("IDs repetidos.");
if(Object.keys(formats).length!==7)fail("Esperados 7 formatos.");
if(!master.includes('data-doc="automatizar-posts"'))fail("Navegação não integrada.");
if(!html.includes('id="artwork"'))fail("Canvas ausente.");
if(brand.theme.primary!==config.colors.masterBlue)fail("Cores da marca divergentes.");
for(const p of posts){
 if(!p.headline||!p.cta||!p.caption||p.benefits.length!==3)fail("Post incompleto: "+p.id);
 if(!fs.existsSync(path.join(root,"assets/mascotes",p.mascot)))fail("Mascote inexistente: "+p.mascot);
}
for(const [id,f] of Object.entries(formats)){
 if(!Number.isInteger(f.width)||!Number.isInteger(f.height)||f.width<500||f.height<500)fail("Formato inválido: "+id);
 for(const side of ["top","right","bottom","left"])if(!Number.isFinite(f.safe[side])||f.safe[side]<0)fail("Margem inválida: "+id);
 if(f.safe.left+f.safe.right>=f.width||f.safe.top+f.safe.bottom>=f.height)fail("Margens excedem canvas: "+id);
}
const frames=motion.scenes.reduce((acc,s)=>acc+s.frames,0)-(motion.scenes.length-1)*motion.transitionFrames;
if(frames!==motion.totalFrames)fail("Duração Remotion divergente.");
const check=spawnSync(process.execPath,["--check",path.join(root,"brand-center/post-studio/studio.js")],{encoding:"utf8"});
if(check.status!==0)fail("studio.js inválido: "+check.stderr);
const audio=json("brand-center/data/audio-production.json");
if(audio.scenes.length!==motion.scenes.length)fail("Áudio tem cenas divergentes.");
for(let i=0;i<audio.scenes.length;i++){
 if(audio.scenes[i].id!==motion.scenes[i].id||audio.scenes[i].frames!==motion.scenes[i].frames)fail("Áudio fora da timeline: "+i);
 if(!audio.scenes[i].text||audio.scenes[i].text.length>650)fail("Locução inválida: "+i);
}
if(!master.includes('data-doc="motion-production"')||!master.includes('production-studio/index.html'))fail("Fluxo de produção não está integrado no menu.");
if(!fs.existsSync(path.join(root,"brand-center/sections/audio-production.html")))fail("Editor avançado de áudio ausente.");
if(!fs.existsSync(path.join(root,"brand-center/sections/motion-production.html")))fail("Biblioteca avançada de motion ausente.");
for(const required of ["index.html","studio.css","studio.js"]){
 if(!fs.existsSync(path.join(root,"brand-center/production-studio",required)))fail("Wizard incompleto: "+required);
}
const wizardCheck=spawnSync(process.execPath,["--check",path.join(root,"brand-center/production-studio/studio.js")],{encoding:"utf8"});
if(wizardCheck.status!==0)fail("Wizard JS inválido: "+wizardCheck.stderr);
console.log("PASS: fluxo guiado presente e módulos avançados preservados.");
const audioCheck=spawnSync(process.execPath,["--check",path.join(root,"brand-center/audio-studio.js")],{encoding:"utf8"});
if(audioCheck.status!==0)fail("audio-studio.js inválido: "+audioCheck.stderr);
const sound=json("brand-center/data/sound-design.json");
if(sound.assets.length!==9||sound.cues.length!==11)fail("Manifesto de efeitos incompleto.");
for(const a of sound.assets){if(!a.prompt||a.prompt.length>450||a.durationSeconds<.5||a.durationSeconds>30)fail("Efeito inválido "+a.id);}
for(const cue of sound.cues){if(!motion.scenes.some(s=>s.id===cue.scene)||!sound.assets.some(a=>a.id===cue.assetId))fail("Cue inválida "+cue.id);}
console.log("PASS: 9 efeitos, 11 cues contextualizadas.");
console.log("PASS: 8 cenas de locução, audio-studio.js e timeline compatíveis.");
console.log("PASS: 14 presets, 7 formatos, links de mascotes, marca, JS e 8 cenas / "+frames+" frames.");
