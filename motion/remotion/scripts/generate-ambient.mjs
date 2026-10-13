#!/usr/bin/env node
/** CLIMAX ambient bed: original deterministic procedural composition.
 * No third-party music sample or license is used. Produces 48 kHz stereo WAV. */
import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const story=JSON.parse(await fs.readFile(path.join(root,"film.config.json"),"utf8"));
const seconds=Number(process.argv.find(v=>v.startsWith("--seconds="))?.slice(10)??(story.totalFrames/story.fps));
if(!Number.isFinite(seconds)||seconds<=0||seconds>600)throw new Error("Duração deve ser de 1 a 600 segundos.");
const rate=48000,frames=Math.ceil(seconds*rate),samples=Buffer.allocUnsafe(frames*4);
const output=path.join(root,"public/audio/music/bed.wav");
const triads=[
 [146.83,174.61,220,329.63], // Dm(add9)
 [116.54,146.83,220,293.66], // Bbmaj7
 [130.81,174.61,220,329.63], // Fmaj9
 [130.81,164.81,196,293.66]  // C(add9)
];
const chordSeconds=11.7,fade=2.4;
const TAU=Math.PI*2;
const harmonic=(f,t,detune)=>Math.sin(TAU*f*t*(1+detune))*.65+Math.sin(TAU*2*f*t*(1+detune))*.18+Math.sin(TAU*.5*f*t*(1+detune))*.17;
const value=(i,t,pan)=>{
 const notes=triads[(i+triads.length)%triads.length];
 const phases=[.11,.48,.29,.74];
 let out=0;
 for(let n=0;n<4;n++){
  const f=notes[n];const base=harmonic(f,t,pan*.0018+(n-2)*.00055);
  const slow=.82+.18*Math.sin(TAU*.11*t+n*1.4);
  out+=base*slow*(n===0?.3:.2);
 }
 const tick=(t%3.14)/3.14;
 const bell=Math.exp(-tick*5)*Math.sin(TAU*(notes[3]*2)*t)*.025;
 return out+bell;
};
for(let n=0;n<frames;n++){
 const t=n/rate;
 const s=t/chordSeconds,idx=Math.floor(s),p=s-idx;
 const blend=p<fade/chordSeconds?(Math.sin((p*chordSeconds/fade)*Math.PI/2)**2):1;
 const prev=idx===0?idx:idx-1;
 const a=p<fade/chordSeconds?1-blend:0, b=p<fade/chordSeconds?blend:1;
 const entrance=Math.min(1,t/2.4),exit=Math.min(1,(seconds-t)/4.5);
 const fadeGain=Math.max(0,Math.min(entrance,exit));
 const left=(a*value(prev,t,-1)+b*value(idx,t,-1))*.75*fadeGain;
 const right=(a*value(prev,t,1)+b*value(idx,t,1))*.75*fadeGain;
 samples.writeInt16LE(Math.max(-32767,Math.min(32767,Math.round(left*32767))),n*4);
 samples.writeInt16LE(Math.max(-32767,Math.min(32767,Math.round(right*32767))),n*4+2);
}
const wav=Buffer.alloc(44);
wav.write("RIFF",0);wav.writeUInt32LE(samples.length+36,4);wav.write("WAVEfmt ",8);
wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(2,22);
wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*4,28);wav.writeUInt16LE(4,32);wav.writeUInt16LE(16,34);
wav.write("data",36);wav.writeUInt32LE(samples.length,40);
await fs.mkdir(path.dirname(output),{recursive:true});
await fs.writeFile(output,Buffer.concat([wav,samples]));
console.log("CLIMAX Ambient Original: "+seconds.toFixed(2)+"s; WAV estéreo 48 kHz; "+output);
console.log("Composição procedural original. Revise musicalmente antes do uso comercial.");
