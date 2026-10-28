import React,{useMemo,useState} from "react";
import {Rocket,Search,LayoutGrid,ArrowUpRight,Download,Code2,ExternalLink,ShieldCheck,AppWindow,PackageOpen} from "lucide-react";
import {CATALOG_APPS,CREATIVE_APPS} from "../catalog.js";
import {localizeTree} from "../i18n.js";

const openExternal=url=>window.open(url,"_blank","noopener,noreferrer");

export default function AppStoreApp({locale="fr",installedApps=[],onInstall=()=>{},onRemove=()=>{},onOpen=()=>{}}){
 const [query,setQuery]=useState("");
 const normalized=query.trim().toLocaleLowerCase();
 const localMatching=useMemo(()=>CATALOG_APPS.filter(app=>(app.id+" "+app.description+" "+app.tags).toLocaleLowerCase().includes(normalized)),[normalized]);
 const creativeMatching=useMemo(()=>CREATIVE_APPS.filter(app=>(app.id+" "+app.description+" "+app.category+" "+app.creator+" "+app.tags).toLocaleLowerCase().includes(normalized)),[normalized]);
 const view=<div className="appstore-shell">
  <aside className="appstore-sidebar">
   <div className="store-logo"><Rocket size={23}/><b>App Store</b></div>
   <button className="selected" onClick={()=>setQuery("")}><LayoutGrid size={15}/> Découvrir</button>
   <button onClick={()=>setQuery("ArtCraft")}>Studio créatif</button>
   <button onClick={()=>setQuery("photo")}>Photo & RAW</button>
   <button onClick={()=>setQuery("video")}>Vidéo</button>
   <div className="store-sidebar-note">Deux types de fiches : outils du simulateur et logiciels externes officiels.</div>
  </aside>
  <section className="appstore-main">
   <header className="appstore-header">
    <div><small>GOLDEN GATE · STORE</small><h2>Découvrir</h2><p>Des outils pour ton bureau et de vrais logiciels créatifs.</p></div>
    <label><Search size={15}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Rechercher une application"/></label>
   </header>
   <div className="store-feature">
    <div><small>ESPACE CRÉATIF</small><h3>Crée. Retouche. Monte.</h3><p>Découvre ArtCraft, PhotoCraft, FilmCraft et LightCraft — les projets open source publiés par ArtCraft Team.</p><button onClick={()=>openExternal("https://github.com/storytold")}>Explorer l’organisation <ArrowUpRight size={13}/></button></div>
    <div className="store-feature-art"><PackageOpen size={42}/></div>
   </div>

   {(localMatching.length>0)&&<section className="store-section">
    <div className="store-section-heading"><div><h3>Applications Golden Gate</h3><p>Outils locaux intégrés au simulateur.</p></div><span>{localMatching.length} apps</span></div>
    <div className="store-grid local-store-grid">{localMatching.map(app=>{const Icon=app.icon;const installed=installedApps.includes(app.id);return <article className="store-card" key={app.id}>
      <div className="store-app-icon" style={{background:app.color}}><Icon size={26}/></div>
      <div className="store-app-info"><b>{app.id}</b><p>{app.description}</p><small>{installed?"Installé dans Golden Gate":"Application locale simulée"}</small></div>
      <div className="store-app-actions">{installed?<><button onClick={()=>onOpen(app.id)}>Ouvrir</button><button className="store-remove" onClick={()=>onRemove(app.id)}>Supprimer</button></>:<button onClick={()=>onInstall(app.id)}>Ajouter</button>}</div>
    </article>})}</div>
   </section>}

   {(creativeMatching.length>0)&&<section className="store-section creative-section">
    <div className="store-section-heading"><div><h3>Logiciels créatifs open source</h3><p>Programmes complets à télécharger depuis leurs dépôts officiels.</p></div><span>{creativeMatching.length} logiciels</span></div>
    <div className="creative-grid">{creativeMatching.map(app=>{const Icon=app.icon;return <article className="creative-card" key={app.id}>
      <div className="creative-card-top"><div className="creative-app-icon" style={{background:app.color}}><Icon size={29}/></div><div className="creative-card-title"><h4>{app.id}</h4><span>{app.category}</span></div><span className="creative-badge">Open source</span></div>
      <p className="creative-description">{app.description}</p>
      <div className="creative-credit"><span>Créé par</span><b>{app.creator}</b></div>
      <div className="creative-meta"><span><ShieldCheck size={12}/>{app.license}</span><span><AppWindow size={12}/>Windows · macOS · Linux</span></div>
      <div className="creative-actions"><button className="creative-download" onClick={()=>openExternal(app.releases)}><Download size={14}/> Voir les téléchargements <ExternalLink size={12}/></button><button className="creative-source" onClick={()=>openExternal(app.repository)}><Code2 size={14}/> Code source</button></div>
      <small className="creative-note">Logiciel externe : la page des versions officielles s’ouvre pour que tu choisisses le bon installateur. Il n’est pas installé dans Golden Gate.</small>
    </article>})}</div>
   </section>}

   {!localMatching.length&&!creativeMatching.length&&<div className="store-no-results"><Search size={25}/><b>Aucun résultat</b><p>Essaie un autre nom ou efface la recherche.</p><button onClick={()=>setQuery("")}>Effacer la recherche</button></div>}
   <footer className="store-footer">Les fiches des logiciels externes indiquent leurs créateurs et renvoient directement vers les pages officielles. Golden Gate ne télécharge pas et n’installe pas ces programmes à ta place.</footer>
  </section>
 </div>;
 return localizeTree(view,locale);
}