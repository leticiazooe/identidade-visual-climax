#!/usr/bin/env node
/** Render final MP4 with narration + soft background music.
 * Prereqs: 8 licensed narrations generated locally; Node, FFmpeg, Remotion.
 * Audio is NOT sent to the public Brand Center or the repository. */
import fs from "node:fs/promises";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const options=process.argv.slice(2);
const opt=(name,def)=>options.find(x=>x.startsWith("--"+name+"="))?.slice(name.length+3)??def;
const format=opt("format","wide"),mode=opt("mode","stems");
const variants={wide:"16x9",vertical:"9x16",portrait:"4x5",square:"1x1"};
if(!(format in variants)||!["stems","master"].includes(mode))throw new Error("Formato: wide, vertical, portrait, square; modo: stems ou master.");
const musicChoice=opt("music","original");
const vol=Number(opt("music-volume","0.16"));
if(!Number.isFinite(vol)||vol<0||vol>0.32)throw new Error("Volume de música permitido: 0 a 0.32.");
const args=(cmd,argv,{cwd=root}={})=>{
 const run=spawnSync(cmd,argv,{cwd,stdio:"inherit"});
 if(run.error||run.status!==0)throw new Error("Falha em "+cmd+" ("+(run.status??run.error?.message)+")");
};
const musicFile=path.join(root,"public/audio/music/bed.wav");
if(mode==="stems"){
 args(process.execPath,["scripts/check-audio.mjs","--stems"]);
 if(musicChoice==="original"){
  try{await fs.access(musicFile);}catch{args(process.execPath,["scripts/generate-ambient.mjs"]);}
 }else if(musicChoice!=="off"){
  const src=path.resolve(musicChoice);
  if(src===musicFile)throw new Error("Não use --music apontando para a saída atual. Escolha um arquivo original.");
  await fs.access(src);
  await fs.mkdir(path.dirname(musicFile),{recursive:true});
  args("ffmpeg",["-hide_banner","-loglevel","error","-y","-i",src,"-ar","48000","-ac","2","-c:a","pcm_s16le",musicFile]);
 }
 await fs.access(musicChoice==="off"?path.join(root,"film.config.json"):musicFile);
}else{
 args(process.execPath,["scripts/check-audio.mjs","--master"]);
 if(musicChoice!=="off")console.warn("Modo master: a mixagem Audition já deve conter a música. Não será adicionada outra trilha.");
}
args(process.execPath,["scripts/sync-assets.mjs"]);
const outputName="climax-final-"+variants[format]+".mp4";
const output=path.join(root,"out",outputName);
await fs.mkdir(path.dirname(output),{recursive:true});
const propsFile=path.join(root,".final-render-props.json");
await fs.writeFile(propsFile,JSON.stringify({
 variant:format,audioMode:mode,musicEnabled:mode==="stems"&&musicChoice!=="off",
 musicVolume:vol,soundEffectsEnabled:false
}));
try{
 const bin=process.platform==="win32"?"npx.cmd":"npx";
 args(bin,["remotion","render","src/index.ts","CLIMAX-Film-"+variants[format],"out/"+outputName,"--codec=h264","--audio-codec=aac","--props="+propsFile]);
 const probe=spawnSync("ffprobe",["-v","error","-show_entries","stream=codec_type,codec_name","-of","json",output],{encoding:"utf8"});
 if(probe.error||probe.status!==0)throw new Error("Não foi possível validar codecs finais. Instale ffprobe.");
 const streams=JSON.parse(probe.stdout).streams??[];
 if(!streams.some(x=>x.codec_type==="video"&&x.codec_name==="h264")||!streams.some(x=>x.codec_type==="audio"&&x.codec_name==="aac"))throw new Error("Arquivo final não contém vídeo H.264 e áudio AAC.");
 console.log("MP4 FINAL COM NARRAÇÃO "+(musicChoice==="off"?"":"E MÚSICA")+" DISPONÍVEL EM: "+output);
 console.log("Valide a mixagem ao ouvir o resultado antes de publicar.");
}catch(error){await fs.rm(output,{force:true});throw error;}finally{await fs.rm(propsFile,{force:true});}
