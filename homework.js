/* Mathescent AI Homework Helper.
   Type a question or add a photo, get every step explained.

   HOW THE AI PART WORKS
   A website can't safely hold an AI key, so the page talks to a tiny server
   you own (see worker.js). Put that server's address below.
   Leave it empty and the helper still solves typed arithmetic, "x% of y"
   and simple equations like 3x + 5 = 20 on its own, with steps. Photos and
   word problems need the AI connection. */
(function(){
var AI_ENDPOINT="";   // e.g. "https://mathescent-ai.yourname.workers.dev"

var M=window.MX;if(!M||!M.openTool)return;
var S=M.S,esc=M.esc;
function $(id){return document.getElementById(id)}
var GRADE={g1:"Grade 1",g2:"Grade 2",g3:"Grade 3",g4:"Grade 4",g5:"Grade 5",g6:"Grade 6",hs:"High School",college:"College"};
function nf(x){return String(+Number(x).toFixed(8)).replace("-","−")}
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=a%b;a=b;b=t}return a}
function isInt(x){return isFinite(x)&&Math.floor(x)===x}

/* ================= built-in solver (no internet, no AI) ================= */
var OPW={"+":"Add","-":"Subtract","*":"Multiply","/":"Divide","^":"Raise to the power"};
var OPS={"+":"+","-":"−","*":"×","/":"÷","^":"^"};
function tokenize(s){
  var t=[],i=0,m,prev;
  s=s.replace(/\s+/g,"");
  while(i<s.length){
    var ch=s.charAt(i);prev=t[t.length-1];
    m=s.slice(i).match(/^(\d+\.?\d*|\.\d+)/);
    if(m){if(prev&&(prev.n!==undefined||prev.p===")"))t.push({o:"*"});t.push({n:parseFloat(m[1])});i+=m[1].length;continue}
    if(ch==="("){if(prev&&(prev.n!==undefined||prev.p===")"))t.push({o:"*"});t.push({p:"("});i++;continue}
    if(ch===")"){t.push({p:")"});i++;continue}
    if("+-*/^".indexOf(ch)>=0){
      var unary=!prev||prev.o||prev.p==="(";
      if(unary&&ch==="-"){
        m=s.slice(i+1).match(/^(\d+\.?\d*|\.\d+)/);
        if(!m)return null;
        t.push({n:-parseFloat(m[1])});i+=1+m[1].length;continue}
      if(unary)return null;
      t.push({o:ch});i++;continue}
    return null}
  var d=0;for(i=0;i<t.length;i++){if(t[i].p==="(")d++;if(t[i].p===")"){d--;if(d<0)return null}}
  return d===0?t:null}
function show(t){
  return t.map(function(x){
    if(x.n!==undefined)return x.n<0?"("+nf(x.n)+")":nf(x.n);
    if(x.o)return OPS[x.o];return x.p}).join(" ").replace(/\( /g,"(").replace(/ \)/g,")")}
function stepOnce(t){
  var lo=-1,hi=-1,i;
  for(i=0;i<t.length;i++){if(t[i].p==="(")lo=i;if(t[i].p===")"){hi=i;break}}
  var a=lo>=0?lo+1:0,b=lo>=0?hi:t.length,inner=t.slice(a,b);
  if(!inner.length)return{err:"There is an empty bracket."};
  if(inner.length===1&&inner[0].n!==undefined){
    if(lo>=0)return{t:t.slice(0,lo).concat(inner,t.slice(hi+1)),title:"Brackets",say:"The bracket now holds just one number, so we can drop the brackets."};
    return null}
  var pick=-1,pr=0,p,o;
  for(i=0;i<inner.length;i++){o=inner[i].o;if(!o)continue;p=o==="^"?3:(o==="*"||o==="/")?2:1;if(p>pr||(p===pr&&p===3)){pr=p;pick=i}}
  if(pick<1||pick>=inner.length-1||inner[pick-1].n===undefined||inner[pick+1].n===undefined)return{err:"I couldn’t read that sum. Check the symbols."};
  var x=inner[pick-1].n,y=inner[pick+1].n,op=inner[pick].o,r;
  if(op==="+")r=x+y;else if(op==="-")r=x-y;else if(op==="*")r=x*y;
  else if(op==="/"){if(y===0)return{err:"You can’t divide by 0, so this one has no answer."};r=x/y}
  else r=Math.pow(x,y);
  if(!isFinite(r))return{err:"That number is too big for me to work out here."};
  var more=false;for(i=0;i<inner.length;i++)if(inner[i].o==="+"||inner[i].o==="-")more=true;
  var why=lo>=0?"Brackets come first. ":pr===3?"Powers come before × ÷ + −. ":(pr===2&&more)?"Multiply and divide come before add and subtract. ":"Work from left to right. ";
  var title=lo>=0?"Do the brackets":pr===3?"Powers":pr===2?"Multiply / divide":"Add / subtract";
  var say=why+OPW[op]+" "+nf(x)+" "+OPS[op]+" "+nf(y)+" = "+nf(r)+".";
  var ni=inner.slice(0,pick-1).concat([{n:+r.toFixed(10)}],inner.slice(pick+2));
  if(lo>=0&&ni.length===1)return{t:t.slice(0,lo).concat(ni,t.slice(hi+1)),title:title,say:say};
  return{t:t.slice(0,a).concat(ni,t.slice(b)),title:title,say:say}}
