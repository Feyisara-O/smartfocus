/* ==============================
   SMARTFOCUS FINAL
============================== */

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let activeTaskId = null;
let timer = null;
let seconds = 0;
let soundEnabled = true;
let isRunning = false;

/* DOM */
const taskList = document.getElementById("taskList");
const timerEl = document.getElementById("timer");
const focusTaskEl = document.getElementById("focusTask");
const reportEl = document.getElementById("reportText");

const topScoreEl = document.getElementById("topScore");
const avgScoreEl = document.getElementById("avgScore");
const taskCountEl = document.getElementById("taskCount");
const doneCountEl = document.getElementById("doneCount");
const remainingCountEl = document.getElementById("remainingCount");

const popSound = document.getElementById("popSound");
const clickSound = document.getElementById("clickSound");
const soundToggle = document.getElementById("soundToggle");

const startBtn = document.getElementById("startFocus");
const pauseBtn = document.getElementById("pauseFocus");
const stopBtn = document.getElementById("stopFocus");

/* -----------------------------
   SOUND TOGGLE
------------------------------ */
soundToggle.addEventListener("change", () => {
  soundEnabled = soundToggle.checked;
});

function playSound(audio) {
  if (!soundEnabled) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

/* -----------------------------
   LOCAL STORAGE
------------------------------ */
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* -----------------------------
   SCORE CALCULATION
------------------------------ */
function calculateScore(u, i) {
  return Math.round((u / 10) * 50 + (i / 10) * 50);
}

/* -----------------------------
   INSIGHT SYSTEM
------------------------------ */
function updateInsight() {
  if (!tasks.length) {
    reportEl.textContent = "Add a task to begin.";
    return;
  }
  const highest = tasks.reduce((max,t)=> t.score>max.score ? t : max, tasks[0]);
  const remaining = tasks.filter(t=>!t.completed).length;

  if (remaining > 5) reportEl.textContent = "🧠 Too many tasks. Focus on completing one.";
  else if (activeTaskId && highest.id !== activeTaskId) reportEl.textContent = `⚠️ You are ignoring: "${highest.title}"`;
  else if (activeTaskId) reportEl.textContent = "🔥 You're working on a high-value task.";
  else reportEl.textContent = "Pick a task and start focusing.";
}

/* -----------------------------
   ADD TASK
------------------------------ */
document.getElementById("addTaskBtn").onclick = () => {
  const title = document.getElementById("taskInput").value.trim();
  if (!title) return;

  const urgency = +document.getElementById("urgency").value;
  const impact = +document.getElementById("impact").value;

  tasks.push({
    id: Date.now(),
    title,
    urgency,
    impact,
    category: document.getElementById("category").value,
    score: calculateScore(urgency, impact),
    completed: false,
    timeSpent: 0 // stored in seconds
  });

  save();
  render();
  playSound(clickSound);
};

/* -----------------------------
   RENDER TASKS
------------------------------ */
function formatTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return (h>0?(h<10?"0":"")+h+":":"")+(m<10?"0":"")+m+":"+(s<10?"0":"")+s;
}

function render() {
  taskList.innerHTML = "";

  const sorted = [...tasks].sort((a,b)=>{
    if(a.completed !== b.completed) return a.completed - b.completed;
    return b.score - a.score;
  });

  sorted.forEach(task=>{
    const li = document.createElement("li");
    li.className = "task-item";

    li.innerHTML = `
      <div>
        <input type="checkbox" data-id="${task.id}" ${task.completed ? "checked":""}>
        <span class="${task.completed?"done":""}">
          ${task.title} (${task.category}) - ${formatTime(task.timeSpent)}
        </span>
      </div>
      <div>
        <strong>${task.score}</strong>
        <button data-delete="${task.id}">✕</button>
      </div>
    `;

    li.onclick = (e)=>{
      if(e.target.tagName==="INPUT"||e.target.tagName==="BUTTON") return;
      activeTaskId = task.id;
      focusTaskEl.textContent = task.title;
      updateInsight();
    };

    taskList.appendChild(li);
  });

  updateStats();
  drawChart();
  updateInsight();
}

/* -----------------------------
   UPDATE STATS
------------------------------ */
function updateStats() {
  const total = tasks.length;
  taskCountEl.textContent = total;

  if(!total){
    topScoreEl.textContent=0;
    avgScoreEl.textContent=0;
    doneCountEl.textContent=0;
    remainingCountEl.textContent=0;
    return;
  }

  topScoreEl.textContent = Math.max(...tasks.map(t=>t.score));
  avgScoreEl.textContent = Math.round(tasks.reduce((s,t)=>s+t.score,0)/total);

  const done = tasks.filter(t=>t.completed).length;
  doneCountEl.textContent = done;
  remainingCountEl.textContent = total - done;
}

