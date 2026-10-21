/* Mathescent extras: math toolbox, daily + shareable challenges, worksheets, backup.
   Loaded after script.js, which exposes the window.MX hooks used here. */
(function(){
var M=window.MX;if(!M)return;
var S=M.S,esc=M.esc;
function $(id){return document.getElementById(id)}
function nf(x,d){return String(+Number(x).toFixed(d===undefined?6:d))}
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=a%b;a=b;b=t}return a}
function isInt(x){return isFinite(x)&&Math.floor(x)===x}
function val(id){var v=$(id).value;if(v===""||v===null)return null;var n=Number(v);return isFinite(n)?n:null}

/* ---------- toast + clipboard ---------- */
var tt=0;
function toast(msg){var t=$("toast");if(!t)return;t.textContent=msg;t.classList.remove("hidden");clearTimeout(tt);tt=setTimeout(function(){t.classList.add("hidden")},2800)}
function fallbackCopy(text){var ta=document.createElement("textarea");ta.value=text;ta.setAttribute("readonly","");ta.style.cssText="position:fixed;opacity:0;top:0;left:0";document.body.appendChild(ta);ta.select();var ok=false;try{ok=document.execCommand("copy")}catch(e){}document.body.removeChild(ta);return ok}
function copy(text,msg){
  var done=function(ok){toast(ok?(msg||"Copied!"):"Couldn’t copy. Please select the text and copy it by hand.")};
  if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(text).then(function(){done(true)},function(){done(fallbackCopy(text))});
  else done(fallbackCopy(text))}

/* ---------- modal ---------- */
var current=null,opener=null,newUse=false;
function used(id){S.toolsUsed=S.toolsUsed||{};if(!S.toolsUsed[id]){S.toolsUsed[id]=1;newUse=true;M.save()}}
function openTool(t,from){
  current=t;opener=from||null;used(t.id);
  $("modalTitle").textContent=t.icon+" "+t.name;
  var body=$("modalBody");body.innerHTML=t.html();
  $("modalCard").onkeydown=t.key||null;
  $("modal").classList.remove("hidden");document.body.style.overflow="hidden";
  t.init(body);$("modalCard").scrollTop=0;$("modalCard").focus()}
function closeTool(){
  $("modal").classList.add("hidden");document.body.style.overflow="";
  current=null;$("modalCard").onkeydown=null;
  if(opener&&opener.focus)opener.focus();
  if(newUse){newUse=false;M.renderHome()}}

/* ---------- tools ---------- */
var calcKey=null;
var TOOLS=[];

