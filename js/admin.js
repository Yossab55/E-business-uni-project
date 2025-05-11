//# check permissions
checkPermissions();

let questions = loadQuestionsFromLocalStorage();

function checkPermissions() {
  const permission = sessionStorage.getItem("permission");
  if (permission == null || permission == "false") {
    window.location.replace("/index.html");
  }
}
// Display questions in the table
function displayQuestions() {
  const tableBody = document.getElementById("questions-table");
  tableBody.innerHTML = "";

  questions.forEach((question, index) => {
    const row = document.createElement("tr");

    let optionsCount = question.type === "mcq" ? question.options.length : 2;

    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${question.question}</td>
            <td>${
              question.type === "mcq" ? "Multiple Choice" : "True/False"
            }</td>
            <td>${optionsCount}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editQuestion(${index})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteQuestion(${index})">Delete</button>
            </td>
        `;

    tableBody.appendChild(row);
  });
}

// Show/hide add form
function showAddQuestionForm() {
  document.getElementById("add-question-form").style.display = "block";
}

function hideAddQuestionForm() {
  document.getElementById("add-question-form").style.display = "none";
  resetForm();
}

// Toggle options based on question type
function toggleOptions() {
  const type = document.getElementById("new-question-type").value;
  if (type === "mcq") {
    document.getElementById("mcq-options").style.display = "block";
    document.getElementById("true-false-options").style.display = "none";
  } else {
    document.getElementById("mcq-options").style.display = "none";
    document.getElementById("true-false-options").style.display = "block";
  }
}

// Add new question
function addQuestion() {
  const text = document.getElementById("new-question-text").value;
  const type = document.getElementById("new-question-type").value;

  if (!text) {
    alert("Please enter question text");
    return;
  }

  let question;
  if (type === "mcq") {
    const options = [
      document.getElementById("option1").value,
      document.getElementById("option2").value,
      document.getElementById("option3").value,
      document.getElementById("option4").value,
    ];
    const correctAnswer = document.getElementById("correct-answer").value;

    if (!options[0] || !options[1] || !correctAnswer) {
      alert("Please enter all options and correct answer");
      return;
    }

    question = {
      question: text,
      type: type,
      options: options,
      correctAnswer: correctAnswer,
    };
  } else {
    const correctAnswer = document.getElementById("tf-answer").value;
    question = {
      question: text,
      type: type,
      correctAnswer: correctAnswer,
    };
  }

  questions.push(question);
  saveQuestionOnLocalStorage();
  displayQuestions();
  hideAddQuestionForm();
  alert("Question added successfully");
}

// Delete question
function deleteQuestion(index) {
  if (confirm("Are you sure you want to delete this question?")) {
    questions.splice(index, 1);
    saveQuestionOnLocalStorage();
    displayQuestions();
  }
}

// Edit question (can be enhanced)
function editQuestion(index) {
  alert("Edit form will open for question #" + (index + 1));
  // You can implement similar logic as add with pre-filled data
}

// Reset form
function resetForm() {
  document.getElementById("new-question-text").value = "";
  document.getElementById("new-question-type").value = "mcq";
  document.getElementById("option1").value = "";
  document.getElementById("option2").value = "";
  document.getElementById("option3").value = "";
  document.getElementById("option4").value = "";
  document.getElementById("correct-answer").value = "";
  document.getElementById("tf-answer").value = "true";
  toggleOptions();
}

// Display questions when page loads
window.onload = function () {
  displayQuestions();
};
// Variables to track edit state
let editingIndex = -1;
let editFormVisible = false;

// Show edit form
function editQuestion(index) {
  // Hide add form if visible
  if (document.getElementById("add-question-form").style.display === "block") {
    hideAddQuestionForm();
  }

  // If the same question is being edited, close the form
  if (editFormVisible && editingIndex === index) {
    hideEditForm();
    return;
  }

  editingIndex = index;
  const question = questions[index];

  // Create or show edit form
  let editForm = document.getElementById("edit-question-form");
  if (!editForm) {
    editForm = document.createElement("div");
    editForm.id = "edit-question-form";
    editForm.style =
      "margin-top: 20px; padding: 20px; background: #f9f9f9; border-radius: 5px;";
    editForm.innerHTML = `
    <h3>Edit Question</h3>
    <div style="margin-bottom: 15px;">
        <label>Question Text:</label>
        <input type="text" id="edit-question-text" style="width: 100%; padding: 8px;">
    </div>
    <div style="margin-bottom: 15px;">
        <label>Question Type:</label>
        <select id="edit-question-type" style="padding: 8px;" onchange="toggleEditOptions()">
            <option value="mcq">Multiple Choice</option>
            <option value="true_false">True/False</option>
        </select>
    </div>
    <div id="edit-mcq-options" style="margin-bottom: 15px;">
        <label>Options:</label>
        <input type="text" id="edit-option1" placeholder="Option 1" style="width: 100%; padding: 8px; margin: 5px 0;">
        <input type="text" id="edit-option2" placeholder="Option 2" style="width: 100%; padding: 8px; margin: 5px 0;">
        <input type="text" id="edit-option3" placeholder="Option 3" style="width: 100%; padding: 8px; margin: 5px 0;">
        <input type="text" id="edit-option4" placeholder="Option 4" style="width: 100%; padding: 8px; margin: 5px 0;">
        <input type="text" id="edit-correct-answer" placeholder="Correct answer number (1-4)" style="width: 100%; padding: 8px; margin: 5px 0;">
    </div>
    <div id="edit-true-false-options" style="margin-bottom: 15px; display: none;">
        <label>Correct Answer:</label>
        <select id="edit-tf-answer" style="padding: 8px; width: 100%;">
            <option value="true">True</option>
            <option value="false">False</option>
        </select>
    </div>
    <button class="add-btn" onclick="saveEditedQuestion()" style="margin-right: 10px;">Save Changes</button>
    <button class="delete-btn" onclick="hideEditForm()">Cancel</button>
`;
    document.querySelector(".container").appendChild(editForm);
  }

  // Fill current data
  document.getElementById("edit-question-text").value = question.question;
  document.getElementById("edit-question-type").value = question.type;

  if (question.type === "mcq") {
    document.getElementById("edit-option1").value = question.options[0];
    document.getElementById("edit-option2").value = question.options[1];
    document.getElementById("edit-option3").value = question.options[2] || "";
    document.getElementById("edit-option4").value = question.options[3] || "";
    document.getElementById("edit-correct-answer").value =
      question.correctAnswer;
    document.getElementById("edit-mcq-options").style.display = "block";
    document.getElementById("edit-true-false-options").style.display = "none";
  } else {
    document.getElementById("edit-tf-answer").value = question.correctAnswer;
    document.getElementById("edit-mcq-options").style.display = "none";
    document.getElementById("edit-true-false-options").style.display = "block";
  }

  editForm.style.display = "block";
  editFormVisible = true;

  // Scroll to the form for better visibility
  editForm.scrollIntoView({ behavior: "smooth" });
}

// Toggle edit options
function toggleEditOptions() {
  const type = document.getElementById("edit-question-type").value;
  if (type === "mcq") {
    document.getElementById("edit-mcq-options").style.display = "block";
    document.getElementById("edit-true-false-options").style.display = "none";
  } else {
    document.getElementById("edit-mcq-options").style.display = "none";
    document.getElementById("edit-true-false-options").style.display = "block";
  }
}

// Save edits
function saveEditedQuestion() {
  if (editingIndex === -1) return;

  const text = document.getElementById("edit-question-text").value;
  const type = document.getElementById("edit-question-type").value;

  if (!text) {
    alert("Please enter question text");
    return;
  }

  if (type === "mcq") {
    const options = [
      document.getElementById("edit-option1").value,
      document.getElementById("edit-option2").value,
      document.getElementById("edit-option3").value,
      document.getElementById("edit-option4").value,
    ];
    const correctAnswer = document.getElementById("edit-correct-answer").value;

    if (!options[0] || !options[1] || !correctAnswer) {
      alert("Please enter all options and correct answer");
      return;
    }

    questions[editingIndex] = {
      question: text,
      type: type,
      options: options,
      correctAnswer: correctAnswer,
    };
  } else {
    const correctAnswer = document.getElementById("edit-tf-answer").value;
    questions[editingIndex] = {
      question: text,
      type: type,
      correctAnswer: correctAnswer,
    };
  }
  saveQuestionOnLocalStorage();
  displayQuestions();
  hideEditForm();
  alert("Changes saved successfully");
}

// Hide edit form
function hideEditForm() {
  const editForm = document.getElementById("edit-question-form");
  if (editForm) {
    editForm.style.display = "none";
  }
  editingIndex = -1;
  editFormVisible = false;
}

// Modify displayQuestions to add class for the question being edited
function displayQuestions() {
  const tableBody = document.getElementById("questions-table");
  tableBody.innerHTML = "";
  console.log(questions);
  questions.forEach((question, index) => {
    const row = document.createElement("tr");

    // Add class if question is being edited
    if (index === editingIndex) {
      row.classList.add("editing-row");
      row.style.backgroundColor = "#fffde7";
    }

    let optionsCount = question.type === "mcq" ? question.options.length : 2;

    row.innerHTML = `
    <td>${index + 1}</td>
    <td>${question.question}</td>
    <td>${question.type === "mcq" ? "Multiple Choice" : "True/False"}</td>
    <td>${optionsCount}</td>
    <td>
        <button class="action-btn edit-btn" onclick="editQuestion(${index})">
            ${index === editingIndex ? "Editing..." : "Edit"}
        </button>
        <button class="action-btn delete-btn" onclick="deleteQuestion(${index})">Delete</button>
    </td>
`;

    tableBody.appendChild(row);
  });
}

// Add CSS to highlight the question being edited
const style = document.createElement("style");
style.innerHTML = `
.editing-row {
position: relative;
}
.editing-row::after {
content: "⚡ Editing";
position: absolute;
right: 10px;
top: 50%;
transform: translateY(-50%);
background: #ffeb3b;
padding: 2px 8px;
border-radius: 10px;
font-size: 12px;
color: #333;
}
`;
document.head.appendChild(style);

// control local localStorage
function loadQuestionsFromLocalStorage() {
  return JSON.parse(window.localStorage.getItem("questions")) || [];
}
function saveQuestionOnLocalStorage() {
  window.localStorage.setItem("questions", JSON.stringify(questions));
}
