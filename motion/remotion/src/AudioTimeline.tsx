import React from "react";
import {AbsoluteFill,interpolate,staticFile,useCurrentFrame} from "remotion";
import {Audio} from "@remotion/media";
import film from "../film.config.json";
import production from "../../../brand-center/data/audio-production.json";

export type AudioMode="silent"|"stems"|"master";
type Props={mode:AudioMode;musicEnabled?:boolean;soundEffectsEnabled?:boolean};
const startFrames=film.scenes.map((_,i)=>film.scenes.slice(0,i).reduce((sum,s)=>sum+s.frames-film.transitionFrames,0));
const windows=production.scenes.map((s,i)=>({
 start:startFrames[i]+production.leadInFrames,
 end:startFrames[i]+film.scenes[i].frames-18,
 filename:s.filename,
 id:s.id
}));
const limit=(frame:number,a:number,b:number)=>Math.max(0,Math.min(1,(frame-a)/(b-a)));
export const AudioTimeline:React.FC<Props>=({mode,musicEnabled=false,soundEffectsEnabled=false})=>{
 const frame=useCurrentFrame();
 if(mode==="silent")return null;
 if(mode==="master")return <AbsoluteFill><Audio src={staticFile("audio/mix/final-mix.wav")} volume={1} name="MASTER / Adobe Audition" /></AbsoluteFill>;

 const fade=limit(frame,0,production.mix.fadeInFrames)*
  (1-limit(frame,film.totalFrames-production.mix.fadeOutFrames,film.totalFrames));
 const speech=Math.max(0,...windows.map(w=>Math.min(limit(frame,w.start-15,w.start),1-limit(frame,w.end,w.end+15))));
 const bgVolume=fade*(production.mix.musicLevelBetweenVoice-
  speech*(production.mix.musicLevelBetweenVoice-production.mix.musicLevelDuringVoice));
 return <AbsoluteFill>
  {musicEnabled&&<Audio loop src={staticFile("audio/music/bed.wav")} volume={bgVolume} name="MUSIC / ducking automático"/>}
  {windows.map(w=><Audio key={w.id} src={staticFile("audio/voice/"+w.filename)}
    from={w.start} durationInFrames={w.end-w.start} volume={production.mix.voiceLevel}
    name={"VOICE / "+w.id} onError={()=>"fail"}/>)}
  {soundEffectsEnabled&&production.soundDesign.map(e=>{
    const idx=film.scenes.findIndex(scene=>scene.id===e.scene);
    const begin=startFrames[idx]+e.offsetFrames;
    return <Audio key={e.id} src={staticFile("audio/sfx/"+e.filename)} from={begin}
      volume={production.mix.sfxLevel*fade} name={"FX / "+e.id} onError={()=>"fail"}/>;
  })}
 </AbsoluteFill>;
};
