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
{id:"bond",n:"Make 100",d:"63 + ? = 100",lim:6},
{id:"rnd",n:"Rounding",d:"Round 47 to the nearest 10",lim:6},
{id:"ord",n:"Order of operations",d:"2 + 3 × 4",lim:6},
{id:"frac",n:"Fractions of numbers",d:"¼ of 36",lim:5},
{id:"word",n:"Word problems",d:"Real-life stories",lim:14},
{id:"mix",n:"Mixed mayhem",d:"A bit of everything",lim:6,tab:1}];
var GRADES=[
{id:"g1",n:"Grade 1",d:"Counting · simple add & subtract",sel:[2,5,10],max:10,chs:["add","sub","dbl","bond"]},
{id:"g2",n:"Grade 2",d:"Tables 2, 5, 10 · add & subtract",sel:[2,5,10],max:10,chs:["times","div","add","sub","dbl","bond"]},
{id:"g3",n:"Grade 3",d:"Tables 2–6 · fractions basics",sel:[2,3,4,5,6],max:12,chs:["times","div","miss","add","sub","dbl","bond","frac"]},
{id:"g4",n:"Grade 4",d:"Tables 2–12 · percentages & rounding",sel:[2,3,4,5,6,7,8,9,10,11,12],max:12,chs:["times","div","miss","add","sub","sq","pct","dbl","bond","rnd","frac"]},
{id:"g5",n:"Grade 5",d:"All tables · roots & order of ops",sel:[2,3,4,5,6,7,8,9,10,11,12],max:12,chs:["times","div","miss","add","sub","sq","root","pct","dbl","bond","rnd","ord","frac","mix"]},
{id:"g6",n:"Grade 6",d:"Extended tables · mixed skills",sel:[2,3,4,5,6,7,8,9,10,11,12,13,14,15],max:15,chs:["times","div","miss","add","sub","sq","root","pct","dbl","bond","rnd","ord","frac","mix"]},
{id:"hs",n:"High School",d:"Fast fluency · tables to 20",sel:[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],max:20,chs:["times","div","miss","add","sub","sq","root","pct","dbl","bond","rnd","ord","frac","mix"]},
{id:"college",n:"College",d:"Expert pace · full challenge set",sel:[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],max:20,chs:["times","div","miss","add","sub","sq","root","pct","dbl","bond","rnd","ord","frac","mix"]},
{id:"custom",n:"Custom",d:"Your own tables & challenges",sel:null,max:null,chs:null}
];
GRADES.forEach(function(g){if(g.chs&&g.id!=="g1"&&g.chs.indexOf("word")<0)g.chs.push("word")});
var S={coins:0,sel:[2,5,10],max:12,len:60,plen:12,focus:false,ch:"times",grade:"g3",facts:{},best:{},stats:{games:0,asked:0,right:0,bestStreak:0}};
try{var raw=localStorage.getItem("mathescent");if(raw){var p=JSON.parse(raw);if(p&&typeof p==="object")S=Object.assign(S,p)}}catch(e){}
function save(){try{localStorage.setItem("mathescent",JSON.stringify(S))}catch(e){}}
var $=function(id){return document.getElementById(id)};
function show(id){["home","game","end"].forEach(function(x){$(x).classList.toggle("hidden",x!==id)});document.body.classList.toggle("playing",id==="game");window.scrollTo(0,0)}
function cur(){return CH.filter(function(c){return c.id===S.ch})[0]||CH[0]}
function r(a,b){return a+Math.floor(Math.random()*(b-a+1))}
function tb(){return S.sel[r(0,S.sel.length-1)]}
function rp(x,k){var o=[];for(var i=0;i<k;i++)o.push(x);return o.join(" + ")}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;")}
function xk(a,b){return "x"+Math.min(a,b)+"x"+Math.max(a,b)}
function gen(id){
  var a,b,n,m;
  if(id==="mix"){var o=CH.filter(function(c){return c.id!=="mix"&&c.id!=="word"});return gen(o[r(0,o.length-1)].id)}
  if(id==="times"){a=tb();b=r(2,S.max);if(Math.random()<.5){n=a;a=b;b=n}var s=Math.min(a,b),l=Math.max(a,b);return{t:a+" × "+b,a:a*b,k:xk(a,b),e:a+" × "+b+" means "+s+" groups of "+l+(s<=6?": "+rp(l,s)+" = "+a*b:" = "+a*b)+"."}}
  if(id==="div"){a=tb();b=r(2,S.max);return{t:(a*b)+" ÷ "+a,a:b,k:"d"+a+"x"+b,e:(a*b)+" ÷ "+a+" asks how many "+a+"s fit into "+a*b+". Because "+a+" × "+b+" = "+a*b+", the answer is "+b+"."}}
  if(id==="miss"){a=tb();b=r(2,S.max);m=a+" × "+b+" = "+a*b;n="Use the fact "+m+". The missing number is "+b+".";return Math.random()<.5?{t:"? × "+a+" = "+a*b,a:b,k:xk(a,b),e:n}:{t:a+" × ? = "+a*b,a:b,k:xk(a,b),e:n}}
  if(id==="add"){a=r(6,80);b=r(5,100-a);return{t:a+" + "+b,a:a+b,e:"Add the tens, then the ones: "+(a-a%10)+" + "+(b-b%10)+" = "+(a-a%10+b-b%10)+", and "+a%10+" + "+b%10+" = "+(a%10+b%10)+". Together that is "+(a+b)+"."}}
  if(id==="sub"){a=r(20,100);b=r(5,a-5);return{t:a+" − "+b,a:a-b,e:"Count up from "+b+" to "+a+": "+b+" + "+(a-b)+" = "+a+", so "+a+" − "+b+" = "+(a-b)+"."}}
  if(id==="sq"){n=r(2,Math.max(15,S.max));return{t:n+"²",a:n*n,k:"s"+n,e:n+"² means "+n+" × "+n+" = "+n*n+"."}}
  if(id==="root"){n=r(2,Math.max(15,S.max));return{t:"√"+n*n,a:n,k:"s"+n,e:"√"+n*n+" asks which number times itself makes "+n*n+". "+n+" × "+n+" = "+n*n+", so the answer is "+n+"."}}
  if(id==="pct"){m=[10,20,25,50,75][r(0,4)];b=r(1,10)*20;return{t:m+"% of "+b,a:b*m/100,e:({10:"10% is one tenth, so divide by 10",20:"20% is one fifth, so divide by 5",25:"25% is a quarter, so halve it twice",50:"50% is half, so divide by 2",75:"75% is three quarters, so find a quarter and multiply by 3"})[m]+": "+m+"% of "+b+" = "+b*m/100+"."}}
  if(id==="dbl"){n=r(3,50);return Math.random()<.5?{t:"Double "+n,a:n*2,e:"Double means times 2: "+n+" + "+n+" = "+n*2+"."}:{t:"Half of "+n*2,a:n,e:"Half means split into 2 equal parts. "+n+" + "+n+" = "+n*2+", so half of "+n*2+" is "+n+"."}}
  if(id==="bond"){a=r(11,89);return{t:a+" + ? = 100",a:100-a,e:a+" + ? = 100. Count up: "+a+" + "+(100-a)+" = 100, so the missing number is "+(100-a)+"."}}
  if(id==="rnd"){b=r(0,1)?10:100;n=r(11,b===10?98:980);if(n%b===b/2)n++;a=Math.round(n/b)*b;return{t:"Round "+n+" to the nearest "+b,a:a,e:n+" is between "+Math.floor(n/b)*b+" and "+(Math.floor(n/b)*b+b)+". It is closer to "+a+"."}}
  if(id==="ord"){a=r(2,9);b=r(2,9);n=r(2,9);return{t:a+" + "+b+" × "+n,a:a+b*n,e:"Multiply first: "+b+" × "+n+" = "+b*n+". Then add "+a+" to get "+(a+b*n)+"."}}
  if(id==="frac"){m=[["½",2],["¼",4],["⅓",3]][r(0,2)];b=m[1]*r(2,12);return{t:m[0]+" of "+b,a:b/m[1],e:m[0]+" means split "+b+" into "+m[1]+" equal parts. "+b+" ÷ "+m[1]+" = "+b/m[1]+"."}}
  if(id==="word"){
    var NM=["Maria","Juan","Ana","Carlo","Liza","Ben","Sofia","Miguel"],nm=NM[r(0,7)],nm2=NM[r(0,7)],k=r(0,9),c;
    while(nm2===nm)nm2=NM[r(0,7)];
    if(k===0){a=r(12,60);b=r(8,40);return{t:nm+" has "+a+" pencils and buys "+b+" more. How many pencils does "+nm+" have now?",a:a+b,e:"“Buys more” means add: "+a+" + "+b+" = "+(a+b)+".",h:["Does the total get bigger or smaller? That tells you whether to add or subtract.","Add the two amounts: "+a+" + "+b+"."]}}
    if(k===1){a=r(6,12);b=r(3,9);return{t:"A tray holds "+a+" eggs. How many eggs are in "+b+" trays?",a:a*b,e:b+" trays of "+a+" eggs is "+b+" × "+a+" = "+a*b+".",h:["Equal groups means multiply.","Do "+b+" × "+a+"."]}}
    if(k===2){a=r(30,90);b=r(5,a-10);return{t:nm+" had "+a+" stickers and gave "+b+" to "+nm2+". How many stickers are left?",a:a-b,e:"“Gave away” means subtract: "+a+" − "+b+" = "+(a-b)+".",h:["Giving away makes the amount smaller, so subtract.","Count up from "+b+" to "+a+" to find the difference."]}}
    if(k===3){b=r(3,8);c=r(3,12);return{t:nm+" shares "+b*c+" sweets equally among "+b+" friends. How many sweets does each friend get?",a:c,e:"Sharing equally means divide: "+b*c+" ÷ "+b+" = "+c+", because "+b+" × "+c+" = "+b*c+".",h:["Sharing equally means divide.","Ask: "+b+" × ? = "+b*c+"."]}}
    if(k===4){a=r(3,15);b=r(3,9);return{t:"A notebook costs ₱"+a+". How many pesos do "+b+" notebooks cost?",a:a*b,e:b+" notebooks at ₱"+a+" each: "+b+" × "+a+" = "+a*b+" pesos.",h:["The price is the same each time, so multiply.","Do "+b+" × "+a+"."]}}
    if(k===5){a=r(12,95);return{t:nm+" pays ₱100 for a snack that costs ₱"+a+". How many pesos change does "+nm+" get back?",a:100-a,e:"Change is what is left: 100 − "+a+" = "+(100-a)+". You can also count up from "+a+" to 100.",h:["Change means the amount left after paying.","Count up from "+a+" to 100."]}}
    if(k===6){a=r(3,15);return{t:"A square garden has sides of "+a+" m. What is the distance around it (its perimeter) in metres?",a:a*4,e:"A square has 4 equal sides: 4 × "+a+" = "+a*4+" m.",h:["Perimeter is the total of all the sides.","A square has 4 equal sides: "+a+" + "+a+" + "+a+" + "+a+"."]}}
    if(k===7){a=r(3,15);b=r(3,12);return{t:"A rectangle is "+a+" cm long and "+b+" cm wide. What is its area in cm²?",a:a*b,e:"Area of a rectangle = length × width: "+a+" × "+b+" = "+a*b+" cm².",h:["Area is the space inside: length × width.","Do "+a+" × "+b+"."]}}
    if(k===8){a=r(2,5);return{t:"A movie lasts "+a+" hours. How many minutes is that?",a:a*60,e:"1 hour is 60 minutes, so "+a+" × 60 = "+a*60+" minutes.",h:["How many minutes are in 1 hour?","Do "+a+" × 6 first, then add a zero."]}}
    a=r(30,60);b=r(10,a-5);return{t:"A bus has "+a+" seats and "+b+" are taken. How many seats are still free?",a:a-b,e:"Free seats = all seats − taken seats: "+a+" − "+b+" = "+(a-b)+".",h:["Free means not taken, so subtract.","Do "+a+" − "+b+"."]}}
}
function score(q){if(!q.k)return .5;var f=S.facts[q.k];return f&&f.n?f.c/f.n-(f.t>2500?.2:0):-1}
var G=null,timer=null,RETRY=[],GOAL=30,ac=null,wl=null;
function buzz(n){try{if(S.snd!==false&&navigator.vibrate)navigator.vibrate(n)}catch(e){}}
function lockScreen(){try{if(navigator.wakeLock&&!wl)navigator.wakeLock.request("screen").then(function(s){wl=s;s.addEventListener("release",function(){wl=null})}).catch(function(){})}catch(e){}}
function unlockScreen(){try{if(wl){wl.release();wl=null}}catch(e){}}
document.addEventListener("visibilitychange",function(){if(!document.hidden&&G&&!G.lock)lockScreen()});
function fitBar(){var pb=$("playbar"),m=document.querySelector("main");if(!pb||!m)return;m.style.paddingBottom=window.innerWidth<900?(pb.offsetHeight+28)+"px":""}
function syncOpt(){var b=$("optBtn");if(b)b.textContent="⚙ Options · Blitz "+lenName().replace(" seconds","s").replace(" minutes"," min")+" · Practice "+(S.plen||"∞")+(S.focus?" · Focus on":"");fitBar()}
function day(){return Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5)}
function beep(f){if(S.snd===false)return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();var o=ac.createOscillator(),g=ac.createGain();o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+.12)}catch(e){}}
var _mr=Math.random,SEEDBAK=null;
function seedOn(s){var a=s>>>0;Math.random=function(){a=(a+0x6D2B79F5)|0;var t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}}
function seedOff(){Math.random=_mr}
function endSeed(){if(SEEDBAK){S.ch=SEEDBAK.ch;S.sel=SEEDBAK.sel;S.max=SEEDBAK.max;S.len=SEEDBAK.len;SEEDBAK=null}seedOff()}
function pick(){
  if(G.queue&&G.queue.length){var rq=G.queue.shift();G.last=rq.t;return rq}
  if(G.opt){var sq=gen(S.ch);G.last=sq.t;return sq}
  var best=null;
  for(var i=0;i<(S.focus&&G.mode==="practice"?10:4);i++){var q=gen(S.ch);if(G.last&&q.t===G.last)continue;if(!best||score(q)<score(best))best=q}
  if(!best)best=gen(S.ch);G.last=best.t;return best}

