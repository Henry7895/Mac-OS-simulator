import React,{useState} from "react";
import {Compass,Search,ChevronLeft,ChevronRight,Plus,X,Globe} from "lucide-react";
import {localizeTree} from "../i18n.js";

export default function SafariApp({locale="fr"}) {
 const [tabs,setTabs]=useState([{id:1,url:"",history:[],index:-1}]);
 const [activeId,setActiveId]=useState(1);
 const [address,setAddress]=useState("");
 const [loading,setLoading]=useState(false);
 const [reload,setReload]=useState(0);
 const active=tabs.find(tab=>tab.id===activeId)||tabs[0];
 const electron=typeof window!=="undefined"&&Boolean(window.desktopShell);
 const navigate=(input)=>{
  const raw=String(input||"").trim();if(!raw)return;
  const isUrl=/^(https?:\/\/|file:\/\/)/i.test(raw)||(!raw.includes(" ")&&/^[a-z0-9-]+(\.[a-z0-9-]+)+([/:?#].*)?$/i.test(raw));
  const url=isUrl?(/^(https?:\/\/|file:\/\/)/i.test(raw)?raw:"https://"+raw):"https://www.google.com/search?igu=1&q="+encodeURIComponent(raw);
  setTabs(old=>old.map(tab=>tab.id===activeId?{...tab,url,history:[...tab.history.slice(0,tab.index+1),url],index:tab.index+1}:tab));
  setAddress(url);setLoading(true);
 };
 const move=delta=>{
  const index=Math.max(0,Math.min(active.history.length-1,active.index+delta));if(index===active.index||index<0)return;
  const url=active.history[index];setTabs(old=>old.map(tab=>tab.id===activeId?{...tab,url,index}:tab));setAddress(url);setLoading(true);
 };
 const newTab=()=>{const id=Math.max(...tabs.map(tab=>tab.id))+1;setTabs(old=>[...old,{id,url:"",history:[],index:-1}]);setActiveId(id);setAddress("");setLoading(false)};
 const closeTab=id=>{
  if(tabs.length===1){setTabs([{id:1,url:"",history:[],index:-1}]);setActiveId(1);setAddress("");return;}
  const remaining=tabs.filter(tab=>tab.id!==id);setTabs(remaining);
  if(id===activeId){const next=remaining[remaining.length-1];setActiveId(next.id);setAddress(next.url||"");}
 };
 const view=<div className="browser safari-browser">
  <div className="safari-tabs">{tabs.map(tab=><div key={tab.id} className={tab.id===activeId?"safari-tab active":"safari-tab"}><button onClick={()=>{setActiveId(tab.id);setAddress(tab.url||"")}} title={tab.url||"Page de démarrage"}>{tab.url?tab.url.replace(/^https?:\/\//,"").split("/")[0]:"Page de démarrage"}</button><button className="tab-close" onClick={()=>closeTab(tab.id)} title="Fermer l’onglet"><X size={11}/></button></div>)}<button className="safari-new-tab" onClick={newTab} title="Nouvel onglet"><Plus size={14}/></button></div>
  <div className="browserbar"><button disabled={active.index<=0} title="Précédent" onClick={()=>move(-1)}><ChevronLeft size={16}/></button><button disabled={active.index>=active.history.length-1} title="Suivant" onClick={()=>move(1)}><ChevronRight size={16}/></button><button title="Actualiser" onClick={()=>active.url?(setLoading(true),setReload(v=>v+1)):setAddress("")}>↻</button><form onSubmit={event=>{event.preventDefault();navigate(address)}}><input value={address} onChange={event=>setAddress(event.target.value)} placeholder="Rechercher ou saisir une adresse"/><button title="Rechercher"><Search size={14}/></button></form><button title="Ouvrir dans le navigateur externe" onClick={()=>window.open(active.url||"https://www.google.com","_blank","noopener,noreferrer")}><Globe size={14}/></button></div>
  {loading&&<div className="safari-progress"><i/></div>}
  <div className="safari-content">{active.url?(electron?<webview key={active.url+reload} className="safari-webview" src={active.url} allowpopups="true" ref={node=>{if(node&&!node.dataset.ggBound){node.dataset.ggBound="1";node.addEventListener("did-start-loading",()=>setLoading(true));node.addEventListener("did-stop-loading",()=>setLoading(false));node.addEventListener("did-fail-load",()=>setLoading(false));}}}/>:<iframe key={active.url+reload} title="Safari web content" className="safari-iframe" src={active.url} onLoad={()=>setLoading(false)} referrerPolicy="no-referrer-when-downgrade"/>):<div className="safari-start"><div className="safari-start-icon"><Compass size={44}/></div><h1>Bienvenue sur Safari</h1><p>Recherche une adresse ou ouvre un site favori. Certains sites bloquent les fenêtres intégrées : utilise le navigateur externe.</p><div className="favorites">{[["Apple","https://www.apple.com"],["Wikipedia","https://wikipedia.org"],["GitHub","https://github.com"],["DuckDuckGo","https://duckduckgo.com"],["YouTube","https://www.youtube.com"],["NCS","https://ncs.io"]].map(([label,url])=><button key={label} onClick={()=>navigate(url)}><span>{label.slice(0,1)}</span>{label}</button>)}</div></div>}</div>
  <div className="browser-notice"><span>Certains sites empêchent leur affichage dans une fenêtre intégrée.</span><button onClick={()=>window.open(active.url||"https://www.google.com","_blank","noopener,noreferrer")}>Ouvrir dans le navigateur externe <Globe size={12}/></button></div>
 </div>;
 return localizeTree(view,locale);
}