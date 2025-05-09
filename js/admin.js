checkPermissions();





function checkPermissions() {
  if (sessionStorage.getItem("permissions") == null) {
    window.location.replace("../index.html");
  }

  if (sessionStorage.getItem("permissions") != true) {
    window.location.replace("../views/exam.html");
  }
}
