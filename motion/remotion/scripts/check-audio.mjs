import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const repo=path.resolve(root,"../..");
const data=JSON.parse(fs.readFileSync(path.join(repo,"brand-center/data/audio-production.json"),"utf8"));
const film=JSON.parse(fs.readFileSync(path.join(root,"film.config.json"),"utf8"));
let start=0;
for(let i=0;i<data.scenes.length;i++){
 const s=data.scenes[i],f=film.scenes[i];
 if(s.id!==f.id||s.frames!==f.frames||!s.text?.trim())throw new Error("Timeline inconsistente: "+s.id);
 start+=s.frames-(i===data.scenes.length-1?0:film.transitionFrames);
}
if(start!==film.totalFrames)throw new Error("Total de frames inválido");
const mode=process.argv.includes("--master")?"master":process.argv.includes("--stems")?"stems":"manifest";
if(mode==="stems"){
 const missing=data.scenes.filter(s=>!fs.existsSync(path.join(root,"public/audio/voice",s.filename)));
 if(missing.length)throw new Error("Faltam locuções: "+missing.map(s=>s.id).join(", "));
}else if(mode==="master"){
 if(!fs.existsSync(path.join(root,"public/audio/mix/final-mix.wav")))throw new Error("Falta mixagem final WAV");
}
console.log("PASS: "+data.scenes.length+" cenas, "+start+" frames, modo "+mode);
