import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../../..');
const expected=['assets/logos/ESCRITA BRANCA PNG.png','assets/mascotes/06-mascote-com-manifold.png','brand-center/data/tokens.json'];
for(const p of expected){if(!fs.existsSync(path.join(root,p)))throw new Error('Asset ausente: '+p);}
const m=JSON.parse(fs.readFileSync(path.resolve(here,'../film.config.json'),'utf8'));
if(m.scenes.length<7)throw new Error('Filme não possui cenas suficientes.');
const total=m.scenes.reduce((n,s)=>n+s.frames,0)-(m.scenes.length-1)*m.transitionFrames;
if(total!==m.totalFrames||total/m.fps<55)throw new Error('Duração inválida: '+total);
for(const s of m.scenes){if(s.frames<=m.transitionFrames)throw new Error('Cena curta demais: '+s.id);}
console.log('OK: '+m.scenes.length+' cenas / '+m.totalFrames+' frames / '+(total/m.fps).toFixed(1)+'s');
