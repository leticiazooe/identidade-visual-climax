#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {fileURLToPath} from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const repo=path.resolve(root,"../..");
const argv=process.argv.slice(2);
const action=argv[0]||"plan";
const flag=(name)=>argv.includes(name);
const option=(name,fallback=null)=>argv.find(x=>x.startsWith(name+"="))?.slice(name.length+1)??fallback;
const key=process.env.ELEVENLABS_API_KEY;
const voiceId=option("--voice",process.env.ELEVENLABS_VOICE_ID);
const manifest=path.resolve(option("--manifest",path.join(repo,"brand-center/data/audio-production.json")));
const outputDir=path.join(root,"public/audio/voice");
const wait=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
async function request(url,options={}){
 if(!key)throw new Error("ELEVENLABS_API_KEY não configurada. Não adicione segredos ao HTML ou Git.");
 for(let attempt=0;attempt<3;attempt++){
  const response=await fetch("https://api.elevenlabs.io"+url,{...options,headers:{"xi-api-key":key,...options.headers},signal:AbortSignal.timeout(60000)});
  if(response.ok)return response;
  if((response.status===429||response.status>=500)&&attempt<2){await wait(2000*(attempt+1));continue;}
  throw new Error("ElevenLabs HTTP "+response.status+" (confira créditos, voice ID e permissões).");
 }
 throw new Error("Serviço de voz indisponível.");
}
async function main(){
 if(action==="help"){
  console.log("Comandos: voice:plan (gratuito); voice:list (chave); voice:generate -- --scene=care --generate; voice:generate -- --all --generate (consome créditos).");
  return;
 }
 if(action==="list"){
  const response=await request("/v2/voices?page_size=50");
  const data=await response.json();
  for(const v of data.voices||[])console.log(v.voice_id+"\t"+v.name+"\t"+(v.labels?.language||v.labels?.accent||""));
  return;
 }
 if(action!=="plan"&&action!=="generate")throw new Error("Ação inválida: "+action);
 const data=JSON.parse(await fs.readFile(manifest,"utf8"));
 const film=JSON.parse(await fs.readFile(path.join(root,"film.config.json"),"utf8"));
 if(data.scenes.length!==film.scenes.length)throw new Error("Número de cenas diferente do filme");
 let cursor=0;
 for(let i=0;i<data.scenes.length;i++){
  const s=data.scenes[i],f=film.scenes[i];
  if(s.id!==f.id||s.frames!==f.frames||!s.text?.trim()||s.text.length>650)throw new Error("Cena inválida: "+f.id);
  if(!/^[a-z0-9-]+\.mp3$/.test(s.filename))throw new Error("Nome de áudio inválido");
  if(action==="plan")console.log((cursor/film.fps).toFixed(2)+"s | "+s.id+" | "+s.text);
  cursor+=f.frames-(i===data.scenes.length-1?0:film.transitionFrames);
 }
 if(cursor!==film.totalFrames)throw new Error("Duração inconsistente");
 if(action==="plan"){console.log("Roteiro OK. Nenhum crédito ElevenLabs consumido.");return;}
 const scene=option("--scene");
 if(!flag("--generate")||(!flag("--all")&&!scene))throw new Error("Para autorizar cobrança, passe --generate com --all ou --scene=ID.");
 if(!key)throw new Error("Configure ELEVENLABS_API_KEY localmente.");
 if(!voiceId||!/^[A-Za-z0-9_-]{10,80}$/.test(voiceId))throw new Error("Configure ELEVENLABS_VOICE_ID válido.");
 const selected=data.scenes.filter(s=>flag("--all")||s.id===scene);
 if(!selected.length)throw new Error("Cena não encontrada: "+scene);
 await fs.mkdir(outputDir,{recursive:true});
 for(const s of selected){
  const target=path.join(outputDir,s.filename);
  if(!flag("--force")){try{await fs.access(target);console.log("SKIP já existente:",s.filename);continue;}catch{}}
  const response=await request("/v1/text-to-speech/"+encodeURIComponent(voiceId)+"?output_format=mp3_44100_128",{
   method:"POST",headers:{"Content-Type":"application/json","Accept":"audio/mpeg"},
   body:JSON.stringify({text:s.text,model_id:data.modelId||"eleven_multilingual_v2",voice_settings:data.voiceProfile?.settings})
  });
  const buffer=Buffer.from(await response.arrayBuffer());
  const mp3=buffer.subarray(0,3).toString("ascii")==="ID3"||buffer[0]===255&&(buffer[1]&0xe0)===0xe0;
  if(!mp3||buffer.length<3000)throw new Error("Arquivo de voz inválido: "+s.id);
  await fs.writeFile(target,buffer,{mode:0o600});
  console.log("CRIADO",s.filename,Math.round(buffer.length/1024)+" KiB");
  await wait(450);
 }
}
main().catch(e=>{console.error("Erro:",e.message);process.exitCode=1;});
