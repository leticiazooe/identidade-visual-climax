#!/usr/bin/env node
/**
 * CLIMAX contextual sound FX / ElevenLabs API. No billable requests without
 * BOTH --generate and --all OR --asset=<ID>. Credentials via env only.
 */
import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const repo=path.resolve(root,"../..");
const argv=process.argv.slice(2),action=argv[0]??"plan";
const arg=(key,def)=>argv.find(v=>v.startsWith("--"+key+"="))?.slice(key.length+3)??def;
const flag=key=>argv.includes("--"+key);
const input=path.resolve(arg("manifest",path.join(repo,"brand-center/data/sound-design.json")));
const config=JSON.parse(await fs.readFile(input,"utf8"));
const film=JSON.parse(await fs.readFile(path.join(root,"film.config.json"),"utf8"));
const dir=path.join(root,"public/audio/sfx");
const starts={};let cursor=0;
for(let i=0;i<film.scenes.length;i++){starts[film.scenes[i].id]=cursor;cursor+=film.scenes[i].frames-(i===film.scenes.length-1?0:film.transitionFrames);}
if(cursor!==film.totalFrames)throw new Error("Duração do filme inconsistente");
const ids=new Set();
for(const a of config.assets){
 if(ids.has(a.id)||!/^[a-z0-9-]+$/.test(a.id))throw new Error("ID duplicado/inválido: "+a.id);
 ids.add(a.id);
 if(!/^[a-z0-9-]+\.mp3$/.test(a.filename)||a.prompt.length>450||a.prompt.length<15||a.durationSeconds<0.5||a.durationSeconds>30)throw new Error("Prompt/duração inválida: "+a.id);
}
for(const c of config.cues){
 const a=config.assets.find(a=>a.id===c.assetId),s=film.scenes.find(s=>s.id===c.scene);
 if(!a||!s||!Number.isInteger(c.offsetFrames)||c.offsetFrames<0||c.offsetFrames+a.durationSeconds*film.fps>s.frames)throw new Error("Cue fora da cena: "+c.id);
}
if(action==="plan"){
 console.log("CLIMAX SOUND DESIGN | "+config.assets.length+" efeitos / "+config.cues.length+" eventos | nenhum crédito consumido");
 for(const a of config.assets)console.log(a.id.padEnd(23)+" | "+a.durationSeconds+"s | "+a.title);
 const seconds=config.assets.reduce((v,a)=>v+a.durationSeconds,0);
 console.log("Duração dos SFX a gerar: "+seconds.toFixed(2)+" segundos. Custos sujeitos ao plano ElevenLabs. Revise prompts/licenças.");
 process.exit(0);
}
if(action!=="generate")throw new Error("Use plan ou generate.");
const selected=arg("asset",null);
if(!flag("generate")||(!flag("all")&&!selected))throw new Error("Geração cobrada exige --generate e --asset=ID ou --all");
const token=process.env.ELEVENLABS_API_KEY;
if(!token)throw new Error("ELEVENLABS_API_KEY ausente. Configure no terminal, nunca no site.");
const chosen=config.assets.filter(a=>flag("all")||a.id===selected);
if(chosen.length===0)throw new Error("Efeito inexistente: "+selected);
await fs.mkdir(dir,{recursive:true});
for(const a of chosen){
 const dest=path.join(dir,a.filename);
 if(!flag("force")){try{await fs.access(dest);console.log("SKIP (arquivo existente):",a.id);continue;}catch{}}
 const res=await fetch("https://api.elevenlabs.io/v1/sound-generation?output_format="+encodeURIComponent(config.outputFormat),{
  method:"POST",headers:{"xi-api-key":token,"Content-Type":"application/json","Accept":"audio/mpeg"},
  body:JSON.stringify({text:a.prompt,loop:false,model_id:config.modelId,duration_seconds:a.durationSeconds,prompt_influence:config.promptInfluence}),
  signal:AbortSignal.timeout(90000)
 });
 if(!res.ok)throw new Error("ElevenLabs SFX HTTP "+res.status+" para "+a.id+"; verifique créditos/permissões.");
 const audio=Buffer.from(await res.arrayBuffer());
 const looksMp3=audio.subarray(0,3).toString("ascii")==="ID3"||(audio[0]===255&&(audio[1]&0xe0)===0xe0);
 if(audio.length<2500||!looksMp3)throw new Error("Resposta SFX inválida: "+a.id);
 await fs.writeFile(dest,audio,{mode:0o600});
 console.log("GERADO "+a.id+" "+audio.length+" bytes | "+dest);
}
console.log("Próximo: npm run sfx:check e npm run final:render -- --format=wide --sfx=on.");
