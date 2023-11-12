addEventListener("DOMContentLoaded", createEventListeners);

function createEventListeners() {
  document
    .querySelectorAll(".target, .target > p")
    .forEach((element) =>
      element.addEventListener("click", toggleCSSVisibility)
    );

  document
    .querySelectorAll(".target > dialog > button")
    .forEach((radio) => radio.addEventListener("click", closeDialog));

  document
    .querySelectorAll(".target > dialog")
    .forEach((radio) => radio.addEventListener("click", closeDialog));

  /* *** Helper functions *** */

  function toggleCSSVisibility(e) {
    var container;
    switch (e.target.parentElement.tagName) {
      case "BODY":
      case "DIV":
        if (e.target.tagName == "P") {
          container = e.target.parentElement;
          e.stopPropagation();
        } else container = e.target;
        break;
      case "DIALOG":
        container = e.target.parentElement;
        break;
    }

    var displayValue = container.querySelector("style").style.display;
    if (displayValue == "none" || displayValue == "") {
      container.querySelector("style").style.display = "block";
      container.querySelector("dialog").showModal();
    } else {
      container.querySelector("style").style.display = "none";
    }
  }

  function closeDialog(e) {
    var dialog;
    switch (e.target.parentElement.tagName) {
      case "BODY":
      case "DIV":
        dialog = e.target;
        break;
      case "DIALOG":
        dialog = e.target.parentElement;
        break;
    }
    dialog.close();
  }
}