function rng(a,b){var o=[];for(var i=a;i<=b;i++)o.push(i);return o}
var LV=[{n:"Easy",d:"Tables 2, 5 and 10",sel:[2,5,10],max:12},{n:"Medium",d:"Tables 2 to 6",sel:rng(2,6),max:12},{n:"Hard",d:"Tables 2 to 12",sel:rng(2,12),max:12},{n:"Expert",d:"Tables 2 to 20",sel:rng(2,20),max:20}];
var LENS=[[30,"30s","30 seconds"],[60,"60s","60 seconds"],[90,"90s","90 seconds"],[120,"2 min","2 minutes"],[180,"3 min","3 minutes"]];
var PLENS=[[12,"12"],[30,"30"],[50,"50"],[0,"∞"]];
function plenName(){return S.plen?S.plen+" questions":"Unlimited questions"}
function hints(q){
  if(q.h)return q.h;
  var t=q.t,a=q.a,m,s,l,n,b,T=function(v){return v-v%10},mul=function(k,c){var o=[];for(var i=1;i<=c;i++)o.push(k*i);return o.join(", ")};
  if(m=t.match(/^\? × (\d+) = (\d+)$/)||t.match(/^(\d+) × \? = (\d+)$/))return["Flip it into a division: "+m[2]+" ÷ "+m[1]+" = ?","Count by "+m[1]+"s: "+mul(+m[1],4)+"… How many jumps to reach "+m[2]+"?"];
  if(m=t.match(/^(\d+) \+ \? = 100$/)){n=T(+m[1])+10;return["How far is "+m[1]+" from 100? Jump to the next ten first.","From "+m[1]+" to "+n+" is "+(n-m[1])+". From "+n+" to 100 is "+(100-n)+". Add the two jumps."]}
  if(m=t.match(/^(\d+) × (\d+)$/)){s=Math.min(m[1],m[2]);l=Math.max(m[1],m[2]);
    if(l>10)return["Split "+l+" into "+T(l)+" and "+l%10+".",T(l)+" × "+s+" = "+T(l)*s+" and "+l%10+" × "+s+" = "+l%10*s+". Now add them."];
    return["Think of "+s+" groups of "+l+". Count by "+l+"s.","Count by "+l+"s: "+mul(l,s-1)+"… one more jump to go."]}
  if(m=t.match(/^(\d+) ÷ (\d+)$/))return["Ask: "+m[2]+" × ? = "+m[1]+". Use your times table backwards.","Count by "+m[2]+"s: "+mul(+m[2],4)+"… until you reach "+m[1]+". Count the jumps."];
  if(m=t.match(/^(\d+)²$/)){n=+m[1];return[n+"² means "+n+" × "+n+".","Try "+n+" × "+(n-1)+" = "+n*(n-1)+", then add one more "+n+"."]}
  if(t.charAt(0)==="√")return["Which number times itself makes "+t.slice(1)+"?","Test "+(a-1)+" × "+(a-1)+" = "+(a-1)*(a-1)+" (too small) and "+(a+1)+" × "+(a+1)+" = "+(a+1)*(a+1)+" (too big). What fits between?"];
  if(m=t.match(/^(\d+)% of (\d+)$/)){b=+m[2];var P=+m[1];
    if(P===10)return["10% means one tenth. Divide by 10.","Split "+b+" into 10 equal parts. One part is the answer."];
    return[{20:"20% is two lots of 10%. Find 10% first: "+b+" ÷ 10.",25:"25% is a quarter: halve it, then halve again.",50:"50% means half.",75:"75% is three quarters. Find a quarter first."}[P],{20:"10% is "+b/10+". Now double it.",25:"Half of "+b+" is "+b/2+". Now halve that.",50:"Split "+b+" into 2 equal parts.",75:"A quarter of "+b+" is "+b/4+". Now multiply by 3."}[P]]}
  if(m=t.match(/^Double (\d+)$/)){n=+m[1];return["Double the tens and the ones separately.","Double "+T(n)+" = "+T(n)*2+" and double "+n%10+" = "+n%10*2+". Add them."]}
  if(m=t.match(/^Half of (\d+)$/)){n=+m[1];return["Halve the tens, then halve the ones.","Half of "+T(n)+" is "+T(n)/2+" and half of "+n%10+" is "+n%10/2+". Add them."]}
  if(m=t.match(/^(½|¼|⅓) of (\d+)$/)){n={"½":2,"¼":4,"⅓":3}[m[1]];return["Split "+m[2]+" into "+n+" equal parts. That is "+m[2]+" ÷ "+n+".",n===4?"Halve "+m[2]+" to get "+m[2]/2+", then halve again.":"Use your times tables backwards: "+n+" × ? = "+m[2]]}
  if(m=t.match(/^Round (\d+) to the nearest (\d+)$/)){n=+m[1];b=+m[2];return["Look at the "+(b===10?"last digit":"last two digits")+": halfway or more rounds up, less rounds down.",n+" sits between "+Math.floor(n/b)*b+" and "+(Math.floor(n/b)*b+b)+". Which one is closer?"]}
  if(m=t.match(/^(\d+) \+ (\d+) × (\d+)$/))return["Multiply before you add (BODMAS).",m[2]+" × "+m[3]+" = "+m[2]*m[3]+". Now add "+m[1]+"."];
  if(m=t.match(/^(\d+) \+ (\d+)$/))return["Add the tens first: "+T(+m[1])+" + "+T(+m[2])+" = "+(T(+m[1])+T(+m[2]))+".","Now add the ones: "+m[1]%10+" + "+m[2]%10+" = "+(m[1]%10+m[2]%10)+". Put the two parts together."];
  if(m=t.match(/^(\d+) − (\d+)$/)){b=+m[2];n=T(b)+10;return["Count up from "+b+" to "+m[1]+" instead of taking away.",n<=m[1]?"Jump from "+b+" to "+n+" (that is "+(n-b)+"), then from "+n+" to "+m[1]+". Add the jumps.":"Count up in small steps from "+b+" to "+m[1]+"."]}
  return["Break it into small steps.","The answer has "+String(a).length+" digit(s) and starts with "+String(a).charAt(0)+"."]}