/* Calculator */
TOOLS.push({id:"calc",icon:"🧮",name:"Calculator",desc:"Brackets, keyboard friendly",
html:function(){return '<div class="calc-display" id="cd">0</div><div class="calc-keys" id="ck"></div><p class="hint">Use your keyboard too: Enter is equals, Backspace deletes, C clears.</p>'},
init:function(){
  var ex="",done=false,cd=$("cd");
  var rows=[["C","(",")","÷"],["7","8","9","×"],["4","5","6","−"],["1","2","3","+"],["0",".","⌫","="]];
  function calc(s){
    var j=s.replace(/×/g,"*").replace(/÷/g,"/").replace(/−/g,"-");
    if(!/^[0-9+\-*\/.() ]+$/.test(j))return null;
    try{var v=Function('"use strict";return ('+j+')')();if(typeof v!=="number"||!isFinite(v))return null;return +v.toFixed(10)}catch(e){return null}}
  function key(k){
    if(k==="C"){ex="";done=false}
    else if(k==="⌫"){if(ex==="Error")ex="";else ex=ex.slice(0,-1);done=false}
    else if(k==="="){if(!ex||ex==="Error")return;var v=calc(ex);ex=v===null?"Error":String(v);done=true}
    else{if(ex==="Error"||(done&&/[0-9.(]/.test(k)))ex="";done=false;if(ex.length<24)ex+=k}
    cd.textContent=ex||"0"}
  calcKey=key;
  rows.forEach(function(row){row.forEach(function(k){
    var b=document.createElement("button");b.textContent=k;
    b.className=k==="="?"calc-eq":(/[÷×−+]/.test(k)?"calc-op":"");
    b.setAttribute("aria-label",({"C":"Clear","⌫":"Delete","=":"Equals","÷":"Divide","×":"Times","−":"Minus","+":"Plus"})[k]||k);
    b.onclick=function(){key(k)};$("ck").appendChild(b)})})},
key:function(e){
  if(!calcKey||e.ctrlKey||e.metaKey||e.altKey)return;
  var k=e.key,map={"*":"×","/":"÷","-":"−","Enter":"=","Backspace":"⌫"};
  if(/^[0-9.()+=]$/.test(k))calcKey(k);
  else if(map[k])calcKey(map[k]);
  else if(k==="c"||k==="C")calcKey("C");
  else return;
  e.preventDefault();e.stopPropagation()}});

/* Fractions */
TOOLS.push({id:"frac",icon:"➗",name:"Fraction helper",desc:"Add, subtract, simplify",
html:function(){return '<p class="hint">Type two fractions and pick an operation. You get the answer, the steps, a mixed number and a decimal.</p>'+
 '<div class="frow"><span class="fr"><input id="fa" type="number" step="1" inputmode="numeric" aria-label="First top number" placeholder="1"><i></i><input id="fb" type="number" step="1" inputmode="numeric" aria-label="First bottom number" placeholder="2"></span>'+
 '<select id="fop" aria-label="Operation"><option value="+">+</option><option value="-">−</option><option value="*">×</option><option value="/">÷</option><option value="s">simplify only</option></select>'+
 '<span class="fr" id="frs"><input id="fc" type="number" step="1" inputmode="numeric" aria-label="Second top number" placeholder="1"><i></i><input id="fd" type="number" step="1" inputmode="numeric" aria-label="Second bottom number" placeholder="3"></span></div>'+
 '<div class="tout" id="fout">Type some numbers to begin.</div>'},
init:function(){
  function go(){
    var ids=["fa","fb","fc","fd"],op=$("fop").value,out=$("fout"),need=op==="s"?2:4,i;
    $("frs").style.opacity=op==="s"?".3":"1";
    var v=ids.map(function(x){return $(x).value}),n=v.map(Number);
    for(i=0;i<need;i++)if(v[i]===""){out.textContent=op==="s"?"Type a fraction to simplify.":"Type both fractions to see the answer.";return}
    for(i=0;i<need;i++)if(!isInt(n[i])){out.textContent="Use whole numbers on the top and bottom.";return}
    var a=n[0],b=n[1],c=n[2],d=n[3],num,den,steps;
    if(b===0||(op!=="s"&&d===0)){out.textContent="The bottom number can’t be 0.";return}
    if(op==="s"){num=a;den=b;steps="Divide the top and bottom by their biggest common factor (GCD)."}
    else if(op==="+"||op==="-"){var sg=op==="+"?"+":"−";num=a*d+(op==="+"?1:-1)*c*b;den=b*d;steps=a+"/"+b+" "+sg+" "+c+"/"+d+" = "+(a*d)+"/"+den+" "+sg+" "+(c*b)+"/"+den+" = "+num+"/"+den}
    else if(op==="*"){num=a*c;den=b*d;steps="Multiply the tops and the bottoms: ("+a+" × "+c+") / ("+b+" × "+d+") = "+num+"/"+den}
    else{if(c===0){out.textContent="You can’t divide by a fraction that equals 0.";return}num=a*d;den=b*c;steps="Flip the second fraction, then multiply: "+a+"/"+b+" × "+d+"/"+c+" = "+num+"/"+den}
    if(den<0){num=-num;den=-den}
    var g=gcd(num,den)||1,sn=num/g,sd=den/g,h="<p>"+esc(steps)+"</p><p class='big2'>= "+sn+(sd===1?"":"/"+sd)+"</p>";
    if(g>1)h+="<p>Simplified by dividing both by "+g+".</p>";
    if(Math.abs(sn)>sd&&sd!==1)h+="<p>Mixed number: <b>"+Math.trunc(sn/sd)+" "+Math.abs(sn%sd)+"/"+sd+"</b></p>";
    h+="<p>Decimal: <b>"+nf(sn/sd,6)+"</b></p>";
    out.innerHTML=h}
  ["fa","fb","fc","fd"].forEach(function(x){$(x).addEventListener("input",go)});$("fop").addEventListener("change",go);go()}});

/* Percent helper */
TOOLS.push({id:"pct",icon:"%",name:"Percent helper",desc:"Of, change, discounts",
html:function(){
  function inp(id,l,ph){return '<input id="'+id+'" type="number" step="any" inputmode="decimal" aria-label="'+l+'" placeholder="'+(ph||"")+'">'}
  return '<p class="hint">Fill in the boxes and the answer appears.</p>'+
  '<div class="trow">What is '+inp("p1a","percent","25")+' % of '+inp("p1b","number","80")+' ? <b class="ans2" id="p1o">…</b></div>'+
  '<div class="trow">'+inp("p2a","part","20")+' is what % of '+inp("p2b","whole","80")+' ? <b class="ans2" id="p2o">…</b></div>'+
  '<div class="trow">% change from '+inp("p3a","old value","50")+' to '+inp("p3b","new value","65")+' : <b class="ans2" id="p3o">…</b></div>'+
  '<div class="trow">Price '+inp("p4a","price","500")+' with '+inp("p4b","discount percent","20")+' % off, you pay: <b class="ans2" id="p4o">…</b></div>'},
init:function(){
  function set(id,t){$(id).textContent=t}
  function go(){
    var a=val("p1a"),b=val("p1b");set("p1o",a===null||b===null?"…":nf(a*b/100,4));
    a=val("p2a");b=val("p2b");set("p2o",a===null||b===null?"…":b===0?"can’t divide by 0":nf(a/b*100,2)+"%");
    a=val("p3a");b=val("p3b");
    if(a===null||b===null)set("p3o","…");else if(a===0)set("p3o","old value can’t be 0");else{var c=(b-a)/a*100;set("p3o",(c>0?"+":"")+nf(c,2)+"% "+(c>0?"(increase)":c<0?"(decrease)":"(no change)"))}
    a=val("p4a");b=val("p4b");set("p4o",a===null||b===null?"…":nf(a*(1-b/100),2)+" (saves "+nf(a*b/100,2)+")")}
  ["p1a","p1b","p2a","p2b","p3a","p3b","p4a","p4b"].forEach(function(x){$(x).addEventListener("input",go)});go()}});

/* Number lab */
TOOLS.push({id:"lab",icon:"🔬",name:"Number lab",desc:"Primes, factors, GCD, LCM",
html:function(){return '<p class="hint">Type a whole number (up to 1,000,000,000,000). Add a second number to find the GCD and LCM.</p>'+
 '<div class="trow"><input id="ln" type="number" min="1" inputmode="numeric" aria-label="Number" placeholder="360"> <input id="lm" type="number" min="1" inputmode="numeric" aria-label="Second number (optional)" placeholder="second number (optional)"></div><div class="tout" id="lout">Type a number to begin.</div>'},
init:function(){
  function factorize(n){var f=[],p=2,c;while(p*p<=n){c=0;while(n%p===0){n/=p;c++}if(c)f.push([p,c]);p+=p===2?1:2}if(n>1)f.push([n,1]);return f}
  function divisors(n){var lo=[],hi=[];for(var i=1;i*i<=n;i++)if(n%i===0){lo.push(i);if(i!==n/i)hi.push(n/i)}return lo.concat(hi.reverse())}
  function ok(x){return isInt(x)&&x>=1&&x<=1e12}
  function go(){
    var n=val("ln"),m=val("lm"),out=$("lout");
    if(n===null){out.textContent="Type a number to begin.";return}
    if(!ok(n)){out.textContent="Use a whole number from 1 to 1,000,000,000,000.";return}
    var f=factorize(n),isP=n>1&&f.length===1&&f[0][1]===1,h="";
    h+="<p><b>"+n.toLocaleString()+"</b> is "+(n%2===0?"even":"odd")+(isP?" and <b>prime</b>.":n===1?" (1 is neither prime nor composite).":" and <b>composite</b>.")+"</p>";
    if(n>1)h+="<p>Prime factors: <b>"+f.map(function(p){return p[0]+(p[1]>1?"<sup>"+p[1]+"</sup>":"")}).join(" × ")+"</b></p>";
    var dv=divisors(n);h+="<p>Factors ("+dv.length+"): "+(dv.length>60?dv.slice(0,60).join(", ")+"…":dv.join(", "))+"</p>";
    var s=Math.sqrt(n);h+="<p>"+(isInt(s)?"Perfect square: √"+n+" = "+s:"Not a perfect square: √"+n+" ≈ "+nf(s,4))+"</p>";
    if(m!==null){
      if(!ok(m))h+="<p>The second number must be a whole number from 1 to 1,000,000,000,000.</p>";
      else{var g=gcd(n,m),l=n/g*m;h+="<hr><p>GCD("+n+", "+m+") = <b>"+g+"</b></p><p>LCM("+n+", "+m+") = <b>"+(l>9e15?"too big to show":l.toLocaleString())+"</b></p>"}}
    out.innerHTML=h}
  $("ln").addEventListener("input",go);$("lm").addEventListener("input",go);go()}});

/* Unit converter */
var UNITS={
 "Length":[["mm",.001],["cm",.01],["m",1],["km",1000],["in",.0254],["ft",.3048],["yd",.9144],["mi",1609.344]],
 "Mass":[["mg",1e-6],["g",.001],["kg",1],["lb",.45359237],["oz",.028349523125]],
 "Volume":[["mL",.001],["L",1],["tsp",.00492892159375],["tbsp",.01478676478125],["cup",.2365882365],["gal (US)",3.785411784]],
 "Area":[["cm²",1e-4],["m²",1],["ha",1e4],["km²",1e6],["ft²",.09290304],["acre",4046.8564224]],
 "Time":[["sec",1],["min",60],["hour",3600],["day",86400],["week",604800]],
 "Speed":[["m/s",1],["km/h",1/3.6],["mph",.44704]],
 "Temperature":[["°C"],["°F"],["K"]]};
TOOLS.push({id:"unit",icon:"📏",name:"Unit converter",desc:"Length, mass, temperature…",
html:function(){return '<div class="trow"><select id="uc" aria-label="Type of unit"></select></div><div class="trow"><input id="uv" type="number" step="any" inputmode="decimal" value="1" aria-label="Value"> <select id="uf" aria-label="From"></select> <button class="quit" id="us" aria-label="Swap units">⇄</button> <select id="ut" aria-label="To"></select></div><div class="tout" id="uo"></div>'},
init:function(){
  var cats=Object.keys(UNITS),uc=$("uc");
  cats.forEach(function(c){var o=document.createElement("option");o.textContent=c;uc.appendChild(o)});
  function fill(){var list=UNITS[uc.value];["uf","ut"].forEach(function(id,k){var s=$(id);s.innerHTML="";list.forEach(function(u,i){var o=document.createElement("option");o.value=i;o.textContent=u[0];s.appendChild(o)});s.value=Math.min(list.length-1,k?Math.min(list.length-1,2):0)});go()}
  function temp(v,f,t){var c=f===0?v:f===1?(v-32)*5/9:v-273.15;return t===0?c:t===1?c*9/5+32:c+273.15}
  function go(){
    var v=val("uv"),list=UNITS[uc.value],f=+$("uf").value,t=+$("ut").value,out=$("uo");
    if(v===null){out.textContent="Type a value.";return}
    var res=uc.value==="Temperature"?temp(v,f,t):v*list[f][1]/list[t][1];
    out.innerHTML="<p class='big2'>"+nf(v,6)+" "+esc(list[f][0])+" = "+(+res.toPrecision(8))+" "+esc(list[t][0])+"</p>"}
  uc.addEventListener("change",fill);["uv","uf","ut"].forEach(function(x){$(x).addEventListener("input",go);$(x).addEventListener("change",go)});
  $("us").onclick=function(){var a=$("uf").value;$("uf").value=$("ut").value;$("ut").value=a;go()};
  fill()}});

/* Equation solver */
TOOLS.push({id:"eq",icon:"📈",name:"Equation solver",desc:"Quadratics with steps",
html:function(){return '<p class="hint">Solve a x² + b x + c = 0. Set a to 0 for a straight-line equation (b x + c = 0).</p><div class="trow"><input id="qa" type="number" step="any" value="1" aria-label="a"> x² + <input id="qb" type="number" step="any" value="-5" aria-label="b"> x + <input id="qc" type="number" step="any" value="6" aria-label="c"> = 0</div><div class="tout" id="qo"></div>'},
init:function(){
  function P(x){return x<0?"("+x+")":String(x)}
  function go(){
    var a=val("qa"),b=val("qb"),c=val("qc"),out=$("qo");
    if(a===null||b===null||c===null){out.textContent="Fill in a, b and c.";return}
    var h="";
    if(a===0){
      if(b===0)h=c===0?"<p>Every value of x works.</p>":"<p>No solution.</p>";
      else h="<p>"+nf(b)+"x + "+nf(c)+" = 0</p><p>x = −c ÷ b = <b>"+nf(-c/b,6)+"</b></p>"}
    else{
      var D=b*b-4*a*c;
      h="<p>Discriminant: D = b² − 4ac = "+P(b)+"² − 4 × "+P(a)+" × "+P(c)+" = <b>"+nf(D,6)+"</b></p>";
      if(D>0){var s=Math.sqrt(D);h+="<p>D is positive, so there are <b>two real roots</b>. Use x = (−b ± √D) ÷ 2a:</p><p class='big2'>x = "+nf((-b+s)/(2*a),4)+" or x = "+nf((-b-s)/(2*a),4)+"</p>"}
      else if(D===0)h+="<p>D is zero, so there is <b>one repeated root</b>:</p><p class='big2'>x = "+nf(-b/(2*a),4)+"</p>";
      else h+="<p>D is negative, so there are <b>no real roots</b>. The complex roots are:</p><p class='big2'>x = "+nf(-b/(2*a),4)+" ± "+nf(Math.sqrt(-D)/(2*Math.abs(a)),4)+"i</p>";
      var vx=-b/(2*a);h+="<p>Vertex (turning point): ("+nf(vx,4)+", "+nf(a*vx*vx+b*vx+c,4)+"). It crosses the y-axis at (0, "+nf(c,4)+").</p>"}
    out.innerHTML=h}
  ["qa","qb","qc"].forEach(function(x){$(x).addEventListener("input",go)});go()}});

/* Formula sheet */
var FORMULAS={
 "Geometry":[["Rectangle area","l × w"],["Rectangle perimeter","2(l + w)"],["Square area / perimeter","s² / 4s"],["Triangle area","½ × base × height"],["Parallelogram area","base × height"],["Trapezoid area","½(a + b) × h"],["Circle circumference","2πr"],["Circle area","πr²"],["Pythagoras (right triangle)","a² + b² = c²"],["Angles in a triangle","add up to 180°"],["Angles in a polygon","(n − 2) × 180°"],["Box volume","l × w × h"],["Cylinder volume","πr²h"],["Cone volume","⅓πr²h"],["Sphere volume","4⁄3 πr³"]],
 "Algebra":[["Quadratic formula","x = (−b ± √(b² − 4ac)) ÷ 2a"],["Square of a sum","(a + b)² = a² + 2ab + b²"],["Square of a difference","(a − b)² = a² − 2ab + b²"],["Difference of squares","a² − b² = (a − b)(a + b)"],["Slope","m = (y₂ − y₁) ÷ (x₂ − x₁)"],["Line","y = mx + b"],["Distance between points","√((x₂ − x₁)² + (y₂ − y₁)²)"],["Midpoint","((x₁ + x₂)÷2, (y₁ + y₂)÷2)"],["Exponent rules","a^m × a^n = a^(m+n); a^m ÷ a^n = a^(m−n); (a^m)^n = a^(mn)"],["Zero and negative powers","a⁰ = 1; a^(−n) = 1 ÷ a^n"],["Arithmetic sequence","nth term = a₁ + (n − 1)d"],["Geometric sequence","nth term = a₁ × r^(n−1)"]],
 "Numbers":[["Order of operations","Brackets, Orders (powers), Division & Multiplication, Addition & Subtraction"],["Divisible by 2","last digit is even"],["Divisible by 3 or 9","digits add up to a multiple of 3 or 9"],["Divisible by 4","last two digits divisible by 4"],["Divisible by 5","ends in 0 or 5"],["Divisible by 6","divisible by 2 and 3"],["Divisible by 10","ends in 0"],["Add fractions","a/b + c/d = (ad + bc) ÷ bd"],["Multiply fractions","a/b × c/d = ac ÷ bd"],["Divide fractions","a/b ÷ c/d = a/b × d/c"],["Mean","sum of values ÷ how many values"],["Median / mode / range","middle value / most common / biggest − smallest"],["Primes up to 50","2 3 5 7 11 13 17 19 23 29 31 37 41 43 47"]],
 "Percent & ratio":[["Part of a whole","part = % ÷ 100 × whole"],["Percent","% = part ÷ whole × 100"],["Percent change","(new − old) ÷ old × 100"],["Price after a discount","price × (1 − discount ÷ 100)"],["Simple interest","I = P × r × t"],["Speed, distance, time","speed = distance ÷ time"],["Proportion","a/b = c/d means a × d = b × c"],["Probability","favourable outcomes ÷ all outcomes"]],
 "Trig":[["Sine","sin θ = opposite ÷ hypotenuse"],["Cosine","cos θ = adjacent ÷ hypotenuse"],["Tangent","tan θ = opposite ÷ adjacent"],["Identity","sin²θ + cos²θ = 1"],["30°","sin ½ · cos √3⁄2 · tan 1⁄√3"],["45°","sin √2⁄2 · cos √2⁄2 · tan 1"],["60°","sin √3⁄2 · cos ½ · tan √3"],["Degrees to radians","radians = degrees × π ÷ 180"]],
 "Calculus":[["Power rule","d/dx xⁿ = n xⁿ⁻¹"],["Product rule","(uv)′ = u′v + uv′"],["Chain rule","d/dx f(g(x)) = f′(g(x)) × g′(x)"],["Trig derivatives","(sin x)′ = cos x; (cos x)′ = −sin x"],["Exponential / log","(eˣ)′ = eˣ; (ln x)′ = 1 ÷ x"],["Power rule for integrals","∫ xⁿ dx = xⁿ⁺¹ ÷ (n + 1) + C"],["Fundamental theorem","∫ from a to b of f(x) dx = F(b) − F(a)"]]};
TOOLS.push({id:"form",icon:"📐",name:"Formula sheet",desc:"Geometry to calculus",
html:function(){return '<div class="chips" id="ftabs"></div><div class="flist" id="flist"></div>'},
init:function(){
  var cats=Object.keys(FORMULAS),sel=S.fTab&&FORMULAS[S.fTab]?S.fTab:cats[0],tabs=$("ftabs");
  function draw(){
    tabs.innerHTML="";
    cats.forEach(function(c){var b=document.createElement("button");b.className="quit tab";b.textContent=c;b.setAttribute("aria-pressed",c===sel);b.onclick=function(){sel=c;S.fTab=c;M.save();draw()};tabs.appendChild(b)});
    $("flist").innerHTML=FORMULAS[sel].map(function(f){return '<div class="frm"><span>'+esc(f[0])+'</span><b>'+esc(f[1])+'</b></div>'}).join("")}
  draw()}});

/* Study timer (keeps running in the background) */
var T={total:25*6e4,left:25*6e4,end:0,iv:null};
function tfmt(ms){var s=Math.ceil(ms/1000);return Math.floor(s/60)+":"+("0"+s%60).slice(-2)}
function studyMin(){return S.study&&S.study.d===M.day()?S.study.min:0}
function tdraw(){
  var el=$("tm");if(!el)return;
  el.textContent=tfmt(T.left);
  $("tgo").textContent=T.iv?"Pause":(T.left<T.total?"Resume":"Start");
  $("tlog").textContent="Focus time finished today: "+studyMin()+" min"}
function tstop(){clearInterval(T.iv);T.iv=null}
function ttick(){
  T.left=Math.max(0,T.end-Date.now());
  if(T.left<=0){
    tstop();var mins=Math.round(T.total/6e4);
    if(mins>=5){if(!S.study||S.study.d!==M.day())S.study={d:M.day(),min:0};S.study.min+=mins;M.save()}
    T.left=T.total;toast("⏰ Time’s up! Take a short break, then come back.");
    M.beep(880);setTimeout(function(){M.beep(660)},250);setTimeout(function(){M.beep(880)},500);M.buzz([200,100,200])}
  tdraw()}
TOOLS.push({id:"timer",icon:"⏱️",name:"Study timer",desc:"Focus sessions with breaks",
html:function(){return '<p class="hint">Work hard for one session, then rest. The timer keeps running if you close this window.</p><div class="calc-display" id="tm">25:00</div><div class="chips" id="tpre"></div><div class="trow"><button class="quit" id="tgo">Start</button> <button class="quit" id="trs">Reset</button></div><p class="hint" id="tlog"></p>'},
init:function(){
  [5,15,25,45].forEach(function(m){var b=document.createElement("button");b.className="quit tab";b.textContent=m+" min";b.onclick=function(){tstop();T.total=T.left=m*6e4;tdraw()};$("tpre").appendChild(b)});
  $("tgo").onclick=function(){if(T.iv){tstop();tdraw();return}T.end=Date.now()+T.left;T.iv=setInterval(ttick,250);tdraw()};
  $("trs").onclick=function(){tstop();T.left=T.total;tdraw()};
  tdraw()}});

/* Worksheet maker */
TOOLS.push({id:"ws",icon:"🖨️",name:"Worksheet maker",desc:"Print practice + answer key",
html:function(){return '<p class="hint">Make a printable practice sheet. It uses the grade and tables you picked on the home page. Choose “Save as PDF” in the print window to share it.</p>'+
 '<div class="trow"><label>Challenge <select id="wsCh"></select></label></div>'+
 '<div class="trow"><label>Questions <select id="wsN"><option>10</option><option selected>20</option><option>30</option><option>40</option></select></label></div>'+
 '<div class="trow"><label class="chk"><input type="checkbox" id="wsKey" checked> Add an answer key on a separate page</label></div>'+
 '<button class="mode" id="wsGo"><b>Make worksheet</b><span>Opens the print window</span></button>'},
init:function(){
  var sel=$("wsCh");
  M.CH.forEach(function(c){var o=document.createElement("option");o.value=c.id;o.textContent=c.n;if(c.id===S.ch)o.selected=true;sel.appendChild(o)});
  $("wsGo").onclick=function(){
    var id=sel.value,n=+$("wsN").value,key=$("wsKey").checked,seen={},qs=[],tries=0,q;
    var name=M.CH.filter(function(c){return c.id===id})[0].n;
    while(qs.length<n&&tries<n*40){tries++;q=M.gen(id);if(seen[q.t])continue;seen[q.t]=1;qs.push(q)}
    while(qs.length<n)qs.push(M.gen(id));
    var h='<div class="ws"><div class="ws-head"><h1>Mathescent Worksheet</h1><div>'+esc(name)+' · '+n+' questions</div></div>'+
      '<div class="ws-meta"><span>Name: ______________________</span><span>Date: ____________</span><span>Score: ____ / '+n+'</span></div><ol class="ws-list">'+
      qs.map(function(q){return '<li><span class="wq">'+esc(q.t)+(/=/.test(q.t)||q.t.length>32?"":" =")+'</span><span class="wl"></span></li>'}).join("")+'</ol></div>';
    if(key)h+='<div class="ws ws-key"><div class="ws-head"><h1>Answer key</h1><div>'+esc(name)+'</div></div><ol class="ws-keylist">'+qs.map(function(q){return '<li>'+esc(q.a)+'</li>'}).join("")+'</ol></div>';
    $("printArea").innerHTML=h;closeTool();setTimeout(function(){window.print()},150)}}});

/* Backup + settings */
var deferredInstall=null;
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();deferredInstall=e});
TOOLS.push({id:"set",icon:"💾",name:"Backup & settings",desc:"Save progress, nickname",
html:function(){return '<div class="trow"><label>Nickname (used when you share a score)<br><input id="nick" maxlength="20" placeholder="optional" autocomplete="off"></label></div>'+
 '<h3>Back up your progress</h3><p class="hint">Your coins, badges and stats live on this device only. Copy a backup code to move them to another phone or computer.</p>'+
 '<div class="trow"><button class="quit" id="bkCopy">Copy backup code</button></div>'+
 '<div class="trow"><textarea id="bkText" rows="3" placeholder="Paste a backup code here" aria-label="Backup code"></textarea></div>'+
 '<div class="trow"><button class="quit" id="bkRestore">Restore from code</button> <button class="quit danger" id="bkReset">Reset everything</button></div>'+
 '<h3>Use it like an app</h3><p class="hint">Android Chrome: menu ⋮ → Add to Home screen. iPhone Safari: Share → Add to Home Screen. After the first visit it also works offline.</p>'+
 '<div class="trow"><button class="quit hidden" id="instBtn">Install app</button></div>'},
init:function(){
  $("nick").value=S.nick||"";
  $("nick").addEventListener("input",function(){S.nick=this.value.trim().slice(0,20);M.save()});
  $("bkCopy").onclick=function(){
    try{copy("MXB1:"+btoa(unescape(encodeURIComponent(JSON.stringify(S)))),"Backup code copied. Keep it somewhere safe.")}catch(e){toast("Couldn’t make a backup code.")}};
  $("bkRestore").onclick=function(){
    var t=$("bkText").value.trim();
    try{
      if(t.indexOf("MXB1:")!==0)throw 0;
      var o=JSON.parse(decodeURIComponent(escape(atob(t.slice(5)))));
      if(!o||typeof o!=="object"||typeof o.coins!=="number"||!o.stats||typeof o.stats!=="object")throw 0;
      if(!confirm("Replace the progress on this device with the backup? This can’t be undone."))return;
      Object.keys(S).forEach(function(k){delete S[k]});Object.assign(S,o);M.save();location.reload()
    }catch(e){toast("That backup code doesn’t look right. Copy it again and paste the whole thing.")}};
  $("bkReset").onclick=function(){
    if(confirm("Erase ALL coins, stats and badges on this device? This can’t be undone.")){try{localStorage.removeItem("mathescent")}catch(e){}location.reload()}};
  if(deferredInstall){var ib=$("instBtn");ib.classList.remove("hidden");ib.onclick=function(){deferredInstall.prompt();deferredInstall=null;ib.classList.add("hidden")}}}});

