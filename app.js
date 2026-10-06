const state = {
  buildings: [],
  edges: [],
  mst: [],
  positions: []
};

const $ = id => document.getElementById(id);
const buildingInput = $("buildingInput"), fromSelect = $("fromSelect"), toSelect = $("toSelect"), costInput = $("costInput");

function showMessage(msg, ok=false) {
  const el = $("message"); el.textContent = msg; el.style.color = ok ? "#55e6b5" : "#ff6f91";
}
function addBuilding(name) {
  name = name.trim();
  if (!name) return showMessage("Enter a building name.");
  if (state.buildings.some(b => b.toLowerCase() === name.toLowerCase())) return showMessage("That building already exists.");
  if (state.buildings.length >= 12) return showMessage("Maximum 12 buildings for a clean visual layout.");
  state.buildings.push(name); buildingInput.value = ""; state.mst = [];
  renderAll(); showMessage(`${name} added.`, true);
}
function addEdge() {
  const a = +fromSelect.value, b = +toSelect.value, cost = +costInput.value;
  if (a === b || Number.isNaN(a) || Number.isNaN(b)) return showMessage("Choose two different buildings.");
  if (!cost || cost < 1) return showMessage("Enter a positive connection cost.");
  const exists = state.edges.some(e => (e.a===a&&e.b===b)||(e.a===b&&e.b===a));
  if (exists) return showMessage("That connection already exists.");
  state.edges.push({a,b,cost}); costInput.value=""; state.mst=[]; renderAll(); showMessage("Connection added.", true);
}
function removeBuilding(i) {
  state.buildings.splice(i,1);
  state.edges = state.edges.filter(e=>e.a!==i&&e.b!==i).map(e=>({...e,a:e.a>i?e.a-1:e.a,b:e.b>i?e.b-1:e.b}));
  state.mst=[]; renderAll();
}
function removeEdge(i) { state.edges.splice(i,1); state.mst=[]; renderAll(); }