function coachSay(ok,q,ms){
  var m,w=0;
  if(ok){
    if(G.hl>0)m="Correct, with a little help. Try the next one without a hint!";
    else if(G.streak>=5)m="🔥 "+G.streak+" in a row! You’re on fire.";
    else if(ms<2000)m="Correct and fast! ⚡";
    else m=["Nice one!","Yes! Keep it going.","Correct. Good thinking.","That’s right!"][r(0,3)];
    $("coachBox").className="coach good"}
  else{
    for(var i=G.log.length-1;i>=0&&!G.log[i].ok;i--)w++;
    m="Not quite. "+q.e;
    if(w>=3)m+=" Tip: you’ve missed a few in a row. Slow down, press Hint, and say the steps out loud.";
    $("coachBox").className="coach bad"}
  $("coach").textContent=m}
function hintBtn(){var b=$("hintBtn"),n=G?G.hl:0;b.textContent=n===0?"💡 Need a hint?":n===1?"💡 Another hint (2/3)":n===2?"💡 Show full steps (3/3)":"💡 No more hints";b.disabled=n>=3}
function hintClick(){
  if(!G||G.mode!=="practice"||G.lock||G.hl>=3)return;
  G.hl++;G.hused++;var H=hints(G.q);
  $("coachBox").className="coach hint";
  $("coach").textContent="💡 Hint "+G.hl+" of 3: "+(G.hl<3?H[G.hl-1]:"Full steps. "+G.q.e);hintBtn()}
