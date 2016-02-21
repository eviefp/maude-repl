const spawn = require('child_process').spawn;

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var temp = require('temp');
var fs = require('fs');

app.use(express.static('public'));
app.use(bodyParser.json({ strict: false }));

app.post('/repl', function(req, res) {
    
    temp.open('myPrefix', function(err, info) {
        if(!err) {
            fs.write(info.fd, req.body.run);
            fs.close(info.fd, function(err) {
               if(!err) {

                    var maude = spawn('./bin/maude27-linux/maude.linux64', ['-no-banner', '-batch' ,info.path]);
                    var response = "";
                    var sent = false;
                    var timeoutHandler = null;
                    
                    var sendResponse = function() {
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
                        if(!sent) {
                            res.send('Maude crashed :(');
                        }
                    });
                   
               } 
            });
        }
    })
       
});

app.listen(3000, function() {
    console.log('Running on port 3000');
});
