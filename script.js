// SECTION SWITCHING
function showSection(id) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// HOMEWORK PLANNER
function addTask() {
    let input = document.getElementById("taskInput");
    if (input.value.trim() === "") return;

    let li = document.createElement("li");
    li.innerHTML = `${input.value} <button onclick="this.parentElement.remove(); saveTasks();">X</button>`;
    document.getElementById("taskList").appendChild(li);

    input.value = "";
    saveTasks();
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => tasks.push(li.innerText.replace("X", "").trim()));
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks.forEach(t => {
        let li = document.createElement("li");
        li.innerHTML = `${t} <button onclick="this.parentElement.remove(); saveTasks();">X</button>`;
        document.getElementById("taskList").appendChild(li);
    });
}

// NOTES + SCHEDULE SAVE
document.getElementById("notesBox").addEventListener("input", () => {
    localStorage.setItem("notes", document.getElementById("notesBox").value);
});

document.getElementById("scheduleBox").addEventListener("input", () => {
    localStorage.setItem("schedule", document.getElementById("scheduleBox").value);
});

// LOAD SAVED DATA
window.onload = () => {
    loadTasks();
    document.getElementById("notesBox").value = localStorage.getItem("notes") || "";
    document.getElementById("scheduleBox").value = localStorage.getItem("schedule") || "";
};

// GRADE CALCULATOR
function calcGrade() {
    let earned = parseFloat(document.getElementById("gradeEarned").value);
    let total = parseFloat(document.getElementById("gradeTotal").value);

    if (isNaN(earned) || isNaN(total) || total === 0) {
        document.getElementById("gradeResult").innerText = "Enter valid numbers.";
        return;
    }

    let percent = ((earned / total) * 100).toFixed(2);
    document.getElementById("gradeResult").innerText = `Grade: ${percent}%`;
}

// STUDY TIMER (25‑minute Pomodoro)
let time = 1500;
let timerInterval;

function startTimer() {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
        time--;
        updateTimer();

        if (time <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("Time's up!");
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    time = 1500;
    updateTimer();
}

function updateTimer() {
    let m = Math.floor(time / 60);
    let s = time % 60;
    document.getElementById("timerDisplay").innerText = `${m}:${s.toString().padStart(2, '0')}`;
}
