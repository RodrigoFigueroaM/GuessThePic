/* jshint browser: true, jquery: true, camelcase: true, indent: 2, undef: true, quotmark: single, maxlen: 80, trailing: true, curly: true, eqeqeq: true, forin: true, immed: true, latedef: true, newcap: true, nonew: true, unused: true, strict: true */

var http = require('http'),
    express = require('express'),
    app = express(),
    server = http.createServer(app).listen(8080);
    io = require('socket.io').listen(server),
    request = require('request');

console.log('Socket listening on port 8080');

//initualize users and socket connections
var users =[],
    connections = [],
    userId = 0;

//question variable
var questionAnswer = '';

//set timer to 30 sec to send a question
var timerDelay = 35000,
    timerId,
    startTimeMS = 0,
    gameTimer = 30000;


/********************************************************
* get the time remain of 30 sec timer
********************************************************/
var getRemainingTime = function() {
    return  30000 - ( (new Date()).getTime() - startTimeMS );
};

/********************************************************
* request opton to send to server
* para data - {path: <path>, method: <GET or POST>, <data: <data>>}
* return the json format for the request to server
********************************************************/
var requestOption = function(para) {

    //default option
    var option = {
        uri: 'http://localhost:3000' + para.path,
        headers: {
            accept: 'application/json',
            'content-type': 'application/json'
        }
    };

    //create get request option
    if(para.method.toUpperCase() === 'GET') {
        option['method'] = 'GET';

    //post option
    } else if (para.method.toUpperCase() === 'POST'){
        //set default data from parameter
        var data = para.data !== '' ? para.data : '';

        option['method'] = 'POST';
        option['json'] = data;
    }

    return option;
};

//socket io connection
io.sockets.on('connection', function(socket){

    'use strict';

    //push client soocket in to connections list
    connections.push(socket);
    console.log('Connected sockets: %s', connections.length);

    /********************************************************
    * listen for a new user to connect
    * para data             - {username: <name>}
    * return to all client  - [{
                                userId: <id>, 
                                username: <name>, 
                                life: 3, 
                                score: 0
                            }, <more users name>]
    ********************************************************/
    socket.on('new user', function(data) {

        //increse userId by 1
        userId += 1;

        //add new username and userId to socket
        socket.username = data.username;
        socket.userId = userId;

        var user = {
            userId: userId,
            username: socket.username,
            score: 0,
            life: 3
        }

        //push new username in to users list
        users.push(user);

        //send the new list of users to all clients
        io.sockets.emit('get users', JSON.stringify(users));
    });

    /********************************************************
    * send question every 35 sec
    * return to all users   - {picture: <url>, question: <question>, timer: <30 sec>}
    ********************************************************/
    // function to send request for question 
    var getQuestion = function() {
        request(
            //send GET request to server to retreive question picture and answer
            requestOption({
                path: '/question',
                method: 'GET'
            }),
            //call back of the POST request
            function(err, res, body) {
                if(err) {
                    console.log(err);
                } else {
                    //json obj to send back to clients
                    var jsonRes = {'picture': body.pic, 'question': body.question, timer: gameTimer};
                    console.log(jsonRes);
                    //save the answer
                    questionAnswer = body.answer;

                    //get the start time of sending question
                    startTimeMS = (new Date()).getTime();

                    //send the question to all clients
                    io.sockets.emit('get question', JSON.stringify(jsonRes));
                }
            }
        );
    };

    //send question every timerDelay interval
    timerId = setInterval(function() {
            getQuestion();
        }, timerDelay
    );
    
    /********************************************************
    * check user life if they answer question correctly
    * para             - NONE
    * return           - {userLife: <num>}
    ********************************************************/
    socket.on('end round', function() {
        //check if client answer right question before end round
        if(socket.answerCorrect === false) {
            //loop each users
            users.some(function(value, index) {

                //get index of user in users list
                if(value.userId === socket.userId) {
                    var userLife = value.life;

                    //user life > 0
                    if (userLife > 0) {
                        users[index].life -= 1;

                        var jsonRes = {userLife: users[index].life};

                        //send back client with how many life left
                        socket.emit('check userLife', JSON.stringify(jsonRes));
                    } 
                    //send the total score of client after loss 3 lives
                    else {
                        var data = {username: users[index].username, score: users[index].score};

                        //send username and score to server
                        request(
                            //send POST request to server
                            requestOption({
                                path: '/question',
                                method: 'POST',
                                data: data
                            }),
                            //call back of the POST request
                            function(err, res, body) {
                                if(err) {
                                    console.log(err);
                                } else {
                                    console.log(body);
                                }
                            }
                        );
                    }

                    //break out of some loop (for loop)
                    return true;
                }
            });
        }
    });

    /********************************************************
    * client want to play again
    * para                      - NONE
    * return to that client     - {waitTime: <millisecond>}
    ********************************************************/
    socket.on('play again', function(){
        //loop each users
        users.some(function(value, index) {
            console.log('this active');
            //get index of user in users list
            if(value.userId === socket.userId) {
                //reset default life to client
                users[index].life = 3;
                users[index].score = 0;

                var jsonRes = {waitTime: parseInt(getRemainingTime())};

                //send back to client how long to wait before next round
                socket.emit('check delay', JSON.stringify(jsonRes));

                //break out of some loop (for loop)
                return true;
            }
        });
    });

    /********************************************************
    * listen for client answer
    * para data             - {answer: <answer>}
    * return to all users   - {result: <true or false>}
    ********************************************************/
    socket.on('answer', function(data) {
        var timeRemain,
            result = 'false';

        socket.answerCorrect = false;

        //client answer correctly
        if(data.answer === questionAnswer) {
            timeRemain = parseInt(getRemainingTime());

            //loop each users
            users.some(function(value, index) {

                //get index of user in users list
                if(value.userId === socket.userId) {
                    //add set the score base on answer time
                    users[index].score += timeRemain;

                    //break out of some loop (for loop)
                    return true;
                }
            });

            socket.answerCorrect = true;
            result = 'true';
        }

        io.sockets.emit('check answer', JSON.stringify({'result': result}));
    });

    /********************************************************
    * listen for client to request score
    * para                  - NONE
    * return to all users   - {score: [
    *                               {username: <name>, userScore: <score>}
    *                               <more users score>
    *                           ]}
    ********************************************************/
    socket.on('score', function() {
        var jsonData;

        //send get request to server for users score
        request(
            requestOption({
                path: '/score',
                method: 'GET'
            }),
            function(err, res, body) {
            if (err) {
                console.log(err);
            } else {
                //send update score to all users
                jsonData = JSON.parse(body);
                console.log(jsonData);
                console.log(jsonData.right);

                //send top 10 score to all users
                io.sockets.emit('top score', JSON.parse(body));
            }
        });
    });

    //disconnect
    socket.on('disconnect', function() {

        //loop each users
        users.some(function(value, index) {

            //check if userId match socket userId
            if(value.userId === socket.userId) {
                //remove username from users array
                users.splice(index,1);
                console.log('Disconnect socket: %s', socket.username);

                //break out of some loop (for loop)
                return true;
            }
        });

        //update list of users on client side
        io.sockets.emit('get users', users);

        //disconnect socket
        connections.splice(connections.indexOf(socket), 1);
        console.log('Connected sockets: %s', connections.length);
    });
});