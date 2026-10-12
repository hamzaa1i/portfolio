import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
const root = path.resolve('dist/client');
const files = fs.readdirSync(root, { recursive: true }).filter(file => file.endsWith('.html'));
const failures = [];
let links = 0;
for (const file of files) {
  const html = fs.readFileSync(path.join(root,file),'utf8');
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const canonical = document.querySelector('link[rel="canonical"]')?.href;
  if (!canonical?.startsWith('https://hamzaalikhurram.com/')) failures.push(`${file}: canonical`);
  if (!document.title || !document.querySelector('meta[name="description"]')?.content) failures.push(`${file}: metadata`);
  for (const img of document.querySelectorAll('img')) if (!img.hasAttribute('alt')) failures.push(`${file}: image alt`);
  for (const node of document.querySelectorAll('[href],[src]')) {
    const value = node.getAttribute('href') || node.getAttribute('src');
    if (!value || !value.startsWith('/') || value.startsWith('//')) continue;
    links++;
    const url = new URL(value,'https://hamzaalikhurram.com');
    const target = path.join(root,decodeURIComponent(url.pathname));
    const fileTarget = [target,path.join(target,'index.html'),target+'.html'].find(candidate=>fs.existsSync(candidate)&&fs.statSync(candidate).isFile());
    if (!fileTarget && !url.pathname.startsWith('/api/')) failures.push(`${file}: missing ${value}`);
    if (url.hash && fileTarget?.endsWith('.html')) {
      const targetDoc = new JSDOM(fs.readFileSync(fileTarget,'utf8')).window.document;
      if (!targetDoc.getElementById(decodeURIComponent(url.hash.slice(1)))) failures.push(`${file}: missing anchor ${value}`);
    }
  }
  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {JSON.parse(script.textContent);} catch {failures.push(`${file}: invalid JSON-LD`);}
  }
  dom.window.close();
}
const sitemap = fs.readFileSync(path.join(root,'sitemap-0.xml'),'utf8');
if (sitemap.includes('hamzaalidev.vercel.app')) failures.push('sitemap: old domain');
console.log(JSON.stringify({ pages:files.length,internalReferences:links,failures },null,2));
if (failures.length) process.exitCode=1;