function solveArithmetic(s){
  if(!/^[0-9+\-*\/^().\s]+$/.test(s)||!/[+\-*\/^]/.test(s.replace(/^\s*-/,"")))return null;
  var t=tokenize(s);if(!t)return null;
  var steps=[],cur=t,n=0,r;
  while(n++<25){
    r=stepOnce(cur);
    if(!r)break;
    if(r.err)return{error:r.err};
    steps.push({title:r.title,explain:r.say,work:show(cur)+"  →  "+show(r.t)});
    cur=r.t}
  if(cur.length!==1||cur[0].n===undefined)return{error:"I couldn’t finish that one. Check the symbols."};
  return{problem:show(t)+" = ?",steps:steps,answer:nf(cur[0].n),
    check:"Estimate first: round each number and see if your answer is close.",
    tip:"Order of operations: Brackets, Powers, then × ÷ (left to right), then + − (left to right)."}}
function solvePercent(s){
  var m=s.match(/^(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)$/);if(!m)return null;
  var p=+m[1],n=+m[2],r=p/100*n;
  return{problem:m[1]+"% of "+m[2],steps:[
    {title:"Turn the percent into a fraction",explain:"“Percent” means “out of 100”, so "+p+"% = "+p+" ÷ 100.",work:p+"% = "+p+" ÷ 100 = "+nf(p/100)},
    {title:"“Of” means multiply",explain:"Multiply that by the number.",work:nf(p/100)+" × "+nf(n)+" = "+nf(r)}],
    answer:nf(r),check:"Easy check: 50% is half, 10% is one tenth. Is your answer sensible next to those?",
    tip:"To find 10%, divide by 10. Build other percents from it (20% is double 10%)."}}
