import React,{useEffect,useMemo,useRef,useState} from "react";
import {Music,Play,Pause,Search,Volume2,ChevronLeft,ChevronRight,Globe,ExternalLink,Radio,Headphones} from "lucide-react";
import {localizeTree} from "../i18n.js";

const NCS_TRACKS=[
 {id:"mZhuH_qeRRU",title:"In Motion",artist:"L3VI",genre:"House",watch:"https://www.youtube.com/watch?v=mZhuH_qeRRU"},
 {id:"Oq_K2wZPP8Y",title:"I Still Hear Your Voice",artist:"Lynxie, johnny joined",genre:"Dance Pop",watch:"https://www.youtube.com/watch?v=Oq_K2wZPP8Y"},
 {id:"4KBQIPdqm68",title:"Falling 4 U",artist:"ROY KNOX",genre:"Melodic Dubstep",watch:"https://www.youtube.com/watch?v=4KBQIPdqm68"},
 {id:"LfAd6mGd81M",title:"Recall",artist:"gabriawll",genre:"House",watch:"https://www.youtube.com/watch?v=LfAd6mGd81M"},
 {id:"ONIx6jXy1hU",title:"Heart My Heart",artist:"intouch",genre:"House",watch:"https://www.youtube.com/watch?v=ONIx6jXy1hU"}
];
const formatTime=value=>{const seconds=Math.max(0,Math.floor(Number(value)||0));return Math.floor(seconds/60)+":"+String(seconds%60).padStart(2,"0")};

