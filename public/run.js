function toggleHelp() {
    var shortcuts = document.getElementById('keyboard-shortcuts');
    if(shortcuts.className == 'show') {
        shortcuts.className = 'hide';
    } else {
        shortcuts.className = 'show';
    }
}

function clearTextArea() {
    document.myCodeMirror.setValue('');
}

function showResult(event) {
    var output = document.getElementById('output');
    output.textContent = `Response at ${new Date().toLocaleTimeString()}\n` + this.response;
}

function sendCommand() {
    var value = document.myCodeMirror.doc.getValue();
    var request = new XMLHttpRequest();
    request.addEventListener('load', showResult);
    request.open("POST", "/repl");
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify({run: value}));
}

document.addEventListener("DOMContentLoaded", function(event) {
    var button = document.getElementById('run');
    var input = document.getElementById('input');
    button.onclick = sendCommand;
    document.myCodeMirror = CodeMirror.fromTextArea(input, {
        theme: "zenburn",
        lineNumbers: true,
        autofocus: true,
        viewportMargin: 100
    });
    document.myCodeMirror.setOption("extraKeys", {
       F9: sendCommand,
       'Ctrl-/': toggleHelp,
       F2: clearTextArea
    });
});