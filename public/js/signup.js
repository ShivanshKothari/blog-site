const passwordFormat = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const tempPassword = document.querySelector("#tempPassword");
const password = document.querySelector("#password");
const validate = $(".validate");
const email = $("#email");
let emailValid, passwordValid, result = true;
const passwordWarning = document.querySelector("#passwordWarning");

if (tempPassword) {

  validate.on("input", function () {
    
    if ((tempPassword.value === password.value) && checkPasswordStrength(tempPassword.value)) {
        passwordWarning.style.color = "green";
        passwordWarning.textContent = "Passwords match.";
        passwordValid = true;
        result = !(passwordValid && emailValid);
        console.log("result" + result)
        $("input[type='submit']").prop("disabled", result);

    } else if (!checkPasswordStrength(tempPassword.value)) {
      passwordWarning.style.color = "red";
      passwordWarning.textContent = "Password length > 8 and contain alphanumeric & special characters.";
      passwordValid = false;
      $("input[type='submit']").prop("disabled", true);

    }else {
      passwordWarning.style.color = "red";
      passwordWarning.textContent = "Passwords do not match.";
      passwordValid = false;
      $("input[type='submit']").prop("disabled", true);
    }
  });

}

// Password Strength Check Function
function checkPasswordStrength(password) {
  // Regular expression for special characters, numbers, and alphabets
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  // Check if password length is at least 8 and matches the regular expression
  return password.length >= 8 && regex.test(password);
}

// Email Validation Code
let typingTimer;
const doneTypingInterval = 200;
const emailWarning = $("#emailWarning");

validate.keyup(function () {
  emailValid = false;
  $("input[type='submit']").prop("disabled", true);
  clearTimeout(typingTimer);
  console.log("done typing");
  typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

validate.keydown(function () {
  console.log("keydorwf");
  clearTimeout(typingTimer);
});

function doneTyping() {
  $.ajax({
    type: "POST",
    url: "/u/validateMail", // Adjusted URL for Express endpoint
    data: { email: $("#email").val() },
    success: function (response) {
      const isValid = response.isValid;
      if (isValid) {
        if (email.val().length > 2){
        emailValid = true;
        result = !(passwordValid && emailValid);
        console.log("result" + passwordValid + emailValid + result)
        $("input[type='submit']").prop("disabled", result);
        
          emailWarning.css({"color" : "green"});
          emailWarning.text("Email can be used :)");
        }
      } else {
        // Update warning
        emailValid = false;
        emailWarning.css({"color" : "red"});
        emailWarning.text("Email is not valid or already exists :(");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("AJAX error:", textStatus, errorThrown);
      // Handle errors as needed
    },
  });
}
