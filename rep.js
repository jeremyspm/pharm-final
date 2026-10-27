import {makeUnits,selectNext,record,snapshot,ready,keyTerms,markFacts,termFound,pace,DAY_HITS,SOLID} from './rep-engine.mjs';
/* Learn the short answers — the Paper Sim port (27 Oct 2026) of hs2-final's "Learn the cases": the same ladder, marking and
   drilling (rep-engine.mjs is that page's, unchanged), driven by REP_DATA (rep.build.mjs) instead of HS2's ten cases.
   Everything is typed and marked by the page, never ticked on trust, and only ever key words, never sentences: a new piece
   climbs a ladder of hidden key words, then comes back a few pieces later for its key words from memory. The lecturer's
   own material comes first in the queue; the tool's written questions come last and say so. */
const D=window.REP_DATA,M=D.meta,Q=new Map(D.questions.map(q=>[q.id,q]));
for(const q of D.questions)q.caseId=q.group;
const ALL=makeUnits(D.questions).filter(u=>u.kind!=='closed');
const ROUND=12;
const STEPS=['Read it','One key word a line hidden','Every key word hidden','Key words from memory'],MEM=3;
const G=new Map(D.groups.map(g=>[g.id,g])),CC=id=>`hsl(${G.get(id)?.hue??220} 70% 62%)`;
document.documentElement.style.setProperty('--tool',M.hue);
const KEY=M.prefix+'relearn.v1';
let storeError=false,state;
try{state=JSON.parse(localStorage.getItem(KEY))}catch{}
if(!state||state.version!==1||typeof state.items!=='object'||typeof state.facts!=='object')state={version:1,items:{},facts:{},turn:0,filter:'all',active:null,lv:2};
state.turn ||= 0;state.filter ||= 'all';
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));storeError=false}catch{storeError=true;}};
const $=s=>document.querySelector(s),app=$('#app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const bold=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
const units=()=>ALL;
const gName=id=>G.get(id)?.title||'Other';
const title=q=>q.short.title;
const ladder=r=>`<div class="ladder" aria-label="Step ${r+1} of ${STEPS.length}">${STEPS.map((s,i)=>`<span class="${i<r?'done':i===r?'on':''}" title="${s}">${i+1}</span>`).join('<i></i>')}</div>`;
const stepLabel=r=>`${r+1} · ${STEPS[r]}`;
const dots=(k,of)=>`<b class="dots" aria-label="${k} of ${of}">${Array.from({length:of},(_,i)=>`<i class="${i<k?'on':''}"></i>`).join('')}</b>`;
const day=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const daysTo=s=>{const t=new Date();t.setHours(0,0,0,0);return Math.round((day(s)-t)/864e5)};
const fmt=s=>day(s).toLocaleDateString('en-NZ',{weekday:'short',day:'numeric',month:'short'});
const askOf=f=>f.ask?`<span class="ask">${esc(f.ask.replace(/^Question \w+\s+/,''))}</span>`:'';
let run=null,sessionCount=0;

/* ── header: theme shared with the Paper Sim (<prefix>theme), countdown to the sitting ── */
$('#themeBtn').onclick=()=>{const r=document.documentElement,to=r.dataset.theme==='light'?'':'light';
  to?r.dataset.theme='light':delete r.dataset.theme;try{localStorage.setItem(M.prefix+'theme',JSON.stringify(to))}catch{}};
const when=()=>{const n=daysTo(M.exam);return n>1?`${n} days to ${fmt(M.exam)}`:n===1?'Exam tomorrow':n===0?'Exam today':''};
$('#countdown').textContent=when();

function mount(html){app.innerHTML=html+(storeError?'<p class="notice" role="alert">This browser could not save progress. Keep this tab open and export progress from the home screen.</p>':'');window.scrollTo(0,0);}
const btn=(id,text,cls='primary wide')=>`<button id="${id}" class="btn ${cls}">${text}</button>`;
function source(q){return `<details class="fold"><summary>The full question and where the answer is from</summary>${q.recall?'':`<p>${esc(q.qt)}</p>`}<p class="source">${esc(q.source)}${q.who==='tool'?' · The question and its answer are the tool’s, not the lecturer’s.':''}</p>${q.steps?`<ol>${q.steps.map(t=>`<li>${esc(t)}</li>`).join('')}</ol>`:''}</details>`;}
function support(q){return `<details class="fold" id="extraHelp"><summary>Stuck? Show the answer lines (counts as help)</summary>${q.note?`<p>${esc(q.note)}</p>`:''}${factList(q.short.groups.flatMap(g=>g.facts))}</details>`;}
function hookHelp(){const e=$('#extraHelp');if(e)e.addEventListener('toggle',()=>{if(e.open){run.assisted=true;persist();}});}
function persist(){state.active={...run};save();}

/* ── home ── */
function home(){
 run=null;const U=units(),s=snapshot(U,state),p=pace(U,state,Date.now(),M.last),n=daysTo(M.exam);
 const active=state.active&&U.some(u=>u.id===state.active.id);
 const met=p.done>=p.target;
 const paceLine=p.left===0
   ?'Every piece is in. From here it’s reviews: clear the due ones each day.'
   :met?`Today’s <b>${p.target}</b> are done. Reviews keep them; more new pieces put you ahead.`
   :`<b>${p.target} new a day</b> meets all ${s.total} by ${fmt(M.last)}.${p.left<s.total?` ${p.left} still to meet.`:''}`;
 mount(`<div class="idcard"><span class="idic" aria-hidden="true">${esc(M.icon)}</span><span class="idtx"><small>${esc(M.kick)}</small><b>${esc(M.name)}</b><span>${esc(M.sub)}</span>${n>=0?`<span class="idwhen">${n===0?'Your sitting is today':`${n} day${n===1?'':'s'} to your sitting · ${fmt(M.exam)}`}</span>`:''}</span></div>
 <div class="card today"><div class="k">Today</div>
  <div class="nums"><div><strong>${p.done}<i>/${p.target}</i></strong><span>new pieces</span></div><div><strong>${s.due}</strong><span>back for review</span></div><div><strong>${s.retained}<i>/${s.total}</i></strong><span>solid (${SOLID} days)</span></div></div>
  <div class="bar"><i style="width:${p.target?Math.min(100,100*p.done/p.target):100}%"></i></div>
  <p class="pace">${paceLine}</p>
  ${btn('begin',active?'Carry on where you stopped':'Start a round of 12')}
 </div>
 <p class="small muted">The written section, learned as key words. The questions that mark themselves (multiple choice) are in the <a href="${esc(M.home)}">Paper Sim</a>.</p>
 <div class="lsec">The ${esc(M.groupWord)}</div>
 ${D.groups.map(g=>{const sub=U.filter(u=>u.caseId===g.id),v=snapshot(sub,state);return `<button class="lrow${v.seen===v.total?' done':''}" data-case="${g.id}" style="--cc:${CC(g.id)}"><span class="lic">${esc(g.title.slice(0,1))}</span><span class="ltx"><b>${esc(g.title)}</b><small>${v.seen}/${v.total} met · ${v.retained} solid${v.due?` · ${v.due} back`:''}</small><span class="bar"><i style="width:${v.total?100*v.seen/v.total:0}%"></i></span></span><span class="lch">›</span></button>`}).join('')}
 <div class="tools">${btn('reviewOnly',`Reviews only${s.due?` · ${s.due}`:''}`,'ghost sm')}${btn('export','Export progress','ghost sm')}${btn('import','Import progress','ghost sm')}<input id="importFile" type="file" accept="application/json" hidden></div>
 <details class="fold"><summary>How this works</summary>
  <p><b>You learn the key words, not the sentences.</b> The highlighted words are what the marker looks for, about 2 a line. You never have to type a sentence here.</p>
  <p><b>A new piece climbs a ladder:</b> 1 read it · 2 one key word a line hidden · 3 every key word hidden. Get a step right and the next one hides more. Miss one and you try that step again, or leave it there and it comes back at that step.</p>
  <p><b>Step 4 comes a few pieces later:</b> type the key words from memory, any order. It's only ever the last step: miss it and it comes back at step 3, never blank. Spelling slips, swapped letters, British/US spellings and word endings are fine; hyper/hypo, intra/inter, numbers and the like are not.</p>
  <p><b>Then it gets drilled.</b> A day only counts after ${DAY_HITS} from-memory hits in a row, a few pieces apart. Then it's back tomorrow, then in 2 days, then 3, and each of those days needs its ${DAY_HITS} in a row too. <b>Solid</b> means ${SOLID} days running. Any miss wipes the streak and it starts again.</p>
  <p>Long answers are learned in pieces of four points, then all their key words together.</p>
  ${M.how?`<p class="source">${M.how}</p>`:''}
  <p class="source">${D.questions.length} pieces, ${D.facts} marking points. “Solid” means written from memory on ${SOLID} different days in a row; it isn’t an exam mark. Progress is separate from your Paper Sim scores.</p>
 </details>`);
 $('#begin').onclick=()=>{sessionCount=0;if(active){run={...state.active};render()}else{state.filter='all';save();next()}};
 document.querySelectorAll('[data-case]').forEach(b=>b.onclick=()=>{state.filter=b.dataset.case;state.active=null;save();sessionCount=0;next()});
 $('#reviewOnly').onclick=()=>{const pool=U.filter(u=>ready(u,state)&&state.items[u.id]?.seen&&state.items[u.id].due<=Date.now()).sort((a,b)=>state.items[a.id].due-state.items[b.id].due);sessionCount=0;if(pool.length)open(pool[0]);else info('Nothing due yet','Pieces come back a few turns after a miss, and a day or more after you get them from memory. Meet new pieces for now.');};
 $('#export').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=M.prefix+'recall-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 $('#import').onclick=()=>$('#importFile').click();
 $('#importFile').onchange=async e=>{try{const x=JSON.parse(await e.target.files[0].text());if(x.version!==1||!x.items||!x.facts||!Number.isFinite(x.turn))throw Error('Unsupported progress file');for(const u of ALL){const incoming=x.items[u.id],old=state.items[u.id];if(incoming&&Number.isFinite(incoming.last)&&(!old||incoming.last>old.last))state.items[u.id]=incoming;}for(const [k,v]of Object.entries(x.facts))if(v&&Number.isFinite(v.last)&&(!state.facts[k]||v.last>state.facts[k].last))state.facts[k]=v;state.turn=Math.max(state.turn,x.turn);state.active=null;save();home()}catch{alert('Could not read that progress file. Your existing progress was kept.')}};
}
function info(t,p){mount(`<div class="card"><h2 style="margin:0 0 6px;font-size:1.15rem">${esc(t)}</h2><p class="muted">${esc(p)}</p>${btn('back','Back to the '+M.groupWord)}</div>`);$('#back').onclick=home;}

/* ── the queue ── */
function next(){
 if(sessionCount>=ROUND){const U=units(),p=pace(U,state,Date.now(),M.last);
  mount(`<div class="card today"><div class="k">Round done</div><h2 style="margin:6px 0 4px;font-size:1.3rem">${ROUND} pieces in.</h2><p class="pace">${p.done>=p.target?`That’s today’s ${p.target} new pieces met.`:`${p.done} of today’s ${p.target} new pieces met.`} Misses are queued to come back.</p><div class="row2">${btn('more','Another round','primary')}${btn('stop','Back to the '+M.groupWord,'')}</div></div>`);
  $('#more').onclick=()=>{sessionCount=0;next()};$('#stop').onclick=home;return;}
 const U=units(),u=selectNext(U,state,Date.now(),state.filter);
 if(u)return open(u);
 const later=U.filter(u=>(state.filter==='all'||u.caseId===state.filter)&&ready(u,state)&&state.items[u.id]?.seen).sort((a,b)=>state.items[a.id].due-state.items[b.id].due)[0];
 mount(`<div class="card"><h2 style="margin:0 0 6px;font-size:1.15rem">${state.filter==='all'?'All caught up':`${esc(gName(state.filter))}: all caught up`}</h2><p class="muted">${later?'Everything here is waiting for its next day. Going early works, but a day’s gap is the real test.':'Nothing to learn in this selection.'}</p><div class="row2">${btn('back','Back to the '+M.groupWord,'primary')}${later?btn('early','Go early',''):''}</div></div>`);
 $('#back').onclick=()=>{state.filter='all';save();home()};if(later)$('#early').onclick=()=>open(later);
}
/* a piece starts where its ladder left it (state.items[id].rung). A whole answer is only ever from memory. */
function open(u){const it=state.items[u.id];
 const r=u.kind==='whole'?MEM:it?.rung??(!it?.seen?0:it.miss?.length?2:MEM);
 run={id:u.id,rung:r,stage:'do',assisted:r<MEM,text:'',started:Date.now()};persist();render();}
function shell(u,q,step,body,back=!!state.items[u.id]?.seen){
 const kind=u.kind==='whole'?'Whole answer':u.parts>1?`Piece ${u.part} of ${u.parts}`:'';
 mount(`<div class="topline">${btn('pause','‹ '+M.groupWord[0].toUpperCase()+M.groupWord.slice(1),'ghost sm')}<div class="pips" aria-label="${sessionCount} of ${ROUND} this round">${Array.from({length:ROUND},(_,i)=>`<i class="${i<sessionCount?'on':''}"></i>`).join('')}</div></div>
 <div class="card piece" style="--cc:${CC(u.caseId)}"><div class="where"><span class="tag">${esc(gName(u.caseId))}</span>${kind?`<span class="tag plain">${kind}</span>`:''}${back?'<span class="tag back">Back again</span>':''}${q.who==='tool'?'<span class="tag tool">Tool’s question</span>':''}</div>
 <h2>${esc(title(q))}</h2><p class="step">${step}</p>${body}</div>`);
 $('#pause').onclick=()=>{if(run)persist();home()};
}
/* the question: a recall card lists its questions (the facts' `ask`), anything else shows its stem */
function prompt(u,q,withAsks=true){
 if(u.facts.some(f=>f.ask))return `<p class="stem">${esc(q.qt)}</p>${withAsks?`<ol class="asks">${u.facts.map(f=>`<li>${esc(f.ask.replace(/^Question \w+\s+/,''))}</li>`).join('')}</ol>`:''}`;
 return `<p class="stem">${esc(q.qt)}</p>${u.kind==='part'&&u.parts>1?`<p class="small muted">This piece: points ${(u.part-1)*4+1}–${(u.part-1)*4+u.facts.length} of the answer.</p>`:''}${q.scenario?`<details class="fold"><summary>The scenario</summary><p>${esc(q.scenario)}</p></details>`:''}`;
}
const factList=(facts,cls='')=>`<ol class="facts ${cls}">${facts.map(f=>`<li>${askOf(f)}${bold(f.t)}${f.fix?`<span class="fix">Note: ${esc(f.fix)}</span>`:''}</li>`).join('')}</ol>`;
/* a fact with its key words coloured: hit (in your answer) or miss */
const marked=(f,terms)=>{let k=0;return askOf(f)+esc(f.t).replace(/\*\*(.+?)\*\*/g,(_,t)=>`<b class="${terms[k++]?.found?'hit':'miss'}">${t}</b>`);};

/* ── the ladder: 0 read it (key words loud, the rest quiet) · 1 one key word a line hidden · 2 every key word hidden, in
   one visit; then 3, key words from memory, a few pieces later. state.items[id].rung is where the next visit starts. ── */
function render(){
 if(!run)return home();const u=ALL.find(u=>u.id===run.id);if(!u){state.active=null;save();return home()}const q=Q.get(u.qid);
 if(run.stage==='mark')return markScreen(u,q);
 if(run.stage==='checked')return checked(u,q);
 const r=run.rung;
 if(r===0){
  shell(u,q,stepLabel(0),`${ladder(0)}${prompt(u,q,false)}${q.note?`<div class="why"><b>Why it works</b>${esc(q.note)}</div>`:''}${q.short.hook?`<div class="hook">${esc(q.short.hook)}</div>`:''}<p class="say">Learn the highlighted words. They're what earn the marks.</p>${factList(u.facts,'kw')}${btn('climb','Start hiding them ›')}${btn('know','I know it, straight to memory','ghost wide')}${source(q)}`);
  $('#climb').onclick=()=>{run.rung=1;persist();render()};
  $('#know').onclick=()=>{run.rung=MEM;run.assisted=true;persist();render()};return;
 }
 if(r<MEM)return cloze(u,q,r);
 const nk=u.facts.reduce((n,f)=>n+keyTerms(f).length,0);
 shell(u,q,u.kind==='whole'?'The whole answer: key words from memory':stepLabel(MEM),`${u.kind==='whole'?'':ladder(MEM)}${prompt(u,q)}<p class="say">Type the key words: ${nk} to find. Any order, no sentences.</p><textarea id="typed" class="kwbox" placeholder="key words, separated by commas…" spellcheck="false">${esc(run.text)}</textarea><p class="small muted">A point counts when all its key words are here. Ctrl+Enter checks.</p>${btn('check','Check')}${support(q)}`);
 const ta=$('#typed'),go=$('#check');go.disabled=!run.text.trim();ta.focus();
 ta.oninput=()=>{run.text=ta.value;go.disabled=!ta.value.trim();persist()};
 ta.onkeydown=e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)&&!go.disabled){e.preventDefault();go.click()}};
 go.onclick=()=>{run.marks=markFacts(u.facts,run.text);run.over=u.facts.map(()=>false);run.stage='mark';persist();render()};hookHelp();
}
/* steps 2 and 3: key words become blanks to type. Step 2 hides the last key word of each line, step 3 every one. */
function cloze(u,q,r){
 let n=0;const rows=u.facts.map((f,fi)=>{const K=keyTerms(f).length;let k=0;return `<li>${askOf(f)}${esc(f.t).replace(/\*\*(.+?)\*\*/g,(_,t)=>{const i=k++;return r===2||i===K-1?`<input class="blank" data-f="${fi}" data-k="${i}" data-i="${n++}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="missing key word" style="width:${Math.min(22,Math.max(5,t.length+2))}ch">`:`<b>${t}</b>`})}</li>`;}).join('');
 shell(u,q,stepLabel(r),`${ladder(r)}${prompt(u,q,false)}<ol class="facts cloze">${rows}</ol>${btn('checkStep','Check')}`);
 const ins=[...document.querySelectorAll('.blank')];ins[0]?.focus();
 ins.forEach((e,i)=>e.onkeydown=ev=>{if(ev.key==='Enter'){ev.preventDefault();ins[i+1]?ins[i+1].focus():$('#checkStep').click()}});
 $('#checkStep').onclick=()=>{
  const got=u.facts.map((f,fi)=>keyTerms(f).map((t,k)=>{const e=ins.find(e=>e.dataset.f==fi&&e.dataset.k==k);if(!e)return {t,given:true,found:true};const v=e.value;return {t,v,found:!!v.trim()&&termFound(t,v)}}));
  run.ok=got.map(g=>g.every(x=>x.found));
  run.html=`<ol class="facts">${u.facts.map((f,fi)=>{let k=0;return `<li>${askOf(f)}${esc(f.t).replace(/\*\*(.+?)\*\*/g,()=>{const g=got[fi][k++];return g.given?`<b>${esc(g.t)}</b>`:g.found?`<b class="hit">${esc(g.t)}</b>`:`<b class="miss">${esc(g.t)}</b>${g.v.trim()?` <s class="small muted">${esc(g.v)}</s>`:''}`})}</li>`}).join('')}</ol>`;
  run.stage='checked';persist();render();
 };
}
/* after a step: all right climbs on (every key word hidden ends the visit); a miss tries the step again or leaves it there */
function checked(u,q){
 const r=run.rung,miss=run.ok.filter(x=>!x).length,top=r===MEM-1;
 shell(u,q,stepLabel(r),`${ladder(r)}<p class="verdict ${miss?'no':'ok'}">${miss?`${miss} to fix`:top?'Climbed it':'All right'}</p>${run.html}
  ${miss?`${btn('again','Try this step again')}${btn('leave','Leave it here, bring it back later','ghost wide')}`
   :btn('up',top?'Done, back later from memory ›':`Next: ${STEPS[r+1].toLowerCase()} ›`)}`);
 const a=$('#again'),l=$('#leave'),up=$('#up');
 if(a)a.onclick=()=>{run.stage='do';persist();render()};
 if(l)l.onclick=()=>finish(u,run.ok,run.html);
 if(up)up.onclick=()=>{if(top)finish(u,run.ok,run.html);else{run.rung++;run.stage='do';persist();render()}};
}
/* after key words from memory: the page's marking, key words coloured, a deliberate override for a right one in other words */
function markScreen(u,q){
 const marks=run.marks,over=run.over;
 shell(u,q,'Checked',`<p class="small muted">Your key words</p><div class="yours">${esc(run.text)}</div>
 <ul class="ticks">${u.facts.map((f,i)=>`<li class="mk ${marks[i].ok||over[i]?'right':'wrong'}"><span class="v">${marks[i].ok?'Got it':over[i]?'Counted (your words)':'Missed'}</span><div>${marked(f,marks[i].terms)}</div>${!marks[i].ok?`<button class="btn ghost sm" data-over="${i}">${over[i]?'Undo':'I had it in other words, count it'}</button>`:''}</li>`).join('')}</ul>
 ${btn('save','Save and carry on')}${source(q)}`);
 document.querySelectorAll('[data-over]').forEach(b=>b.onclick=()=>{const i=+b.dataset.over;over[i]=!over[i];persist();markScreen(u,q)});
 $('#save').onclick=()=>finish(u,marks.map((m,i)=>m.ok||over[i]));
}
function finish(u,correct,detail=''){
 const back=!!state.items[u.id]?.seen,result=record(u,state,correct,{supported:run.assisted});
 /* where the next visit starts: climbed or recalled → from memory; a missed step → that step; missed from memory → every key word hidden */
 const mem=run.rung>=MEM;state.items[u.id].rung=result.pass?MEM:mem?2:Math.max(1,run.rung);
 if(u.kind==='whole'&&!result.pass)for(const id of u.requires)if(state.items[id]&&!state.items[id].wins)state.items[id].rung=2;
 state.active=null;sessionCount++;save();
 const q=Q.get(u.qid),miss=correct.filter(x=>!x).length,n=result.days;
 const gap=result.interval>=3*864e5?'in 3 days':result.interval>=2*864e5?'in 2 days':'tomorrow';
 const [cls,head,line]=!result.pass?['no',`${miss} point${miss===1?'':'s'} to fix`,mem?`Streak wiped. It comes back in a few pieces with its key words hidden, and needs ${DAY_HITS} in a row again.`:'It comes back in a few pieces at this step.']
   :run.assisted?['help',mem?'Got it with help':'Climbed it',mem?'Help doesn’t count as a hit. It comes back in a few pieces, from memory.':`Now the drilling: key words from memory, a few pieces from now. It needs ${DAY_HITS} in a row today.`]
   :!result.locked?['ok',`Hit ${result.hits} of ${DAY_HITS} today`,'Once more from memory in a few pieces to lock today in.']
   :n>=SOLID?['ok','Solid',`From memory ${SOLID} days running. It still comes back every 3 days to stay that way.`]
   :['ok',`Day ${n} of ${SOLID} locked in`,`Back ${gap} for ${DAY_HITS} more in a row.`];
 const today=result.locked?DAY_HITS:result.hits;
 const drill=`<div class="drill"><div><span>Today</span>${dots(today,DAY_HITS)}</div><div><span>Days in a row</span>${dots(Math.min(n,SOLID),SOLID)}</div></div>`;
 shell(u,q,'Saved',`<p class="verdict ${cls}">${head}</p><p class="small muted">${line}</p>${drill}${detail||(miss?factList(u.facts.filter((_,i)=>!correct[i])):'')}${btn('next','Next piece ›')}`,back);
 $('#pause').onclick=home;$('#next').onclick=next;$('#next').focus();run=null;
}

home();
