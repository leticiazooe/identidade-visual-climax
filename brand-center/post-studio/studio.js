const $=(id)=>document.getElementById(id);
const state={posts:[],formats:{},config:null,current:null,formatKey:"instagramFeedPortrait",layout:"editorial",guides:false};
const fields=["kicker","headline","description","cta","caption","benefit1","benefit2","benefit3"];
const toast=(message)=>{$("progress").textContent=message;};
const enc=(file)=>encodeURIComponent(file).replaceAll("%2F","/");
const mascotUrl=(filename)=>state.config.assets.mascotBase+enc(filename);
async function boot(){
 try{
  const [p,f,c]=await Promise.all(["posts.json","formats.json","brand.config.json"].map(async file=>{const r=await fetch("./"+file);if(!r.ok)throw new Error(file+" "+r.status);return r.json();}));
  state.posts=p.posts; state.formats=f.formats;state.config=c;
  $("preset").replaceChildren(...state.posts.map(p=>new Option((p.group==="semana-1"?"Dia ":"Extra ")+p.id.replace(/\D/g,"")+" · "+p.name,p.id)));
  $("format").replaceChildren(...Object.entries(state.formats).map(([key,val])=>new Option(val.label,key)));
  const mascots=[...new Set(state.posts.map(x=>x.mascot))];
  $("mascot").replaceChildren(...mascots.map(file=>new Option(file.replace(/^\d+-/,"").replace(".png","").replaceAll("-"," "),file)));
  for(const name of fields){$(name).addEventListener("input",render);}
  $("mascot").addEventListener("change",render);
  $("layout").addEventListener("change",()=>{state.layout=$("layout").value;render();});
  $("format").addEventListener("change",()=>{state.formatKey=$("format").value;render();});
  $("preset").addEventListener("change",()=>loadPreset($("preset").value));
  $("reset").addEventListener("click",()=>loadPreset($("preset").value,true));
  $("save").addEventListener("click",saveDraft);
  $("exportPng").addEventListener("click",()=>exportOne("png"));
  $("exportJpeg").addEventListener("click",()=>exportOne("jpeg"));
  $("batchZip").addEventListener("click",exportWeek);
  $("copyCaption").addEventListener("click",()=>navigator.clipboard.writeText($("caption").value).then(()=>toast("Legenda copiada.")).catch(()=>toast("Seu navegador bloqueou a cópia automática.")));
  $("downloadJson").addEventListener("click",()=>downloadBlob(new Blob([JSON.stringify(readForm(),null,2)],{type:"application/json"}),"climax-post.json"));
  $("toggleGuides").addEventListener("click",()=>{state.guides=!state.guides;render();});
  window.addEventListener("resize",resizePreview);
  if("ResizeObserver" in window)new ResizeObserver(resizePreview).observe($("stage"));
  const restored=restoreDraft();loadPreset("dia01");
  if(restored&&state.posts.some(x=>x.id===restored.id)){
   $("preset").value=restored.id;loadPreset(restored.id,true);
   Object.entries(restored.fields||{}).forEach(([k,v])=>{if($(k))$(k).value=v;});
   if(state.formats[restored.formatKey])$("format").value=restored.formatKey;
   $("layout").value=restored.layout||"editorial";
   state.formatKey=$("format").value;state.layout=$("layout").value;render();toast("Rascunho local recuperado.");
  }
 }catch(error){console.error(error);toast("Não foi possível abrir o catálogo. Hospede a pasta em HTTP(S) para carregar os arquivos JSON.");}
}
function restoreDraft(){try{return JSON.parse(localStorage.getItem("climax.post-studio.draft.v1")||"null");}catch{return null;}}
function saveDraft(){try{localStorage.setItem("climax.post-studio.draft.v1",JSON.stringify({id:$("preset").value,fields:readForm(),formatKey:state.formatKey,layout:state.layout}));toast("Rascunho salvo neste navegador.");}catch{toast("Não foi possível salvar o rascunho no navegador.");}}
function loadPreset(id){const p=state.posts.find(item=>item.id===id);if(!p)return;state.current=p;$("preset").value=id;["kicker","headline","description","cta","caption"].forEach(k=>$(k).value=p[k]);p.benefits.forEach((v,i)=>$("benefit"+(i+1)).value=v);$("mascot").value=p.mascot;render();}
function readForm(){return {kicker:$("kicker").value,headline:$("headline").value,description:$("description").value,benefits:[1,2,3].map(i=>$("benefit"+i).value).filter(Boolean),cta:$("cta").value,caption:$("caption").value,mascot:$("mascot").value,scene:state.current?.scene||"maintenance"};}
function clear(el){while(el.firstChild)el.removeChild(el.firstChild);}
function draw(p,formatKey=state.formatKey,layout=state.layout){
 const f=state.formats[formatKey],art=$("artwork");
 art.style.setProperty("--w",f.width+"px");art.style.setProperty("--h",f.height+"px");
 art.style.setProperty("--safe-top",f.safe.top/f.height*100+"%");art.style.setProperty("--safe-bottom",f.safe.bottom/f.height*100+"%");art.style.setProperty("--safe-left",f.safe.left/f.width*100+"%");art.style.setProperty("--safe-right",f.safe.right/f.width*100+"%");
 art.dataset.orientation=f.width/f.height>1.5?"wide":f.height/f.width>1.55?"story":f.width===f.height?"square":"portrait";
 art.dataset.layout=layout;
 $("postLogo").src=layout==="editorial"?state.config.assets.logo:state.config.assets.logoWhite;
 $("artMascot").src=mascotUrl(p.mascot);$("artSeries").textContent=(state.current?.id||"CLIMAX").toUpperCase()+" / "+f.platform;
 $("artKicker").textContent=p.kicker;
 const h=$("artHeadline");clear(h);
 const parts=p.headline.split("\n");parts.forEach((part,i)=>{if(i>0)h.appendChild(document.createElement("br"));const span=document.createElement("span");span.className=i?"accent":"";span.textContent=part;h.appendChild(span);});
 $("artDescription").textContent=p.description;$("artCTA").textContent=p.cta;
 const benefits=$("artBenefits");clear(benefits);p.benefits.forEach((b,i)=>{const div=document.createElement("div");div.className="art-benefit";const num=document.createElement("i");num.textContent=String(i+1).padStart(2,"0");div.append(num,document.createTextNode(b));benefits.append(div);});
 const guides=$("safeGuides");guides.hidden=!state.guides;
 $("dimension").textContent=f.width+" × "+f.height;
 $("sizeHint").textContent=f.label+" · "+f.width+"×"+f.height+" px";
 resizePreview();
}
function render(){if(!state.config)return;draw(readForm());}
function resizePreview(){const f=state.formats[state.formatKey];if(!f)return;const root=$("stage"),sizer=$("stageSizer"),art=$("artwork");const availableW=Math.max(180,root.clientWidth-42);const availableH=Math.max(280,root.clientHeight-45);const scale=Math.min(availableW/f.width,availableH/f.height,1);sizer.style.width=f.width*scale+"px";sizer.style.height=f.height*scale+"px";art.style.transform="scale("+scale+")";art.style.transformOrigin="top left";}
function downloadBlob(blob,name){const a=document.createElement("a"),url=URL.createObjectURL(blob);a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),6000);}
function waitImages(root){return Promise.all([...root.querySelectorAll("img")].map(img=>img.decode().catch(()=>{throw new Error("Imagem não carregou: "+img.src)})));}
async function makeBlob(p,formatKey=state.formatKey,kind="png"){
 const art=$("artwork"),original=readForm(),wasGuides=state.guides;
 draw(p,formatKey,state.layout);$("safeGuides").hidden=true;
 await document.fonts.ready;await waitImages(art);
 if(typeof html2canvas!=="function")throw new Error("Biblioteca html2canvas indisponível.");
 const f=state.formats[formatKey];
 const clone=art.cloneNode(true);clone.id="exportCanvas";clone.style.transform="none";clone.style.width=f.width+"px";clone.style.height=f.height+"px";
 const holder=document.createElement("div");Object.assign(holder.style,{position:"fixed",top:"0",left:"-20000px",width:f.width+"px",height:f.height+"px",zIndex:"-1"});holder.append(clone);document.body.append(holder);
 try{await waitImages(clone);const canvas=await html2canvas(clone,{width:f.width,height:f.height,scale:1,useCORS:true,allowTaint:false,backgroundColor:"#FFFFFF",logging:false});
 return await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error("Falha no canvas.")),kind==="jpeg"?"image/jpeg":"image/png",.96));
 }finally{holder.remove();state.guides=wasGuides;draw(original,state.formatKey,state.layout);}
}
async function exportOne(kind){try{setBusy(true);toast("Renderizando "+kind.toUpperCase()+"…");const blob=await makeBlob(readForm(),state.formatKey,kind);downloadBlob(blob,"climax-"+$("preset").value+"-"+state.formatKey+"."+kind);toast("Imagem exportada em tamanho real.");}catch(err){console.error(err);toast("Erro de exportação: "+err.message);}finally{setBusy(false);}}
function setBusy(busy){["exportPng","exportJpeg","batchZip"].forEach(id=>$(id).disabled=busy);}
async function exportWeek(){
 const selected=state.posts.filter(x=>x.group==="semana-1"),saved=readForm();
 try{setBusy(true);const files={};for(let i=0;i<selected.length;i++){const p=selected[i];toast("Exportando "+(i+1)+"/"+selected.length+"…");const blob=await makeBlob(p,state.formatKey,"png");files["climax-"+p.id+"-"+state.formatKey+".png"]=new Uint8Array(await blob.arrayBuffer());}
  const {zipSync}=await import("https://esm.sh/fflate@0.8.2");
  const archive=zipSync(files,{level:0});downloadBlob(new Blob([archive],{type:"application/zip"}),"climax-semana-1-"+state.formatKey+".zip");toast("Sete publicações prontas em ZIP.");
 }catch(err){console.error(err);toast("Não foi possível gerar o ZIP: "+err.message);}finally{state.current=state.posts.find(p=>p.id===$("preset").value)||state.current;draw(saved,state.formatKey,state.layout);setBusy(false);}
}
boot();