/* -----------------------------
   COMPLETE / DELETE TASK
------------------------------ */
taskList.addEventListener("change", e=>{
  if(e.target.type==="checkbox"){
    const id = +e.target.dataset.id;
    tasks = tasks.map(t=>t.id===id ? {...t, completed:e.target.checked}:t);
    save();

    if(e.target.checked){
      playSound(popSound);
      confettiFromCheckbox(e.target);
    }

    render();
  }
});

taskList.addEventListener("click", e=>{
  if(e.target.dataset.delete){
    tasks = tasks.filter(t=>t.id != e.target.dataset.delete);
    save();
    render();
    playSound(clickSound);
  }
});

/* -----------------------------
   TIMER UTILS
------------------------------ */
function updateTimer(){
  seconds++;
  timerEl.textContent = formatTime(seconds);
}

/* -----------------------------
   TIMER BUTTONS
------------------------------ */
startBtn.onclick = () => {
  if (!activeTaskId || isRunning) return;
  seconds = 0;
  timer = setInterval(updateTimer, 1000);
  isRunning = true;
  pauseBtn.textContent = "Pause";
  updateInsight();
};

pauseBtn.onclick = () => {
  if (!activeTaskId) return;
  if (isRunning) {
    clearInterval(timer);
    timer = null;
    isRunning = false;
    pauseBtn.textContent = "Resume";
  } else {
    timer = setInterval(updateTimer, 1000);
    isRunning = true;
    pauseBtn.textContent = "Pause";
  }
};

stopBtn.onclick = () => {
  clearInterval(timer);
  timer = null;
  isRunning = false;

  const task = tasks.find(t=>t.id===activeTaskId);
  if(task) task.timeSpent += seconds;

  seconds=0;
  timerEl.textContent="00:00";

  save();
  render();
};

/* -----------------------------
   PIE CHART
------------------------------ */
function drawChart(){
  const svg = document.getElementById("chart");
  svg.innerHTML = "";

  const categoryTime = {};
  tasks.forEach(t=>{
    categoryTime[t.category]=(categoryTime[t.category]||0)+t.timeSpent;
  });

  const total = Object.values(categoryTime).reduce((a,b)=>a+b,0);
  if(!total) return;

  let start = 0;
  const colors = ["#00E5BC","#30d158","#ffd60a","#ff453a","#ff9f0a"];

  Object.entries(categoryTime).forEach(([cat,time],i)=>{
    const angle = (time/total)*2*Math.PI;
    const end = start + angle;

    const x1 = 150 + 100*Math.cos(start);
    const y1 = 150 + 100*Math.sin(start);
    const x2 = 150 + 100*Math.cos(end);
    const y2 = 150 + 100*Math.sin(end);

    const path = document.createElementNS("http://www.w3.org/2000/svg","path");
    path.setAttribute("d",`M150,150 L${x1},${y1} A100,100 0 ${angle>Math.PI?1:0},1 ${x2},${y2} Z`);
    path.setAttribute("fill",colors[i%colors.length]);
    svg.appendChild(path);

    const mid = start + angle/2;
    const tx = 150 + 60*Math.cos(mid);
    const ty = 150 + 60*Math.sin(mid);

    const text = document.createElementNS("http://www.w3.org/2000/svg","text");
    text.setAttribute("x",tx);
    text.setAttribute("y",ty);
    text.setAttribute("fill","#fff");
    text.setAttribute("font-size","10");
    text.setAttribute("text-anchor","middle");
    text.textContent = cat;
    svg.appendChild(text);

    start = end;
  });
}

/* -----------------------------
   CONFETTI
------------------------------ */
function confettiFromCheckbox(el){
  const rect = el.getBoundingClientRect();
  for(let i=0;i<30;i++){
    const d=document.createElement("div");
    d.style.position="fixed";
    d.style.width="6px";
    d.style.height="6px";
    d.style.background=["#00E5BC","#30d158","#ffd60a","#ff453a"][Math.floor(Math.random()*4)];
    d.style.top=rect.top + "px";
    d.style.left=rect.left + "px";
    d.style.animation="fall 2s linear";
    document.body.appendChild(d);
    setTimeout(()=>d.remove(),2000);
  }
}

/* -----------------------------
   INIT
------------------------------ */
render();