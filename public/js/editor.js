function formatSelectedText(openTag, closeTag) {
    const myTextarea = document.getElementById("post_text");
  
    // Get the selected text and its position
    const selectedText = myTextarea.value.substring(myTextarea.selectionStart, myTextarea.selectionEnd);
    const selectionStart = myTextarea.selectionStart;
  
    // Create the formatted text
    const formattedText = `${openTag}${selectedText}${closeTag}`;
  
    // Replace the selected text with an empty string
    myTextarea.value = myTextarea.value.replace(selectedText, "");
  
    // Insert the formatted text at the original selection start
    const newText = myTextarea.value.slice(0, selectionStart) + formattedText + myTextarea.value.slice(selectionStart);
  
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
      formatSelectedText("<a href=\"" + url + "\" target=\"_blank\">", "</a>");
    }
  }
  
  // "Show preview" functionality
function togglePreview() {
    document.querySelector(".main > input").classList.toggle("hidden");  
    document.querySelector("#postPreview").classList.toggle("hidden");  
    document.querySelector("#postPreview").innerHTML = document.querySelector("#post_text").value;
    console.log(document.querySelector("#post_text").value)
    document.querySelector("#postContent").classList.toggle("hidden");  
}

// Event Listeners
document.querySelector("#heading").addEventListener("keyup", ()=> {
    document.querySelector("#url").value = encodeURIComponent(document.querySelector("#heading").value.trim());
})