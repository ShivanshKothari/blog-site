let leaveMessage = true;
function formatSelectedText(openTag, closeTag) {
  const myTextarea = document.getElementById("post_text");

  // Get the selected text and its position
  const selectedText = myTextarea.value.substring(
    myTextarea.selectionStart,
    myTextarea.selectionEnd
  );
  const selectionStart = myTextarea.selectionStart;

  // Create the formatted text
  const formattedText = `${openTag}${selectedText}${closeTag}`;

  // Replace the selected text with an empty string
  myTextarea.value = myTextarea.value.replace(selectedText, "");

  // Insert the formatted text at the original selection start
  const newText =
    myTextarea.value.slice(0, selectionStart) +
    formattedText +
    myTextarea.value.slice(selectionStart);

  // Update the textarea value with the new text
  myTextarea.value = newText;

  // Set the cursor position to the end of the inserted formatted text
  myTextarea.selectionStart = selectionStart + formattedText.length;
  myTextarea.selectionEnd = myTextarea.selectionStart;
}

function boldSelectedText() {
  formatSelectedText("<b>", "</b>");
}

function italicSelectedText() {
  formatSelectedText("<i>", "</i>");
}

function centerSelectedText() {
  formatSelectedText("<center>", "</center>");
}

function createLinkSelectedText() {
  const url = prompt("Enter the link URL:");
  if (url) {
    formatSelectedText('<a href="' + url + '" target="_blank">', "</a>");
  }
}

// "Show preview" functionality
function togglePreview() {
  document.querySelector(".main").classList.toggle("hidden");
  document.querySelector("#postPreview").innerHTML = document
    .querySelector("#post_text")
    .value.replaceAll("\n", "<br>");
  console.log(document.querySelector("#post_text").value);
  document.querySelector("#postContent").classList.toggle("hidden");
}

// Event Listeners
window.onbeforeunload = function () {
  if (leaveMessage) return true;
};

document.querySelector("#heading").addEventListener("keyup", () => {
  document.querySelector("#url").value = encodeURIComponent(
    document.querySelector("#heading").value.trim()
  );
});
document.querySelector("#post_text").addEventListener("input", function() {
  // Calculate the optimal number of rows based on content
  const rows = Math.ceil(textArea.value.split("\n").length + 1);

  // Ensure a minimum of 20 rows and a maximum of 200 rows for flexibility
  textArea.rows = Math.min(Math.max(30, rows), 200);
});

// Submit functionality
function submit() {
  leaveMessage = fal
  document.querySelector("form").submit();
}

// Dynamic text area functionality
dynamicTextArea("#post_text");
function dynamicTextArea(id) {
  const textArea = document.querySelector(id);
  // Calculate the optimal number of rows based on content
  const rows = Math.ceil(textArea.value.split("\n").length + 1);

  // Ensure a minimum of 20 rows and a maximum of 200 rows for flexibility
  textArea.rows = Math.min(Math.max(30, rows), 200);
}