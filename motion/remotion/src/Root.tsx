import React from "react";
import {Composition,Folder} from "remotion";
import {ClimaxFilm} from "./ClimaxFilm";
import manifest from "../film.config.json";
const dims=manifest.formats;
export const RemotionRoot:React.FC=()=>(
 <Folder name="CLIMAX-Filmes-de-Marca">
  <Composition id="CLIMAX-Film-16x9" component={ClimaxFilm} durationInFrames={manifest.totalFrames} fps={manifest.fps} width={dims["16x9"].width} height={dims["16x9"].height} defaultProps={{variant:"wide" as const}}/>
  <Composition id="CLIMAX-Film-9x16" component={ClimaxFilm} durationInFrames={manifest.totalFrames} fps={manifest.fps} width={dims["9x16"].width} height={dims["9x16"].height} defaultProps={{variant:"vertical" as const}}/>
  <Composition id="CLIMAX-Film-4x5" component={ClimaxFilm} durationInFrames={manifest.totalFrames} fps={manifest.fps} width={dims["4x5"].width} height={dims["4x5"].height} defaultProps={{variant:"portrait" as const}}/>
  <Composition id="CLIMAX-Film-1x1" component={ClimaxFilm} durationInFrames={manifest.totalFrames} fps={manifest.fps} width={dims["1x1"].width} height={dims["1x1"].height} defaultProps={{variant:"square" as const}}/>
 </Folder>
);
