import {newState,cardOf,queues,nextCard,answer,undo,preview,stats,dayOf,span,DEFAULTS,NEW,LEARN,REVIEW,RELEARN} from './srs-engine.mjs';
/* Flashcards — a stripped-down Anki (27 Oct 2026: "copy anki basically, I want a full stripped down version of anki with all
   of its shit as a tab"). Decks with New · Learn · Due counts, a deck overview, the study screen (Show answer, then Again ·
   Hard · Good · Easy with each one's next interval, keys 1–4 and Space), undo, bury, suspend, flag, mark, leeches, a card
   browser with search, stats (today, card counts, a 30-day forecast, reviews a day, retention) and the deck options. The
   scheduler is srs-engine.mjs (Anki's SM-2, v3 defaults). Cards come from rep.build.mjs: everything in the written section
   that is not verbatim lecturer material — that stays on the ladder (rep.html). Progress lives in this browser only.
   27 Oct, later ("no one needs to know or see those settings"): Decks only. Browse, Stats, Options, bury, suspend, flag,
   mark and card info are off the page; the engine keeps them. Undo stays. The new-card limit follows the exam date by
   itself (pace), since there's no Options tab to raise it in. */
const D=window.CARD_DATA,M=D.meta,C=new Map(D.cards.map(c=>[c.id,c])),DK=new Map(D.decks.map(d=>[d.id,d]));
const KEY=M.prefix+'srs.v1';
document.documentElement.style.setProperty('--tool',M.hue);
let S;try{S=JSON.parse(localStorage.getItem(KEY))}catch{}
if(!S||S.v!==1||typeof S.cards!=='object'||!Array.isArray(S.log))S=newState();
S.cfg={...DEFAULTS,...S.cfg};
/* pace: enough new cards a day to meet every card by the exam, never fewer than Anki's default */
{const unseen=D.cards.filter(c=>!S.cards[c.id]).length,[y,m,d]=M.exam.split('-').map(Number),
  days=Math.max(1,Math.round((new Date(y,m-1,d)-new Date(new Date().setHours(0,0,0,0)))/864e5));
 S.cfg.newPerDay=Math.max(DEFAULTS.newPerDay,Math.ceil(unseen/days));}
