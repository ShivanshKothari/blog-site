const email = $("#email");
const validate = $(".validate");
const passwordWarning = document.querySelector("#passwordWarning");
const submitButton = document.querySelector("#submitButton");

// OTP verification code
let typingTimer;
const doneTypingInterval = 500;

function doneTyping() {
  $.ajax({
    type: "POST",
    url: "/u/verifyOTP", // Adjusted URL for Express endpoint
    data: {otp: $("#otp").val() },
    success: function (response) {
      const isValid = response.isValid;
      if (!isValid) {
        $("input[type='submit']").prop("disabled", false);
      } else {
        passwordWarning.css({ color: "red" });
        passwordWarning.text("Incorrect OTP :(");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("AJAX error:", textStatus, errorThrown);
      // Handles errors
    },
  });
}


// Event listeners

// Check OTP on keypress
validate.keyup(function () {
  emailValid = false;
  $("input[type='submit']").prop("disabled", true);
  clearTimeout(typingTimer);
  console.log("done typing");
  typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

validate.keydown(function () {
  console.log("keydown initiated");
  clearTimeout(typingTimer);
});

// Check new password strength
$("#newPassword").on("input", function() {
  if (checkPasswordStrength(this.value)) {

  }
})

// Get OTP if email exists
$("input[value='Get OTP']").onclick(function () {
  $.ajax({
    type: "POST",
    url: "/u/validateMail", // Adjusted URL for Express endpoint
    data: { email: $("#email").val(), requestSource: window.location.href},
    success: function (response) {
      if (!response.isValid) {
        $(".form-group").removeClass(".hidden");
      } else {
        passwordWarning.css({ color: "red" });
        passwordWarning.text("Account does not exist :(");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("AJAX error:", textStatus, errorThrown);
      // Handles errors
    },
  });
});

// Password Strength Check Function
function checkPasswordStrength(password) {
  // Regular expression for special characters, numbers, and alphabets
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  // Check if password length is at least 8 and matches the regular expression
  return password.length >= 8 && regex.test(password);
}
