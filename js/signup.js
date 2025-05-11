const form = document.getElementById("signup");
const localStorage = window.localStorage;
const users = JSON.parse(localStorage.getItem("users")) || [];
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // delete previous errors
  document.getElementById("username-error").textContent = "";
  document.getElementById("password-error").textContent = "";

  let isValid = true;

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  console.log("yossabpro5@gmail.com".length);
  const usernameRegex = /^[a-zA-Za-zA-Z0-9_@\.]{2,20}$/gi;
  if (!usernameRegex.test(username)) {
    document.getElementById("username-error").textContent =
      "Invalid username. It must start with a letter and contain 2 to 20 characters, including letters, numbers, or underscores.";
    isValid = false;
  }
  try {
    for (let i = 0; i < users.length; i++) {
      if (users != null && username != users[i].username) {
        throw new Error();
      }
    }
  } catch (error) {
    document.getElementById("username-error").textContent =
      "this username is already taken login if it's you";
    isValid = false;
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@\.\\-_#$%&])(?=.*\d)(?=[a-zA-Z])[a-zA-Z0-9@\.\\-_#$%&]{6,50}$/;

  if (!passwordRegex.test(password)) {
    document.getElementById("password-error").textContent =
      "Invalid password. Password must be between 6-16 characters, and include at least one lowercase letter, one uppercase letter, one number, and one special character.";
    isValid = false;
  }

  if (isValid) {
    const data = {
      username: username,
      password: password,
      permission: false,
      result: 0,
    };
    createSession(password);
    users.push(data);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful!");
    changeHref();
  }
});

function createSession(password) {
  let permission = false;
  if (password.includes("AdminExam101")) permission = true;
  window.sessionStorage.setItem("permission", permission);
}
function changeHref() {
  const permission = window.sessionStorage.getItem("permission");
  if (permission == "true") {
    window.location.href = "/views/admin.html";
  } else {
    window.location.href = "/views/exam.html";
  }
}