let storeError=false;
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S));storeError=false}catch{storeError=true}};
const $=s=>document.querySelector(s),app=$('#app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const bold=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
const plain=s=>String(s).replace(/\*\*/g,'');
const idsOf=deck=>D.cards.filter(c=>deck==='all'||c.deck===deck).map(c=>c.id);
const deckName=id=>id==='all'?'All decks':DK.get(id)?.title||id;
const hue=id=>`hsl(${DK.get(id)?.hue??220} 70% 62%)`;
let view='decks',deck='all',cur=null,shown=false,t0=0,undoStack=[];

/* header: the sim's theme; tabs */
$('#themeBtn').onclick=()=>{const r=document.documentElement,to=r.dataset.theme==='light'?'':'light';to?r.dataset.theme='light':delete r.dataset.theme;try{localStorage.setItem(M.prefix+'theme',JSON.stringify(to))}catch{}};
function mount(html){app.innerHTML=html+(storeError?'<p class="notice" role="alert">This browser could not save progress.</p>':'');}
const counts=deck=>{const q=queues(S,idsOf(deck),Date.now());return {n:q.nw.length,l:q.learn.length,r:q.rev.length}};
const nums=c=>`<span class="cn n">${c.n}</span><span class="cn l">${c.l}</span><span class="cn r">${c.r}</span>`;

/* ── Decks ── */
function decksView(){
 const t=stats(S,idsOf('all'),Date.now()).today,all=counts('all');
 mount(`<div class="idcard"><span class="idic" aria-hidden="true">${esc(M.icon)}</span><span class="idtx"><small>${esc(M.kick)}</small><b>${esc(M.name)}</b><span>${esc(M.sub)}</span></span></div>
 <div class="card"><table class="decks"><thead><tr><th>Deck</th><th class="n">New</th><th class="l">Learn</th><th class="r">Due</th></tr></thead><tbody>
 <tr class="all" data-deck="all"><td><b>All decks</b></td><td>${all.n}</td><td>${all.l}</td><td>${all.r}</td></tr>
 ${D.decks.map(d=>{const c=counts(d.id);return `<tr data-deck="${d.id}" style="--cc:${hue(d.id)}"><td><i class="dot"></i>${esc(d.title)} <small>${d.n}</small></td><td class="${c.n?'':'z'}">${c.n}</td><td class="${c.l?'':'z'}">${c.l}</td><td class="${c.r?'':'z'}">${c.r}</td></tr>`}).join('')}
 </tbody></table>
 <button class="btn primary wide" id="studyAll">Study all decks</button></div>
 <p class="small muted center">Studied ${t.n} card${t.n===1?'':'s'} in ${Math.round(t.ms/6e4)} minute${Math.round(t.ms/6e4)===1?'':'s'} today.</p>
 ${M.how?`<details class="fold"><summary>What is in here</summary><p>${M.how}</p></details>`:''}
 <details class="fold"><summary>How it works</summary>
  <p>Answer it in your head, then <b>Show answer</b> (Space) and be honest: <b>Again</b> you didn't know it · <b>Hard</b> barely · <b>Good</b> you got it · <b>Easy</b> too easy. Each button shows when the card comes back. ${S.cfg.newPerDay} new cards a day, enough to meet them all before the exam. Keys: Space, 1–4, Z to undo, Esc for the decks.</p>
 </details>`);
 document.querySelectorAll('[data-deck]').forEach(r=>r.onclick=()=>{deck=r.dataset.deck;view='overview';render()});
 $('#studyAll').onclick=()=>{deck='all';view='study';cur=null;render()};
}
/* ── Overview ── */
function overview(){
 const c=counts(deck),d=DK.get(deck);
 mount(`<div class="card ov" style="--cc:${deck==='all'?'var(--primary)':hue(deck)}"><h2>${esc(deckName(deck))}</h2>
 <div class="ovn"><div><strong class="n">${c.n}</strong><span>New</span></div><div><strong class="l">${c.l}</strong><span>Learning</span></div><div><strong class="r">${c.r}</strong><span>To review</span></div></div>
 ${c.n+c.l+c.r?`<button class="btn primary wide" id="go">Study now</button>`:`<p class="center muted">Nothing due in this deck right now.</p>`}
 <button class="btn ghost wide" id="back">‹ Decks</button>${d?`<p class="small muted center">${d.n} cards in this deck</p>`:''}</div>`);
 const g=$('#go');if(g)g.onclick=()=>{view='study';cur=null;render()};$('#back').onclick=()=>{view='decks';render()};
}
/* ── Study ── */
function study(){
 const now=Date.now();
 if(!cur){const n=nextCard(S,idsOf(deck),now);cur=n.id;shown=false;t0=now;}
 if(!cur){
  const later=idsOf(deck).map(id=>S.cards[id]).filter(c=>c&&!c.susp&&(c.type===LEARN||c.type===RELEARN)).sort((a,b)=>a.due-b.due)[0];
  mount(`<div class="card center"><h2>Congratulations! You have finished ${deck==='all'?'all decks':'this deck'} for now.</h2>
  <p class="muted">${later?`A learning card is due again in ${span((later.due-now)/1000)}.`:'New cards and reviews come back tomorrow.'}</p>
  <button class="btn primary wide" id="back">‹ Decks</button>${undoStack.length?'<button class="btn ghost wide" id="undo">Undo the last answer</button>':''}</div>`);
  $('#back').onclick=()=>{view='decks';render()};const u=$('#undo');if(u)u.onclick=doUndo;return;}
 const card=C.get(cur),st=cardOf(S,cur),q=queues(S,idsOf(deck),now);
 const which=st.type===NEW?'n':st.type===REVIEW?'r':'l';
 const top=`<div class="studybar"><button class="btn ghost sm" id="back">‹ Decks</button><span class="qn">${['n','l','r'].map(k=>`<span class="cn ${k}${k===which?' cur':''}">${k==='n'?q.nw.length:k==='l'?q.learn.length+q.ahead.length:q.rev.length}</span>`).join('<i>+</i>')}</span><span class="tools2"></span></div>`;
 const front=`<div class="where"><span class="tag" style="--cc:${hue(card.deck)}">${esc(deckName(card.deck))}</span><span class="tag ${card.who==='tool'?'tool':'plain'}">${esc(card.kind)}</span>${st.type===NEW?'<span class="tag new">New</span>':''}</div>
  ${card.title?`<p class="ctitle">${esc(card.title)}</p>`:''}<div class="front">${bold(card.front)}</div>`;
 if(!shown){
  mount(`${top}<div class="card face" style="--cc:${hue(card.deck)}">${front}</div><div class="answerbar"><button class="btn primary wide" id="show">Show answer <kbd>Space</kbd></button></div>${more()}`);
  $('#show').onclick=()=>{shown=true;render()};
 }else{
  let k=0;const back=card.heads?card.heads.map(([h,n])=>`<p class="bh">${esc(h)}</p><ul class="back">${card.back.slice(k,k+=n).map(t=>`<li>${bold(t)}</li>`).join('')}</ul>`).join(''):`<ul class="back">${card.back.map(t=>`<li>${bold(t)}</li>`).join('')}</ul>`;
  const btns=[[1,'Again','again'],[2,'Hard','hard'],[3,'Good','good'],[4,'Easy','easy']].map(([e,t,c])=>`<button class="ans ${c}" data-ease="${e}"><small>${preview(st,e,now,S.cfg,cur)}</small>${t}<kbd>${e}</kbd></button>`).join('');
  mount(`${top}<div class="card face" style="--cc:${hue(card.deck)}">${front}<hr>${back}
   ${card.full?`<details class="fold"><summary>The full model answer</summary><ol>${card.full.map(t=>`<li>${esc(t)}</li>`).join('')}</ol></details>`:''}
   <details class="fold"><summary>Where this is from</summary><p class="source">${esc(card.src)}${card.who==='tool'?' · The question and answer are the tool’s, not the lecturer’s.':''}</p></details></div>
   <div class="answerbar grades">${btns}</div>${more()}`);
  document.querySelectorAll('[data-ease]').forEach(b=>b.onclick=()=>grade(+b.dataset.ease));
 }
 $('#back').onclick=()=>{view='decks';cur=null;render()};
 hookMore();
}
const more=()=>undoStack.length?`<div class="more"><button class="btn ghost sm" id="m-undo">Undo</button></div>`:'';
function hookMore(){const b=$('#m-undo');if(b)b.onclick=doUndo;}
function snap(){undoStack.push({id:cur,before:S.cards[cur]?{...S.cards[cur]}:null,logLen:S.log.length});if(undoStack.length>30)undoStack.shift();}
function grade(e){
 const ms=Math.min(60000,Date.now()-t0);snap();answer(S,cur,e,Date.now(),ms);save();cur=null;render();
}
function doUndo(){
 const u=undoStack.pop();if(!u)return;
 if(u.before)S.cards[u.id]=u.before;else delete S.cards[u.id];S.log.length=u.logLen;save();
 view='study';cur=u.id;shown=false;t0=Date.now();render();
}
function render(){window.scrollTo(0,0);({decks:decksView,overview,study})[view]();}
/* keys, as in Anki */
document.addEventListener('keydown',e=>{
 if(e.target.matches?.('input,select,textarea')||e.ctrlKey&&e.key!=='z'||e.metaKey||e.altKey)return;
 if(view!=='study'){return;}
 const k=e.key.toLowerCase();
 if(k==='escape'){view='decks';cur=null;render();return}
 if(k==='z'){e.preventDefault();doUndo();return}
 if(!cur)return;
 if(!shown&&(k===' '||k==='enter')){e.preventDefault();shown=true;render();return}
 if(shown&&(k===' '||k==='enter')){e.preventDefault();grade(3);return}
 if(shown&&['1','2','3','4'].includes(k)){e.preventDefault();grade(+k);return}
});
render();
