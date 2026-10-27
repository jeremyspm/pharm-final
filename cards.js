import {newState,cardOf,queues,nextCard,answer,undo,preview,stats,dayOf,span,DEFAULTS,NEW,LEARN,REVIEW,RELEARN} from './srs-engine.mjs';
/* Flashcards — a stripped-down Anki (27 Oct 2026: "copy anki basically, I want a full stripped down version of anki with all
   of its shit as a tab"). Decks with New · Learn · Due counts, a deck overview, the study screen (Show answer, then Again ·
   Hard · Good · Easy with each one's next interval, keys 1–4 and Space), undo, bury, suspend, flag, mark, leeches, a card
   browser with search, stats (today, card counts, a 30-day forecast, reviews a day, retention) and the deck options. The
   scheduler is srs-engine.mjs (Anki's SM-2, v3 defaults). Cards come from rep.build.mjs: everything in the written section
   that is not verbatim lecturer material — that stays on the ladder (rep.html). Progress lives in this browser only. */
const D=window.CARD_DATA,M=D.meta,C=new Map(D.cards.map(c=>[c.id,c])),DK=new Map(D.decks.map(d=>[d.id,d]));
const KEY=M.prefix+'srs.v1';
document.documentElement.style.setProperty('--tool',M.hue);
let S;try{S=JSON.parse(localStorage.getItem(KEY))}catch{}
if(!S||S.v!==1||typeof S.cards!=='object'||!Array.isArray(S.log))S=newState();
S.cfg={...DEFAULTS,...S.cfg};
let storeError=false;
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S));storeError=false}catch{storeError=true}};
const $=s=>document.querySelector(s),app=$('#app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const bold=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
const plain=s=>String(s).replace(/\*\*/g,'');
const idsOf=deck=>D.cards.filter(c=>deck==='all'||c.deck===deck).map(c=>c.id);
const deckName=id=>id==='all'?'All decks':DK.get(id)?.title||id;
const hue=id=>`hsl(${DK.get(id)?.hue??220} 70% 62%)`;
const FLAGS=['','var(--danger)','hsl(28 90% 58%)','var(--ok)','hsl(210 90% 62%)'];
let view='decks',deck='all',cur=null,shown=false,t0=0,undoStack=[],browse={q:'',f:'all',deck:'all',open:null};

/* header: the sim's theme; tabs */
$('#themeBtn').onclick=()=>{const r=document.documentElement,to=r.dataset.theme==='light'?'':'light';to?r.dataset.theme='light':delete r.dataset.theme;try{localStorage.setItem(M.prefix+'theme',JSON.stringify(to))}catch{}};
const tabs=()=>`<nav class="tabs" role="tablist">${[['decks','Decks'],['browse','Browse'],['stats','Stats'],['options','Options']].map(([k,t])=>`<button role="tab" class="tab${view===k||(k==='decks'&&(view==='study'||view==='overview'))?' on':''}" data-tab="${k}">${t}</button>`).join('')}</nav>`;
function mount(html){app.innerHTML=tabs()+html+(storeError?'<p class="notice" role="alert">This browser could not save progress. Export it from Options before you close the tab.</p>':'');
  document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{view=b.dataset.tab;cur=null;render()});}
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
 ${paceNote()}
 ${M.how?`<details class="fold"><summary>What is in here</summary><p>${M.how}</p></details>`:''}
 <details class="fold"><summary>How it works (it is Anki)</summary>
  <p>Read the question, answer it in your head, then <b>Show answer</b> (Space) and grade yourself honestly: <b>Again</b> (1) you didn't know it · <b>Hard</b> (2) you got it, barely · <b>Good</b> (3) you got it · <b>Easy</b> (4) too easy. Each button shows when the card comes back.</p>
  <p>New cards go through short <b>learning steps</b> (${S.cfg.learnSteps.join('m, ')}m) before they graduate to days. A review you get wrong goes back into relearning, and its interval drops. ${S.cfg.newPerDay} new cards a day by default; change it in Options.</p>
  <p>Keys: Space shows the answer and then means Good · 1–4 grade · Z undo · B bury until tomorrow · S suspend · M mark · F flag · Esc back to the decks. A card you miss ${S.cfg.leech} times is a <b>leech</b>: it is suspended and tagged, so rewrite it in your own notes and unsuspend it in Browse.</p>
 </details>`);
 document.querySelectorAll('[data-deck]').forEach(r=>r.onclick=()=>{deck=r.dataset.deck;view='overview';render()});
 $('#studyAll').onclick=()=>{deck='all';view='study';cur=null;render()};
}
/* Anki's new-card limit does not know the exam date; say so when it will not reach every card by the day before */
function paceNote(){
 const now=Date.now(),unseen=D.cards.filter(c=>!S.cards[c.id]).length;if(!unseen)return '';
 const [y,m,d]=M.exam.split('-').map(Number),days=Math.max(1,Math.round((new Date(y,m-1,d)-new Date(new Date(now).setHours(0,0,0,0)))/864e5));
 const need=Math.ceil(unseen/days);
 return need>S.cfg.newPerDay?`<p class="notice small">${unseen} cards still new and ${days} day${days===1?'':'s'} to the exam: at ${S.cfg.newPerDay} new a day you will not meet them all. About <b>${need} new a day</b> would — set it in Options.</p>`:'';
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
  <p class="muted">${later?`A learning card is due again in ${span((later.due-now)/1000)}.`:'New cards and reviews come back tomorrow (the day rolls over at 4 am).'} ${counts(deck).n===0&&queues(S,idsOf(deck),now).nw.length===0&&idsOf(deck).some(id=>!S.cards[id])?'You have hit today’s new-card limit; raise it in Options to study more.':''}</p>
  <button class="btn primary wide" id="back">‹ Decks</button>${undoStack.length?'<button class="btn ghost wide" id="undo">Undo the last answer</button>':''}</div>`);
  $('#back').onclick=()=>{view='decks';render()};const u=$('#undo');if(u)u.onclick=doUndo;return;}
 const card=C.get(cur),st=cardOf(S,cur),q=queues(S,idsOf(deck),now);
 const which=st.type===NEW?'n':st.type===REVIEW?'r':'l';
 const top=`<div class="studybar"><button class="btn ghost sm" id="back">‹ Decks</button><span class="qn">${['n','l','r'].map(k=>`<span class="cn ${k}${k===which?' cur':''}">${k==='n'?q.nw.length:k==='l'?q.learn.length+q.ahead.length:q.rev.length}</span>`).join('<i>+</i>')}</span><span class="tools2">${st.flag?`<i class="flag" style="background:${FLAGS[st.flag]}"></i>`:''}${st.mark?'<i class="mark">★</i>':''}</span></div>`;
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
const more=()=>`<div class="more">${btnS('undo','Undo',!undoStack.length)}${btnS('bury','Bury')}${btnS('susp','Suspend')}${btnS('flag','Flag')}${btnS('mark','Mark')}${btnS('info','Info')}</div><div id="infobox"></div>`;
const btnS=(id,t,dis)=>`<button class="btn ghost sm" id="m-${id}"${dis?' disabled':''}>${t}</button>`;
function hookMore(){
 const on=(id,f)=>{const b=$('#m-'+id);if(b)b.onclick=f};
 on('undo',doUndo);on('bury',()=>act('bury'));on('susp',()=>act('susp'));on('flag',()=>act('flag'));on('mark',()=>act('mark'));
 on('info',()=>{const c=cardOf(S,cur),log=S.log.filter(r=>r.id===cur);$('#infobox').innerHTML=`<div class="card small"><b>Card info</b><br>Type: ${['New','Learning','Review','Relearning'][c.type]} · Interval: ${c.ivl?span(c.ivl*86400):'—'} · Ease: ${c.ease?Math.round(c.ease*100)+'%':'—'} · Reviews: ${c.reps||0} · Lapses: ${c.lapses||0}${c.leech?' · leech':''}<br>${log.slice(-8).map(r=>`${new Date(r.t).toLocaleDateString('en-NZ')} ${['','Again','Hard','Good','Easy'][r.e]}`).join(' · ')||'Not studied yet.'}</div>`});
}
function snap(){undoStack.push({id:cur,before:S.cards[cur]?{...S.cards[cur]}:null,logLen:S.log.length});if(undoStack.length>30)undoStack.shift();}
function act(what){
 const today=dayOf(Date.now(),S.cfg),c={...cardOf(S,cur)};snap();
 if(what==='bury')c.buried=today;else if(what==='susp')c.susp=true;else if(what==='flag')c.flag=((c.flag||0)+1)%5;else if(what==='mark')c.mark=!c.mark;
 S.cards[cur]=c;save();if(what==='bury'||what==='susp'){cur=null;}render();
}
function grade(e){
 const ms=Math.min(60000,Date.now()-t0);snap();answer(S,cur,e,Date.now(),ms);save();cur=null;render();
}
function doUndo(){
 const u=undoStack.pop();if(!u)return;
 if(u.before)S.cards[u.id]=u.before;else delete S.cards[u.id];S.log.length=u.logLen;save();
 view='study';cur=u.id;shown=false;t0=Date.now();render();
}
/* ── Browse ── */
function browseView(){
 const now=Date.now(),today=dayOf(now,S.cfg),q=browse.q.toLowerCase();
 const stateOf=c=>c.susp?'Suspended':c.buried>=today?'Buried':['New','Learning','Review','Relearning'][c.type];
 const dueTxt=c=>c.type===NEW?'New':c.type===REVIEW?(c.due<=today?'Due':'in '+span((c.due-today)*86400)):(c.due<=now?'Due':'in '+span((c.due-now)/1000));
 const rows=D.cards.filter(card=>{const c=cardOf(S,card.id);
   if(browse.deck!=='all'&&card.deck!==browse.deck)return false;
   if(q&&!(plain(card.front)+' '+card.back.map(plain).join(' ')).toLowerCase().includes(q))return false;
   const f=browse.f;return f==='all'||f==='new'&&c.type===NEW||f==='learn'&&(c.type===LEARN||c.type===RELEARN)||f==='review'&&c.type===REVIEW||f==='due'&&c.type!==NEW&&(c.type===REVIEW?c.due<=today:c.due<=now)
    ||f==='susp'&&c.susp||f==='buried'&&c.buried>=today||f==='leech'&&c.leech||f==='marked'&&c.mark||f==='flag'&&c.flag;});
 mount(`<div class="card"><div class="bfilters"><input id="bq" type="search" placeholder="Search the cards" value="${esc(browse.q)}">
  <select id="bf">${[['all','All cards'],['new','New'],['learn','Learning'],['review','Review'],['due','Due'],['susp','Suspended'],['buried','Buried'],['leech','Leeches'],['marked','Marked'],['flag','Flagged']].map(([v,t])=>`<option value="${v}"${browse.f===v?' selected':''}>${t}</option>`).join('')}</select>
  <select id="bd"><option value="all">All decks</option>${D.decks.map(d=>`<option value="${d.id}"${browse.deck===d.id?' selected':''}>${esc(d.title)}</option>`).join('')}</select></div>
  <p class="small muted">${rows.length} card${rows.length===1?'':'s'}</p>
  <ul class="blist">${rows.slice(0,300).map(card=>{const c=cardOf(S,card.id),o=browse.open===card.id;return `<li class="${o?'open':''}"><button class="brow" data-open="${esc(card.id)}"><span class="bf">${c.flag?`<i class="flag" style="background:${FLAGS[c.flag]}"></i>`:''}${c.mark?'★ ':''}${esc(plain(card.front))}</span><span class="bm"><i class="dot" style="--cc:${hue(card.deck)}"></i>${stateOf(c)} · ${dueTxt(c)}${c.type===REVIEW?` · ${span(c.ivl*86400)} · ${Math.round(c.ease*100)}%`:''}${c.lapses?` · ${c.lapses} lapses`:''}</span></button>
   ${o?`<div class="bdet"><ul class="back">${card.back.map(t=>`<li>${bold(t)}</li>`).join('')}</ul><p class="source">${esc(deckName(card.deck))} · ${esc(card.src)}</p>
   <div class="row3">${[['susp',c.susp?'Unsuspend':'Suspend'],['bury',c.buried>=today?'Unbury':'Bury'],['flag','Flag'],['mark',c.mark?'Unmark':'Mark'],['forget','Forget (make new)']].map(([a,t])=>`<button class="btn ghost sm" data-act="${a}" data-id="${esc(card.id)}">${t}</button>`).join('')}</div></div>`:''}</li>`}).join('')}</ul>
  ${rows.length>300?'<p class="small muted">Showing the first 300. Narrow the search.</p>':''}</div>`);
 const bq=$('#bq');bq.oninput=()=>{browse.q=bq.value;const p=bq.selectionStart;browseView();const n=$('#bq');n.focus();n.setSelectionRange(p,p)};
 $('#bf').onchange=e=>{browse.f=e.target.value;browseView()};$('#bd').onchange=e=>{browse.deck=e.target.value;browseView()};
 document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{browse.open=browse.open===b.dataset.open?null:b.dataset.open;browseView()});
 document.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>{const id=b.dataset.id,c={...cardOf(S,id)},a=b.dataset.act;
  if(a==='susp')c.susp=!c.susp;else if(a==='bury')c.buried=c.buried>=today?null:today;else if(a==='flag')c.flag=((c.flag||0)+1)%5;else if(a==='mark')c.mark=!c.mark;
  if(a==='forget'){if(!confirm('Forget this card? It goes back to new, and its history is kept in the log.'))return;delete S.cards[id];}else{if(a==='susp'&&!c.susp)c.leech=false;S.cards[id]=c;}
  save();browseView()});
}
/* ── Stats ── */
function statsView(){
 const sel=browse.deck,ids=idsOf(sel),st=stats(S,ids,Date.now()),c=st.count,tot=Object.values(c).reduce((a,b)=>a+b,0)||1;
 const bars=(arr,lab)=>{const mx=Math.max(1,...arr);return `<div class="bars" role="img" aria-label="${lab}">${arr.map((v,i)=>`<i style="height:${Math.round(100*v/mx)}%" title="${v}"></i>`).join('')}</div>`};
 const pct=([a,n])=>n?Math.round(100*a/n)+'% of '+n:'—';
 mount(`<div class="card"><select id="sd"><option value="all">All decks</option>${D.decks.map(d=>`<option value="${d.id}"${sel===d.id?' selected':''}>${esc(d.title)}</option>`).join('')}</select>
  <h3>Today</h3><p>Studied <b>${st.today.n}</b> card${st.today.n===1?'':'s'} in <b>${Math.round(st.today.ms/6e4)}</b> minutes. Again: ${st.today.again} (${st.today.n?Math.round(100*(st.today.n-st.today.again)/st.today.n):0}% correct). New: ${st.today.nw} · Reviews: ${st.today.rv}.</p>
  <h3>Card counts</h3><div class="stack">${[['new','New','n'],['learn','Learning','l'],['young','Young','y'],['mature','Mature','m'],['susp','Suspended','s']].map(([k,t,cl])=>`<i class="${cl}" style="flex:${c[k]}" title="${t} ${c[k]}"></i>`).join('')}</div>
  <p class="small">${[['new','New'],['learn','Learning'],['young','Young (under 21 days)'],['mature','Mature (21 days+)'],['susp','Suspended']].map(([k,t])=>`${t} <b>${c[k]}</b> (${Math.round(100*c[k]/tot)}%)`).join(' · ')}</p>
  <h3>Due in the next 30 days</h3>${bars(st.forecast,'Forecast')}<p class="small muted">Today on the left. ${st.forecast.slice(0,7).reduce((a,b)=>a+b,0)} due in the next 7 days.</p>
  <h3>Reviews a day, last 30 days</h3>${bars(st.hist,'Review history')}<p class="small muted">Today on the right. ${st.hist.reduce((a,b)=>a+b,0)} answers in 30 days.</p>
  <h3>Retention (reviews passed, last 30 days)</h3><p>Young: <b>${pct(st.ret.young)}</b> · Mature: <b>${pct(st.ret.mature)}</b></p></div>`);
 $('#sd').onchange=e=>{browse.deck=e.target.value;statsView()};
}
/* ── Options ── */
function optionsView(){
 const c=S.cfg,num=(k,t,h)=>`<label class="opt"><span>${t}<small>${h||''}</small></span><input type="number" step="any" min="0" data-k="${k}" value="${c[k]}"></label>`;
 mount(`<div class="card"><h3>Daily limits</h3>${num('newPerDay','New cards a day')}${num('revPerDay','Maximum reviews a day')}
  <h3>New cards</h3><label class="opt"><span>Learning steps<small>minutes, space-separated</small></span><input data-steps="learnSteps" value="${c.learnSteps.join(' ')}"></label>
  ${num('gradIvl','Graduating interval','days')}${num('easyIvl','Easy interval','days')}${num('startEase','Starting ease','2.5 = 250%')}
  <label class="opt"><span>New card order</span><select data-k="newOrder"><option value="deck"${c.newOrder==='deck'?' selected':''}>In deck order</option><option value="random"${c.newOrder==='random'?' selected':''}>Random</option></select></label>
  <h3>Lapses</h3><label class="opt"><span>Relearning steps<small>minutes</small></span><input data-steps="relearnSteps" value="${c.relearnSteps.join(' ')}"></label>
  ${num('lapseMult','New interval','× the old one; 0 = back to the minimum')}${num('minIvl','Minimum interval','days')}${num('leech','Leech threshold','lapses')}
  <h3>Advanced</h3>${num('maxIvl','Maximum interval','days')}${num('easyBonus','Easy bonus')}${num('hardIvl','Hard interval')}${num('ivlMod','Interval modifier')}${num('rollover','Next day starts at','hour')}
  <button class="btn primary wide" id="saveOpt">Save options</button><button class="btn ghost wide" id="defOpt">Restore Anki’s defaults</button></div>
  <div class="card"><h3>Your progress</h3><p class="small muted">Kept in this browser only. Export it to move it to another device.</p>
  <div class="row3"><button class="btn ghost sm" id="exp">Export progress</button><button class="btn ghost sm" id="imp">Import progress</button><button class="btn ghost sm danger" id="wipe">Reset all progress</button></div><input id="impf" type="file" accept="application/json" hidden></div>`);
 $('#saveOpt').onclick=()=>{
  document.querySelectorAll('[data-k]').forEach(i=>{const k=i.dataset.k;c[k]=k==='newOrder'?i.value:Math.max(0,parseFloat(i.value)||0)});
  document.querySelectorAll('[data-steps]').forEach(i=>{const v=i.value.split(/[\s,]+/).map(Number).filter(x=>x>0);if(v.length)c[i.dataset.steps]=v});
  c.startEase=Math.max(1.3,c.startEase);c.minIvl=Math.max(1,c.minIvl);save();optionsView();toast('Options saved.')};
 $('#defOpt').onclick=()=>{S.cfg={...DEFAULTS};save();optionsView();toast('Anki’s defaults restored.')};
 $('#exp').onclick=()=>{const b=new Blob([JSON.stringify(S)],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=M.prefix+'flashcards.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)};
 $('#imp').onclick=()=>$('#impf').click();
 $('#impf').onchange=async e=>{try{const x=JSON.parse(await e.target.files[0].text());if(x.v!==1||typeof x.cards!=='object'||!Array.isArray(x.log))throw 0;S={...x,cfg:{...DEFAULTS,...x.cfg}};save();toast('Progress imported.');optionsView()}catch{alert('That file is not flashcard progress from this page. Nothing was changed.')}};
 $('#wipe').onclick=()=>{if(confirm('Reset all flashcard progress in this browser? Every card goes back to new. This cannot be undone (export first if unsure).')){S=newState(S.cfg);undoStack=[];save();toast('Progress reset.');optionsView()}};
}
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),2200)}

function render(){window.scrollTo(0,0);({decks:decksView,overview,study,browse:browseView,stats:statsView,options:optionsView})[view]();}
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
 if(k==='b')act('bury');else if(k==='s'||e.key==='@')act('susp');else if(k==='m'||e.key==='*')act('mark');else if(k==='f')act('flag');
});
render();
