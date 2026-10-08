import fs from "node:fs/promises";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const options=process.argv.slice(2);
const get=(k,def)=>options.find(v=>v.startsWith(k+"="))?.slice(k.length+1)??def;
const mode=get("--mode","stems");
const format=get("--format","wide");
const variants={wide:"16x9",vertical:"9x16",portrait:"4x5",square:"1x1"};
if(!variants[format]||!["stems","master"].includes(mode))throw new Error("Use --format=wide|vertical|portrait|square e --mode=stems|master");
const validate=spawnSync(process.execPath,[path.join(root,"scripts/check-audio.mjs"),"--"+mode],{stdio:"inherit"});
if(validate.status!==0)process.exit(validate.status||1);
const sync=spawnSync(process.execPath,[path.join(root,"scripts/sync-assets.mjs")],{stdio:"inherit"});
if(sync.status!==0)process.exit(sync.status||1);
const propsFile=path.join(root,".audio-render-props.json");
await fs.writeFile(propsFile,JSON.stringify({variant:format,audioMode:mode}));
try{
 const cmd=process.platform==="win32"?"npx.cmd":"npx";
 const result=spawnSync(cmd,["remotion","render","src/index.ts","CLIMAX-Film-"+variants[format],"out/climax-film-"+variants[format]+"-"+mode+".mp4","--codec=h264","--props="+propsFile],{cwd:root,stdio:"inherit"});
 if(result.error)throw result.error;
 if(result.status!==0)process.exitCode=result.status||1;
}finally{await fs.rm(propsFile,{force:true});}
