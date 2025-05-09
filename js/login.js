// in the name of Cross
const form = document.getElementById("login");
const localStorage = window.localStorage;
const users = JSON.parse(localStorage.getItem("users")) || [];
console.log(localStorage)
console.log(users)
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // delete previous errors
  document.getElementById("username-error").textContent = "";
  document.getElementById("password-error").textContent = "";

  let isValid = true;

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;
  if (!usernameRegex.test(username)) {
    document.getElementById("username-error").textContent =
      "Invalid username. It must start with a letter and contain 2 to 15 characters, including letters, numbers, or underscores.";
    isValid = false;
  }
  let passwordConfirmation = ''
  try {
    for (let i = 0; i < users.length; i++) {
      if (users != null && username == users[i].username) {
        passwordConfirmation = users[i].password;
        break;
      } else {
        throw new Error();
      }
    }
  } catch (error) {
    document.getElementById("username-error").textContent =
      "this username doesn't exist";
    isValid = false;
  }

  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{6,50}$/;
  if (!passwordRegex.test(password)) {
    document.getElementById("password-error").textContent =
      "Invalid password. Password must be between 6-50 characters, and include at least one lowercase letter, one uppercase letter, one number, and one special character.";
    isValid = false;
  }
  if (password != passwordConfirmation) {
    document.getElementById("password-error").textContent =
      "Wrong password Try Again";
    isValid = false;
  }

  if (isValid) {
    createSession(password);
    changeHref();
  }
});

function createSession(password) {
  let permission = false;
  if(password.includes("AdminExam101")) permission = true;
  window.sessionStorage.setItem("permission", permission);
}

function createSession(password) {
  let permission = false;
  if (password.includes("AdminExam101")) permission = true;
  window.sessionStorage.setItem("permission", permission);
}
function changeHref() {
  if (window.sessionStorage.getItem("permission") == true) {
    window.location.href("/views/admin.html");
  } else {
    window.location.href("/views/exam.html");
  }
}
