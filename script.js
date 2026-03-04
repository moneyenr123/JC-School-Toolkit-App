/* ============================================================
   JC SCHOOL TOOLKIT — FULL FIXED SCRIPT.JS
   All features restored, cleaned, and working
   ============================================================ */

/* ---------- UTIL ---------- */
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- GPA ---------- */
function calcGPA() {
    const grade = parseFloat(document.getElementById("gpa-input").value);
    const out = document.getElementById("gpa-output");
    if (isNaN(grade) || grade < 0 || grade > 100) {
        out.textContent = "Enter a valid number between 0 and 100.";
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

/* ---------- PASSWORD ---------- */
function generatePassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let pass = "";
    for (let i = 0; i < 12; i++) pass += chars[Math.floor(Math.random() * chars.length)];
    document.getElementById("password-output").textContent = pass;
}

/* ---------- NOTES ---------- */
function saveNotes() {
    const val = document.getElementById("notes-box").value;
    localStorage.setItem("jc_notes", val);
    document.getElementById("notes-status").textContent = "Saved!";
}

/* ---------- CALENDAR / AGENDA ---------- */
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
    const label = `${month + 1}/${day}/${year}`;
    document.getElementById("agenda-date").textContent = "Homework for " + label;
    const key = `agenda_${year}_${month}_${day}`;
    const saved = localStorage.getItem(key);
    document.getElementById("agenda-text").value = saved || "";
    document.getElementById("agenda-status").textContent = "";
    document.getElementById("dash-homework").textContent = saved || "No homework saved for this day.";
    renderCalendar();
}

function saveAgenda() {
    if (!selectedDate) return;
    const key = `agenda_${selectedDate.year}_${selectedDate.month}_${selectedDate.day}`;
    const text = document.getElementById("agenda-text").value;
    localStorage.setItem(key, text);
    document.getElementById("agenda-status").textContent = "Saved!";
    document.getElementById("dash-homework").textContent = text || "No homework saved.";
}

/* ---------- TO-DO ---------- */
function addTodo() {
    const input = document.getElementById("todo-input");
    const text = input.value.trim();
    if (!text) return;
    const li = document.createElement("li");
    li.textContent = text;
    li.onclick = () => li.remove();
    document.getElementById("todo-list").appendChild(li);
    input.value = "";
}

