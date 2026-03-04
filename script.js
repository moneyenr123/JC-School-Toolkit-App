// ---------------- GPA ----------------
function calcGPA() {
    const grade = parseFloat(document.getElementById("gpa-input").value);
    const out = document.getElementById("gpa-output");

    if (isNaN(grade) || grade < 0 || grade > 100) {
        out.textContent = "Enter a valid number.";
        return;
    }

    let gpa = 0;
    if (grade >= 93) gpa = 4.0;
    else if (grade >= 90) gpa = 3.7;
    else if (grade >= 87) gpa = 3.3;
    else if (grade >= 83) gpa = 3.0;
    else if (grade >= 80) gpa = 2.7;
    else if (grade >= 77) gpa = 2.3;
    else if (grade >= 73) gpa = 2.0;
    else if (grade >= 70) gpa = 1.7;
    else if (grade >= 67) gpa = 1.3;
    else if (grade >= 65) gpa = 1.0;
    else gpa = 0.0;

    out.textContent = "GPA: " + gpa.toFixed(1);
}

// ---------------- Password ----------------
function generatePassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let pass = "";
    for (let i = 0; i < 12; i++) pass += chars[Math.floor(Math.random() * chars.length)];
    document.getElementById("password-output").textContent = pass;
}

// ---------------- Notes ----------------
function saveNotes() {
    localStorage.setItem("jc_notes", document.getElementById("notes-box").value);
    document.getElementById("notes-status").textContent = "Saved!";
}

// ---------------- Calendar ----------------
let currentDate = new Date();
let selectedDate = null;

function renderCalendar() {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    document.getElementById("month-year").textContent =
        currentDate.toLocaleString("default", { month: "long" }) + " " + year;

    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();

    const grid = document.getElementById("calendar-grid");
    grid.innerHTML = "";

    for (let i = 0; i < firstDay; i++) grid.appendChild(document.createElement("div"));

    for (let d = 1; d <= days; d++) {
        const cell = document.createElement("div");
        cell.classList.add("calendar-day");
        cell.textContent = d;
        cell.onclick = () => selectDay(d, month, year);

        if (selectedDate &&
            selectedDate.day === d &&
            selectedDate.month === month &&
            selectedDate.year === year) {
            cell.classList.add("selected");
        }

        grid.appendChild(cell);
    }
}

function prevMonth() { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); }
function nextMonth() { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); }

function selectDay(day, month, year) {
    selectedDate = { day, month, year };
    document.getElementById("agenda-date").textContent = `${month + 1}/${day}/${year}`;
    const key = `agenda_${year}_${month}_${day}`;
    document.getElementById("agenda-text").value = localStorage.getItem(key) || "";
    document.getElementById("agenda-status").textContent = "";
    renderCalendar();
}

function saveAgenda() {
    if (!selectedDate) return;
    const key = `agenda_${selectedDate.year}_${selectedDate.month}_${selectedDate.day}`;
    localStorage.setItem(key, document.getElementById("agenda-text").value);
    document.getElementById("agenda-status").textContent = "Saved!";
}

// ---------------- To‑Do List ----------------
function addTodo() {
    const text = document.getElementById("todo-input").value.trim();
    if (!text) return;

    const li = document.createElement("li");
    li.textContent = text;
    li.onclick = () => li.remove();

    document.getElementById("todo-list").appendChild(li);
    document.getElementById("todo-input").value = "";
}

// ---------------- Pomodoro ----------------
let pomodoroTime = 1500;
let pomodoroInterval = null;

function startPomodoro() {
    if (pomodoroInterval) return;
    pomodoroInterval = setInterval(() => {
        pomodoroTime--;
        updatePomodoro();
        if (pomodoroTime <= 0) resetPomodoro();
    }, 1000);
}

function resetPomodoro() {
    clearInterval(pomodoroInterval);
    pomodoroInterval = null;
    pomodoroTime = 1500;
    updatePomodoro();
}

function updatePomodoro() {
    const m = Math.floor(pomodoroTime / 60);
    const s = pomodoroTime % 60;
    document.getElementById("pomodoro-display").textContent =
        `${m}:${s.toString().padStart(2, "0")}`;
}

// ---------------- Unit Converter ----------------
function cmToIn() {
    document.getElementById("in-input").value =
        (parseFloat(document.getElementById("cm-input").value) / 2.54).toFixed(2);
}

function inToCm() {
    document.getElementById("cm-input").value =
        (parseFloat(document.getElementById("in-input").value) * 2.54).toFixed(2);
}

// ---------------- Name Picker ----------------
function pickName() {
    const names = document.getElementById("names-box").value.trim().split("\n");
    if (names.length === 0) return;
    const pick = names[Math.floor(Math.random() * names.length)];
    document.getElementById("picked-name").textContent = pick;
}

// ---------------- Calculator ----------------
const calcButtons = ["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+"];
const calcDiv = document.getElementById("calc-buttons");

calcButtons.forEach(b => {
    const btn = document.createElement("div");
    btn.textContent = b;
    btn.classList.add("calc-btn");
    btn.onclick = () => calcPress(b);
    calcDiv.appendChild(btn);
});

function calcPress(b) {
    const disp = document.getElementById("calc-display");
    if (b === "=") disp.value = eval(disp.value || "0");
    else disp.value += b;
}

// ---------------- Stopwatch ----------------
let stopwatch = 0;
let stopwatchInterval = null;

function startStopwatch() {
    if (stopwatchInterval) return;
    stopwatchInterval = setInterval(() => {
        stopwatch++;
        updateStopwatch();
    }, 1000);
}

function stopStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
}

function resetStopwatch() {
    stopwatch = 0;
    updateStopwatch();
}

function updateStopwatch() {
    const h = Math.floor(stopwatch / 3600);
    const m = Math.floor((stopwatch % 3600) / 60);
    const s = stopwatch % 60;
    document.getElementById("stopwatch-display").textContent =
        `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
}

// ---------------- On Load ----------------
window.onload = () => {
    renderCalendar();
    const saved = localStorage.getItem("jc_notes");
    if (saved) document.getElementById("notes-box").value = saved;
};
