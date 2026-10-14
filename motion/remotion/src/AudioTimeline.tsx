import React from "react";
import {AbsoluteFill,Sequence,staticFile,useCurrentFrame} from "remotion";
import {Audio} from "@remotion/media";
import film from "../film.config.json";
import production from "../../../brand-center/data/audio-production.json";
import sound from "../../../brand-center/data/sound-design.json";

export type AudioMode="silent"|"stems"|"master";
type Props={mode:AudioMode;musicEnabled?:boolean;musicVolume?:number;soundEffectsEnabled?:boolean;sfxVolume?:number};
const startFrames=film.scenes.map((_,i)=>film.scenes.slice(0,i).reduce((sum,s)=>sum+s.frames-film.transitionFrames,0));
const windows=production.scenes.map((s,i)=>({
 start:startFrames[i]+production.leadInFrames,
 end:startFrames[i]+film.scenes[i].frames-18,
 filename:s.filename,
 id:s.id
}));
const limit=(frame:number,a:number,b:number)=>Math.max(0,Math.min(1,(frame-a)/(b-a)));
export const AudioTimeline:React.FC<Props>=({mode,musicEnabled=false,musicVolume=0.16,soundEffectsEnabled=false,sfxVolume=1})=>{
 const frame=useCurrentFrame();
 if(mode==="silent"&&!musicEnabled&&!soundEffectsEnabled)return null;
 if(mode==="master")return <AbsoluteFill><Audio src={staticFile("audio/mix/final-mix.wav")} volume={1} name="MASTER / Adobe Audition" /></AbsoluteFill>;

 const fade=limit(frame,0,production.mix.fadeInFrames)*
  (1-limit(frame,film.totalFrames-production.mix.fadeOutFrames,film.totalFrames));
 const speech=mode==="silent"?0:Math.max(0,...windows.map(w=>Math.min(limit(frame,w.start-15,w.start),1-limit(frame,w.end,w.end+15))));
 const gain=Math.max(0,Math.min(0.32,musicVolume));
 const bgVolume=fade*gain*(1-speech*0.46);
 return <AbsoluteFill>
  {musicEnabled&&<Audio loop src={staticFile("audio/music/bed.wav")} volume={bgVolume} name="MUSIC / ducking automático"/>}
  {mode==="stems"&&windows.map(w=><Audio key={w.id} src={staticFile("audio/voice/"+w.filename)}
    from={w.start} durationInFrames={w.end-w.start} volume={production.mix.voiceLevel}
    name={"VOICE / "+w.id} onError={()=>"fail"}/>)}
  {soundEffectsEnabled&&sound.cues.map(cue=>{
    const asset=sound.assets.find(a=>a.id===cue.assetId);
    if(!asset)return null;
    const sceneIndex=film.scenes.findIndex(scene=>scene.id===cue.scene);
    const start=startFrames[sceneIndex]+cue.offsetFrames;
    const duration=Math.ceil(asset.durationSeconds*film.fps);
    const fadeIn=Math.min(8,Math.floor(duration/4));
    const fadeOut=Math.min(14,Math.floor(duration/4));
    const local=frame-start;
    const attack=limit(local,0,fadeIn||1);
    const release=1-limit(local,duration-fadeOut,duration);
    const voiceDucking=1-0.42*speech;
    const level=Math.max(0,Math.min(1,sfxVolume))*asset.volume*voiceDucking*attack*release;
    return <Sequence key={cue.id} from={start} durationInFrames={duration} layout="none">
      <Audio src={staticFile("audio/sfx/"+asset.filename)} volume={level} name={"SFX / "+cue.scene+" / "+asset.id}/>
    </Sequence>;
  })}
 </AbsoluteFill>;
};