function goNext(){
  if(!G||!G.wait)return;
  $("coach").textContent="Next question! Stuck? Tap 💡 for a step-by-step hint.";
  $("coachBox").className="coach";after()}
function endCoach(g){
  var el=$("endCoach");
  if(g.mode!=="practice"||!g.asked){el.classList.add("hidden");return}
  var pct=Math.round(g.score/g.asked*100),bad=g.log.filter(function(x){return !x.ok}).map(function(x){return x.t}),m;
  m=pct>=90?"Excellent work! You’re ready to try Blitz and earn coins.":pct>=70?"Good job. A bit more practice and these will feel automatic.":"Keep going, mistakes are how your brain learns. Read the “Why” notes below, then try again.";
  if(bad.length)m+="<br><b>Practise these next:</b> "+bad.slice(0,6).map(esc).join(" · ");
  if(g.hused)m+="<br>You used "+g.hused+" hint"+(g.hused>1?"s":"")+". Try fewer next round.";
  el.innerHTML="🎓 <b>Coach says:</b> "+m;el.classList.remove("hidden")}
function lenName(){for(var i=0;i<LENS.length;i++)if(LENS[i][0]===S.len)return LENS[i][2];return "60 seconds"}
function fmt(s){return s>=60?Math.floor(s/60)+":"+("0"+s%60).slice(-2):s+"s"}
function bk(id){return S.len===60?id:id+"@"+S.len}
function lvName(){for(var i=0;i<LV.length;i++){if(S.max===LV[i].max&&JSON.stringify(S.sel.slice().sort(function(x,y){return x-y}))===JSON.stringify(LV[i].sel))return LV[i].n}return "Custom"}
function goTo(id){
  var el=$(id);if(!el)return;
  var rm=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches;
  requestAnimationFrame(function(){
    el.scrollIntoView({behavior:rm?"auto":"smooth",block:"start"});
    el.classList.remove("flash");void el.offsetWidth;el.classList.add("flash");
    setTimeout(function(){el.classList.remove("flash")},1900)})}
function pulsePlay(){
  var b=$("gig");if(!b)return;
  b.classList.remove("pulse");void b.offsetWidth;b.classList.add("pulse");
  setTimeout(function(){b.classList.remove("pulse")},2600)}
