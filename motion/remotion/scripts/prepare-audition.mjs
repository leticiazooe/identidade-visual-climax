#!/usr/bin/env node
/**
 * Adobe Audition handoff: verified WAV stems and aligned voice mix.
 * Audition's native .sesx session must be created/saved by Audition itself.
 */
import fs from "node:fs/promises";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const repo=path.resolve(root,"../..");
const project=JSON.parse(await fs.readFile(path.join(repo,"brand-center/data/audio-production.json"),"utf8"));
const film=JSON.parse(await fs.readFile(path.join(root,"film.config.json"),"utf8"));
const target=path.join(root,"audio-workspace/audition");
const voiceOut=path.join(target,"01-voice");
for(const dir of ["01-voice","02-music","03-sfx","04-mixdown"])await fs.mkdir(path.join(target,dir),{recursive:true});
const run=(exe,args,opts={})=>{
 const out=spawnSync(exe,args,{...opts,encoding:"utf8"});
 if(out.error||out.status!==0)throw new Error(exe+" falhou: "+(out.stderr||out.error?.message||"erro desconhecido").slice(-700));
 return out.stdout||"";
};
run("ffmpeg",["-version"]);
const tracks=[],rows=[["Cena","Início (s)","Duração disponível (s)","Texto","Arquivo"]];
let cursor=0;
for(let i=0;i<project.scenes.length;i++){
 const s=project.scenes[i],f=film.scenes[i];
 const src=path.join(root,"public/audio/voice",s.filename);
 const to=path.join(voiceOut,s.filename.replace(/\.mp3$/,".wav"));
 const start=(cursor+project.leadInFrames)/film.fps;
 const available=(f.frames-project.leadInFrames-18)/film.fps;
 await fs.access(src);
 const duration=Number(run("ffprobe",["-v","error","-show_entries","format=duration","-of","default=noprint_wrappers=1:nokey=1",src]).trim());
 if(!Number.isFinite(duration)||duration<=0||duration>available)throw new Error("Locução "+s.id+" tem "+duration.toFixed(2)+"s; limite da cena "+available.toFixed(2)+"s. Encurte texto ou ajuste a timeline antes de mixar.");
 run("ffmpeg",["-hide_banner","-loglevel","error","-y","-i",src,"-ar","48000","-ac","1","-c:a","pcm_s24le",to]);
 tracks.push({src:to,start});
 rows.push([s.id,start.toFixed(3),available.toFixed(3),s.text,path.basename(to)]);
 cursor+=f.frames-(i===project.scenes.length-1?0:film.transitionFrames);
}
const csvCell=x=>'"'+String(x).replaceAll('"','""')+'"';
await fs.writeFile(path.join(target,"cue-sheet.csv"),rows.map(row=>row.map(csvCell).join(",")).join("\n")+"\n");
const secs=(film.totalFrames/film.fps).toFixed(3);
const filters=tracks.map((t,i)=>"["+i+":a]adelay="+Math.round(t.start*1000)+":all=1,apad,atrim=0:"+secs+"[a"+i+"]").join(";")+";"+tracks.map((_,i)=>"[a"+i+"]").join("")+"amix=inputs="+tracks.length+":duration=longest:normalize=0,alimiter=limit=0.88[aligned]";
run("ffmpeg",["-hide_banner","-loglevel","error","-y",...tracks.flatMap(t=>["-i",t.src]),"-filter_complex",filters,"-map","[aligned]","-ar","48000","-ac","2","-c:a","pcm_s24le","-t",secs,path.join(voiceOut,"voiceover-aligned.wav")]);
for(const [source,dest] of [["public/audio/music/bed.wav","02-music/bed.wav"],["public/audio/sfx/rise.wav","03-sfx/rise.wav"],["public/audio/sfx/airflow.wav","03-sfx/airflow.wav"]]){
 try{await fs.copyFile(path.join(root,source),path.join(target,dest));}catch{}
}
const guide=[
"# CLIMAX — Entrega para Adobe Audition",
"",
"1. Crie uma sessão multitrack 48 kHz no Adobe Audition e salve como CLIMAX-VO-MIX.sesx dentro desta pasta.",
"2. Importe 01-voice/voiceover-aligned.wav na faixa VOICE, começando em 00:00.",
"3. Se houver licença adequada, importe 02-music/bed.wav na faixa MUSIC.",
"4. Importe SFX aprovados na faixa FX e use cue-sheet.csv para posicionar cada evento.",
"5. Faça cortes, de-esser leve, EQ corretiva, compressão suave e automação de volume. Evite clipping.",
"6. Confira pausas, pronúncias e equilíbrio entre fala/trilha; compare em fone e alto-falantes.",
"7. Exporte sessão inteira em WAV estéreo 48 kHz / 24-bit, com o nome 04-mixdown/final-mix.wav.",
"8. Execute npm run audition:import, seguido de npm run render:audio:wide -- --mode=master.",
"",
"Alvos editoriais preliminares: -16 LUFS integrado e pico verdadeiro de no máximo -1,5 dBTP.",
"Estas metas NÃO foram medidas pelo gerador. Validar medição real no Audition.",
"Arquivos de voz, música, sessão e mixagem ficam apenas na máquina de produção, fora do Git."
].join("\n");
await fs.writeFile(path.join(target,"README-AUDITION.md"),guide+"\n");
console.log("Pacote Audition pronto:",target);
