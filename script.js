// Utility functions
const getJSON = async (url) => fetch(url).then((res) => res.json());
const postJSON = async (url, data) =>
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

// Simulating the backend JSON file
const testData = {
    tests: [],
    results: [],
};

// Global variables
let currentTest = null;

// Event Handlers
document.getElementById("faculty-login").onclick = () => {
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("faculty-section").classList.remove("hidden");
};

document.getElementById("student-login").onclick = () => {
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("student-section").classList.remove("hidden");
};

document.getElementById("logout-faculty").onclick = () => {
    document.getElementById("faculty-section").classList.add("hidden");
    document.getElementById("login-section").classList.remove("hidden");
};

document.getElementById("logout-student").onclick = () => {
    document.getElementById("student-section").classList.add("hidden");
    document.getElementById("login-section").classList.remove("hidden");
};

document.getElementById("create-test").onclick = () => {
    document.getElementById("test-creation").classList.remove("hidden");
};

document.getElementById("add-question").onclick = () => {
    const questionDiv = document.createElement("div");
    questionDiv.innerHTML = `
        <label>Question:</label>
        <input type="text" class="question-text">
        <label>Options:</label>
        <input type="text" class="option" placeholder="Option 1">
        <input type="text" class="option" placeholder="Option 2">
        <input type="text" class="option" placeholder="Option 3">
        <input type="text" class="option" placeholder="Option 4">
        <label>Correct Option (1-4):</label>
        <input type="number" class="correct-option" min="1" max="4">
    `;
    document.getElementById("questions").appendChild(questionDiv);
};

document.getElementById("save-test").onclick = () => {
    const title = document.getElementById("test-title").value;
    const timer = document.getElementById("timer").value;
    const questions = Array.from(document.querySelectorAll("#questions > div")).map((div) => {
        return {
            question: div.querySelector(".question-text").value,
            options: Array.from(div.querySelectorAll(".option")).map((opt) => opt.value),
            correctOption: div.querySelector(".correct-option").value,
        };
    });

    const testID = Math.floor(1000 + Math.random() * 9000);
    testData.tests.push({ id: testID, title, timer, questions });

    alert(`Test created with ID: ${testID}`);
    document.getElementById("test-creation").classList.add("hidden");
};

document.getElementById("start-test").onclick = () => {
    const testID = document.getElementById("test-id").value;
    const test = testData.tests.find((t) => t.id == testID);

    if (!test) {
        alert("Invalid Test ID!");
        return;
    }

    currentTest = test;
    document.getElementById("test-section").classList.remove("hidden");
    document.getElementById("test-title-display").textContent = test.title;

    const form = document.getElementById("test-form");
    form.innerHTML = test.questions
        .map((q, i) => {
            return `
                <div>
                    <p>${i + 1}. ${q.question}</p>
                    ${q.options
                        .map(
                            (opt, j) =>
                                `<label><input type="radio" name="q${i}" value="${j + 1}">${opt}</label><br>`
                        )
                        .join("")}
                </div>
            `;
        })
        .join("");
};

document.getElementById("submit-test").onclick = () => {
    const formData = new FormData(document.getElementById("test-form"));
    const answers = currentTest.questions.map((q, i) => formData.get(`q${i}`));
    const correctAnswers = currentTest.questions.filter(
        (q, i) => q.correctOption == answers[i]
    ).length;

    testData.results.push({
        testID: currentTest.id,
        studentName: "Anonymous",
        score: correctAnswers,
    });

    alert("Test submitted!");
    document.getElementById("test-section").classList.add("hidden");
};

// Faculty: View Results
document.getElementById("view-results").onclick = () => {
    const resultsList = document.getElementById("results-list");
    resultsList.innerHTML = testData.results
        .map((r) => `<li>Test ID: ${r.testID}, Score: ${r.score}</li>`)
        .join("");
    document.getElementById("results-section").classList.remove("hidden");
};
