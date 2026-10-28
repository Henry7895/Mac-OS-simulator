import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, ChevronRight, Eye, Globe2, Keyboard,
  LockKeyhole, MapPin, Monitor, Moon, Palette, ShieldCheck, Sparkles,
  Sun, UserRound, Wifi, Volume2, Accessibility, Laptop, Upload, WandSparkles
} from "lucide-react";
import "./SetupAssistant.css";

const STAGES = [
  { label: "Langue", title: "Choisissez votre langue", subtitle: "La langue utilisée dans Golden Gate." },
  { label: "Région", title: "Choisissez votre pays ou région", subtitle: "Cela permet de régler les formats de date, d’heure et de nombre." },
  { label: "Accessibilité", title: "L’accessibilité pour tous", subtitle: "Personnalisez les options d’affichage et d’interaction." },
  { label: "Réseau", title: "Se connecter à un réseau Wi-Fi", subtitle: "Cette étape est simulée : aucune connexion réseau n’est modifiée." },
  { label: "Confidentialité", title: "Données et confidentialité", subtitle: "Vos préférences restent dans le stockage local de ce navigateur." },
  { label: "Compte", title: "Créez votre compte", subtitle: "Personnalisez le profil affiché sur votre session." },
  { label: "Apparence", title: "Choisissez votre apparence", subtitle: "Vous pourrez tout modifier ensuite dans Réglages Système." },
  { label: "Terminé", title: "Tout est prêt.", subtitle: "Golden Gate est configuré. Bienvenue sur votre bureau." }
];

const LANGUAGES = [
  { name: "Français", detail: "Français", flag: "🇫🇷" },
  { name: "English", detail: "English (United States)", flag: "🇺🇸" },
  { name: "Deutsch", detail: "Deutsch", flag: "🇩🇪" },
  { name: "Español", detail: "Español", flag: "🇪🇸" },
  { name: "Italiano", detail: "Italiano", flag: "🇮🇹" },
  { name: "日本語", detail: "日本語", flag: "🇯🇵" }
];
const REGIONS = [
  { name: "France", flag: "🇫🇷", detail: "Français · 24 heures" },
  { name: "Belgique", flag: "🇧🇪", detail: "Français / Nederlands" },
  { name: "Suisse", flag: "🇨🇭", detail: "Français · CHF" },
  { name: "Canada", flag: "🇨🇦", detail: "Français / English" },
  { name: "États-Unis", flag: "🇺🇸", detail: "English · 12/24 hours" },
  { name: "Royaume-Uni", flag: "🇬🇧", detail: "English · 24 hours" }
];
const ACCESSIBILITY = [
  { id: "voiceover", title: "Lecteur d’écran", detail: "Décrit les éléments de l’interface.", Icon: Eye },
  { id: "zoom", title: "Zoom de l’écran", detail: "Agrandit l’interface pour plus de confort.", Icon: WandSparkles },
  { id: "captions", title: "Sous-titres", detail: "Affiche des légendes pour les contenus compatibles.", Icon: Volume2 },
  { id: "keyboard", title: "Contrôle au clavier", detail: "Mieux naviguer sans souris.", Icon: Keyboard }
];
const WALLPAPERS = [
  { name: "Golden Gate", value: 0, background: "url(\"./wallpapers/golden-gate-blue.svg\")" },
  { name: "Aurore", value: 1, background: "radial-gradient(ellipse at 22% 18%,#55eccb 0%,transparent 37%),radial-gradient(ellipse at 80% 72%,#916cf1 0%,transparent 42%),linear-gradient(140deg,#07162d,#123954 64%,#101633)" },
  { name: "Bleu profond", value: 2, background: "radial-gradient(ellipse at 72% 16%,#76d9ff 0%,transparent 35%),radial-gradient(ellipse at 22% 80%,#5e65e8 0%,transparent 45%),linear-gradient(135deg,#0d174a,#342c85,#07162d)" },
  { name: "Rose", value: 3, background: "radial-gradient(ellipse at 18% 78%,#ffc2bc 0%,transparent 40%),radial-gradient(ellipse at 76% 20%,#ed8cc8 0%,transparent 35%),linear-gradient(135deg,#39245f,#984f9c,#f3a6a0)" }
];

