#!/usr/bin/env node
/** Explicitly publish an existing and reviewed final MP4 to a GitHub release.
 * Never uploads narration stems, keys, or source projects. */
import fs from "node:fs/promises";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const repo=path.resolve(root,"../..");
const options=process.argv.slice(2),get=(key,def)=>options.find(x=>x.startsWith("--"+key+"="))?.slice(key.length+3)??def;
const fmt=get("format","wide"),tag=get("tag","climax-motion-final-v1");
const keys={wide:"16x9",vertical:"9x16",portrait:"4x5",square:"1x1"};
if(!(fmt in keys)||!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(tag))throw new Error("Formato ou tag inválido.");
if(!options.includes("--publish"))throw new Error("A publicação precisa de autorização explícita: --publish");
const fileName="climax-final-"+keys[fmt]+".mp4";
const filePath=path.join(root,"out",fileName);
await fs.access(filePath);
const check=spawnSync("ffprobe",["-v","error","-show_entries","stream=codec_type,codec_name","-of","json",filePath],{encoding:"utf8"});
if(check.error||check.status!==0)throw new Error("Instale ffprobe para validar o MP4 antes de publicar.");
const streams=JSON.parse(check.stdout).streams||[];
if(!streams.some(x=>x.codec_type==="audio"&&x.codec_name==="aac")||!streams.some(x=>x.codec_type==="video"&&x.codec_name==="h264"))throw new Error("MP4 sem voz/mixagem AAC e vídeo H.264");
const gh=process.platform==="win32"?"gh.exe":"gh";
const run=(argv,allowFailure=false)=>{const p=spawnSync(gh,argv,{encoding:"utf8",stdio:["ignore","pipe","pipe"]});if(p.error||p.status!==0){if(allowFailure)return false;throw new Error("GitHub CLI não autorizado ou falhou: "+(p.stderr||p.error?.message||"erro").slice(0,350));}return true;};
const name="CLIMAX Motion | Versão final com narração";
const targetRepo="leticiazooe/identidade-visual-climax";
if(!run(["release","view",tag,"-R",targetRepo],true))run(["release","create",tag,"-R",targetRepo,"--title",name,"--notes","Exports finais aprovados: motion CLIMAX com locução e música de fundo."]);
run(["release","upload",tag,filePath,"-R",targetRepo,"--clobber"]);
const registryPath=path.join(repo,"brand-center/data/final-exports.json");
const registry=JSON.parse(await fs.readFile(registryPath,"utf8"));
const url="https://github.com/"+targetRepo+"/releases/download/"+tag+"/"+fileName;
registry.formats[fmt].url=url;
registry.formats[fmt].publishedAt=new Date().toISOString();
registry.state="partially-published";
registry.updated=new Date().toISOString().slice(0,10);
await fs.writeFile(registryPath,JSON.stringify(registry,null,2)+"\n");
console.log("MP4 enviado com sucesso para GitHub Releases:",url);
console.log("ATENÇÃO: para habilitar o botão no site, versione e publique o manifesto atualizado:");
console.log("git add brand-center/data/final-exports.json && git commit -m \"chore: publica MP4 final CLIMAX\" && git push origin main");
