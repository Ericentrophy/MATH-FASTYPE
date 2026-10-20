(function(){
var RANKS=[[0,"Garage Band"],[100,"Busker"],[300,"Gigger"],[700,"Support Act"],[1500,"Headliner"],[3000,"Rock Legend"]];
var CH=[
{id:"times",n:"Multiplication",d:"6 × 7 (times tables)",lim:3,tab:1},
{id:"div",n:"Division",d:"42 ÷ 6",lim:4,tab:1},
{id:"miss",n:"Missing number",d:"? × 6 = 42",lim:5,tab:1},
{id:"add",n:"Addition",d:"23 + 45",lim:5},
{id:"sub",n:"Subtraction",d:"80 − 35",lim:5},
{id:"sq",n:"Squares",d:"7² means 7 × 7",lim:4},
{id:"root",n:"Square roots",d:"√49 = 7",lim:4},
{id:"pct",n:"Percentages",d:"25% of 80",lim:6},
{id:"dbl",n:"Doubles and halves",d:"Double 37",lim:4},
{id:"mix",n:"Mixed mayhem",d:"A bit of everything",lim:6,tab:1}];
var S={coins:0,sel:[2,5,10],max:12,len:60,ch:"times",facts:{},best:{},stats:{games:0,asked:0,right:0,bestStreak:0}};
try{var raw=localStorage.getItem("mathRock");if(raw){var p=JSON.parse(raw);if(p&&typeof p==="object")S=Object.assign(S,p)}}catch(e){}
function save(){try{localStorage.setItem("mathRock",JSON.stringify(S))}catch(e){}}
var $=function(id){return document.getElementById(id)};
function show(id){["home","game","end"].forEach(function(x){$(x).classList.toggle("hidden",x!==id)});window.scrollTo(0,0)}
function cur(){return CH.filter(function(c){return c.id===S.ch})[0]||CH[0]}
function r(a,b){return a+Math.floor(Math.random()*(b-a+1))}
function tb(){return S.sel[r(0,S.sel.length-1)]}
function rp(x,k){var o=[];for(var i=0;i<k;i++)o.push(x);return o.join(" + ")}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;")}
function xk(a,b){return "x"+Math.min(a,b)+"x"+Math.max(a,b)}
function gen(id){
  var a,b,n,m;
  if(id==="mix"){var o=CH.filter(function(c){return c.id!=="mix"});return gen(o[r(0,o.length-1)].id)}
  if(id==="times"){a=tb();b=r(2,S.max);if(Math.random()<.5){n=a;a=b;b=n}var s=Math.min(a,b),l=Math.max(a,b);return{t:a+" × "+b,a:a*b,k:xk(a,b),e:a+" × "+b+" means "+s+" groups of "+l+(s<=6?": "+rp(l,s)+" = "+a*b:" = "+a*b)+"."}}
  if(id==="div"){a=tb();b=r(2,S.max);return{t:(a*b)+" ÷ "+a,a:b,k:"d"+a+"x"+b,e:(a*b)+" ÷ "+a+" asks how many "+a+"s fit into "+a*b+". Because "+a+" × "+b+" = "+a*b+", the answer is "+b+"."}}
  if(id==="miss"){a=tb();b=r(2,S.max);m=a+" × "+b+" = "+a*b;n="Use the fact "+m+". The missing number is "+b+".";return Math.random()<.5?{t:"? × "+a+" = "+a*b,a:b,k:xk(a,b),e:n}:{t:a+" × ? = "+a*b,a:b,k:xk(a,b),e:n}}
  if(id==="add"){a=r(6,80);b=r(5,100-a);return{t:a+" + "+b,a:a+b,e:"Add the tens, then the ones: "+(a-a%10)+" + "+(b-b%10)+" = "+(a-a%10+b-b%10)+", and "+a%10+" + "+b%10+" = "+(a%10+b%10)+". Together that is "+(a+b)+"."}}
  if(id==="sub"){a=r(20,100);b=r(5,a-5);return{t:a+" − "+b,a:a-b,e:"Count up from "+b+" to "+a+": "+b+" + "+(a-b)+" = "+a+", so "+a+" − "+b+" = "+(a-b)+"."}}
  if(id==="sq"){n=r(2,Math.max(15,S.max));return{t:n+"²",a:n*n,k:"s"+n,e:n+"² means "+n+" × "+n+" = "+n*n+"."}}
  if(id==="root"){n=r(2,Math.max(15,S.max));return{t:"√"+n*n,a:n,k:"s"+n,e:"√"+n*n+" asks which number times itself makes "+n*n+". "+n+" × "+n+" = "+n*n+", so the answer is "+n+"."}}
  if(id==="pct"){m=[10,20,25,50,75][r(0,4)];b=r(1,10)*20;return{t:m+"% of "+b,a:b*m/100,e:({10:"10% is one tenth, so divide by 10",20:"20% is one fifth, so divide by 5",25:"25% is a quarter, so halve it twice",50:"50% is half, so divide by 2",75:"75% is three quarters, so find a quarter and multiply by 3"})[m]+": "+m+"% of "+b+" = "+b*m/100+"."}}
  if(id==="dbl"){n=r(3,50);return Math.random()<.5?{t:"Double "+n,a:n*2,e:"Double means times 2: "+n+" + "+n+" = "+n*2+"."}:{t:"Half of "+n*2,a:n,e:"Half means split into 2 equal parts. "+n+" + "+n+" = "+n*2+", so half of "+n*2+" is "+n+"."}}
}
function score(q){if(!q.k)return .5;var f=S.facts[q.k];return f&&f.n?f.c/f.n-(f.t>2500?.2:0):-1}
var G=null,timer=null;
function pick(){
  var best=null;
  for(var i=0;i<4;i++){var q=gen(S.ch);if(G.last&&q.t===G.last)continue;if(!best||score(q)<score(best))best=q}
  if(!best)best=gen(S.ch);G.last=best.t;return best}

function rng(a,b){var o=[];for(var i=a;i<=b;i++)o.push(i);return o}
var LV=[{n:"Easy",d:"Tables 2, 5 and 10",sel:[2,5,10],max:12},{n:"Medium",d:"Tables 2 to 6",sel:rng(2,6),max:12},{n:"Hard",d:"Tables 2 to 12",sel:rng(2,12),max:12},{n:"Expert",d:"Tables 2 to 20",sel:rng(2,20),max:20}];
var LENS=[[30,"30s","30 seconds"],[60,"60s","60 seconds"],[90,"90s","90 seconds"],[120,"2 min","2 minutes"],[180,"3 min","3 minutes"]];
function lenName(){for(var i=0;i<LENS.length;i++)if(LENS[i][0]===S.len)return LENS[i][2];return "60 seconds"}
function fmt(s){return s>=60?Math.floor(s/60)+":"+("0"+s%60).slice(-2):s+"s"}
function bk(id){return S.len===60?id:id+"@"+S.len}
function lvName(){for(var i=0;i<LV.length;i++){if(S.max===LV[i].max&&JSON.stringify(S.sel.slice().sort(function(x,y){return x-y}))===JSON.stringify(LV[i].sel))return LV[i].n}return "Custom"}
function renderHome(){
  $("coins").textContent=S.coins;
  var i=0;for(var k=0;k<RANKS.length;k++)if(S.coins>=RANKS[k][0])i=k;
  var nx=RANKS[i+1];
  $("rankName").textContent=RANKS[i][1];
  $("rankNext").textContent=nx?(nx[0]-S.coins)+" coins to "+nx[1]:"Top of the bill";
  $("rankBar").style.width=(nx?(S.coins-RANKS[i][0])/(nx[0]-RANKS[i][0])*100:100)+"%";
  var c=$("cards");c.innerHTML="";
  CH.forEach(function(ch){var b=document.createElement("button");b.className="card";
    b.setAttribute("aria-pressed",ch.id===S.ch);
    b.innerHTML="<b>"+ch.n+"</b><small>"+ch.d+(S.best[bk(ch.id)]?" · Best "+S.best[bk(ch.id)]:"")+"</small>";
    b.onclick=function(){S.ch=ch.id;save();renderHome()};c.appendChild(b)});
  $("tablesBox").classList.toggle("hidden",!cur().tab);$("max").value=S.max;$("playName").textContent=cur().n+(cur().tab?" · "+lvName():"");
  var ln=$("len");ln.innerHTML="";
  LENS.forEach(function(l){var b=document.createElement("button");b.textContent=l[1];b.setAttribute("aria-pressed",S.len===l[0]);b.setAttribute("aria-label","Blitz length "+l[2]);
    b.onclick=function(){S.len=l[0];save();renderHome()};ln.appendChild(b)});
  $("gigSub").textContent=lenName()+", earn coins";
  var lv=$("levels");lv.innerHTML="";
  LV.forEach(function(l){var b=document.createElement("button");b.className="card";
    var on=S.max===l.max&&JSON.stringify(S.sel.slice().sort(function(x,y){return x-y}))===JSON.stringify(l.sel);
    b.setAttribute("aria-pressed",on);b.innerHTML="<b>"+l.n+"</b><small>"+l.d+"</small>";
    b.onclick=function(){S.sel=l.sel.slice();S.max=l.max;save();renderHome()};lv.appendChild(b)});
  var ch=$("chips");ch.innerHTML="";
  for(var n=2;n<=S.max;n++){(function(n){var b=document.createElement("button");b.className="chip";b.textContent=n;
    b.setAttribute("aria-pressed",S.sel.indexOf(n)>-1);b.setAttribute("aria-label",n+" times table");
    b.onclick=function(){var j=S.sel.indexOf(n);if(j>-1){if(S.sel.length>1)S.sel.splice(j,1)}else S.sel.push(n);save();renderHome()};
    ch.appendChild(b)})(n)}
  var h="<table><tr><th></th>";
  for(var x=2;x<=12;x++)h+="<th>"+x+"</th>";h+="</tr>";
  for(var a=2;a<=12;a++){h+="<tr><th>"+a+"</th>";
    for(var b2=2;b2<=12;b2++){var f=S.facts[xk(a,b2)],cl="";
      if(f&&f.n>0){var acc=f.c/f.n;cl=(acc>=.8&&f.c>=3&&f.t<2500)?"f":(acc>=.6?"m":"l")}
      h+='<td class="'+cl+'" title="'+a+' × '+b2+'"></td>'}
    h+="</tr>"}
  $("grid").innerHTML=h+"</table>";renderLearn();renderProgress()}

function start(mode){
  S.seen=1;save();
  G={mode:mode,score:0,coins:0,asked:0,wrong:{},log:[],streak:0,maxStreak:0,t0:Date.now(),qStart:0,input:"",lock:false,lim:cur().lim*1000,len:S.len*1000};
  show("game");$("streak").textContent="";$("status").textContent=(mode==="gig"?"Blitz: ":"Practice: ")+cur().n;
  $("qbar").parentNode.classList.toggle("hidden",mode!=="gig");
  next();clearInterval(timer);timer=setInterval(tick,50)}
function next(){
  var q=pick();G.q=q;G.input="";G.lock=false;G.qStart=Date.now();
  $("q").textContent=q.t;$("ans").textContent="";$("ans").className="ans";$("qbar").style.width="100%"}
function tick(){
  if(!G)return;var now=Date.now();
  if(G.mode==="gig"){
    var left=Math.max(0,G.len-(now-G.t0));$("clock").textContent=fmt(Math.ceil(left/1000));
    if(!G.lock){var ql=G.lim-(now-G.qStart);$("qbar").style.width=Math.max(0,ql/G.lim*100)+"%";if(ql<=0)answer(true)}
    if(left<=0&&!G.lock)finish()
  }else $("clock").textContent=Math.min(G.asked+1,12)+"/12"}
function answer(timedOut){
  if(G.lock)return;
  var q=G.q,ms=Date.now()-G.qStart,ok=!timedOut&&parseInt(G.input,10)===q.a;
  G.asked++;if(ok){G.streak++;if(G.streak>G.maxStreak)G.maxStreak=G.streak}else G.streak=0;$("streak").textContent=G.streak>1?"🔥 "+G.streak:"";G.log.push({t:q.t,a:q.a,u:(timedOut||G.input==="")?null:G.input,ok:ok,e:q.e||""});
  if(q.k){var f=S.facts[q.k]||(S.facts[q.k]={c:0,n:0,t:3000});f.n++;if(ok){f.c++;f.t=Math.round(f.t*.6+Math.min(ms,6000)*.4)}}
  G.lock=true;
  if(ok){G.score++;if(G.mode==="gig")G.coins+=ms<G.lim*.6?2:1;after()}
  else{$("ans").textContent=q.a;$("ans").classList.add("no");setTimeout(after,G.mode==="gig"?600:1500)}}
function after(){
  if(!G)return;
  if(G.mode==="practice"&&G.asked>=12)return finish();
  if(G.mode==="gig"&&Date.now()-G.t0>=G.len)return finish();
  next()}
function finish(){
  clearInterval(timer);var g=G,was=earned();g.lock=true;S.coins+=g.coins;S.stats.games++;S.stats.asked+=g.asked;S.stats.right+=g.score;S.stats.bestStreak=Math.max(S.stats.bestStreak,g.maxStreak);
  if(g.mode==="gig"&&g.score>(S.best[bk(S.ch)]||0))S.best[bk(S.ch)]=g.score;
  save();show("end");
  $("endTitle").textContent=g.mode==="gig"?"Encore!":"Nice practice!";
  $("endScore").textContent=g.score+" / "+g.asked;
  $("endSum").textContent=g.mode==="gig"?"You earned "+g.coins+" coins. Total: "+S.coins+".":"Practice doesn’t earn coins, but it sharpens your skills.";
  var now=earned().filter(function(n){return was.indexOf(n)<0});$("endBadge").textContent=now.length?"🏅 New badge: "+now.join(", "):"";
  $("endFix").innerHTML=g.log.length?review(g.log):""}
function item(x){
  var h="<li class='"+(x.ok?"good":"bad")+"'><div class='rvl'><span class='mk'>"+(x.ok?"✓":"✗")+"</span><b>"+esc(x.t)+" = "+x.a+"</b>";
  if(!x.ok)h+="<span class='you'>You said: "+(x.u===null?"no answer":esc(x.u))+"</span>";
  return h+"</div><p class='why'>"+(x.ok?"":"Why: ")+esc(x.e)+"</p></li>"}
function review(log){
  var bad=log.filter(function(x){return !x.ok}),good=log.filter(function(x){return x.ok}),h="";
  if(bad.length)h+="<div class='rvcol'><h2 class='rvg bad'>✗ Wrong ("+bad.length+")</h2><ul class='rv'>"+bad.map(item).join("")+"</ul></div>";
  if(good.length)h+="<div class='rvcol'><h2 class='rvg good'>✓ Correct ("+good.length+")</h2><ul class='rv'>"+good.map(item).join("")+"</ul></div>";
  return h}
function renderLearn(){
  var n=S.learn||3,lc=$("learnChips"),i,x,a,h;lc.innerHTML="";
  for(i=1;i<=12;i++)(function(i){var b=document.createElement("button");b.className="chip";b.textContent=i;
    b.setAttribute("aria-pressed",i===n);b.setAttribute("aria-label",i+" times table");
    b.onclick=function(){S.learn=i;save();renderLearn()};lc.appendChild(b)})(i);
  $("learnTip").innerHTML="<b>"+n+" × 3</b> means 3 groups of "+n+": "+rp(n,3)+" = "+n*3+".<br>Count by "+n+"s: "+[1,2,3,4,5,6].map(function(k){return n*k}).join(", ")+"…";
  h="";for(i=1;i<=12;i++)h+="<div>"+n+" × "+i+" = <b>"+n*i+"</b></div>";
  $("learnList").innerHTML=h;
  h="<table><tr><th>×</th>";for(x=1;x<=12;x++)h+="<th"+(x===n?" class='hi'":"")+">"+x+"</th>";h+="</tr>";
  for(a=1;a<=12;a++){h+="<tr><th"+(a===n?" class='hi'":"")+">"+a+"</th>";
    for(x=1;x<=12;x++)h+="<td"+(a===n||x===n?" class='hi'":"")+">"+a*x+"</td>";h+="</tr>"}
  $("learnChart").innerHTML=h+"</table>"}
var TRICKS=[
"Times 9: multiply by 10, then subtract the number. 9 × 7 = 70 − 7 = 63.",
"Times 5: halve the number, then multiply by 10. 5 × 8 = 4 × 10 = 40.",
"Times 4: double it, then double again. 4 × 7 = 14, then 28.",
"Times 11: for a two-digit number, add the digits and put the sum in the middle. 11 × 23 = 2 (2+3) 3 = 253.",
"Squares ending in 5: multiply the first digit by the next number up, then write 25. 35²: 3 × 4 = 12, so 1225.",
"Adding 9: add 10, then take away 1. 36 + 9 = 46 − 1 = 45.",
"Times 6 with an even digit: the answer ends in that digit and starts with half of it. 6 × 8 = 48.",
"Percentages: find 10% by dividing by 10. For 5%, halve that. 5% of 80 = 8 ÷ 2 = 4."];
var ti=Math.floor(Date.now()/864e5)%TRICKS.length;
function mastered(){var c=0;for(var k in S.facts){if(k.charAt(0)!=="x")continue;var f=S.facts[k];if(f.n&&f.c/f.n>=.8&&f.c>=3&&f.t<2500)c++}return c}
var BADGES=[
["First Gig","Finish a game",function(){return S.stats.games>=1}],
["On Fire","10 correct in a row",function(){return S.stats.bestStreak>=10}],
["Unstoppable","25 correct in a row",function(){return S.stats.bestStreak>=25}],
["Century","100 correct answers",function(){return S.stats.right>=100}],
["Sharp Shooter","90% accuracy, 50+ questions",function(){return S.stats.asked>=50&&S.stats.right/S.stats.asked>=.9}],
["Coin Collector","Earn 300 coins",function(){return S.coins>=300}],
["Fast Fingers","Master 10 table facts",function(){return mastered()>=10}],
["Table Master","Master 40 table facts",function(){return mastered()>=40}]];
function earned(){return BADGES.filter(function(b){return b[2]()}).map(function(b){return b[0]})}
function renderProgress(){
  var st=S.stats,acc=st.asked?Math.round(st.right/st.asked*100)+"%":"–";
  $("stats").innerHTML=[["Games",st.games],["Questions",st.asked],["Accuracy",acc],["Best streak",st.bestStreak]].map(function(x){return "<div><b>"+x[1]+"</b><span>"+x[0]+"</span></div>"}).join("");
  $("trick").textContent=TRICKS[ti%TRICKS.length];
  var e=earned();$("badgeCount").textContent="("+e.length+"/"+BADGES.length+")";
  $("badges").innerHTML=BADGES.map(function(b){var on=e.indexOf(b[0])>-1;return "<div class='badge"+(on?" on":"")+"'><b>"+(on?"🏅 ":"🔒 ")+b[0]+"</b><small>"+b[1]+"</small></div>"}).join("")}
$("trickBtn").onclick=function(){ti++;$("trick").textContent=TRICKS[ti%TRICKS.length]};
function press(d){
  if(!G||G.lock||$("game").classList.contains("hidden"))return;
  if(d==="back")G.input=G.input.slice(0,-1);
  else if(d==="go"){if(G.input)answer(false);return}
  else if(G.input.length<4)G.input+=d;
  $("ans").textContent=G.input;
  if(G.input.length===String(G.q.a).length)answer(false)}
["1","2","3","4","5","6","7","8","9","back","0","go"].forEach(function(d){
  var b=document.createElement("button");b.textContent=d==="back"?"⌫":(d==="go"?"Go":d);
  b.setAttribute("aria-label",d==="back"?"Delete":(d==="go"?"Submit":d));
  b.onclick=function(){press(d)};$("pad").appendChild(b)});
document.addEventListener("keydown",function(e){
  if(e.key>="0"&&e.key<="9")press(e.key);
  else if(e.key==="Backspace")press("back");
  else if(e.key==="Enter"){if(G&&!$("game").classList.contains("hidden"))press("go");else if(!$("home").classList.contains("hidden")&&document.activeElement===document.body)start("gig")}});
$("max").onchange=function(){var v=parseInt($("max").value,10);if(isNaN(v))v=12;v=Math.max(2,Math.min(50,v));S.max=v;S.sel=S.sel.filter(function(x){return x<=v});if(!S.sel.length)S.sel=[2];save();renderHome()};
$("all").onclick=function(){S.sel=[];for(var i=2;i<=S.max;i++)S.sel.push(i);save();renderHome()};
$("gig").onclick=function(){start("gig")};
$("practice").onclick=function(){start("practice")};
$("quit").onclick=function(){clearInterval(timer);G=null;renderHome();show("home")};
$("again").onclick=function(){start(G.mode)};
$("home2").onclick=function(){G=null;renderHome();show("home")};
renderHome();
if(S.seen)$("how").removeAttribute("open");
})();