/* ---------- toolbox grid ---------- */
(function(){
  var box=$("tools");if(!box)return;
  TOOLS.forEach(function(t){
    var b=document.createElement("button");b.className="tool-card";
    b.innerHTML='<span class="tool-icon">'+t.icon+'</span><b>'+esc(t.name)+'</b><small>'+esc(t.desc)+'</small>';
    b.onclick=function(){openTool(t,b)};box.appendChild(b)});
  $("modalX").onclick=closeTool;
  $("modal").addEventListener("click",function(e){if(e.target===$("modal"))closeTool()});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&current)closeTool()});
})();

M.openTool=openTool;M.toast=toast;M.copy=copy;

/* ---------- campus challenges (daily + codes) ---------- */
function dailyOpt(){var d=M.day();return{ch:"mix",sel:M.rng(2,12),max:12,len:60,seed:(d*2654435761)>>>0,daily:true,code:"daily",label:"Daily"}}
function parseCode(s){
  var m=String(s).trim().toLowerCase().match(/^([a-z]+)-(\d{1,2})-(\d{2,3})-(\d{1,9})$/);if(!m)return null;
  var ch=M.CH.filter(function(c){return c.id===m[1]})[0];if(!ch)return null;
  var max=+m[2],len=+m[3];if(max<2||max>50)return null;
  if(!M.LENS.some(function(l){return l[0]===len}))return null;
  return{ch:ch.id,sel:M.rng(2,max),max:max,len:len,seed:+m[4],code:m[0],label:"Code "+m[4]}}