/* ---------- GRADE TRACKER ---------- */
function addGrade() {
    const cls = document.getElementById("gt-class").value.trim();
    const grade = parseFloat(document.getElementById("gt-grade").value);
    if (!cls || isNaN(grade)) return;
    const tbody = document.querySelector("#gt-table tbody");
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${cls}</td><td>${grade.toFixed(1)}%</td>`;
    tbody.appendChild(tr);
    document.getElementById("gt-class").value = "";
    document.getElementById("gt-grade").value = "";
    updateGradeAverage();
}

function updateGradeAverage() {
    const rows = document.querySelectorAll("#gt-table tbody tr");
    let sum = 0, count = 0;
    rows.forEach(r => {
        const val = parseFloat(r.children[1].textContent);
        if (!isNaN(val)) { sum += val; count++; }
    });
    const avg = count ? (sum / count).toFixed(1) : "N/A";
    document.getElementById("gt-average").textContent = "Average: " + avg + (avg !== "N/A" ? "%" : "");
}

/* ---------- CLASS SCHEDULE ---------- */
function addClassSchedule() {
    const period = document.getElementById("cs-period").value.trim();
    const cls = document.getElementById("cs-class").value.trim();
    if (!period || !cls) return;
    const li = document.createElement("li");
    li.textContent = `${period}: ${cls}`;
    document.getElementById("cs-list").appendChild(li);
    document.getElementById("cs-period").value = "";
    document.getElementById("cs-class").value = "";
}

/* ---------- FLASHCARDS ---------- */
let flashcards = [];
let currentFlashIndex = -1;
let showBack = false;

function addFlashcard() {
    const front = document.getElementById("fc-front").value.trim();
    const back = document.getElementById("fc-back").value.trim();
    if (!front || !back) return;
    flashcards.push({ front, back });
    const li = document.createElement("li");
    li.textContent = front + " → " + back;
    document.getElementById("fc-list").appendChild(li);
    document.getElementById("fc-front").value = "";
    document.getElementById("fc-back").value = "";
}

function showFlashcard() {
    if (flashcards.length === 0) {
        document.getElementById("fc-display-front").textContent = "No cards yet.";
        document.getElementById("fc-display-back").textContent = "";
        return;
    }
    currentFlashIndex = Math.floor(Math.random() * flashcards.length);
    showBack = false;
    const card = flashcards[currentFlashIndex];
    document.getElementById("fc-display-front").textContent = card.front;
    document.getElementById("fc-display-back").textContent = "";
}

function toggleFlashcard() {
    if (currentFlashIndex < 0 || currentFlashIndex >= flashcards.length) return;
    showBack = !showBack;
    document.getElementById("fc-display-back").textContent =
        showBack ? flashcards[currentFlashIndex].back : "";
}

/* ============================================================
   QUIZ SYSTEM — FIXED + DYNAMIC LOADER
   ============================================================ */

let quizBank = {};
let quizFiles = [
    "quizzes/grade1.js",
    "quizzes/grade2.js",
    "quizzes/grade3.js",
    "quizzes/grade4.js",
    "quizzes/grade5.js",
    "quizzes/grade6.js",
    "quizzes/grade7.js",
    "quizzes/grade8.js",
    "quizzes/algebra1.js",
    "quizzes/geometry.js",
    "quizzes/algebra2.js",
    "quizzes/precalc.js"
];

function loadAllQuizzes() {
    quizFiles.forEach(file => {
        const script = document.createElement("script");
        script.src = file;
        document.body.appendChild(script);
    });
}

let currentQuizKey = null;

function populateQuizSelect() {
    const sel = document.getElementById("quiz-select");
    sel.innerHTML = "";
    Object.keys(quizBank).forEach(key => {
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = quizBank[key].name;
        sel.appendChild(opt);
    });
}

function startQuiz() {
    const key = document.getElementById("quiz-select").value;
    if (!key) return;
    currentQuizKey = key;
    const quiz = quizBank[key];
    const area = document.getElementById("quiz-area");
    area.innerHTML = "";
    quiz.questions.forEach((q, idx) => {
        const div = document.createElement("div");
        div.classList.add("card");
        let html = `<p><strong>Q${idx + 1}.</strong> ${q.q}</p>`;
        q.options.forEach((opt, i) => {
            html += `<label style="display:block;margin-bottom:4px;">
                        <input type="radio" name="q${idx}" value="${i}"> ${opt}
                     </label>`;
        });
        div.innerHTML = html;
        area.appendChild(div);
    });
    document.getElementById("quiz-submit").style.display = "inline-block";
    document.getElementById("quiz-result").textContent = "";
}

function submitQuiz() {
    if (!currentQuizKey) return;
    const quiz = quizBank[currentQuizKey];
    let score = 0;
    quiz.questions.forEach((q, idx) => {
        const radios = document.getElementsByName("q" + idx);
        let chosen = -1;
        radios.forEach(r => { if (r.checked) chosen = parseInt(r.value); });
        if (chosen === q.answer) score++;
    });
    const percent = Math.round((score / quiz.questions.length) * 100);
    document.getElementById("quiz-result").textContent =
        `Score: ${score}/${quiz.questions.length} (${percent}%)`;
}

/* ---------- POMODORO ---------- */
let pomodoroTime = 1500;
let pomodoroInterval = null;

function updatePomodoro() {
    const m = Math.floor(pomodoroTime / 60);
    const s = pomodoroTime % 60;
    document.getElementById("pomodoro-display").textContent =
        `${m}:${s.toString().padStart(2, "0")}`;
}

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

/* ---------- STOPWATCH ---------- */
let stopwatch = 0;
let stopwatchInterval = null;

function updateStopwatch() {
    const h = Math.floor(stopwatch / 3600);
    const m = Math.floor((stopwatch % 3600) / 60);
    const s = stopwatch % 60;
    document.getElementById("stopwatch-display").textContent =
        `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
}

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

