// GPA Converter
function calcGPA() {
    const grade = parseFloat(document.getElementById("gpa-input").value);
    const output = document.getElementById("gpa-output");

    if (isNaN(grade) || grade < 0 || grade > 100) {
        output.textContent = "Enter a valid number between 0 and 100.";
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

    output.textContent = "GPA: " + gpa.toFixed(1);
}

// Password Generator
function generatePassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let pass = "";
    for (let i = 0; i < 12; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById("password-output").textContent = pass;
}

// Notes (local storage)
function saveNotes() {
    const notes = document.getElementById("notes-box").value;
    localStorage.setItem("jc_notes", notes);
    document.getElementById("notes-status").textContent = "Saved!";
}

// Load saved notes on page load
window.onload = () => {
    const saved = localStorage.getItem("jc_notes");
    if (saved) document.getElementById("notes-box").value = saved;
};