function BrandMark() {
  return <div className="setup-brand-mark"><span /><span /><span /></div>;
}

export default function SetupAssistant({ username, wall, dark, avatar, onComplete }) {
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState("Français");
  const [region, setRegion] = useState("France");
  const [enabledAccess, setEnabledAccess] = useState([]);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [network, setNetwork] = useState("Maison-5G");
  const [privacyAnalytics, setPrivacyAnalytics] = useState(false);
  const [fullName, setFullName] = useState(username || "Utilisateur");
  const [accountName, setAccountName] = useState((username || "utilisateur").toLowerCase().replace(/[^a-z0-9-]/g, ""));
  const [profilePhoto, setProfilePhoto] = useState(avatar || "");
  const [avatarColor, setAvatarColor] = useState("#8e8cf5");
  const [appearance, setAppearance] = useState(dark ? "dark" : "light");
  const [selectedWall, setSelectedWall] = useState(wall ?? 0);
  const [wifiExpanded, setWifiExpanded] = useState(true);
  const photoInput = useRef(null);

  const choosePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        const size = Math.min(image.width, image.height);
        canvas.getContext("2d")?.drawImage(image, (image.width - size) / 2, (image.height - size) / 2, size, size, 0, 0, 256, 256);
        setProfilePhoto(canvas.toDataURL("image/jpeg", 0.78));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const next = () => {
    if (step < STAGES.length - 1) {
      setStep((current) => current + 1);
      return;
    }
    onComplete({
      username: fullName.trim() || "Utilisateur",
      accountName: accountName.trim() || "utilisateur",
      avatar: profilePhoto,
      wall: selectedWall,
      dark: appearance === "dark" || (appearance === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches),
      language,
      region,
      accessibility: enabledAccess,
      wifiEnabled,
      network: wifiEnabled ? network : "Hors ligne",
      privacyAnalytics
    });
  };

  const back = () => setStep((current) => Math.max(0, current - 1));
  const toggleAccess = (id) => setEnabledAccess((old) => old.includes(id) ? old.filter((item) => item !== id) : [...old, id]);
  const activeStage = STAGES[step];

  const content = () => {
    switch (step) {
      case 0:
        return <div className="setup-choice-list language-list">
          {LANGUAGES.map((item) => <button key={item.name} className={language === item.name ? "setup-choice selected" : "setup-choice"} onClick={() => setLanguage(item.name)}>
            <span className="setup-flag">{item.flag}</span><span className="setup-choice-copy"><b>{item.name}</b><small>{item.detail}</small></span>{language === item.name && <Check size={18} />}
          </button>)}
        </div>;
      case 1:
        return <div className="setup-region-grid">
          {REGIONS.map((item) => <button key={item.name} className={region === item.name ? "setup-region-card selected" : "setup-region-card"} onClick={() => setRegion(item.name)}>
            <span>{item.flag}</span><b>{item.name}</b><small>{item.detail}</small>{region === item.name && <i><Check size={13} /></i>}
          </button>)}
        </div>;
      case 2:
        return <div className="setup-access-list">
          {ACCESSIBILITY.map(({ id, title, detail, Icon }) => <button key={id} className={enabledAccess.includes(id) ? "setup-access-row enabled" : "setup-access-row"} onClick={() => toggleAccess(id)}>
            <span className="setup-feature-icon"><Icon size={22} /></span><span className="setup-choice-copy"><b>{title}</b><small>{detail}</small></span><span className={enabledAccess.includes(id) ? "setup-switch on" : "setup-switch"}><i /></span>
          </button>)}
          <p className="setup-footnote">Vous pourrez retrouver ces options dans les réglages d’accessibilité.</p>
        </div>;
      case 3:
        return <div className="setup-network">
          <div className="setup-network-status"><span className={wifiEnabled ? "setup-wifi-symbol active" : "setup-wifi-symbol"}><Wifi size={31} /></span><div><b>{wifiEnabled ? "Wi-Fi activé" : "Wi-Fi désactivé"}</b><small>{wifiEnabled ? "Choisissez un réseau simulé pour continuer." : "Vous pourrez continuer sans réseau."}</small></div><button className={wifiEnabled ? "setup-switch on" : "setup-switch"} onClick={() => setWifiEnabled(!wifiEnabled)} aria-label="Activer ou désactiver le Wi-Fi"><i /></button></div>
          {wifiEnabled && <><button className="setup-network-heading" onClick={() => setWifiExpanded(!wifiExpanded)}>{wifiExpanded ? "Réseaux disponibles" : "Afficher les réseaux"}<ChevronRight className={wifiExpanded ? "rotate-down" : ""} size={17} /></button>
            {wifiExpanded && <div className="setup-network-list">{["Maison-5G", "Wi-Fi invité", "iPhone partagé"].map((name, index) => <button key={name} className={network === name ? "setup-network-option selected" : "setup-network-option"} onClick={() => setNetwork(name)}>
              <Wifi size={18} /><span><b>{name}</b><small>{index === 0 ? "Sécurisé · WPA2" : index === 1 ? "Sécurisé" : "Partage de connexion"}</small></span><span className="network-bars">▂▄▆{index===2?"":"█"}</span>{network === name && <Check size={17} />}
            </button>)}</div>}</>}
          <p className="setup-footnote">Aucun vrai mot de passe Wi-Fi n’est demandé et aucune connexion système n’est modifiée.</p>
        </div>;
      case 4:
        return <div className="setup-privacy">
          <div className="setup-privacy-hero"><div className="privacy-orbit"><ShieldCheck size={43} strokeWidth={1.35} /></div><div><b>Votre vie privée est essentielle.</b><p>Cette simulation fonctionne localement. Les notes, fichiers et préférences sont conservés dans le navigateur et aucune télémétrie n’est envoyée par cette interface.</p></div></div>
          <div className="setup-privacy-option"><span><b>Partager des statistiques de diagnostic</b><small>Option présentée à titre de démonstration. Aucun rapport ne sera transmis.</small></span><button className={privacyAnalytics ? "setup-switch on" : "setup-switch"} onClick={() => setPrivacyAnalytics(!privacyAnalytics)} aria-label="Statistiques de diagnostic"><i /></button></div>
          <a href="https://github.com/Henry7895/Mac-OS-simulator" target="_blank" rel="noreferrer" className="setup-learn-more">En savoir plus sur ce projet <ChevronRight size={14}/></a>
        </div>;
      case 5:
        return <div className="setup-account">
          <div className="setup-account-avatar" style={{ background: avatarColor }}>{profilePhoto ? <img src={profilePhoto} alt="Photo de profil" /> : <UserRound size={48} strokeWidth={1.4} />}</div>
          <button className="setup-photo-button" onClick={() => photoInput.current?.click()}><Upload size={14}/> Choisir une photo</button>
          <input ref={photoInput} type="file" accept="image/*" hidden onChange={choosePhoto} />
          <div className="setup-avatar-swatches">{["#8e8cf5","#4e9bff","#42bfa5","#efa26f","#ed7fa6","#525b6e"].map((color) => <button key={color} style={{ background: color }} aria-label="Couleur de l’avatar" className={avatarColor === color ? "active" : ""} onClick={() => {setAvatarColor(color);setProfilePhoto("");}} />)}</div>
          <div className="setup-account-fields"><label>Nom complet<input value={fullName} onChange={(e) => {setFullName(e.target.value);if(!accountName || accountName === username.toLowerCase())setAccountName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));}} placeholder="Votre nom" /></label><label>Nom du compte<input value={accountName} onChange={(e) => setAccountName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder="utilisateur" /><small>Utilisé pour le dossier personnel simulé.</small></label></div>
        </div>;
      case 6:
        return <div className="setup-appearance">
          <div className="setup-theme-options">
            {[{id:"light",label:"Clair",Icon:Sun},{id:"dark",label:"Sombre",Icon:Moon},{id:"auto",label:"Automatique",Icon:Monitor}].map(({id,label,Icon}) => <button className={appearance === id ? "setup-theme-option selected" : "setup-theme-option"} onClick={() => setAppearance(id)} key={id}><span className={"theme-preview "+id}><Icon size={24}/><i/><i/><i/></span><b>{label}</b>{appearance===id&&<Check size={15}/>}</button>)}
          </div>
          <h3>Fond d’écran</h3><div className="setup-wallpapers">
            {WALLPAPERS.map((item) => <button className={selectedWall === item.value ? "setup-wall-option selected" : "setup-wall-option"} key={item.name} onClick={() => setSelectedWall(item.value)}><span style={{background:item.background}}>{selectedWall===item.value&&<Check size={20}/>}</span><small>{item.name}</small></button>)}
          </div>
          <p className="setup-footnote">Le fond sélectionné sera utilisé sur le bureau et l’écran verrouillé.</p>
        </div>;
      default:
        return <div className="setup-ready">
          <div className="setup-ready-art"><div className="ready-glow" /><div className="ready-window"><div><i/><i/><i/></div><span /><span /><span /></div><div className="ready-dock"><i/><i/><i/><i/><i/></div><Sparkles className="ready-sparkle" size={27}/></div>
          <h3>Votre espace est prêt.</h3>
          <p>Bonjour {fullName.trim() || "Utilisateur"}. Votre langue, votre profil, votre apparence et vos préférences sont enregistrés localement.</p>
          <div className="setup-review"><span><Globe2 size={15}/>{language}</span><span><MapPin size={15}/>{region}</span><span><Palette size={15}/>{appearance === "auto" ? "Automatique" : appearance === "dark" ? "Sombre" : "Clair"}</span></div>
        </div>;
    }
  };

  return <main className="setup-assistant" style={{ backgroundImage: WALLPAPERS[selectedWall]?.background || undefined }}>
    <div className="setup-backdrop" />
    <div className="setup-topline"><div className="setup-top-brand"><BrandMark/><span>Golden Gate</span></div><div className="setup-top-meta"><LockKeyhole size={13}/> Configuration privée et locale</div></div>
    <motion.section className="setup-panel" initial={{ opacity: 0, scale: 0.965, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}>
      <div className="setup-panel-head">
        <div className="setup-progress-label"><span>ASSISTANT DE CONFIGURATION</span><b>{String(step + 1).padStart(2, "0")} <i>/</i> {String(STAGES.length).padStart(2, "0")}</b></div>
        <div className="setup-progress-track"><i style={{ width: ((step + 1) / STAGES.length * 100) + "%" }} /></div>
        <AnimatePresence mode="wait">
          <motion.div key={step} className="setup-step-heading" initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -7 }} transition={{ duration: .22 }}>
            <div className="setup-step-icon">{[<Globe2/>,<MapPin/>,<Accessibility/>,<Wifi/>,<ShieldCheck/>,<UserRound/>,<Palette/>,<Sparkles/>][step]}</div>
            <h1>{activeStage.title}</h1><p>{activeStage.subtitle}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className={"setup-panel-content step-" + step}>
        <AnimatePresence mode="wait"><motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: .2 }}>{content()}</motion.div></AnimatePresence>
      </div>
      <div className="setup-panel-footer">
        <div className="setup-step-dots">{STAGES.map((item, index) => <button key={item.label} className={index===step ? "active" : index<step ? "done" : ""} onClick={() => { if(index<step) setStep(index); }} aria-label={"Étape "+item.label} />)}</div>
        <div className="setup-footer-actions">{step>0 && <button className="setup-back-button" onClick={back}><ArrowLeft size={15}/> Retour</button>}<button className="setup-next-button" onClick={next}>{step===STAGES.length-1 ? "Démarrer la session" : "Continuer"} {step===STAGES.length-1 ? <Check size={16}/> : <ArrowRight size={16}/>}</button></div>
      </div>
    </motion.section>
    <div className="setup-bottom-note">Un simulateur de bureau indépendant · Aucun compte Apple requis</div>
  </main>;
}
