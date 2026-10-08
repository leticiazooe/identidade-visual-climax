import {chromium} from "playwright";
import {mkdir,stat,readFile} from "node:fs/promises";
import path from "node:path";

const base=process.env.TEST_URL||"http://127.0.0.1:8000/brand-center/post-studio/";
const output=path.resolve("out");
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const page=await browser.newPage({viewport:{width:1700,height:1150},deviceScaleFactor:1,acceptDownloads:true});
const errors=[];
page.on("pageerror",error=>errors.push(error.message));
page.on("console",message=>{if(message.type()==="error")errors.push(message.text());});
try{
 const response=await page.goto(base,{waitUntil:"domcontentloaded",timeout:60000});
 if(!response?.ok())throw new Error("Editor não respondeu HTTP 200");
 await page.waitForTimeout(2300);
 console.log("INIT",JSON.stringify(await page.evaluate(()=>({url:location.href,preset:document.getElementById("preset")?.options.length,notice:document.getElementById("progress")?.textContent,scripts:[...document.scripts].map(s=>s.src)}))));
 console.log("BROWSER-ERRORS",errors);
 await page.locator("#preset option").first().waitFor({state:"attached",timeout:10000});
 await page.locator("#artMascot").evaluate(img=>img.decode());
 const formats=await page.locator("#format option").evaluateAll(items=>items.map(item=>item.value));
 if(formats.length!==7)throw new Error("Esperados 7 formatos, obtidos "+formats.length);
 for(const id of formats){
  await page.selectOption("#format",id);
  await page.waitForTimeout(450);
  const metrics=await page.evaluate(()=>{
   const art=document.getElementById("artwork"),s=document.getElementById("dimension");
   return {w:parseInt(art.style.getPropertyValue("--w")),h:parseInt(art.style.getPropertyValue("--h")),label:s.textContent,mascotReady:document.getElementById("artMascot").naturalWidth>0,logoReady:document.getElementById("postLogo").naturalWidth>0,title:document.getElementById("artHeadline").textContent};
  });
  if(!metrics.w||!metrics.h||!metrics.logoReady||!metrics.mascotReady||!metrics.title)throw new Error("Falha de conteúdo/imagem: "+id+" "+JSON.stringify(metrics));
  await page.screenshot({path:path.join(output,id+".png"),fullPage:true});
  console.log("PASS:",id,metrics.w+"x"+metrics.h,metrics.label);
 }
 for(const id of formats){
  await page.selectOption("#format",id);
  const [download]=await Promise.all([page.waitForEvent("download",{timeout:120000}),page.locator("#exportPng").click()]);
  const file=path.join(output,id+"-export.png");
  await download.saveAs(file);
  const bytes=await readFile(file);
  const expected=await page.evaluate(()=>{
   const art=document.getElementById("artwork");
   return {w:Number.parseInt(art.style.getPropertyValue("--w")),h:Number.parseInt(art.style.getPropertyValue("--h"))};
  });
  if(bytes.length<50000)throw new Error("PNG vazio: "+id+" "+bytes.length);
  if(bytes.subarray(0,8).toString("hex")!=="89504e470d0a1a0a")throw new Error("Assinatura PNG inválida: "+id);
  const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20);
  if(width!==expected.w||height!==expected.h)throw new Error("Dimensões incorretas: "+id+" "+width+"x"+height);
  console.log("PASS export PNG",id,width+"x"+height,bytes.length+" bytes");
 }
 await page.selectOption("#format","facebookFeed");
 const [jpegDownload]=await Promise.all([page.waitForEvent("download",{timeout:120000}),page.locator("#exportJpeg").click()]);
 const jpegFile=path.join(output,"facebookFeed-export.jpeg");
 await jpegDownload.saveAs(jpegFile);
 const jpeg=await readFile(jpegFile);
 if(jpeg.length<50000||jpeg[0]!==0xff||jpeg[1]!==0xd8)throw new Error("Exportação JPEG inválida.");
 console.log("PASS export JPEG facebookFeed",jpeg.length+" bytes");
 if(errors.length)throw new Error("Erros no navegador: "+errors.join(" | ").slice(0,2000));
 console.log("PASS: 7 screenshots, 7 PNGs dimensionados, JPEG, imagens oficiais e ausência de erros.");
}catch(err){await page.screenshot({path:path.join(output,"startup-failure.png"),fullPage:true}).catch(()=>null);throw err;}finally{await browser.close();}