function prim() {
  const n=state.buildings.length;
  if(n<2) return {ok:false,msg:"Add at least 2 buildings."};
  const adj=Array.from({length:n},()=>[]);
  state.edges.forEach((e,i)=>{adj[e.a].push({...e,to:e.b,index:i});adj[e.b].push({...e,to:e.a,index:i});});
  const visited=Array(n).fill(false), dist=Array(n).fill(Infinity), parent=Array(n).fill(-1), parentEdge=Array(n).fill(-1);
  dist[0]=0; const result=[];
  for(let k=0;k<n;k++){
    let u=-1,best=Infinity;
    for(let i=0;i<n;i++) if(!visited[i]&&dist[i]<best){best=dist[i];u=i;}
    if(u===-1) return {ok:false,msg:"Network is disconnected. Add connections so every building can be reached."};
    visited[u]=true;
    if(parentEdge[u]!==-1) result.push(parentEdge[u]);
    adj[u].forEach(e=>{if(!visited[e.to]&&e.cost<dist[e.to]){dist[e.to]=e.cost;parent[e.to]=u;parentEdge[e.to]=e.index;}});
  }
  return {ok:true, result};
}
function design() {
  const r=prim();
  if(!r.ok){state.mst=[]; renderAll(); showMessage(r.msg); $("resultBadge").textContent="CHECK INPUT"; return;}
  state.mst=r.result; renderAll(); showMessage("Minimum-cost network generated successfully.",true); $("resultBadge").textContent="OPTIMIZED";
}
function loadDemo() {
  state.buildings=["Main Gate","Library","CSE Block","ECE Block","Hostel","Admin Block","Innovation Hub"];
  state.edges=[
    {a:0,b:1,cost:8},{a:0,b:2,cost:14},{a:1,b:2,cost:6},{a:1,b:3,cost:11},
    {a:1,b:5,cost:13},{a:2,b:3,cost:5},{a:2,b:4,cost:12},{a:2,b:6,cost:9},
    {a:3,b:5,cost:7},{a:3,b:6,cost:10},{a:4,b:5,cost:6},{a:4,b:6,cost:8},{a:5,b:6,cost:4}
  ];
  state.mst=[]; renderAll(); design();
}
function reset(){state.buildings=[];state.edges=[];state.mst=[];renderAll();showMessage("");$("resultBadge").textContent="NOT RUN";}
function renderLists(){
  $("buildingList").innerHTML=state.buildings.map((b,i)=>`<div class="list-item"><span>${i+1}. ${escapeHtml(b)}</span><button class="remove" onclick="removeBuilding(${i})">×</button></div>`).join("");
  const opts=state.buildings.map((b,i)=>`<option value="${i}">${escapeHtml(b)}</option>`).join("");
  fromSelect.innerHTML=opts; toSelect.innerHTML=opts;
  $("edgeList").innerHTML=state.edges.map((e,i)=>`<div class="list-item"><span>${escapeHtml(state.buildings[e.a])} → ${escapeHtml(state.buildings[e.b])} <b>${e.cost}</b></span><button class="remove" onclick="removeEdge(${i})">×</button></div>`).join("");
}
function renderStats(){
  $("buildingCount").textContent=state.buildings.length;
  $("edgeCount").textContent=state.edges.length;
  if(!state.mst.length){$("minCost").textContent="—";$("savings").textContent="—";return;}
  const mstCost=state.mst.reduce((s,i)=>s+state.edges[i].cost,0);
  const allCost=state.edges.reduce((s,e)=>s+e.cost,0);
  $("minCost").textContent=mstCost.toLocaleString();
  $("savings").textContent=Math.max(0,allCost-mstCost).toLocaleString();
}
function renderResult(){
  if(!state.mst.length){$("resultTable").className="result-empty";$("resultTable").textContent="Run the optimizer to see the recommended cable plan.";return;}
  $("resultTable").className="";
  let html=`<table class="result-table"><thead><tr><th>#</th><th>FROM</th><th>TO</th><th>COST</th></tr></thead><tbody>`;
  state.mst.forEach((idx,i)=>{const e=state.edges[idx];html+=`<tr><td>${String(i+1).padStart(2,"0")}</td><td>${escapeHtml(state.buildings[e.a])}</td><td>${escapeHtml(state.buildings[e.b])}</td><td class="cost">${e.cost}</td></tr>`});
  html+="</tbody></table>"; $("resultTable").innerHTML=html;
}
function renderGraph(){
  const svg=$("graph"), empty=$("emptyState"); svg.innerHTML="";
  if(!state.buildings.length){empty.style.display="grid";return} empty.style.display="none";
  const n=state.buildings.length, cx=450,cy=255,rx=330,ry=180;
  state.positions=state.buildings.map((_,i)=>{const a=-Math.PI/2+(2*Math.PI*i/n);return{x:cx+rx*Math.cos(a),y:cy+ry*Math.sin(a)}});
  const NS="http://www.w3.org/2000/svg";
  state.edges.forEach((e,idx)=>{
    const p=state.positions[e.a],q=state.positions[e.b], line=document.createElementNS(NS,"line");
    line.setAttribute("x1",p.x);line.setAttribute("y1",p.y);line.setAttribute("x2",q.x);line.setAttribute("y2",q.y);
    line.setAttribute("class","edge-line"+(state.mst.includes(idx)?" mst":""));svg.appendChild(line);
    const t=document.createElementNS(NS,"text"),mx=(p.x+q.x)/2,my=(p.y+q.y)/2;
    t.setAttribute("x",mx);t.setAttribute("y",my-5);t.setAttribute("text-anchor","middle");t.setAttribute("class","edge-label");t.textContent=e.cost;svg.appendChild(t);
  });
  state.positions.forEach((p,i)=>{
    const g=document.createElementNS(NS,"g"), circle=document.createElementNS(NS,"circle"), text=document.createElementNS(NS,"text"), sub=document.createElementNS(NS,"text");
    circle.setAttribute("cx",p.x);circle.setAttribute("cy",p.y);circle.setAttribute("r",29);circle.setAttribute("class","node"+(state.mst.some(idx=>{const e=state.edges[idx];return e.a===i||e.b===i})?" mst":""));g.appendChild(circle);
    text.setAttribute("x",p.x);text.setAttribute("y",p.y-1);text.setAttribute("class","node-text");text.textContent=i+1;g.appendChild(text);
    sub.setAttribute("x",p.x);sub.setAttribute("y",p.y+44);sub.setAttribute("class","node-index");sub.textContent=state.buildings[i].length>18?state.buildings[i].slice(0,17)+"…":state.buildings[i];g.appendChild(sub);svg.appendChild(g);
  });
}
function renderAll(){renderLists();renderStats();renderResult();renderGraph();}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
$("addBuilding").onclick=()=>addBuilding(buildingInput.value);
buildingInput.addEventListener("keydown",e=>{if(e.key==="Enter")addBuilding(buildingInput.value)});
$("addEdge").onclick=addEdge; $("designBtn").onclick=design; $("resetBtn").onclick=reset; $("demoBtn").onclick=loadDemo;
renderAll(); loadDemo();