function renderHome(){
  $("coins").textContent=S.coins;$("dstreak").textContent=S.last>=day()-1?S.ds||0:0;
  var tn=S.td&&S.td.d===day()?S.td.n:0;$("goal").textContent=tn>=GOAL?"🎯 Daily goal done! "+tn+" correct today":"🎯 Daily goal: "+tn+"/"+GOAL+" correct answers today (+20 coins)";
  var i=0;for(var k=0;k<RANKS.length;k++)if(S.coins>=RANKS[k][0])i=k;
  var nx=RANKS[i+1];
  $("rankName").textContent=RANKS[i][1];
  $("rankNext").textContent=nx?(nx[0]-S.coins)+" coins to "+nx[1]:"Top of the bill";
  $("rankBar").style.width=(nx?(S.coins-RANKS[i][0])/(nx[0]-RANKS[i][0])*100:100)+"%";
  var gr=$("grades");if(gr){gr.innerHTML="";
  GRADES.forEach(function(g){var b=document.createElement("button");b.className="card";
    b.setAttribute("aria-pressed",g.id===S.grade);
    b.innerHTML="<b>"+g.n+"</b><small>"+g.d+"</small>";
    b.onclick=function(){S.grade=g.id;if(g.sel){S.sel=g.sel.slice();S.max=g.max;}if(g.chs&&g.chs.indexOf(S.ch)<0)S.ch=g.chs[0];save();renderHome();goTo("challengeBox")};
    gr.appendChild(b)});}
  var allowed=null;for(var gi=0;gi<GRADES.length;gi++)if(GRADES[gi].id===S.grade)allowed=GRADES[gi].chs;
  var c=$("cards");c.innerHTML="";
  CH.forEach(function(ch){if(allowed&&allowed.indexOf(ch.id)<0)return;
    var b=document.createElement("button");b.className="card";
    b.setAttribute("aria-pressed",ch.id===S.ch);
    b.innerHTML="<b>"+ch.n+"</b><small>"+ch.d+(S.best[bk(ch.id)]?" · Best "+S.best[bk(ch.id)]:"")+"</small>";
    b.onclick=function(){S.ch=ch.id;save();renderHome();if(cur().tab)goTo("tablesBox");else pulsePlay()};c.appendChild(b)});
  $("tablesBox").classList.toggle("hidden",!cur().tab);$("max").value=S.max;$("playName").textContent=cur().n+(cur().tab?" · "+lvName():"");
  var ln=$("len");ln.innerHTML="";
  LENS.forEach(function(l){var b=document.createElement("button");b.textContent=l[1];b.setAttribute("aria-pressed",S.len===l[0]);b.setAttribute("aria-label","Blitz length "+l[2]);
    b.onclick=function(){S.len=l[0];save();renderHome()};ln.appendChild(b)});
  $("gigSub").textContent=lenName()+", earn coins";
  var pl=$("plen");pl.innerHTML="";
  PLENS.forEach(function(l){var b=document.createElement("button");b.textContent=l[1];b.setAttribute("aria-pressed",S.plen===l[0]);b.setAttribute("aria-label","Practice length "+(l[0]||"unlimited"));
    b.onclick=function(){S.plen=l[0];save();renderHome()};pl.appendChild(b)});
  $("pracSub").textContent=plenName()+", with coach";$("focus").setAttribute("aria-pressed",!!S.focus);
  var lv=$("levels");lv.innerHTML="";
  LV.forEach(function(l){var b=document.createElement("button");b.className="card";
    var on=S.max===l.max&&JSON.stringify(S.sel.slice().sort(function(x,y){return x-y}))===JSON.stringify(l.sel);
    b.setAttribute("aria-pressed",on);b.innerHTML="<b>"+l.n+"</b><small>"+l.d+"</small>";
    b.onclick=function(){S.sel=l.sel.slice();S.max=l.max;save();renderHome();pulsePlay()};lv.appendChild(b)});
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
  $("grid").innerHTML=h+"</table>";renderLearn();renderProgress();syncOpt()}

function start(mode,queue,opt){
  endSeed();
  if(opt){SEEDBAK={ch:S.ch,sel:S.sel,max:S.max,len:S.len};S.ch=opt.ch;S.sel=opt.sel.slice();S.max=opt.max;S.len=opt.len;seedOn(opt.seed)}
  S.seen=1;S.tried=S.tried||{};S.tried[S.ch]=1;if(!opt)save();lockScreen();
  var _lim=cur().lim*1000;if(!opt&&S.grade==="hs")_lim=Math.round(_lim*0.85);if(!opt&&S.grade==="college")_lim=Math.round(_lim*0.7);
  G={mode:mode,score:0,coins:0,asked:0,wrong:{},log:[],streak:0,maxStreak:0,t0:Date.now(),qStart:0,input:"",lock:false,wait:false,hl:0,hused:0,plen:queue?queue.length:S.plen,queue:queue||null,lim:_lim,len:S.len*1000,times:[],paceTarget:_lim,opt:opt||null};
  show("game");$("streak").textContent="";$("status").textContent=(opt&&opt.label?opt.label+" · ":"")+(mode==="gig"?"Blitz: ":"Practice: ")+cur().n;
  $("qbar").parentNode.classList.toggle("hidden",mode!=="gig");
  $("coachBox").className=mode==="practice"?"coach":"coach hidden";$("finishBtn").classList.toggle("hidden",mode!=="practice");
  $("coach").textContent="I’m your coach. Stuck? Tap 💡 (or press H) for up to 3 hints: a nudge, a closer clue, then the full steps. I’ll explain every mistake.";
  next();clearInterval(timer);timer=setInterval(tick,50)}
function next(){
  var q=pick();G.q=q;G.input="";G.lock=false;G.qStart=Date.now();
  $("q").textContent=q.t;$("q").classList.toggle("long",q.t.length>32);$("ans").textContent="";$("ans").className="ans";$("qbar").style.width="100%";G.hl=0;G.wait=false;$("nextBtn").classList.add("hidden");$("hintBtn").classList.remove("hidden");hintBtn();if(G.times&&G.times.length)updatePace();else{var pb=$("paceBar"),pv=$("paceVal");if(pb){pb.style.width="50%";pb.className="";}if(pv)pv.textContent="—";}}
function tick(){
  if(!G)return;var now=Date.now();
  if(G.mode==="gig"){
    var left=Math.max(0,G.len-(now-G.t0));$("clock").textContent=fmt(Math.ceil(left/1000));
    if(!G.lock){var ql=G.lim-(now-G.qStart);$("qbar").style.width=Math.max(0,ql/G.lim*100)+"%";if(ql<=0)answer(true)}
    if(left<=0&&!G.lock)finish()
  }else $("clock").textContent=G.plen?Math.min(G.asked+1,G.plen)+"/"+G.plen:"Q"+(G.asked+1)}
