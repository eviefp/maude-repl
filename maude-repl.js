const spawn = require('child_process').spawn;

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var temp = require('temp');
var fs = require('fs');

app.use(express.static('public'));
app.use(bodyParser.json({ strict: false }));

app.post('/repl', function(req, res) {
    if(req.body.run.indexOf('SOCKET') > -1) {
        res.send('Nope. No sockets.');
        return;
    }
    temp.open('myPrefix', function(err, info) {
        if(!err) {
            fs.write(info.fd, req.body.run);
            fs.close(info.fd, function(err) {
               if(!err) {

                    var maude = spawn('./bin/maude27-linux/maude.linux64', ['-no-banner', '-batch' ,info.path]);
                    var response = "";
                    var sent = false;
                    var timeoutHandler = null;
                    var overallTimeoutHandler = null;

                    var sendResponse = function() {
                        if(overallTimeoutHandler) {
                            clearTimeout(overallTimeoutHandler);
                            overallTimeoutHandler = null;
                        }
                        if(!sent) {
                            res.send(response);
                            sent = true;
                            maude.kill();
                        }
                    }

                    maude.stdout.on('data', (data) => {
                        response += data;
                        console.log(data.toString());
                        if(data.indexOf("Maude>") > -1) {
                            if(timeoutHandler)
                                clearTimeout(timeoutHandler);
                            timeoutHandler = setTimeout(sendResponse, 500);
                        }
                    });

                    maude.stderr.on('data', (data) => {
                        console.log(data.toString());
                        response += data;
                        if(timeoutHandler)
                                clearTimeout(timeoutHandler);
                        timeoutHandler = setTimeout(sendResponse, 500);
                    });

                    maude.on('close', (code) => {
                        response += 'Maude crashed :(';
                        clearTimeout(timeoutHandler);
                        sendResponse();
                    });

                    overallTimeoutHandler = setTimeout(function() {
                        response += "Maude timed out after 10 minutes";
                        sendResponse();
                    }, 10 * 60 * 1000);
               }
            });
        }
    })

});

app.listen(3000, function() {
    console.log('Running on port 3000');
});