/* ---------- COUNTDOWN ---------- */
let cdTime = 0;
let cdInterval = null;

function updateCountdown() {
    const m = Math.floor(cdTime / 60);
    const s = cdTime % 60;
    document.getElementById("cd-display").textContent =
        `${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
}

function startCountdown() {
    const mins = parseInt(document.getElementById("cd-minutes").value);
    if (isNaN(mins) || mins <= 0) return;
    cdTime = mins * 60;
    updateCountdown();
    if (cdInterval) clearInterval(cdInterval);
    cdInterval = setInterval(() => {
        cdTime--;
        updateCountdown();
        if (cdTime <= 0) {
            clearInterval(cdInterval);
            cdInterval = null;
        }
    }, 1000);
}

function resetCountdown() {
    clearInterval(cdInterval);
    cdInterval = null;
    cdTime = 0;
    updateCountdown();
}

/* ---------- UNIT CONVERTERS ---------- */
function mToFt() {
    const m = parseFloat(document.getElementById("len-m").value);
    if (isNaN(m)) return;
    document.getElementById("len-ft").value = (m * 3.28084).toFixed(2);
}

function ftToM() {
    const ft = parseFloat(document.getElementById("len-ft").value);
    if (isNaN(ft)) return;
    document.getElementById("len-m").value = (ft / 3.28084).toFixed(2);
}

function kgToLb() {
    const kg = parseFloat(document.getElementById("mass-kg").value);
    if (isNaN(kg)) return;
    document.getElementById("mass-lb").value = (kg * 2.20462).toFixed(2);
}

function lbToKg() {
    const lb = parseFloat(document.getElementById("mass-lb").value);
    if (isNaN(lb)) return;
    document.getElementById("mass-kg").value = (lb / 2.20462).toFixed(2);
}

function cToF() {
    const c = parseFloat(document.getElementById("temp-c").value);
    if (isNaN(c)) return;
    document.getElementById("temp-f").value = (c * 9/5 + 32).toFixed(1);
}

function fToC() {
    const f = parseFloat(document.getElementById("temp-f").value);
    if (isNaN(f)) return;
    document.getElementById("temp-c").value = ((f - 32) * 5/9).toFixed(1);
}

/* ---------- CBM ---------- */
function calcCBM() {
    const L = parseFloat(document.getElementById("cbm-length").value);
    const W = parseFloat(document.getElementById("cbm-width").value);
    const H = parseFloat(document.getElementById("cbm-height").value);
    const unit = document.getElementById("cbm-unit").value;
    const out = document.getElementById("cbm-output");
    if (isNaN(L) || isNaN(W) || isNaN(H)) {
        out.textContent = "Enter valid numbers.";
        return;
    }
    let cbm = 0;
    if (unit === "cm") cbm = (L * W * H) / 1000000;
    if (unit === "m") cbm = L * W * H;
    if (unit === "in") cbm = (L * W * H) * 0.0000163871;
    if (unit === "ft") cbm = (L * W * H) * 0.0283168;
    out.textContent = "CBM: " + cbm.toFixed(4) + " m³";
}

function convertCBM() {
    const value = parseFloat(document.getElementById("cbm-value").value);
    const type = document.getElementById("cbm-type").value;
    const out = document.getElementById("cbm-convert-output");
    if (isNaN(value)) {
        out.textContent = "Enter a valid number.";
        return;
    }
    let m3 = 0;
    if (type === "m3") m3 = value;
    if (type === "ft3") m3 = value * 0.0283168;
    if (type === "liters") m3 = value / 1000;
    if (type === "gallons") m3 = value * 0.00378541;

    const ft3 = m3 / 0.0283168;
    const liters = m3 * 1000;
    const gallons = m3 / 0.00378541;

