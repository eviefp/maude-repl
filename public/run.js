function showResult(event) {
    var output = document.getElementById('output');
    output.textContent = this.response;
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
    document.myCodeMirror = CodeMirror.fromTextArea(input);    
});