function solveLinear(s){
  var parts=s.split("=");if(parts.length!==2||!parts[0]||!parts[1])return null;
  var letters=s.match(/[a-z]/g);if(!letters)return null;
  var v=letters[0];for(var i=0;i<letters.length;i++)if(letters[i]!==v)return null;
  function prep(x){return x.replace(/\s+/g,"").replace(/(\d|\))(?=[a-z(])/g,"$1*").replace(/([a-z])(?=[\d(a-z])/g,"$1*")}
  var L=prep(parts[0]),R=prep(parts[1]);
  if(!/^[0-9+\-*\/().a-z]+$/.test(L+R))return null;
  function ev(e,val){try{var f=Function(v,'"use strict";return ('+e+')');var r=f(val);return typeof r==="number"&&isFinite(r)?r:null}catch(err){return null}}
  var l0=ev(L,0),l1=ev(L,1),l2=ev(L,2),r0=ev(R,0),r1=ev(R,1),r2=ev(R,2);
  if([l0,l1,l2,r0,r1,r2].some(function(x){return x===null}))return null;
  var f0=l0-r0,f1=l1-r1,f2=l2-r2;
  if(Math.abs((f2-f1)-(f1-f0))>1e-9)return{error:"That equation isn’t a straight-line (linear) one, so the built-in helper can’t solve it. The AI connection can."};
  var a=f1-f0,b=f0;
  if(Math.abs(a)<1e-12)return{error:b===0?"Every value works: both sides are always equal.":"No value works: the two sides can never be equal."};
  var sol=-b/a;
  var sg=function(x){return x<0?"− "+nf(-x):"+ "+nf(x)};
  var frac="";if(isInt(a)&&isInt(b)&&isInt(-b/a)===false){var g=gcd(b,a),pn=-b/g,pd=a/g;if(pd<0){pn=-pn;pd=-pd}frac=pn+"/"+pd+" = "}
  var lv=ev(L,sol),rv=ev(R,sol);
  return{problem:s.replace(/\s+/g,"").replace("="," = "),steps:[
    {title:"Get everything on one side",explain:"Subtract the right side from the left side so the equation equals 0.",work:"("+parts[0].trim()+") − ("+parts[1].trim()+") = 0"},
    {title:"Collect like terms",explain:"Add up all the "+v+" terms, and add up all the plain numbers.",work:nf(a)+v+" "+sg(b)+" = 0"},
    {title:"Move the plain number across",explain:"Do the opposite operation on both sides to get the "+v+" term alone.",work:nf(a)+v+" = "+nf(-b)},
    {title:"Divide to find "+v,explain:"Divide both sides by "+nf(a)+", the number in front of "+v+".",work:v+" = "+nf(-b)+" ÷ "+nf(a)+" = "+frac+nf(sol)}],
    answer:v+" = "+nf(sol),
    check:"Put "+v+" = "+nf(sol)+" back into the original. Left side = "+nf(lv)+", right side = "+nf(rv)+(Math.abs(lv-rv)<1e-6?". They match, so it’s right ✓":". They don’t match, so recheck your typing."),
    tip:"Whatever you do to one side of an equation, do to the other side too."}}
function offline(text){
  var s=String(text).toLowerCase().trim()
    .replace(/[×·∙]/g,"*").replace(/÷/g,"/").replace(/[−–—]/g,"-").replace(/\*\*/g,"^")
    .replace(/^(please\s+)?(solve|calculate|compute|evaluate|simplify|find|work out|what is|what’s|what's)\s*[:\s]\s*/,"")
    .replace(/[?=\s]+$/,"").replace(/(\d)\s*x\s*(?=\d)/g,"$1*");
  if(!s)return null;
  return solvePercent(s)||solveLinear(s)||solveArithmetic(s)}

/* ================= photo handling ================= */
var IMG=null,last=null,busy=false;
function toast(m){M.toast(m)}
function setPhoto(img){
  IMG=img;var prev=$("hwPrev");if(!prev)return;
  if(img){$("hwImg").src="data:"+img.mediaType+";base64,"+img.data;prev.classList.remove("hidden")}
  else{$("hwImg").removeAttribute("src");prev.classList.add("hidden")}}
function loadPhoto(file){
  if(!file)return;
  if(!/^image\//.test(file.type)){toast("Please choose a photo.");return}
  var fr=new FileReader();
  fr.onerror=function(){toast("Couldn’t open that photo. Try another one.")};
  fr.onload=function(){
    var im=new Image();
    im.onerror=function(){toast("Couldn’t open that photo. Try another one.")};
    im.onload=function(){
      var k=Math.min(1,1600/Math.max(im.naturalWidth,im.naturalHeight)),c=document.createElement("canvas");
      c.width=Math.max(1,Math.round(im.naturalWidth*k));c.height=Math.max(1,Math.round(im.naturalHeight*k));
      var cx=c.getContext("2d");cx.fillStyle="#fff";cx.fillRect(0,0,c.width,c.height);cx.drawImage(im,0,0,c.width,c.height);
      setPhoto({data:c.toDataURL("image/jpeg",.85).split(",")[1],mediaType:"image/jpeg"})};
    im.src=fr.result};
  fr.readAsDataURL(file)}

/* ================= showing results ================= */
function lines(s){return esc(s)}
function render(r,mode){
  var h='<div class="hw-res">',hint=mode==="hint";
  if(r.unclear)h+='<div class="hw-err">'+lines(r.unclear)+'</div>';
  if(r.problem)h+='<h3>The problem</h3><div class="hw-prob">'+lines(r.problem)+'</div>';
  var st=Array.isArray(r.steps)?r.steps:[];
  if(st.length)h+='<h3>'+(hint?"Your hint":"Step by step")+'</h3>';
  st.forEach(function(s,i){
    h+='<div class="hw-step"><span class="hw-n">'+(i+1)+'</span><div><b>'+lines(s.title||"Step "+(i+1))+'</b>'+(s.explain?'<p>'+lines(s.explain)+'</p>':'')+(!hint&&s.work?'<div class="hw-work">'+lines(s.work)+'</div>':'')+'</div></div>'});
  if(!hint&&r.answer)h+='<div class="hw-ans"><b>✅ Final answer</b><span class="big2">'+lines(r.answer)+'</span></div>';
  if(hint)h+='<div class="hw-tip">🧠 Now try the next step yourself. When you’re ready, tap <b>Show full steps</b> to check your work.</div>';
  if(!hint&&r.check)h+='<div class="hw-tip"><b>🔍 Check it:</b> '+lines(r.check)+'</div>';
  if(r.tip)h+='<div class="hw-tip"><b>💡 Remember:</b> '+lines(r.tip)+'</div>';
  h+='<div class="hw-actions" id="hwAfter"></div></div>';
  return h}
function after(mode,online,r){
  var box=$("hwAfter");if(!box)return;
  function btn(t,sub,alt,fn){var b=document.createElement("button");b.className="mode"+(alt?" alt":"");b.innerHTML="<b>"+t+"</b><span>"+sub+"</span>";b.onclick=fn;box.appendChild(b)}
  if(mode==="hint")btn("Show full steps","Check your work",false,function(){run("full")});
  else if(online)btn("Explain simpler","Smaller, easier steps",false,function(){run("full",true)});
  if(mode!=="hint"){var txt=(r.problem?r.problem+"\n\n":"")+(r.steps||[]).map(function(s,i){return (i+1)+". "+(s.title||"")+(s.explain?": "+s.explain:"")+(s.work?"\n   "+s.work:"")}).join("\n")+(r.answer?"\n\nAnswer: "+r.answer:"");
    btn("Copy","Save these steps",true,function(){M.copy(txt,"Steps copied.")})}
  btn("New question","Start again",true,function(){$("hwText").value="";setPhoto(null);$("hwOut").innerHTML="";$("hwText").focus()})}
function setBusy(b){busy=b;[ "hwFull","hwHint"].forEach(function(id){var e=$(id);if(e)e.disabled=b})}
function showError(msg,small){$("hwOut").innerHTML='<div class="hw-err">'+lines(msg)+(small?'<small>'+lines(small)+'</small>':'')+'</div>'}
function scrollOut(){var o=$("hwOut");if(o&&o.scrollIntoView)o.scrollIntoView({behavior:"smooth",block:"start"})}

function run(mode,simpler){
  if(busy)return;
  var text=$("hwText").value.trim().slice(0,2000);
  if(!text&&!IMG){toast("Type a question or add a photo first.");return}
  var out=$("hwOut");
  if(!AI_ENDPOINT){
    if(IMG&&!text){showError("Reading photos needs the AI connection, and it isn’t switched on yet.","Type the question instead. For example: 3x + 5 = 20, or 25% of 80, or (4 + 6) × 3.");scrollOut();return}
    var r=offline(text);
    if(!r){showError("The built-in helper can’t solve this one yet.","It handles sums like (4 + 6) × 3, “25% of 80” and equations like 3x + 5 = 20. Word problems, other topics and photos need the AI connection.");scrollOut();return}
    if(r.error){showError(r.error);scrollOut();return}
    if(mode==="hint"){r={problem:r.problem,steps:r.steps.slice(0,1).map(function(s){return{title:s.title,explain:s.explain}}),tip:r.tip}}
    out.innerHTML=render(r,mode);after(mode,false,r);scrollOut();return}
  setBusy(true);
  out.innerHTML='<div class="hw-load"><span class="hw-spin"></span><span>Working through your homework…</span></div>';scrollOut();
  var ctl=window.AbortController?new AbortController():null,tm=setTimeout(function(){if(ctl)ctl.abort()},60000);
  fetch(AI_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},signal:ctl?ctl.signal:undefined,
    body:JSON.stringify({text:text,image:IMG?IMG.data:null,mediaType:IMG?IMG.mediaType:null,mode:mode,simpler:!!simpler,grade:GRADE[S.grade]||""})})
  .then(function(res){return res.json().catch(function(){return{}}).then(function(j){return{ok:res.ok,j:j}})})
  .then(function(x){
    clearTimeout(tm);setBusy(false);
    if(!x.ok||(!x.j.result&&!x.j.text)){showError(x.j&&x.j.error?x.j.error:"The helper couldn’t answer right now. Please try again in a minute.");return}
    var r=x.j.result||{steps:[{title:"Answer",explain:x.j.text}]};
    last={mode:mode};
    $("hwOut").innerHTML=render(r,mode);after(mode,true,r);scrollOut()})
  .catch(function(){clearTimeout(tm);setBusy(false);showError("Couldn’t reach the helper. Check your internet and try again.")})}

/* ================= the tool window ================= */
var tool={id:"hw",icon:"📸",name:"AI Homework Helper",
html:function(){return '<p class="hint">Type your homework question, or take a photo of it. You get every step explained, so you know exactly what to do.</p>'+
 '<textarea id="hwText" rows="4" maxlength="2000" placeholder="Example: Solve 3x + 5 = 20" aria-label="Your homework question"></textarea>'+
 '<div class="hw-photo"><button class="quit" id="hwCam" type="button">📷 Take photo</button><button class="quit" id="hwUp" type="button">🖼️ Upload photo</button></div>'+
 '<input type="file" id="hwFileCam" accept="image/*" capture="environment" hidden><input type="file" id="hwFileUp" accept="image/*" hidden>'+
 '<div class="hw-prev hidden" id="hwPrev"><img id="hwImg" alt="Your homework photo"><br><button class="quit" id="hwRm" type="button">Remove photo</button></div>'+
 '<div class="hw-actions"><button class="mode" id="hwFull" type="button"><b>Explain step by step</b><span>Full solution</span></button><button class="mode alt" id="hwHint" type="button"><b>Just a hint</b><span>Try it yourself first</span></button></div>'+
 '<p class="hw-note" id="hwNote"></p><div id="hwOut" aria-live="polite"></div>'},
init:function(){
  $("hwNote").textContent=AI_ENDPOINT?"Tip: try the hint first, you learn more that way. Photos are sent to an AI service to read your homework, so keep your face, name and private info out of the picture.":"The AI connection isn’t switched on yet. For now this solves typed sums, percents and simple equations with steps.";
  $("hwCam").onclick=function(){$("hwFileCam").click()};
  $("hwUp").onclick=function(){$("hwFileUp").click()};
  $("hwFileCam").onchange=function(){loadPhoto(this.files[0]);this.value=""};
  $("hwFileUp").onchange=function(){loadPhoto(this.files[0]);this.value=""};
  $("hwRm").onclick=function(){setPhoto(null)};
  $("hwFull").onclick=function(){run("full")};
  $("hwHint").onclick=function(){run("hint")};
  IMG=null;busy=false}};

/* ================= AI Math Chat (math questions only) ================= */
var HIST=[],chBusy=false;
function chAdd(who,text){
  var log=$("chLog");if(!log)return;
  var d=document.createElement("div");d.className="ch-msg "+who;d.textContent=text;log.appendChild(d);log.scrollTop=log.scrollHeight;return d}
function offlineText(r){
  if(!r)return "I can’t work that one out without the AI connection. Try a sum like (4 + 6) × 3, “25% of 80” or 3x + 5 = 20.";
  if(r.error)return r.error;
  return (r.steps||[]).map(function(s,i){return (i+1)+". "+(s.explain||s.title)+(s.work?"\n   "+s.work:"")}).join("\n")+"\n\nAnswer: "+r.answer+(r.check?"\n"+r.check:"")}
function chSend(){
  var inp=$("chIn"),t=inp.value.trim().slice(0,1500);
  if(!t||chBusy)return;
  inp.value="";chAdd("u",t);HIST.push({role:"user",content:t});
  if(!AI_ENDPOINT){var rep=offlineText(offline(t));chAdd("a",rep);HIST.push({role:"assistant",content:rep});HIST=HIST.slice(-12);return}
  chBusy=true;$("chSend").disabled=true;
  var wait=chAdd("a","Thinking…");wait.classList.add("wait");
  var ctl=window.AbortController?new AbortController():null,tm=setTimeout(function(){if(ctl)ctl.abort()},60000);
  function done(msg,ok){clearTimeout(tm);chBusy=false;var b=$("chSend");if(b)b.disabled=false;
    if(wait&&wait.parentNode){wait.classList.remove("wait");wait.textContent=msg;if(!ok)wait.classList.add("err")}
    if(ok){HIST.push({role:"assistant",content:msg});HIST=HIST.slice(-12)}
    var log=$("chLog");if(log)log.scrollTop=log.scrollHeight}
  fetch(AI_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},signal:ctl?ctl.signal:undefined,
    body:JSON.stringify({mode:"chat",messages:HIST.slice(-10),grade:GRADE[S.grade]||""})})
  .then(function(res){return res.json().catch(function(){return{}}).then(function(j){return{ok:res.ok,j:j}})})
  .then(function(x){if(x.ok&&x.j.reply)done(x.j.reply,true);else done(x.j&&x.j.error?x.j.error:"The coach couldn’t answer right now. Try again in a minute.",false)})
  .catch(function(){done("Couldn’t reach the coach. Check your internet and try again.",false)})}
