import React,{useState} from "react";
import {ArrowUpRight,Download,ExternalLink,RefreshCw,ShieldCheck,Globe,FileImage} from "lucide-react";
import {CREATIVE_APPS} from "../catalog.js";
const openExternal=url=>window.open(url,"_blank","noopener,noreferrer");

export default function CreativeWebApp({name}) {
 const app=CREATIVE_APPS.find(item=>item.id===name);
 const [reloadKey,setReloadKey]=useState(0);
 if(!app) return <div className="creative-native-page"><h2>Application introuvable</h2></div>;
 if(!app.webSlug) return <div className="creative-native-page">
  <div className="creative-native-logo" style={{background:app.color}}><FileImage size={35}/></div>
  <span className="creative-web-eyebrow">ARTCRAFT TEAM · APPLICATION DE BUREAU</span>
  <h2>ArtCraft Desktop</h2>
  <p>ArtCraft est distribué comme logiciel de bureau. Je n’ai pas trouvé de version Web officielle à intégrer à une fenêtre de Golden Gate. Une page Web ne peut pas exécuter directement un installateur Windows : télécharge l’application depuis la source officielle, puis lance l’installateur hors du simulateur.</p>
  <div className="creative-native-actions"><button onClick={()=>openExternal(app.releases)}><Download size={15}/> Télécharger ArtCraft <ExternalLink size={13}/></button><button className="secondary" onClick={()=>openExternal(app.website)}><Globe size={15}/> Site officiel <ArrowUpRight size={13}/></button></div>
  <div className="creative-native-license"><ShieldCheck size={14}/><span>Publié par {app.creator}. Licence : {app.license}. Consulte la licence complète sur le dépôt officiel.</span></div>
 </div>;
 const appUrl=(import.meta.env.BASE_URL||"./")+"creative/"+app.webSlug+"/index.html";
 return <div className="creative-web-shell">
  <header className="creative-web-toolbar"><div className="creative-web-mark" style={{background:app.color}}>{app.id.slice(0,1)}</div><div className="creative-web-heading"><b>{app.id}</b><small>Version Web officielle · {app.creator}</small></div><span className="creative-web-local"><ShieldCheck size={13}/> Dans cette fenêtre</span><button title="Recharger l’application" aria-label="Recharger l’application" onClick={()=>setReloadKey(v=>v+1)}><RefreshCw size={14}/></button><button title="Ouvrir dans un nouvel onglet" aria-label="Ouvrir dans un nouvel onglet" onClick={()=>openExternal(appUrl)}><ArrowUpRight size={15}/></button></header>
  <div className="creative-web-stage"><iframe key={reloadKey} title={app.id+" Web"} src={appUrl} allow="clipboard-read; clipboard-write; fullscreen; autoplay" allowFullScreen/></div>
  <footer className="creative-web-footer"><span><ShieldCheck size={12}/> L’application fonctionne dans le navigateur ; les fichiers restent sur ton appareil selon ses fonctions.</span><button onClick={()=>openExternal(app.releases)}>Téléchargement officiel <ExternalLink size={11}/></button></footer>
 </div>;
}