export default function MusicApp({locale="fr",volume=65,playing:controlledPlaying,onVolumeChange,onPlaybackChange}) {
 const audioRef=useRef(null),youtubeRef=useRef(null);
 const [mode,setMode]=useState("full"),[query,setQuery]=useState("NCS"),[results,setResults]=useState([]),[previewTrack,setPreviewTrack]=useState(null),[fullTrack,setFullTrack]=useState(NCS_TRACKS[0]),[localPlaying,setLocalPlaying]=useState(false),[fullPlaying,setFullPlaying]=useState(false),[loading,setLoading]=useState(false),[error,setError]=useState(""),[time,setTime]=useState(0),[duration,setDuration]=useState(0),[youtubeReady,setYoutubeReady]=useState(false);
 const externalPlaying=mode==="full"?fullPlaying:localPlaying;
 const playing=typeof controlledPlaying==="boolean"?controlledPlaying:externalPlaying;
 function sendYouTubeCommand(func,args=[]) {
  const frame=youtubeRef.current;
  if(frame?.contentWindow)frame.contentWindow.postMessage(JSON.stringify({event:"command",func,args}),"*");
 }
 const setPlaying=value=>{
  const next=typeof value==="function"?value(playing):value;
  if(mode==="full"){setFullPlaying(next);if(youtubeReady)sendYouTubeCommand(next?"playVideo":"pauseVideo");}
  else setLocalPlaying(next);
  onPlaybackChange?.(next);
 };
 const search=async(term)=>{
  const q=String(term||"").trim()||"NCS";setQuery(q);setMode("preview");setLoading(true);setError("");
  try {
   const response=await fetch("https://itunes.apple.com/search?term="+encodeURIComponent(q)+"&entity=song&limit=24");
   if(!response.ok)throw new Error("Catalogue musical indisponible");
   const data=await response.json();
   const list=(data.results||[]).filter(item=>item.previewUrl).map(item=>({id:item.trackId,title:item.trackName,artist:item.artistName,album:item.collectionName,artwork:item.artworkUrl100?.replace("100x100bb","400x400bb"),previewUrl:item.previewUrl,url:item.trackViewUrl}));
   setResults(list);if(!list.length)setError("Aucun aperçu disponible dans le catalogue. Essaie un autre titre ou écoute NCS en version complète.");
  } catch {setResults([]);setError("Catalogue de préécoute indisponible. Vérifie ta connexion Internet.");}
  finally{setLoading(false);}
 };
 const selectPreview=item=>{setPreviewTrack(item);setTime(0);setDuration(30);setLocalPlaying(true);setMode("preview");setFullPlaying(false);onPlaybackChange?.(true)};
 const selectFull=item=>{setFullTrack(item);setFullPlaying(false);setTime(0);setDuration(0);setYoutubeReady(false);setMode("full");setLocalPlaying(false);onPlaybackChange?.(false)};
 const filteredNcs=useMemo(()=>{const normalized=query.toLocaleLowerCase().trim();if(!normalized||normalized==="ncs")return NCS_TRACKS;return NCS_TRACKS.filter(item=>(item.title+" "+item.artist+" "+item.genre).toLocaleLowerCase().includes(normalized))},[query]);
 useEffect(()=>{
  const audio=audioRef.current;if(!audio)return;
  audio.volume=Math.max(0,Math.min(1,volume/100));
  if(mode==="preview"&&localPlaying&&previewTrack?.previewUrl){const promise=audio.play();if(promise?.catch)promise.catch(()=>setLocalPlaying(false));}
  else audio.pause();
 },[previewTrack,localPlaying,volume,mode]);
 useEffect(()=>{if(mode==="full"&&youtubeReady)sendYouTubeCommand("setVolume",[Math.max(0,Math.min(100,volume))])},[volume,mode,youtubeReady,fullTrack]);
 useEffect(()=>{
  const onMessage=event=>{
   if(!["https://www.youtube-nocookie.com","https://www.youtube.com"].includes(event.origin))return;
   let data=event.data;if(typeof data==="string"){try{data=JSON.parse(data)}catch{return}}
   if(data?.event==="infoDelivery"&&data.info){
    if(Number.isFinite(data.info.currentTime))setTime(data.info.currentTime);
    if(Number.isFinite(data.info.duration)&&data.info.duration>0)setDuration(data.info.duration);
    if(data.info.playerState===1)setFullPlaying(true);
    else if(data.info.playerState===2||data.info.playerState===0)setFullPlaying(false);
   }
   if(data?.event==="onStateChange"&&data.info===1)setFullPlaying(true);
   if(data?.event==="onStateChange"&&(data.info===0||data.info===2))setFullPlaying(false);
  };
  window.addEventListener("message",onMessage);return()=>window.removeEventListener("message",onMessage);
 },[]);
 useEffect(()=>{onPlaybackChange?.(mode==="full"?fullPlaying:localPlaying)},[mode,fullPlaying,localPlaying,onPlaybackChange]);
 const previewMode=mode==="preview",displayTrack=previewMode?previewTrack:fullTrack;
 const view=<div className="musicapp music-app-shell">
  <div className="music-audio-host" aria-hidden="true"><audio ref={audioRef} src={previewTrack?.previewUrl||undefined} onTimeUpdate={event=>setTime(event.currentTarget.currentTime||0)} onLoadedMetadata={event=>setDuration(event.currentTarget.duration||30)} onEnded={()=>{setLocalPlaying(false);setTime(0)}}/></div>
  <aside className="music-sidebar">
   <div className="music-brand"><span className="music-brand-icon"><Music size={18}/></span><b>Musique</b></div>
   <div className="music-sidebar-label">Écouter</div>
   <button className={!previewMode?"selected":""} onClick={()=>{setMode("full");setLocalPlaying(false);onPlaybackChange?.(false)}}><Headphones size={14}/> NCS — complet</button>
   <button className={previewMode?"selected":""} onClick={()=>{setMode("preview");setFullPlaying(false);if(!results.length&&!loading)search(query||"NCS")}}><Music size={14}/> Aperçus iTunes</button>
   <div className="music-sidebar-label">Sources officielles</div>
   <button onClick={()=>window.open("https://ncs.io/music","_blank","noopener,noreferrer")}>Catalogue NCS ↗</button>
   <button onClick={()=>window.open("https://music.apple.com","_blank","noopener,noreferrer")}>Apple Music ↗</button>
   <button onClick={()=>window.open("https://www.youtube.com/@NoCopyrightSounds","_blank","noopener,noreferrer")}>YouTube NCS ↗</button>
   <div className="music-sidebar-bottom">Les morceaux complets sont lus depuis le lecteur officiel YouTube. La recherche iTunes ne fournit que des extraits.</div>
  </aside>
  <section className="music-main">
   <header className="music-topbar"><div><h2>{previewMode?"Aperçus musicaux":"À écouter"}</h2><p>{previewMode?"Recherche et écoute les extraits disponibles.":"Des pistes NCS complètes dans le lecteur officiel."}</p></div>
    <form onSubmit={event=>{event.preventDefault();search(query)}}><Search size={15}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder={previewMode?"Rechercher un titre ou un artiste":"Filtrer la sélection NCS"}/><button type="submit">{previewMode?"Rechercher":"iTunes"}</button></form>
   </header>
   {previewMode ? <div className="music-preview-view">
    <div className="music-feature"><div className="music-feature-art"><Music size={42}/><span>30s</span></div><div><small>APERÇUS OFFICIELS</small><h3>Découvre avant d’écouter</h3><p>Ces extraits sont limités par le catalogue iTunes. Pour écouter des morceaux NCS entiers, passe sur « NCS — complet ».</p><button onClick={()=>{setMode("full");setLocalPlaying(false)}}>Écouter un morceau complet <Play size={13}/></button><button className="ncs-button" onClick={()=>window.open("https://ncs.io/music","_blank","noopener,noreferrer")}>Catalogue NCS <ExternalLink size={12}/></button></div></div>
    <div className="music-results-heading"><b>Résultats de recherche</b><span>{loading?"Recherche…":results.length+" extraits"}</span></div>
    {error&&<p className="music-feedback" role="status">{error}</p>}
    <div className="music-results">{results.map(item=><div className={previewTrack?.id===item.id?"music-result active":"music-result"} key={item.id}>
     <button className="track-play" onClick={()=>{if(previewTrack?.id===item.id&&localPlaying)setLocalPlaying(false);else selectPreview(item)}} title={previewTrack?.id===item.id&&localPlaying?"Pause":"Lire"}>{previewTrack?.id===item.id&&localPlaying?<Pause size={15}/>:<Play size={15}/>}</button>
     <img src={item.artwork||""} alt="" loading="lazy"/><button className="track-metadata" onClick={()=>selectPreview(item)}><b>{item.title}</b><small>{item.artist}</small></button><span className="track-album">{item.album}</span><a href={item.url||"https://music.apple.com"} target="_blank" rel="noreferrer" title="Ouvrir sur Apple Music"><Globe size={13}/></a>
    </div>)}</div>
    {!loading&&!results.length&&!error&&<div className="music-empty"><Music size={28}/><p>Recherche un titre pour écouter un aperçu.</p><button onClick={()=>search(query||"NCS")}>Rechercher</button></div>}
    <p className="music-legal">Les extraits proviennent de l’API publique de recherche iTunes. Leur durée de préécoute est imposée par le fournisseur ; ce n’est pas la durée du morceau complet.</p>
   </div> : <div className="music-full-view">
    <div className="music-full-heading"><div className="music-ncs-mark"><Radio size={21}/></div><div><small>NOCOPYRIGHTSOUNDS · CHAÎNE OFFICIELLE</small><h3>{fullTrack.title}</h3><p>{fullTrack.artist} <span>·</span> {fullTrack.genre}</p></div><button className="music-open-official" onClick={()=>window.open(fullTrack.watch,"_blank","noopener,noreferrer")}>YouTube <ExternalLink size={13}/></button></div>
    <div className="youtube-player-shell"><iframe ref={youtubeRef} key={fullTrack.id} title={"Lecture complète : "+fullTrack.title} src={"https://www.youtube-nocookie.com/embed/"+fullTrack.id+"?enablejsapi=1&playsinline=1&rel=0"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen onLoad={()=>{setYoutubeReady(true);sendYouTubeCommand("addEventListener",["onStateChange"]);sendYouTubeCommand("setVolume",[Math.max(0,Math.min(100,volume))])}}/></div>
    <div className="music-full-callout"><Headphones size={15}/><span>Le lecteur officiel YouTube diffuse la vidéo complète : pas de limite de 30 secondes de l’API d’aperçus.</span><button onClick={()=>window.open("https://ncs.io/usage-policy","_blank","noopener,noreferrer")}>Conditions NCS <ExternalLink size={12}/></button></div>
    <div className="music-results-heading"><b>Sélection NCS — lecture complète</b><span>{filteredNcs.length} pistes</span></div>
    <div className="ncs-track-list">{filteredNcs.map(item=><button key={item.id} className={fullTrack.id===item.id?"ncs-track selected":"ncs-track"} onClick={()=>selectFull(item)}><span className="ncs-track-art"><Music size={16}/></span><span className="ncs-track-info"><b>{item.title}</b><small>{item.artist} · {item.genre}</small></span><span className="ncs-track-action">{fullTrack.id===item.id?<span>En cours</span>:<Play size={15}/>}</span></button>)}</div>
    {!filteredNcs.length&&<p className="music-feedback">Aucune piste NCS de cette sélection ne correspond. Ouvre le catalogue NCS officiel pour en découvrir d’autres.</p>}
    <p className="music-legal">Les vidéos sont intégrées depuis la chaîne officielle NoCopyrightSounds ; Golden Gate ne télécharge pas ni ne réhéberge les fichiers audio. Les autres pistes sont accessibles dans le catalogue NCS.</p>
   </div>}
  </section>
  <footer className="music-player">
   <div className="now-playing"><span className="now-playing-art"><Music size={16}/></span><span><b>{displayTrack?.title||"Aucun morceau sélectionné"}</b><small>{displayTrack?.artist||(previewMode?"Recherche un titre pour commencer":"NCS · lecteur officiel")}</small></span></div>
   <div className="player-center">
    <div className="player-controls"><button title="Piste précédente" disabled={!previewMode&&NCS_TRACKS.findIndex(item=>item.id===fullTrack.id)<=0} onClick={()=>{if(previewMode){const i=results.findIndex(item=>item.id===previewTrack?.id);if(i>0)selectPreview(results[i-1])}else{const i=NCS_TRACKS.findIndex(item=>item.id===fullTrack.id);if(i>0)selectFull(NCS_TRACKS[i-1])}}}><ChevronLeft size={17}/></button><button className="player-play" title={playing?"Pause":"Lecture"} onClick={()=>setPlaying(v=>!v)} disabled={previewMode&&!previewTrack}>{playing?<Pause size={17}/>:<Play size={17}/>}</button><button title="Piste suivante" disabled={!previewMode&&NCS_TRACKS.findIndex(item=>item.id===fullTrack.id)>=NCS_TRACKS.length-1} onClick={()=>{if(previewMode){const i=results.findIndex(item=>item.id===previewTrack?.id);if(i>=0&&i<results.length-1)selectPreview(results[i+1])}else{const i=NCS_TRACKS.findIndex(item=>item.id===fullTrack.id);if(i<NCS_TRACKS.length-1)selectFull(NCS_TRACKS[i+1])}}}><ChevronRight size={17}/></button></div>
    <div className="player-timeline"><small>{formatTime(time)}</small><input aria-label="Progression" type="range" min="0" max={Math.max(1,duration||30)} step=".5" value={Math.min(time,duration||30)} onChange={event=>{const value=Number(event.target.value);setTime(value);if(previewMode&&audioRef.current)audioRef.current.currentTime=value;else sendYouTubeCommand("seekTo",[value,true])}}/><small>{duration?formatTime(duration):"—:—"}</small></div>
   </div>
   <div className="player-volume"><Volume2 size={15}/><input aria-label="Volume musical" type="range" min="0" max="100" value={volume} onChange={event=>onVolumeChange?.(+event.target.value)}/></div>
  </footer>
 </div>;
 return localizeTree(view,locale);
}