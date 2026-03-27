/* ==============================
   SMARTFOCUS FINAL (INTELLIGENT INSIGHT)
============================== */

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let activeTaskId = null;
let timer = null;
let seconds = 0;
let soundEnabled = true;

/* DOM ELEMENTS */
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

/* -----------------------------
   SOUND TOGGLE
------------------------------ */
soundToggle.addEventListener("change", () => {
  soundEnabled = soundToggle.checked;
});

/* -----------------------------
   SAVE TASKS
------------------------------ */
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* -----------------------------
   CALCULATE TASK SCORE
------------------------------ */
function calculateScore(u, i) {
  return Math.round((u / 10) * 50 + (i / 10) * 50);
}

/* -----------------------------
   INTELLIGENT INSIGHT
------------------------------ */
function updateInsight() {
  if (!tasks.length) {
    reportEl.textContent = "Add a task to begin.";
    return;
  }

  const remainingTasks = tasks.filter(t => !t.completed);
  if (!remainingTasks.length) {
    reportEl.textContent = "All tasks completed! 🎉";
    return;
  }

  const highest = remainingTasks.reduce((max, t) => t.score > max.score ? t : max, remainingTasks[0]);
  const activeTask = tasks.find(t => t.id === activeTaskId);

  if (activeTask) {
    if (activeTask.score < highest.score) {
      reportEl.textContent = `⚠️ You're working on "${activeTask.title}" while ignoring higher-value task "${highest.title}"`;
    } else {
      reportEl.textContent = `🔥 Good job! You're focusing on high-value task "${activeTask.title}"`;
    }
  } else {
    reportEl.textContent = "Pick a task and start focusing.";
  }
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
    timeSpent: 0
  });

  save();
  render();

  if (soundEnabled) {
    clickSound.currentTime = 0;
    clickSound.play();
  }
};

/* -----------------------------
   RENDER TASKS
------------------------------ */
function render() {
  taskList.innerHTML = "";

  const sorted = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed - b.completed;
    return b.score - a.score;
  });

  sorted.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";

    li.innerHTML = `
      <div>
        <input type="checkbox" data-id="${task.id}" ${task.completed ? "checked":""}>
        <span class="${task.completed?"done":""}">
          ${task.title} (${task.category}) - ${task.timeSpent}s
        </span>
      </div>
      <div>
        <strong>${task.score}</strong>
        <button data-delete="${task.id}">✕</button>
      </div>
    `;

    li.onclick = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;
      activeTaskId = task.id;
      focusTaskEl.textContent = task.title;
      updateInsight(); // Real-time update
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

  if (!total) {
    topScoreEl.textContent = 0;
    avgScoreEl.textContent = 0;
    doneCountEl.textContent = 0;
    remainingCountEl.textContent = 0;
    return;
  }

  topScoreEl.textContent = Math.max(...tasks.map(t => t.score));
  avgScoreEl.textContent = Math.round(tasks.reduce((s, t) => s + t.score, 0) / total);

  const done = tasks.filter(t => t.completed).length;
  doneCountEl.textContent = done;
  remainingCountEl.textContent = total - done;
}

/* -----------------------------
   COMPLETE / DELETE TASK
------------------------------ */
taskList.addEventListener("change", e => {
  if (e.target.type === "checkbox") {
    const id = +e.target.dataset.id;
    tasks = tasks.map(t => t.id === id ? { ...t, completed: e.target.checked } : t);
    save();

    if (e.target.checked) {
      confetti(e.target); // Confetti from checkbox
      if (soundEnabled) {
        popSound.currentTime = 0;
        popSound.play();
      }
    }

    updateInsight();
    render();
  }
});

taskList.addEventListener("click", e => {
  const deleteBtn = e.target.closest("[data-delete]");
  if (!deleteBtn) return;

  const id = +deleteBtn.dataset.delete;
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();

  if (soundEnabled) {
    clickSound.currentTime = 0;
    clickSound.play();
  }
});

/* -----------------------------
   TIMER
------------------------------ */
function updateTimer() {
  seconds++;
  timerEl.textContent = seconds + "s";
}

document.getElementById("startFocus").onclick = () => {
  if (!activeTaskId || timer) return;
  seconds = 0;
  timer = setInterval(updateTimer, 1000);
  updateInsight();
};

document.getElementById("pauseFocus").onclick = () => {
  clearInterval(timer);
  timer = null;
};

document.getElementById("resumeFocus").onclick = () => {
  if (timer) return;
  timer = setInterval(updateTimer, 1000);
};

document.getElementById("stopFocus").onclick = () => {
  clearInterval(timer);
  timer = null;

  const task = tasks.find(t => t.id === activeTaskId);
  if (task) task.timeSpent += seconds;

  seconds = 0;
  timerEl.textContent = "00:00";

  save();
  render();
};

/* -----------------------------
   PIE CHART
------------------------------ */
function drawChart() {
  const svg = document.getElementById("chart");
  svg.innerHTML = "";

  const categoryTime = {};
  tasks.forEach(t => {
    categoryTime[t.category] = (categoryTime[t.category] || 0) + t.timeSpent;
  });

  const total = Object.values(categoryTime).reduce((a, b) => a + b, 0);
  if (!total) return;

  let start = 0;
  const colors = ["#00E5BC","#30d158","#ffd60a","#ff453a","#ff9f0a"];

  Object.entries(categoryTime).forEach(([cat, time], i) => {
    const angle = (time / total) * 2 * Math.PI;
    const end = start + angle;

    const x1 = 150 + 100 * Math.cos(start);
    const y1 = 150 + 100 * Math.sin(start);
    const x2 = 150 + 100 * Math.cos(end);
    const y2 = 150 + 100 * Math.sin(end);

    const path = document.createElementNS("http://www.w3.org/2000/svg","path");
    path.setAttribute("d",`M150,150 L${x1},${y1} A100,100 0 ${angle>Math.PI?1:0},1 ${x2},${y2} Z`);
    path.setAttribute("fill", colors[i % colors.length]);
    svg.appendChild(path);

    const mid = start + angle / 2;
    const tx = 150 + 60 * Math.cos(mid);
    const ty = 150 + 60 * Math.sin(mid);

    const text = document.createElementNS("http://www.w3.org/2000/svg","text");
    text.setAttribute("x", tx);
    text.setAttribute("y", ty);
    text.setAttribute("fill", "#fff");
    text.setAttribute("font-size", "10");
    text.setAttribute("text-anchor", "middle");
    text.textContent = cat;
    svg.appendChild(text);

    start = end;
  });
}

/* -----------------------------
   CONFETTI FROM CHECKBOX
------------------------------ */
function confetti(source) {
  const rect = source.getBoundingClientRect();
  for (let i = 0; i < 30; i++) {
    const d = document.createElement("div");
    d.style.position = "fixed";
    d.style.width = "6px";
    d.style.height = "6px";
    d.style.background = ["#00E5BC","#30d158","#ffd60a","#ff453a"][Math.floor(Math.random()*4)];
    d.style.top = rect.top + "px";
    d.style.left = (rect.left + rect.width/2) + "px";
    d.style.animation = "fall 2s linear";
    document.body.appendChild(d);
    setTimeout(()=>d.remove(),2000);
  }
}

/* -----------------------------
   INIT
------------------------------ */
render();