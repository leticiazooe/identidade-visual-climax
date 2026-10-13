import React from "react";
import {AbsoluteFill,Composition,Folder} from "remotion";
import {ClimaxFilm} from "./ClimaxFilm";
import {AudioTimeline,type AudioMode} from "./AudioTimeline";
import film from "../film.config.json";
type Variant="wide"|"vertical"|"portrait"|"square";
type ProductionProps={variant:Variant;audioMode?:AudioMode;musicEnabled?:boolean;musicVolume?:number;soundEffectsEnabled?:boolean;sfxVolume?:number};
const Production:React.FC<ProductionProps>=({variant,audioMode="silent",musicEnabled=false,musicVolume=0.16,soundEffectsEnabled=false,sfxVolume=1})=>
 <AbsoluteFill>
  <ClimaxFilm variant={variant}/>
  <AudioTimeline mode={audioMode} musicEnabled={musicEnabled} musicVolume={musicVolume} soundEffectsEnabled={soundEffectsEnabled} sfxVolume={sfxVolume}/>
 </AbsoluteFill>;
const defaultProps=(variant:Variant):ProductionProps=>({variant,audioMode:"silent",musicEnabled:false,musicVolume:0.16,soundEffectsEnabled:false,sfxVolume:1});
export const RemotionRoot:React.FC=()=>(
 <Folder name="CLIMAX-Filmes-de-Marca">
  <Composition id="CLIMAX-Film-16x9" component={Production} durationInFrames={film.totalFrames} fps={film.fps} width={film.formats["16x9"].width} height={film.formats["16x9"].height} defaultProps={defaultProps("wide")}/>
  <Composition id="CLIMAX-Film-9x16" component={Production} durationInFrames={film.totalFrames} fps={film.fps} width={film.formats["9x16"].width} height={film.formats["9x16"].height} defaultProps={defaultProps("vertical")}/>
  <Composition id="CLIMAX-Film-4x5" component={Production} durationInFrames={film.totalFrames} fps={film.fps} width={film.formats["4x5"].width} height={film.formats["4x5"].height} defaultProps={defaultProps("portrait")}/>
  <Composition id="CLIMAX-Film-1x1" component={Production} durationInFrames={film.totalFrames} fps={film.fps} width={film.formats["1x1"].width} height={film.formats["1x1"].height} defaultProps={defaultProps("square")}/>
 </Folder>
);
