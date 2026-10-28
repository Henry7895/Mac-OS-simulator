import {CloudSun,Activity,Mic,Shapes,BookOpen,Clock3,Sparkles,Image as ImageIcon,Film,SlidersHorizontal} from "lucide-react";

export const CATALOG_APPS=[
 {id:"Météo",icon:CloudSun,color:"linear-gradient(145deg,#87d6ff,#347fe8)",description:"Consulte la météo d’une ville.",tags:"weather forecast météo",kind:"local"},
 {id:"Dictaphone",icon:Mic,color:"linear-gradient(145deg,#ff9898,#dc3659)",description:"Enregistre du son avec ton microphone.",tags:"audio microphone recorder",kind:"local"},
 {id:"Moniteur d’activité",icon:Activity,color:"linear-gradient(145deg,#b1f3b7,#27ae68)",description:"Observe les fenêtres de la session simulée.",tags:"activity monitor performance",kind:"local"},
 {id:"Freeform",icon:Shapes,color:"linear-gradient(145deg,#ffd28f,#df7cdb)",description:"Crée un tableau de notes local.",tags:"board canvas notes",kind:"local"},
 {id:"Livres",icon:BookOpen,color:"linear-gradient(145deg,#ffbd83,#db613f)",description:"Une petite bibliothèque de lecture.",tags:"books reading",kind:"local"},
 {id:"Horloge",icon:Clock3,color:"linear-gradient(145deg,#c9d7eb,#667d9b)",description:"Horloge locale et fuseaux horaires simulés.",tags:"clock time timer",kind:"local"}
];

export const CREATIVE_APPS=[
 {
  id:"ArtCraft",icon:Sparkles,color:"linear-gradient(145deg,#8267f8,#e37cce)",
  description:"Studio créatif assisté par IA pour composer des images, des vidéos et des scènes 3D.",
  category:"Studio IA",creator:"ArtCraft Team et contributeurs",
  repository:"https://github.com/storytold/artcraft",
  releases:"https://github.com/storytold/artcraft/releases/latest",
  website:"https://getartcraft.com/",
  license:"MIT ou Apache-2.0",
  tags:"ai image video 3d generation studio artcraft"
 },
 {
  id:"PhotoCraft",icon:ImageIcon,color:"linear-gradient(145deg,#3688ff,#224db8)",
  description:"Éditeur photo avec calques, masques, retouche, texte et prise en charge des fichiers PSD.",
  category:"Édition photo",creator:"ArtCraft Team et contributeurs",
  repository:"https://github.com/storytold/photocraft",
  releases:"https://github.com/storytold/photocraft/releases/latest",
  website:"https://getartcraft.com/",
  license:"MIT ou Apache-2.0",
  tags:"photo image editor photoshop psd layers masks photocraft"
 },
 {
  id:"FilmCraft",icon:Film,color:"linear-gradient(145deg,#a05cf4,#5937ad)",
  description:"Logiciel de montage vidéo non linéaire avec outils de couleur, de son, d’effets et de titres.",
  category:"Montage vidéo",creator:"ArtCraft Team et contributeurs",
  repository:"https://github.com/storytold/filmcraft",
  releases:"https://github.com/storytold/filmcraft/releases/latest",
  website:"https://getartcraft.com/",
  license:"MIT ou Apache-2.0",
  tags:"film video editor montage color audio effets filmcraft"
 },
 {
  id:"LightCraft",icon:SlidersHorizontal,color:"linear-gradient(145deg,#e6a23c,#b65b21)",
  description:"Bibliothèque photo et développement RAW non destructif pour classer et retoucher ses photos.",
  category:"Photothèque & RAW",creator:"ArtCraft Team et contributeurs",
  repository:"https://github.com/storytold/lightcraft",
  releases:"https://github.com/storytold/lightcraft/releases/latest",
  website:"https://getartcraft.com/",
  license:"MIT ou Apache-2.0",
  tags:"lightroom photo raw development library non destructive lightcraft"
 }
];
