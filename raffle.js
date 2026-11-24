(()=>{
const K='caixa-raffle',$=s=>document.querySelector(s);
let L=JSON.parse(localStorage.getItem(K)||'[]');
const save=()=>localStorage.setItem(K,JSON.stringify(L));
const esc=t=>t.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function render(){$('#raffleBody').innerHTML=L.map((p,i)=>`<tr class="${p.drawn?'done':''}"><td><span class="dot ${p.drawn?'done':''}" title="${p.drawn?'Já sorteado':'Disponível'}"></span></td><td>${esc(p.name)}</td><td>${p.drawn||'—'}</td><td><button class="raffle-del" data-i="${i}" aria-label="Remover">✕</button></td></tr>`).join('')||'<tr><td colspan="4">Adicione os colaboradores acima.</td></tr>'}
$('#raffleBtn').onclick=()=>{render();$('#raffle').hidden=false};
$('#raffleClose').onclick=()=>$('#raffle').hidden=true;
$('#raffleForm').onsubmit=e=>{e.preventDefault();const n=$('#raffleName').value.trim();if(n){L.push({name:n,drawn:null});save();render()}$('#raffleName').value=''};
$('#raffleBody').onclick=e=>{const b=e.target.closest('.raffle-del');if(b&&confirm('Remover colaborador?')){L.splice(+b.dataset.i,1);save();render()}};
$('#raffleReset').onclick=()=>{if(confirm('Liberar todos para nova rodada?')){L.forEach(p=>p.drawn=null);save();render();$('#raffleResult').textContent='Clique em sortear!'}};
$('#raffleDraw').onclick=()=>{
  if(!L.length)return $('#raffleResult').textContent='Adicione colaboradores primeiro';
  let pool=L.filter(p=>!p.drawn);
  if(!pool.length){L.forEach(p=>p.drawn=null);pool=L.slice()}
  const r=$('#raffleResult'),btn=$('#raffleDraw');btn.disabled=true;r.classList.add('spin');let t=0;
  const iv=setInterval(()=>{r.textContent=pool[Math.floor(Math.random()*pool.length)].name;if(++t>18){clearInterval(iv);
    const w=pool[Math.floor(Math.random()*pool.length)];w.drawn=new Date().toLocaleDateString('pt-BR');save();
    r.classList.remove('spin');r.textContent='🏆 '+w.name;btn.disabled=false;render();window.confetti?.()}},90)};
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#raffle').hidden=true});
})();