function answer(timedOut){
  if(G.lock)return;
  var q=G.q,ms=Date.now()-G.qStart,ok=!timedOut&&parseInt(G.input,10)===q.a;
  G.asked++;if(ok){G.streak++;if(G.streak>G.maxStreak)G.maxStreak=G.streak}else G.streak=0;$("streak").textContent=G.streak>1?"🔥 "+G.streak:"";G.log.push({t:q.t,a:q.a,u:(timedOut||G.input==="")?null:G.input,ok:ok,e:q.e||"",q:q,ms:ms});
  if(!timedOut){G.times.push(ms);updatePace();}
  if(q.k){var f=S.facts[q.k]||(S.facts[q.k]={c:0,n:0,t:3000});f.n++;if(ok){f.c++;f.t=Math.round(f.t*.6+Math.min(ms,6000)*.4)}}
  G.lock=true;beep(ok?660:220);if(!ok)buzz(90);
  if(ok){G.score++;if(G.mode==="gig")G.coins+=ms<G.lim*.6?2:1;if(G.mode==="gig"&&G.streak%5===0){G.coins+=3;$("streak").textContent+=" +3🪙"}if(G.mode==="practice")coachSay(true,q,ms);after()}
  else{$("ans").textContent=q.a;$("ans").classList.add("no");
    if(G.mode==="practice"){coachSay(false,q,ms);G.wait=true;$("nextBtn").classList.remove("hidden");$("hintBtn").classList.add("hidden")}
    else setTimeout(after,600)}}
function after(){
  if(!G)return;
  if(G.mode==="practice"&&G.plen&&G.asked>=G.plen)return finish();
  if(G.mode==="gig"&&Date.now()-G.t0>=G.len)return finish();
  next()}
function finish(){
  clearInterval(timer);unlockScreen();var g=G,was=earned();g.lock=true;S.coins+=g.coins;S.stats.games++;S.stats.asked+=g.asked;S.stats.right+=g.score;S.stats.bestStreak=Math.max(S.stats.bestStreak,g.maxStreak);
  var d=day(),pre;if(S.last!==d){S.ds=S.last===d-1?(S.ds||0)+1:1;S.last=d}S.stats.bestDs=Math.max(S.stats.bestDs||0,S.ds);
  if(!S.td||S.td.d!==d)S.td={d:d,n:0};pre=S.td.n;S.td.n+=g.score;
  if(pre<GOAL&&S.td.n>=GOAL){S.coins+=20;S.stats.goals=(S.stats.goals||0)+1;g.goal=1}
  if(g.mode==="practice"&&g.asked>=12&&!g.hused&&g.score/g.asked>=.9)S.stats.nh=(S.stats.nh||0)+1;
  if(g.queue&&g.asked&&g.score===g.asked)S.stats.fixed=(S.stats.fixed||0)+1;
  if(!g.opt&&g.mode==="gig"&&g.score>(S.best[bk(S.ch)]||0))S.best[bk(S.ch)]=g.score;
  if(g.opt&&g.opt.daily){if(!S.dly||S.dly.d!==d){S.stats.dailies=(S.stats.dailies||0)+1;S.dly={d:d,s:g.score,a:g.asked};S.coins+=10;g.coins+=10}else if(g.score>S.dly.s){S.dly.s=g.score;S.dly.a=g.asked}}
  endSeed();
  save();show("end");
  $("endTitle").textContent=g.mode==="gig"?"Encore!":"Nice practice!";
  $("endScore").textContent=g.score+" / "+g.asked;
  $("endSum").textContent=g.mode==="gig"?"You earned "+g.coins+" coins. Total: "+S.coins+".":"Practice doesn’t earn coins, but it sharpens your skills.";
  renderEndResults(g);
  var now=earned().filter(function(n){return was.indexOf(n)<0});$("endBadge").textContent=now.length?"🏅 New badge: "+now.join(", "):"";
  $("endFix").innerHTML=g.log.length?review(g.log):"";
  if(g.goal)$("endSum").textContent+=" 🎯 Daily goal reached: +20 bonus coins!";
  RETRY=g.log.filter(function(x){return !x.ok}).map(function(x){return x.q});$("retry").classList.toggle("hidden",!RETRY.length);endCoach(g);if(window.MX&&window.MX.onEnd)window.MX.onEnd(g)}
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
"Percentages: find 10% by dividing by 10. For 5%, halve that. 5% of 80 = 8 ÷ 2 = 4.",
"Times 12: do times 10, then add times 2. 12 × 7 = 70 + 14 = 84.",
"Subtracting 9: take away 10, then add 1. 52 − 9 = 42 + 1 = 43.",
"Make 100: the tens add to 9 and the ones add to 10. 100 − 37 = 63 (3 + 6 = 9, 7 + 3 = 10).",
"Times 3: double it, then add one more lot. 3 × 14 = 28 + 14 = 42.",
"Divisible by 3? Add the digits. If that total is in the 3 table, so is the number. 123: 1 + 2 + 3 = 6, yes!",
"Times 8: double, double, double. 8 × 6 = 12, 24, 48.",
"Doubling big numbers: double the tens, double the ones, then add. Double 47 = 80 + 14 = 94.",
"Percent flip: 8% of 50 is the same as 50% of 8, which is 4. Swap them to make it easier."];
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
["Table Master","Master 40 table facts",function(){return mastered()>=40}],
["Daily Habit","Play 3 days in a row",function(){return (S.stats.bestDs||0)>=3}],
["Goal Getter","Reach your daily goal",function(){return (S.stats.goals||0)>=1}],
["Hint-Free Hero","Practice 12+ questions, 90%+, no hints",function(){return (S.stats.nh||0)>=1}],
["Explorer","Try 6 different challenges",function(){return Object.keys(S.tried||{}).length>=6}],
["Mistake Fixer","Redo your mistakes with no errors",function(){return (S.stats.fixed||0)>=1}],
["Daily Player","Finish 3 Daily Challenges",function(){return (S.stats.dailies||0)>=3}],
["Toolbox Pro","Use 5 different math tools",function(){return Object.keys(S.toolsUsed||{}).length>=5}]];
function earned(){return BADGES.filter(function(b){return b[2]()}).map(function(b){return b[0]})}
function renderProgress(){
  var st=S.stats,acc=st.asked?Math.round(st.right/st.asked*100)+"%":"–";
  $("stats").innerHTML=[["Games",st.games],["Questions",st.asked],["Accuracy",acc],["Best streak",st.bestStreak]].map(function(x){return "<div><b>"+x[1]+"</b><span>"+x[0]+"</span></div>"}).join("");
  $("trick").textContent=TRICKS[ti%TRICKS.length];
  var tf=[];for(var k in S.facts){var f=S.facts[k];if(k.charAt(0)==="x"&&f.n>=2&&f.c/f.n<.8)tf.push([k,f.c/f.n])}tf.sort(function(x,y){return x[1]-y[1]});
  $("tricky").innerHTML=tf.length?tf.slice(0,8).map(function(x){var p=x[0].split("x");return "<li>"+p[1]+" × "+p[2]+" <small>"+Math.round(x[1]*100)+"%</small></li>"}).join(""):"<li>None yet. Play a few rounds and your tricky facts show up here.</li>";
  $("trainBtn").classList.toggle("hidden",!tf.length);
  var e=earned();$("badgeCount").textContent="("+e.length+"/"+BADGES.length+")";
  $("badges").innerHTML=BADGES.map(function(b){var on=e.indexOf(b[0])>-1;return "<div class='badge"+(on?" on":"")+"'><b>"+(on?"🏅 ":"🔒 ")+b[0]+"</b><small>"+b[1]+"</small></div>"}).join("")}
