// Show password functinality
function showPassword(event) {
    event.target.classList.toggle("checked");
    if (password.type === "password") {
      password.type = "text";
      if (tempPassword) tempPassword.type = "text";
    } else {
      password.type = "password";
      if (tempPassword) tempPassword.type = "password";
    }
  }