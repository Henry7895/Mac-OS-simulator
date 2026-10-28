import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const OUTPUT_ROOT = path.join(ROOT, "public", "creative");
const PROJECTS = ["photocraft","filmcraft","lightcraft","vectorcraft","pdfcraft"].map(slug => ({slug,name:slug==="pdfcraft"?"PdfCraft":slug[0].toUpperCase()+slug.slice(1)}));
const UPSTREAM_FILES = ["LICENSE-MIT","LICENSE-APACHE","NOTICE","ASSETS.md","THIRD_PARTY_NOTICES.md"];
const HEADERS = {"Accept":"application/vnd.github+json","User-Agent":"Golden-Gate-Creative-App-Bundler"};

async function json(url) {
  const response = await fetch(url,{headers:HEADERS});
  if (!response.ok) throw new Error("GitHub API request failed ("+response.status+"): "+url);
  return response.json();
}
async function findWebRoot(root) {
  const queue=[{path:root,depth:0}], matches=[];
  while(queue.length) {
    const current=queue.shift();
    if(current.depth>5) continue;
    const entries=await fs.readdir(current.path,{withFileTypes:true});
    if(entries.some(e=>e.isFile()&&e.name.toLowerCase()==="index.html")) {matches.push(current);continue;}
    for(const e of entries) if(e.isDirectory()&&!e.name.startsWith(".")) queue.push({path:path.join(current.path,e.name),depth:current.depth+1});
  }
  matches.sort((a,b)=>a.depth-b.depth);
  return matches[0]?.path||null;
}
async function prepare(project,tempRoot) {
  const release=await json("https://api.github.com/repos/storytold/"+project.slug+"/releases/latest");
  const asset=(release.assets||[]).find(a=>a.name.toLowerCase().startsWith(project.slug+"-web-")&&a.name.toLowerCase().endsWith(".zip"));
  if(!asset) throw new Error("No official Web ZIP for "+project.name+" in "+release.html_url);
  const target=path.join(OUTPUT_ROOT,project.slug), markerPath=path.join(target,".golden-gate-release.json");
  try {
    const marker=JSON.parse(await fs.readFile(markerPath,"utf8"));
    await fs.access(path.join(target,"index.html"));
    if(marker.tag_name===release.tag_name&&marker.asset===asset.name) {console.log(project.name+": cached "+release.tag_name);return;}
  } catch {}
  console.log(project.name+": bundling "+asset.name+" from official release "+release.tag_name);
  const res=await fetch(asset.browser_download_url,{headers:{"User-Agent":HEADERS["User-Agent"]}});
  if(!res.ok) throw new Error("Download failed ("+res.status+") for "+asset.browser_download_url);
  const zip=path.join(tempRoot,asset.name);
  await fs.writeFile(zip,Buffer.from(await res.arrayBuffer()));
  const extracted=path.join(tempRoot,project.slug+"-extracted");
  await fs.mkdir(extracted,{recursive:true});
  const unpack=spawnSync("tar",["-xf",zip,"-C",extracted],{encoding:"utf8"});
  if(unpack.status!==0) throw new Error("Failed to extract "+asset.name+": "+(unpack.stderr||unpack.error?.message||"tar failed"));
  const webRoot=await findWebRoot(extracted);
  if(!webRoot) throw new Error("Official ZIP for "+project.name+" does not contain index.html");
  await fs.rm(target,{recursive:true,force:true});
  await fs.mkdir(path.dirname(target),{recursive:true});
  await fs.cp(webRoot,target,{recursive:true});
  for(const filename of UPSTREAM_FILES) {
    if(await fs.stat(path.join(target,filename)).then(()=>true).catch(()=>false)) continue;
    for(const ref of [release.tag_name,"main"]) {
      const url="https://raw.githubusercontent.com/storytold/"+project.slug+"/"+encodeURIComponent(ref)+"/"+filename;
      const lr=await fetch(url,{headers:{"User-Agent":HEADERS["User-Agent"]}});
      if(lr.ok) {await fs.writeFile(path.join(target,filename),await lr.text(),"utf8");break;}
    }
  }
  await fs.writeFile(markerPath,JSON.stringify({project:project.name,repository:"https://github.com/storytold/"+project.slug,tag_name:release.tag_name,release_url:release.html_url,asset:asset.name},null,2)+"\n");
  await fs.writeFile(path.join(target,"GOLDEN-GATE-NOTICE.txt"),project.name+" official Web release bundled unmodified by Golden Gate.\nCopyright remains with ArtCraft Team and contributors.\nRepository: https://github.com/storytold/"+project.slug+"\nRelease: "+release.html_url+"\nSee the included upstream licence and asset notice files for full terms.\n","utf8");
}
async function main() {
  await fs.mkdir(OUTPUT_ROOT,{recursive:true});
  const tempRoot=await fs.mkdtemp(path.join(os.tmpdir(),"golden-gate-creative-"));
  try {for(const project of PROJECTS) await prepare(project,tempRoot);}
  finally {await fs.rm(tempRoot,{recursive:true,force:true});}
}
main().catch(error=>{console.error("\nUnable to prepare official creative Web apps; stopping rather than shipping broken install buttons.\n",error);process.exitCode=1;});