$("trickBtn").onclick=function(){ti++;$("trick").textContent=TRICKS[ti%TRICKS.length]};
function press(d){
  if(G&&G.wait){if(d==="go")goNext();return}
  if(!G||G.lock||$("game").classList.contains("hidden"))return;
  if(d==="back")G.input=G.input.slice(0,-1);
  else if(d==="go"){if(G.input)answer(false);return}
  else if(G.input.length<4){G.input+=d;buzz(8)}
  $("ans").textContent=G.input;
  if(G.input.length===String(G.q.a).length)answer(false)}
["1","2","3","4","5","6","7","8","9","back","0","go"].forEach(function(d){
  var b=document.createElement("button");b.textContent=d==="back"?"⌫":(d==="go"?"Go":d);
  b.setAttribute("aria-label",d==="back"?"Delete":(d==="go"?"Submit":d));
  b.onclick=function(){press(d)};$("pad").appendChild(b)});
(function(){
  var kb=$("kb"),keys={};
  var P={"`":"Backquote","-":"Minus","=":"Equal","[":"BracketLeft","]":"BracketRight","\\":"Backslash",";":"Semicolon","'":"Quote",",":"Comma",".":"Period","/":"Slash"};
  function code(l){if(l>="0"&&l<="9")return"Digit"+l;if(/^[a-z]$/.test(l))return"Key"+l.toUpperCase();return P[l]}
  function mk(parent,label,id,cls,act){
    var el=document.createElement("div");el.className="k "+(cls||"");el.textContent=label;
    if(act){el.classList.add("on");el.onclick=act.fn;if(act.c)el.classList.add(act.c)}
    if(id)(keys[id]=keys[id]||[]).push(el);parent.appendChild(el);return el}
  var NUM=function(d){return{c:"num",fn:function(){press(d)}}};
  var DEL={c:"del",fn:function(){press("back")}},GO={c:"go",fn:function(){press("go")}};
  var main=document.createElement("div");main.className="kbmain";
  var rows=[
    ["`","1","2","3","4","5","6","7","8","9","0","-","=",["⌫","Backspace","w2",DEL]],
    [["Tab","Tab","w15"],"q","w","e","r","t","y","u","i","o","p","[","]",["\\","Backslash","w15"]],
    [["Caps","CapsLock","w2"],"a","s","d","f","g","h","j","k","l",";","'",["Go","Enter","w25",GO]],
    [["Shift","ShiftLeft","w25"],"z","x","c","v","b","n","m",",",".","/",["Shift","ShiftRight","w25"]],
    [["","Space","w6"]]
  ];
  rows.forEach(function(r){
    var row=document.createElement("div");row.className="kr";
    r.forEach(function(k){
      if(typeof k==="string"){
        var act=null;
        if(k>="0"&&k<="9")act=NUM(k);
        else if(k==="h")act={fn:function(){hintClick()}};
        mk(row,k.toUpperCase(),code(k),"",act)}
      else mk(row,k[0],k[1],k[2],k[3])});
    main.appendChild(row)});
  var np=document.createElement("div");np.className="kbnum";
  [["Num","NumLock"],["/","NumpadDivide"],["*","NumpadMultiply"],["-","NumpadSubtract"],
   ["7","Numpad7",0,NUM("7")],["8","Numpad8",0,NUM("8")],["9","Numpad9",0,NUM("9")],["+","NumpadAdd","s2r"],
   ["4","Numpad4",0,NUM("4")],["5","Numpad5",0,NUM("5")],["6","Numpad6",0,NUM("6")],
   ["1","Numpad1",0,NUM("1")],["2","Numpad2",0,NUM("2")],["3","Numpad3",0,NUM("3")],["Go","NumpadEnter","s2r",GO],
   ["0","Numpad0","s2c",NUM("0")],[".","NumpadDecimal"]
  ].forEach(function(k){mk(np,k[0],k[1],k[2],k[3])});
  var wrap=document.createElement("div");wrap.className="kbwrap";
  wrap.appendChild(main);wrap.appendChild(np);kb.appendChild(wrap);
    function set(e,on){var l=keys[e.code];if(l)l.forEach(function(x){x.classList.toggle("down",on)})}
  document.addEventListener("keydown",function(e){set(e,true)});
  document.addEventListener("keyup",function(e){set(e,false)});
  window.addEventListener("blur",function(){for(var k in keys)keys[k].forEach(function(x){x.classList.remove("down")})});
})();
function restartRun(){
  if($("home")&&!$("home").classList.contains("hidden"))return;
  if(!G)return;
  var mode=G.mode,op=G.opt;
  clearInterval(timer);
  G=null;
  start(mode,null,op);
}
document.addEventListener("keydown",function(e){
  if(e.key==="Enter"&&G&&!$("game").classList.contains("hidden"))e.preventDefault();
  var inRun=G&&(!$("game").classList.contains("hidden")||!$("end").classList.contains("hidden"));
  if(inRun&&((e.key==="r"||e.key==="R")||((e.ctrlKey||e.metaKey)&&(e.key==="r"||e.key==="R")))){
    e.preventDefault();restartRun();return}
  if((e.key==="h"||e.key==="H")&&G&&!$("game").classList.contains("hidden")){hintClick();return}
  if(e.key>="0"&&e.key<="9")press(e.key);
  else if(e.key==="Backspace")press("back");
  else if(e.key==="Enter"){if(G&&!$("game").classList.contains("hidden"))press("go");else if(!$("home").classList.contains("hidden")&&document.activeElement===document.body)start("gig")}});
