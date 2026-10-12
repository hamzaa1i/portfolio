import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { PDFDocument, PDFString, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const source = fs.readFileSync(new URL('../src/data/resume.json', import.meta.url),'utf8');
const resume = JSON.parse(source);
const email = process.env.PUBLIC_CONTACT_EMAIL === 'hello@hamzaalikhurram.com'
  ? 'hello@hamzaalikhurram.com' : 'hamzaali.dev@proton.me';
const document = await PDFDocument.create();
document.registerFontkit(fontkit);
const font = await document.embedFont(fs.readFileSync(new URL('./fonts/DejaVuSans.ttf', import.meta.url)), { subset: true });
const bold = await document.embedFont(fs.readFileSync(new URL('./fonts/DejaVuSans-Bold.ttf', import.meta.url)), { subset: true });
const italic = font;
const page = document.addPage([595.276, 841.89]);
const margin = 42;
const width = page.getWidth() - margin * 2;
const ink = rgb(0.09,0.09,0.1);
const muted = rgb(0.28,0.28,0.3);
let y = page.getHeight() - margin;

function linesFor(text, face, size, maxWidth) {
  const lines = []; let line='';
  for (const word of text.split(/\s+/)) {
    const proposed = line ? `${line} ${word}` : word;
    if (face.widthOfTextAtSize(proposed,size) > maxWidth && line) { lines.push(line); line=word; }
    else line=proposed;
  }
  if (line) lines.push(line);
  return lines;
}
function text(value, {size=10,face=font,color=ink,indent=0,leading=13,after=0}={}) {
  for(const line of linesFor(value,face,size,width-indent)) {
    y-=leading;
    if(y<margin) throw new Error('Resume exceeds one A4 page; revise content or layout rather than clipping.');
    page.drawText(line,{x:margin+indent,y,size,font:face,color});
  }
  y-=after;
}
function section(label) {
  y-=9;
  text(label.toUpperCase(),{size:10,face:bold,leading:13,after:5});
  page.drawLine({start:{x:margin,y:y+2},end:{x:margin+width,y:y+2},thickness:0.45,color:rgb(0.73,0.73,0.74)});
}
function link(label,url) {
  const size=8.7;
  const top=y;
  text(label,{size,color:muted,leading:11});
  page.node.addAnnot(document.context.register(document.context.obj({
    Type:'Annot',Subtype:'Link',Rect:[margin,y-2,margin+font.widthOfTextAtSize(label,size),top],
    Border:[0,0,0],A:{Type:'Action',S:'URI',URI:PDFString.of(url)},
  })));
}
text(resume.name,{size:25,face:bold,leading:28,after:3});
text(`${resume.title} | ${resume.secondaryTitle}`,{size:11,leading:14,after:3});
text(`${resume.location} | ${email}`,{size:8.7,color:muted,leading:11});
page.node.addAnnot(document.context.register(document.context.obj({
  Type:'Annot',Subtype:'Link',Rect:[margin+font.widthOfTextAtSize(resume.location+' | ',8.7),y-2,margin+font.widthOfTextAtSize(resume.location+' | '+email,8.7),y+10],
  Border:[0,0,0],A:{Type:'Action',S:'URI',URI:PDFString.of('mailto:'+email)},
})));
link(resume.website.replace('https://',''),resume.website);
link(resume.github.replace('https://',''),resume.github);
section('Summary'); text(resume.summary);
section('Relevant Experience');
for(const item of resume.experience) {
  text(item.heading,{face:bold,size:10,leading:13});
  text(item.period,{size:8.4,color:muted,leading:11});
  text(item.scope,{size:8.6,face:italic,color:muted,leading:11,after:3});
  for(const bullet of item.bullets) text(`- ${bullet}`,{indent:7});
}
section('Selected Projects');
for(const project of resume.projects) {
  text(`${project.name} | ${project.scope}`,{face:bold,size:9.2,leading:12,after:1});
  text(project.description,{after:4});
}
section('Education');
for(const item of resume.education) {
  text(item.heading+(item.period?` | ${item.period}`:''),{face:bold,size:9.2,leading:12});
  if(item.institution || item.detail) text([item.institution,item.detail].filter(Boolean).join('. '),{size:9,leading:11.6,after:2});
}
section('Technical Skills');
for(const group of resume.skills) text(`${group.group}: ${group.items.join(', ')}`,{size:9.1,leading:11.6});

document.setTitle('Hamza Ali - Resume');
document.setAuthor(resume.name);
document.setSubject(resume.title);
document.setProducer('Portfolio resume build');
document.setCreator('Portfolio shared resume data');
document.setKeywords(['resume-source:'+createHash('sha256').update(source+email).digest('hex')]);
const date=new Date(`${resume.updatedDate}T00:00:00Z`);
document.setCreationDate(date);document.setModificationDate(date);
const bytes=await document.save({useObjectStreams:false});
fs.writeFileSync(new URL('../public/Hamza_Ali_Resume.pdf',import.meta.url),bytes);
console.log(`Generated one-page A4 resume (${bytes.length} bytes; ${Math.round(y-margin)}pt remaining).`);
