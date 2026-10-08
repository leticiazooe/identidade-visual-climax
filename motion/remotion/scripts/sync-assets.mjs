import {cp,mkdir,access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../../../',import.meta.url));
const here=fileURLToPath(new URL('../',import.meta.url));
for(const segment of ['logos','mascotes']){
 const from=path.join(root,'assets',segment);
 await access(from);
 const to=path.join(here,'public','assets',segment);
 await mkdir(to,{recursive:true});
 await cp(from,to,{recursive:true,force:true});
 console.log('Assets sincronizados:',segment);
}
