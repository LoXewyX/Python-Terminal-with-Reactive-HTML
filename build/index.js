let textArray = [];
let index = 0;
let welcome = true;

function scrollToBottom(id) {
  const element = document.getElementById(id);
  const height = element.scrollHeight;
  console.log(height);
  element.scrollTo({ top: height, behavior: "smooth" });
}


function store() {
  const txt = document.getElementById("text_input").value;
  if (textArray.length === 0 && txt === "") return;
  const indent = parseInt(document.getElementById("text_indent").value);

  if (index >= 0 && index < textArray.length) {
    // Update an existing line
    textArray[index] = { i: indent, txt: txt };
    const line = "&nbsp;".repeat(4).repeat(indent);
    // Seems like it generates a phantom ".code-el" when the welcome is true.
    const pos =
      textArray.length - (textArray.length - index) + (welcome ? 2 : 1);
    document.querySelector(
      `.code-el:nth-child(${pos})`
    ).innerHTML = `<span class="index">${index}</span><span class='${
      indent === 0 ? "arrow me-2 nodrag'>" : "dots me-2 nodrag'>"
    }${indent === 0 ? "&gt;&gt;&gt;" : "..."}</span>${line}${txt}`;
  } else {
    // Add a new line
    textArray.push({ i: indent, txt: txt });
    const line = "&nbsp;".repeat(4).repeat(indent);
    document.getElementById(
      "text"
    ).innerHTML += `<div class="code-el"><span class="index">${index}</span><span class='${
      indent === 0 ? "arrow me-2 nodrag'>" : "dots me-2 nodrag'>"
    }${indent === 0 ? "&gt;&gt;&gt;" : "..."}</span>${line}${txt}</div>`;
  }

  if (txt.endsWith(":"))
    document.getElementById("text_indent").value = indent + 1;
  document.getElementById("text_input").value = "";
  scrollToBottom("text");
  index = textArray.length;
}

function clean() {
  document.getElementById("text").innerHTML = "";
  document.getElementById("text_indent").value = 0;
  textArray = [];
  welcome = false;
  index = 0;
}

// exposed
eel.expose(getString);

function getString() {
  if (textArray.length === 0) return;

  let text = "";
  for (var i = 0; i < textArray.length; i++) {
    text += "\t".repeat(textArray[i].i) + textArray[i].txt + "\n";
  }
  text = text.slice(0, -1);

  let content = "";
  eel.get_string(text)((code) => {
    let s = '<div style="opacity: .5;">';
    code.forEach((e) => (s += `<div>${e}</div>`));
    document.getElementById(
      "text"
    ).innerHTML += `<div style="opacity: .5;">${s}<hr /></div>`;
  });

  console.log(content);

  document.getElementById(
    "text"
  ).innerHTML += `<div style="opacity: .5;">${content}<hr /></div>`;
  textArray = [];
  document.getElementById("text_indent").value = 0;
  scrollToBottom("text");
}

// Input functionality
function inputNumbers(evt) {
  const inputElement = evt.target;
  const currentValue = inputElement.value;
  inputElement.value = currentValue.replace(/\D/g, "");
}

document.addEventListener("keydown", function (event) {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    document.getElementById("compile").click();
  } else if (
    (event.ctrlKey || event.metaKey) &&
    event.altKey &&
    event.key === "ArrowLeft"
  ) {
    event.preventDefault();
    let i = document.getElementById("text_indent").value;
    if (parseInt(i) > 0)
      document.getElementById("text_indent").value = parseInt(i) - 1;
  } else if (
    (event.ctrlKey || event.metaKey) &&
    event.altKey &&
    event.key === "ArrowRight"
  ) {
    let i = document.getElementById("text_indent").value;
    if (parseInt(i) < 99)
      document.getElementById("text_indent").value = parseInt(i) + 1;
  } else if (
    (event.ctrlKey || event.metaKey) &&
    event.altKey &&
    event.key === "ArrowUp"
  ) {
    if (textArray.length === 0) {
      document.getElementById("text_indent").value = 0;
      return;
    }
    if (index < textArray.length) {
      index += 1;
      document.getElementById("text_input").value =
        textArray[index] === undefined ? "" : textArray[index].txt;
      document.getElementById("text_indent").value =
        textArray[index] === undefined ? 0 : textArray[index].i;
    }
  } else if (
    (event.ctrlKey || event.metaKey) &&
    event.altKey &&
    event.key === "ArrowDown"
  ) {
    if (textArray.length === 0) {
      document.getElementById("text_indent").value = 0;
      return;
    }
    if (index > 0) {
      index -= 1;
      document.getElementById("text_input").value = textArray[index].txt;
      document.getElementById("text_indent").value = textArray[index].i;
    }
  } else if (event.key === "Delete") {
    event.preventDefault();
    document.getElementById("clean").click();
  } else if (event.key === "Enter") {
    document.getElementById("forward").click();
  }
  document.getElementById("edit").innerHTML =
    index >= 0 && index < textArray.length
      ? `<div>${index}</div>`
      : '<i class="fa-solid fa-up-right-from-square"></i>';
});

// Core reactive
eel.expose(setHTML)
function setHTML(html) {
  document.getElementsByTagName("html")[0].innerHTML = html;
};