var chatTool={id:"chat",icon:"💬",name:"Ask the AI (math only)",
html:function(){return '<p class="hint">Ask anything about math, then keep asking follow-ups. It only answers math questions.</p>'+
 '<div class="ch-log" id="chLog" aria-live="polite"></div>'+
 '<div class="chips ch-ex" id="chEx"></div>'+
 '<div class="ch-form"><textarea id="chIn" rows="2" maxlength="1500" placeholder="Ask a math question…" aria-label="Your math question"></textarea><button class="mode" id="chSend" type="button"><b>Send</b></button></div>'+
 '<div class="trow"><button class="quit" id="chClear" type="button">Clear chat</button></div>'+
 '<p class="hw-note" id="chNote"></p>'},
init:function(){
  $("chNote").textContent=AI_ENDPOINT?"Math questions only. Don’t share your name or private info.":"The AI connection isn’t switched on yet. For now this solves typed sums, percents and simple equations with steps.";
  HIST.length?HIST.forEach(function(m){chAdd(m.role==="user"?"u":"a",m.content)}):chAdd("a","Hi! Ask me any math question and I’ll explain it step by step.");
  ["How do I add fractions?","What is 15% of 240?","Solve 2x + 7 = 19","Why is a negative times a negative positive?"].forEach(function(q){
    var b=document.createElement("button");b.className="quit tab";b.type="button";b.textContent=q;
    b.onclick=function(){$("chIn").value=q;chSend()};$("chEx").appendChild(b)});
  $("chSend").onclick=chSend;
  $("chIn").addEventListener("keydown",function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();chSend()}});
  $("chClear").onclick=function(){HIST=[];$("chLog").innerHTML="";chAdd("a","Chat cleared. Ask me a math question!")};
  chBusy=false}};

/* ================= entry points on the home page ================= */
var box=$("tools");
if(box){var b=document.createElement("button");b.className="tool-card hw";b.type="button";
  b.innerHTML='<span class="tool-icon">📸</span><b>AI Homework Helper</b><small>Type or snap a photo</small>';
  b.onclick=function(){M.openTool(tool,b)};box.insertBefore(b,box.firstChild);
  var c=document.createElement("button");c.className="tool-card hw";c.type="button";
  c.innerHTML='<span class="tool-icon">💬</span><b>Ask the AI</b><small>Math questions only</small>';
  c.onclick=function(){M.openTool(chatTool,c)};box.insertBefore(c,b.nextSibling)}
var ban=$("hwBtn");if(ban)ban.onclick=function(){M.openTool(tool,ban)};
var cban=$("chatBtn");if(cban)cban.onclick=function(){M.openTool(chatTool,cban)};
})();