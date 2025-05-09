const questions = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
      "Hyperlinking Text Method Language",
    ],
    answer: "Hyper Text Markup Language",
  },
  {
    question: "Which language is used for styling web pages?",
    options: ["HTML", "JQuery", "CSS", "XML"],
    answer: "CSS",
  },
  {
    question: "What is the correct syntax to link a CSS file?",
    options: [
      "<style src='style.css'>",
      "<link rel='stylesheet' href='style.css'>",
      "<script src='style.css'>",
      "<css link='style.css'>",
    ],
    answer: "<link rel='stylesheet' href='style.css'>",
  },
  {
    question: "Which is not a JavaScript data type?",
    options: ["Undefined", "Number", "Boolean", "Float"],
    answer: "Float",
  },
  {
    question: "Which tag is used to define an image in HTML?",
    options: ["<image>", "<img>", "<pic>", "<src>"],
    answer: "<img>",
  },
  {
    question: "How can you make a numbered list in HTML?",
    options: ["<ul>", "<ol>", "<list>", "<dl>"],
    answer: "<ol>",
  },
  {
    question: "Inside which element do we put the JavaScript?",
    options: ["<js>", "<javascript>", "<script>", "<scripting>"],
    answer: "<script>",
  },
  {
    question:
      "Which attribute is used to provide a unique name to an HTML element?",
    options: ["class", "id", "name", "type"],
    answer: "id",
  },
  {
    question: "How do you write 'Hello World' in an alert box in JS?",
    options: [
      "msgBox('Hello World');",
      "alertBox('Hello World');",
      "msg('Hello World');",
      "alert('Hello World');",
    ],
    answer: "alert('Hello World');",
  },
  {
    question: "Which company developed JavaScript?",
    options: ["Netscape", "Bell Labs", "Sun Microsystems", "IBM"],
    answer: "Netscape",
  },
];

let currentQuestionIndex = 0;
let userAnswers = Array(questions.length).fill(null);
let markedQuestions = Array(questions.length).fill(false);
let timeLeft = 300;

const questionBox = document.getElementById("questionBox");
const optionsContainer = document.getElementById("optionsContainer");
const questionCounter = document.getElementById("counter");
const markedQuestionContainer = document.getElementById(
  "marked-questions-container"
);
const timer = document.getElementById("timer");
const markBtn = document.getElementById("markBtn");
const flagButton = document.getElementById("flagButton");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const resultEl = document.getElementById("result");

function loadQuestion() {
  const current = questions[currentQuestionIndex];
  questionBox.textContent = current.question;
  questionBox.classList.toggle("marked", markedQuestions[currentQuestionIndex]);
  questionCounter.textContent =
    "Question " + (currentQuestionIndex + 1) + " of " + questions.length;

  optionsContainer.innerHTML = "";
  current.options.forEach((option) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "option";
    input.value = option;
    if (userAnswers[currentQuestionIndex] === option) input.checked = true;
    input.onclick = () => {
      userAnswers[currentQuestionIndex] = option;
    };
    label.appendChild(input);
    label.appendChild(document.createTextNode(option));
    optionsContainer.appendChild(label);
  });

  prevBtn.classList.toggle("hidden", currentQuestionIndex === 0);

  if (currentQuestionIndex === questions.length - 1) {
    nextBtn.textContent = "Submit";
    nextBtn.style.backgroundColor = "#28a745";
    nextBtn.onclick = submitExam;
  } else {
    nextBtn.textContent = "Next";
    nextBtn.style.backgroundColor = "#007bff";
    nextBtn.onclick = goToNext;
  }
}

function goToNext() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
  }
}

function submitExam() {
  nextBtn.disabled = true;
  prevBtn.disabled = true;
  markBtn.disabled = true;
  clearInterval(timerInterval);
  showResult();
}

function showResult() {
  let score = 0;
  questions.forEach((q, i) => {
    if (userAnswers[i] === q.answer) score++;
  });

  const percentage = Math.round((score / questions.length) * 100);
  resultEl.textContent =
    "You answered " +
    score +
    " out of " +
    questions.length +
    " correctly (" +
    percentage +
    "%).";
  resultEl.classList.remove("hidden");
}
markBtn.addEventListener("click", () => {
  markedQuestions[currentQuestionIndex] = markedQuestions[currentQuestionIndex]
    ? false
    : true;
  loadQuestion();
});

markBtn.addEventListener("click", function showMarkedQuestion() {
  if (!markedQuestions.every((ele) => ele == false)) {
    flagButton.classList.remove("d-none");
  }
});

flagButton.addEventListener("click", function addQuestionsMarked() {
  markedQuestionContainer.innerHTML = "";
  for (let i = 0; i < markedQuestions.length; i++) {
    if (markedQuestions[i] == true) {
      const questionSpan = createSpanQuestion(i);
      markedQuestionContainer.appendChild(questionSpan);
    }
  }
});
function createSpanQuestion(questionIndex) {
  const questionSpan = document.createElement("span");

  questionSpan.setAttribute("data-question-index", questionIndex);

  questionSpan.setAttribute(
    "class",
    "list-group-item list-group-item-action marked-question"
  );

  if (currentQuestionIndex == questionIndex) {
    questionSpan.classList.add("active");
  }
  questionSpan.innerText = `Question No.${questionIndex + 1}`;

  questionSpan.addEventListener('click', function goTo() {
    currentQuestionIndex = questionIndex;
    loadQuestion();
  } )

  return questionSpan;
}

prevBtn.onclick = () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
  }
};

const timerInterval = setInterval(() => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timer.textContent =
    "Time Left: " + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  timeLeft--;
  if (timeLeft < 0) {
    clearInterval(timerInterval);
    alert("Time's up! Exam submitted.");
    showResult();
    nextBtn.disabled = true;
    prevBtn.disabled = true;
    markBtn.disabled = true;
    submitBtn.disabled = true;
  }
}, 1000);

loadQuestion();