function newCode(){return S.ch+"-"+S.max+"-"+S.len+"-"+(1000+Math.floor(Math.random()*98999))}
function refreshCampus(){
  var s=$("dailySub");if(!s)return;
  s.textContent=S.dly&&S.dly.d===M.day()?"Done today: "+S.dly.s+"/"+S.dly.a+". Play again to beat it.":"Same 60-second mixed round for everyone today · +10 coins"}
if($("dailyBtn")){
  $("dailyBtn").onclick=function(){M.start("gig",null,dailyOpt())};
  $("codeMake").onclick=function(){var c=newCode();$("codeIn").value=c;copy(c,"Code "+c+" copied. Send it to friends, then press Play code too.");$("codeMsg").textContent="Everyone who plays "+c+" gets the exact same questions."};
  function playCode(){var o=parseCode($("codeIn").value);if(!o){$("codeMsg").textContent="That code doesn’t look right. It should look like mix-12-60-48213.";return}M.start("gig",null,o)}
  $("codePlay").onclick=playCode;
  $("codeIn").addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();e.stopPropagation();playCode()}});
  refreshCampus();
  if(window.MutationObserver)new MutationObserver(refreshCampus).observe($("home"),{attributes:true,attributeFilter:["class"]})}

/* ---------- end-of-round sharing ---------- */
M.onEnd=function(g){
  var box=$("endExtra");if(!box)return;box.innerHTML="";if(!g.asked)return;
  var chId=g.opt?g.opt.ch:S.ch,nm=M.CH.filter(function(c){return c.id===chId})[0].n;
  var url=/^https?:/.test(location.protocol)?location.href.split("#")[0].split("?")[0]:"";
  var who=S.nick?S.nick+" scored":"I scored";
  var what=g.opt&&g.opt.daily?"the Daily Challenge":nm+" "+(g.mode==="gig"?"Blitz":"Practice");
  var text=who+" "+g.score+"/"+g.asked+" on Mathescent ("+what+")."+(g.opt&&!g.opt.daily?" Beat me with code "+g.opt.code+".":"")+(url?" "+url:"");
  var b=document.createElement("button");b.className="quit";b.textContent="📋 Copy my result";b.onclick=function(){copy(text,"Result copied. Paste it in your group chat!")};box.appendChild(b);
  if(g.mode==="gig"&&!g.opt){
    var c=document.createElement("button");c.className="quit";c.textContent="🤝 Challenge a friend";
    c.onclick=function(){var code=newCode();copy(code,"Code "+code+" copied. Play it yourself too so you both get the same questions.")};box.appendChild(c)}
  refreshCampus()};

/* ---------- offline / install ---------- */
if("serviceWorker" in navigator&&/^https?:$/.test(location.protocol))navigator.serviceWorker.register("sw.js").catch(function(){});
})();