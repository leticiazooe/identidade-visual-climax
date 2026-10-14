import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const repo=path.resolve(root,"../..");
const cfg=JSON.parse(fs.readFileSync(path.join(repo,"brand-center/data/sound-design.json"),"utf8"));
const film=JSON.parse(fs.readFileSync(path.join(root,"film.config.json"),"utf8"));
const ids=new Set();
for(const a of cfg.assets){
 if(ids.has(a.id)||!/^[a-z0-9-]+$/.test(a.id)||!/^[a-z0-9-]+\.mp3$/.test(a.filename))throw new Error("Asset inválido: "+a.id);
 ids.add(a.id);
 if(typeof a.prompt!=="string"||a.prompt.length<15||a.prompt.length>450||!(a.durationSeconds>=.5&&a.durationSeconds<=30))throw new Error("Prompt/duração inválida: "+a.id);
 if(!(a.volume>=0&&a.volume<=.25))throw new Error("Volume fora do limite para "+a.id);
}
for(const cue of cfg.cues){
 const asset=cfg.assets.find(a=>a.id===cue.assetId);
 const scene=film.scenes.find(s=>s.id===cue.scene);
 if(!asset||!scene||!Number.isInteger(cue.offsetFrames)||cue.offsetFrames<0||cue.offsetFrames+Math.ceil(asset.durationSeconds*film.fps)>scene.frames)throw new Error("Cue fora da cena: "+cue.id);
}
if(process.argv.includes("--files")){
 const missing=cfg.assets.filter(a=>!fs.existsSync(path.join(root,"public/audio/sfx",a.filename)));
 if(missing.length)throw new Error("Faltam efeitos: "+missing.map(x=>x.id).join(", ")+". Execute npm run sfx:generate -- --all --generate ou adicione MP3s licenciados com os nomes definidos.");
}
console.log("PASS: "+cfg.assets.length+" SFX; "+cfg.cues.length+" eventos contextualizados / "+film.scenes.length+" cenas.");