$("max").onchange=function(){var v=parseInt($("max").value,10);if(isNaN(v))v=12;v=Math.max(2,Math.min(50,v));S.max=v;S.sel=S.sel.filter(function(x){return x<=v});if(!S.sel.length)S.sel=[2];save();renderHome()};
$("all").onclick=function(){S.sel=[];for(var i=2;i<=S.max;i++)S.sel.push(i);save();renderHome()};
$("hintBtn").onclick=hintClick;$("nextBtn").onclick=goNext;
$("finishBtn").onclick=function(){if(G&&G.mode==="practice")finish()};
$("focus").onclick=function(){S.focus=!S.focus;save();renderHome()};
$("retry").onclick=function(){start("practice",RETRY.slice())};
$("trainBtn").onclick=function(){S.ch="times";S.focus=true;save();start("practice")};
function applyTheme(){if(S.theme)document.documentElement.setAttribute("data-theme",S.theme);var m=$("tc");if(m)m.setAttribute("content",getComputedStyle(document.body).backgroundColor)}
$("theme").onclick=function(){var dark=document.documentElement.getAttribute("data-theme")==="dark"||(!S.theme&&!matchMedia("(prefers-color-scheme:light)").matches);S.theme=dark?"light":"dark";applyTheme();save()};
$("snd").onclick=function(){S.snd=S.snd===false;save();$("snd").textContent=S.snd===false?"🔇":"🔊"};
applyTheme();$("snd").textContent=S.snd===false?"🔇":"🔊";
$("gig").onclick=function(){start("gig")};
$("practice").onclick=function(){start("practice")};
$("quit").onclick=function(){clearInterval(timer);unlockScreen();endSeed();G=null;renderHome();show("home")};

$("restart").onclick=function(){restartRun()};
$("again").onclick=function(){start(G.mode,null,G.opt)};
$("home2").onclick=function(){G=null;renderHome();show("home")};

function updatePace(){
  if(!G||!G.times.length)return;
  var avg=G.times.reduce(function(a,b){return a+b},0)/G.times.length;
  var target=G.paceTarget||3000;
  var ratio=Math.min(2,Math.max(0,target/Math.max(avg,1)));
  var pct=Math.round(ratio*50);
  var bar=$("paceBar"),val=$("paceVal");
  if(!bar)return;
  bar.style.width=pct+"%";
  bar.className="";
  if(avg<=target*0.7){bar.classList.add("fast");val.textContent="Fast "+Math.round(avg/100)/10+"s"}
  else if(avg>=target*1.2){bar.classList.add("slow");val.textContent="Slow "+Math.round(avg/100)/10+"s"}
  else{val.textContent=Math.round(avg/100)/10+"s"}
}
function renderEndResults(g){
  var el=$("endStats"),ps=$("paceSummary");
  if(!el)return;
  var acc=g.asked?Math.round(g.score/g.asked*100):0;
  var times=g.times||[];
  var avg=times.length?Math.round(times.reduce(function(a,b){return a+b},0)/times.length):0;
  var best=times.length?Math.min.apply(null,times):0;
  var target=g.paceTarget||3000;
  el.innerHTML=[["Correct",g.score+"/"+g.asked],["Accuracy",acc+"%"],["Best streak",g.maxStreak],["Avg time",avg?Math.round(avg/100)/10+"s":"—"],["Fastest",best?Math.round(best/100)/10+"s":"—"],["Coins",g.coins||0]].map(function(x){return "<div><b>"+x[1]+"</b><span>"+x[0]+"</span></div>"}).join("");
  if(ps){
    var paceMsg;
    if(!times.length)paceMsg="No timed answers this round.";
    else if(avg<=target*0.7)paceMsg="⚡ <b>Great pace!</b> Average "+(Math.round(avg/100)/10)+"s per question (target ~"+(Math.round(target/100)/10)+"s).";
    else if(avg>=target*1.2)paceMsg="🐢 <b>Take your time</b> — average "+(Math.round(avg/100)/10)+"s. Practice mode helps you speed up safely.";
    else paceMsg="🎯 <b>Solid pace.</b> Average "+(Math.round(avg/100)/10)+"s per question (target ~"+(Math.round(target/100)/10)+"s).";
    if(g.mode==="gig")paceMsg+=" Blitz rewards faster correct answers with extra coins.";
    ps.innerHTML=paceMsg;
  }
}



$("optBtn").onclick=function(){var pb=$("playbar"),o=pb.classList.toggle("open");this.setAttribute("aria-expanded",o);this.classList.remove("fresh");if(!S.optSeen){S.optSeen=1;save()}fitBar()};
if(!S.optSeen)$("optBtn").classList.add("fresh");
if(window.ResizeObserver)new ResizeObserver(fitBar).observe($("playbar"));
window.addEventListener("resize",fitBar);
$("max").addEventListener("focus",function(){document.body.classList.add("typing")});
$("max").addEventListener("blur",function(){document.body.classList.remove("typing")});
window.MX={S:S,save:save,gen:gen,start:start,renderHome:renderHome,CH:CH,LENS:LENS,rng:rng,esc:esc,day:day,beep:beep,buzz:buzz,getG:function(){return G},onEnd:null};
renderHome();
if(S.seen)$("how").removeAttribute("open");
})();