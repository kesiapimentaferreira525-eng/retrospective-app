const KEY='caixa-review-board';
const COLS=[{id:'bom',t:'O que ocorreu de bom?',e:'🎉',c:'p'},{id:'melhorar',t:'O que pode ser melhorado?',e:'🔧',c:'g'},{id:'acoes',t:'Ações a serem realizadas',e:'🚀',c:'o'},{id:'agradec',t:'Reconhecimentos / Agradecimentos',e:'💙',c:'c'}];
const COLORS={y:'var(--y)',p:'var(--p)',g:'var(--g)',o:'var(--o)',c:'var(--c)',k:'var(--k)'};
const REACT=['👍','❤️','😂','🚀','👏','😲'];
const seed={title:'SICAQ – PI 04 Sprint 2',cards:[
{id:1,col:'bom',text:'Entrega do Consignado INSS, Biometria e Whatsapp',color:'p',votes:5,who:'Deise'},
{id:2,col:'bom',text:'Retorno do Thiago',color:'p',votes:3,who:'Equipe'},
{id:3,col:'bom',text:'Github Copilot',color:'p',votes:1,who:'Equipe'},
{id:4,col:'melhorar',text:'Divisão da equipe me preocupa',color:'g',votes:7,who:'Anônimo'},
{id:5,col:'melhorar',text:'O Backlog de Demandas baixo',color:'g',votes:1,who:'Anônimo'},
{id:6,col:'acoes',text:'Conversar com Marta, Marcelo e Henry sobre o Backlog',color:'o',votes:0,who:'Deise'},
{id:7,col:'agradec',text:'A toda Squad SICAQ pelas entregas realizadas',color:'c',votes:2,who:'Equipe'}]};
let S=JSON.parse(localStorage.getItem(KEY)||'null')||seed;
const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
const $=s=>document.querySelector(s);
const board=$('#board');let editing=null,pick='y';
$('#me').value=localStorage.getItem(KEY+'-me')||'';
$('#me').oninput=e=>localStorage.setItem(KEY+'-me',e.target.value);
$('#boardTitle').value=S.title;$('#boardTitle').oninput=e=>{S.title=e.target.value;save()};

function render(){
  board.innerHTML='';const q=$('#filter').value.toLowerCase();
  COLS.forEach(col=>{
    const list=S.cards.filter(c=>c.col===col.id).sort((a,b)=>b.votes-a.votes);
    const el=document.createElement('section');el.className='col';el.dataset.col=col.id;
    el.innerHTML=`<h3>${col.e} ${col.t} <button class="add" title="Adicionar card">+</button><span class="count">${list.length}</span></h3><div class="cards"></div>`;
    el.querySelector('.add').onclick=()=>openModal(col);
    const wrap=el.querySelector('.cards');
    list.forEach(c=>{
      const d=document.createElement('article');d.className='card'+(q&&!c.text.toLowerCase().includes(q)?' hide':'');
      d.draggable=true;d.style.background=COLORS[c.color];d.style.setProperty('--r',((c.id*37)%7-3)+'deg');
      const r=c.reacts||{};
      d.innerHTML=`<button class="del" title="Excluir">✕</button><div class="txt"></div><span class="who">— ${c.who||'Anônimo'}</span>
      <div class="bar"><button data-v>+${c.votes}</button>${REACT.map(e=>`<button data-r="${e}">${e}${r[e]?' '+r[e]:''}</button>`).join('')}</div>`;
      d.querySelector('.txt').textContent=c.text;
      d.querySelector('[data-v]').onclick=ev=>{c.votes++;burst(ev,'⭐');if(c.votes%5===0)confetti();save();render()};
      d.querySelectorAll('[data-r]').forEach(b=>b.onclick=ev=>{c.reacts=r;r[b.dataset.r]=(r[b.dataset.r]||0)+1;burst(ev,b.dataset.r);save();render()});
      d.querySelector('.del').onclick=()=>{if(confirm('Excluir este card?')){S.cards=S.cards.filter(x=>x!==c);save();render()}};
      d.ondblclick=()=>openModal(col,c);
      d.ondragstart=e=>{e.dataTransfer.setData('id',c.id);d.classList.add('dragging')};
      d.ondragend=()=>d.classList.remove('dragging');
      wrap.appendChild(d);
    });
    el.ondragover=e=>{e.preventDefault();el.classList.add('over')};
    el.ondragleave=()=>el.classList.remove('over');
    el.ondrop=e=>{const c=S.cards.find(x=>x.id==e.dataTransfer.getData('id'));if(c){c.col=col.id;save();render()}};
    board.appendChild(el);
  });
}
function openModal(col,card){
  editing={col,card};pick=card?card.color:col.c;
  $('#modalTitle').textContent=card?'Editar card':col.e+' '+col.t;
  $('#text').value=card?card.text:'';drawColors();$('#modal').hidden=false;$('#text').focus();
}
function drawColors(){$('#colors').innerHTML='';Object.keys(COLORS).forEach(k=>{const b=document.createElement('button');b.type='button';b.style.background=COLORS[k];if(k===pick)b.className='sel';b.onclick=()=>{pick=k;drawColors()};$('#colors').appendChild(b)})}
$('#cancel').onclick=()=>$('#modal').hidden=true;
$('#form').onsubmit=e=>{e.preventDefault();const text=$('#text').value.trim();if(!text)return;
  if(editing.card){editing.card.text=text;editing.card.color=pick}
  else{S.cards.push({id:Date.now(),col:editing.col.id,text,color:pick,votes:0,who:$('#me').value||'Anônimo'});confetti(30)}
  save();$('#modal').hidden=true;render()};
$('#filter').oninput=render;
$('#resetBtn').onclick=()=>{if(confirm('Apagar todos os cards?')){S.cards=[];save();render()}};
$('#exportBtn').onclick=()=>{let t=`# ${S.title}\n`;COLS.forEach(c=>{t+=`\n## ${c.t}\n`;S.cards.filter(x=>x.col===c.id).forEach(x=>t+=`- ${x.text} (+${x.votes}) — ${x.who}\n`)});
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/plain'}));a.download='review.txt';a.click()};
function burst(ev,e){const s=document.createElement('span');s.className='float';s.textContent=e;s.style.left=ev.clientX+'px';s.style.top=ev.clientY-20+'px';document.body.appendChild(s);setTimeout(()=>s.remove(),1000)}
function confetti(n=60){const cs=['#005ca9','#f39200','#e6d4ff','#c9f2d5','#ffd3a3'];for(let i=0;i<n;i++){const b=document.createElement('i');b.className='bit';b.style.left=Math.random()*100+'vw';b.style.background=cs[i%5];b.style.animationDelay=Math.random()*.5+'s';$('#confetti').appendChild(b);setTimeout(()=>b.remove(),2200)}}
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#modal').hidden=true});
render();
