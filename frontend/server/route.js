function welcomeEmail(from, to, cost, hours, mins) {
    return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' + '<html xmlns="http://www.w3.org/1999/xhtml">' + '<head> ' + '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' + '<meta name="viewport" content="width=device-width, initial-scale=1.0"/>' + '<title>Runaway</title>' + '<style type="text/css">' + '</style>' + '</head>' + '<body>' + '<h1>Runaway</h1>' + '<h2>Thanks for using Runaway, below is your itenerary:</h2>' + '<p><b>From:</b>' + from + '</p>' + '<p><b>To:</b>' + to + '</p>' + '<p><b>Total Cost:</b>' + cost + '</p>' + '<p><b>Time:</b>' + hours + 'h' + mins + 'm</p>' + '</body>' + '</html>'
};

function matchEmail(from, to, cost, hours, mins) {
    return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' + '<html xmlns="http://www.w3.org/1999/xhtml">' + '<head> ' + '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' + '<meta name="viewport" content="width=device-width, initial-scale=1.0"/>' + '<title>Runaway</title>' + '<style type="text/css">' + '</style>' + '</head>' + '<body>' + '<h1>Runaway</h1>' + '<h2>Thanks for using Runaway, below is your itenerary:</h2>' + '<p><b>From:</b>' + from + '</p>' + '<p><b>To:</b>' + to + '</p>' + '<p><b>Total Cost:</b>' + cost + '</p>' + '<p><b>Time:</b>' + hours + 'h' + mins + 'm</p>' + '</body>' + '</html>'
};

Meteor.methods({
    api_postRoute: function(lat, lon, budget, hours) {
        var fut = new Future();
        postRequest("http://127.0.0.127", 3000, '/api/route', {
            lat: lat,
            lon: lon,
            budget: budget,
            hours: hours
        }, function(error, result) {
            if (result) {
                fut['return'](result.data);
            } else {
                fut['return']([]);
            }
        });
        return fut.wait();
    },
    api_finishUp: function(fullName, email, lat, lon, from, to, hours, mins, cost) {
        Users.insert({
            email: email,
            lat: lat,
            lon: lon,
            fullName: fullName
        }, function(err, userID) {
            var existingUsers = Users.findOne({
                email: {
                    $ne: email
                }
            });
            if (existingUsers != null) {
                var newGroupID = Groups.insert({
                    travelers: [existingUsers._id, userID]
                }, function(err, id) {
                    sendEmail(id, fullName, email, lat, lon, from, to, hours, mins, cost);
                });
            } else {
                sendEmail(null, fullName, email, lat, lon, from, to, hours, mins, cost);
            }
        });
    }
});


function sendEmail(newGroupID, fullName, email, lat, lon, from, to, hours, mins, cost) {
    /*
    curl -X POST --user "168e11004bf9b958273a58d65983c3c9:a3c92c3c92fe031f939cc2f83aa20f2c" \    
    https://api.mailjet.com/v3/send/message \    
    -F from='Miss Mailjet <ms.mailjet@example.com>' \    -F to=mr.mailjet@example.com \    -F subject='Hello World!' \    -F text='Greetings from Mailjet.'XReplaceAll.*Aa\

    //Parse route
    curl -X POST --user "$MJ_APIKEY_PUBLIC:$MJ_APIKEY_PRIVATE" \
            http://api.mailjet.com/v3/REST/parseroute \   
         -d '{"URL":"http://your-domain/webhook"}' \   
         -H "Content-Type: application/json"
    */
    spawn = Npm.require('child_process').spawn;
    var parse_text = "";
    if (newGroupID) {
        console.log("Sending email to group " + newGroupID);
        /*mailjet = spawn('curl', ['-X', 'POST', '--user', "168e11004bf9b958273a58d65983c3c9:a3c92c3c92fe031f939cc2f83aa20f2c",
            'https://api.mailjet.com/v3/send/message', '-F', "from='Runaway Server <runawayyesreply@gmail.com>'",
            '-F', 'to=rohitkrishnan101@gmail.com', '-F', "subject='You have a match!'", '-F',
            "html='" + matchEmail(from, to, cost, hours, mins) + "'"
        ]);*/
        /*parseroute = spawn('curl', ['-X', 'POST', '--user', "168e11004bf9b958273a58d65983c3c9:a3c92c3c92fe031f939cc2f83aa20f2c",
            'http://api.mailjet.com/v3/REST/parseroute', '-d', '{"URL":"http://your-domain/webhook"}',
            '-H', "Content-Type: application/json"
        ]);*/
    } else {
        /*mailjet = spawn('curl', ['-X', 'POST', '--user', "168e11004bf9b958273a58d65983c3c9:a3c92c3c92fe031f939cc2f83aa20f2c",
            'https://api.mailjet.com/v3/send/message', '-F', "from='Runaway Server <runawayyesreply@gmail.com>'",
            '-F', 'to=rohitkrishnan101@gmail.com', '-F', "subject='Welcome to Runaway!'", '-F',
            "html='" + welcomeEmail(from, to, cost, hours, mins) + "'"
        ]);*/
    }
}