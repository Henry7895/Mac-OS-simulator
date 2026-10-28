import React,{useMemo,useState} from "react";
import {Rocket,Search,LayoutGrid,ArrowUpRight,Download,Code2,ExternalLink,ShieldCheck,AppWindow,PackageOpen,CheckCircle2} from "lucide-react";
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
   <button onClick={()=>setQuery("pdf")}>PDF & documents</button>
   <div className="store-sidebar-note">Installe les versions Web directement dans le simulateur, ou télécharge les versions de bureau officielles.</div>
  </aside>
  <section className="appstore-main">
   <header className="appstore-header">
    <div><small>GOLDEN GATE · STORE</small><h2>Découvrir</h2><p>Des outils intégrés et six logiciels créatifs publiés par ArtCraft Team.</p></div>
    <label><Search size={15}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Rechercher une application"/></label>
   </header>
   <div className="store-feature">
    <div><small>ESPACE CRÉATIF</small><h3>Crée. Retouche. Monte.</h3><p>PhotoCraft, FilmCraft, LightCraft, VectorCraft et PdfCraft fonctionnent dans les fenêtres de Golden Gate. ArtCraft se télécharge comme application de bureau.</p><button onClick={()=>openExternal("https://getartcraft.com/apps")}>Découvrir les 6 logiciels <ArrowUpRight size={13}/></button></div>
    <div className="store-feature-art"><PackageOpen size={42}/></div>
   </div>

   {localMatching.length>0&&<section className="store-section">
    <div className="store-section-heading"><div><h3>Applications Golden Gate</h3><p>Outils locaux intégrés au simulateur.</p></div><span>{localMatching.length} apps</span></div>
    <div className="store-grid local-store-grid">{localMatching.map(app=>{const Icon=app.icon;const installed=installedApps.includes(app.id);return <article className="store-card" key={app.id}>
     <div className="store-app-icon" style={{background:app.color}}><Icon size={26}/></div>
     <div className="store-app-info"><b>{app.id}</b><p>{app.description}</p><small>{installed?"Installé dans Golden Gate":"Application locale simulée"}</small></div>
     <div className="store-app-actions">{installed?<><button onClick={()=>onOpen(app.id)}>Ouvrir</button><button className="store-remove" onClick={()=>onRemove(app.id)}>Supprimer</button></>:<button onClick={()=>onInstall(app.id)}>Ajouter</button>}</div>
    </article>})}</div>
   </section>}

   {creativeMatching.length>0&&<section className="store-section creative-section">
    <div className="store-section-heading"><div><h3>Les six logiciels créatifs</h3><p>Cinq versions Web officielles sont utilisables dans le simulateur ; ArtCraft est un logiciel de bureau.</p></div><span>{creativeMatching.length} logiciels</span></div>
    <div className="creative-grid">{creativeMatching.map(app=>{const Icon=app.icon;const installed=installedApps.includes(app.id);const webApp=Boolean(app.webSlug);return <article className="creative-card" key={app.id}>
     <div className="creative-card-top"><div className="creative-app-icon" style={{background:app.color}}><Icon size={27}/></div><div className="creative-card-title"><h4>{app.id}</h4><span>{app.category}</span></div><span className="creative-badge">{webApp?"Version Web":"Bureau"}</span></div>
     <p className="creative-description">{app.description}</p>
     <div className="creative-credit"><span>Créateur</span><b>{app.creator}</b></div>
     <div className="creative-meta"><span><ShieldCheck size={12}/>{app.license}</span><span><AppWindow size={12}/>{webApp?"Utilisable dans Golden Gate":"Installateur à lancer hors du simulateur"}</span></div>
     <div className="creative-actions">
      {webApp?(installed?<button className="creative-launch" onClick={()=>onOpen(app.id)}><CheckCircle2 size={14}/> Ouvrir dans le simulateur</button>:<button className="creative-download" onClick={()=>{onInstall(app.id);onOpen(app.id)}}><Download size={14}/> Installer et ouvrir</button>):<button className="creative-download" onClick={()=>openExternal(app.releases)}><Download size={14}/> Télécharger ArtCraft <ExternalLink size={12}/></button>}
      <button className="creative-source" onClick={()=>openExternal(app.releases)}><Download size={13}/> Voir les téléchargements</button>
      <button className="creative-source" onClick={()=>openExternal(app.repository)}><Code2 size={13}/> Code source</button>
      {webApp&&installed&&<button className="creative-remove" onClick={()=>onRemove(app.id)}>Retirer du Dock</button>}
     </div>
     <small className="creative-note">{webApp?"La version Web officielle est intégrée au site au moment du build ; les fichiers de licence et avis du projet sont conservés avec elle.":"Aucune version Web officielle n’a été repérée pour ArtCraft : Golden Gate ouvre la page officielle de téléchargement au lieu de simuler un faux lancement."}</small>
    </article>})}</div>
   </section>}

   {!localMatching.length&&!creativeMatching.length&&<div className="store-no-results"><Search size={25}/><b>Aucun résultat</b><p>Essaie un autre nom ou efface la recherche.</p><button onClick={()=>setQuery("")}>Effacer la recherche</button></div>}
   <footer className="store-footer">Les cinq versions Web sont téléchargées depuis les dépôts officiels lors de la préparation de Golden Gate puis exécutées dans leurs propres fenêtres. Les programmes natifs comme ArtCraft ne peuvent pas se lancer directement depuis une page Web.</footer>
  </section>
 </div>;
 return localizeTree(view,locale);
}
