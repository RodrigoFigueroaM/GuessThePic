var socket = io.connect('http://localhost:8080');

/*********************************************************
* send request to socket server
* path - socket path
* data - json format
*********************************************************/
var socketSend = function(path, data) {
    //send to socket with data
    if(data) {
        socket.emit(path, data);
    }

    //send only path
    else {
        socket.emit(path);
    }

};

var main = function() {

    /*********************************************************
    * received new list of users
    * data - [{userId: <id>, username: <name>, life: 3}, <more users name>]
    *********************************************************/
    socket.on('get users', function(data) {
        console.log(data);
    });

    /*********************************************************
    * received new question, image, and timer
    * data - {picture: <url>, answerId: <id>, timer: <num>}
    *********************************************************/
    socket.on('get question', function(data) {
        console.log(data);
    });

    /*********************************************************
    * check how many life that user still have after end round
    * data - {userLife: <num>}
    *********************************************************/
    socket.on('check userLife', function(data) {
        console.log(data);
    });

    /*********************************************************
    * check how delay user want play again when user join in middle of game
    * data - {waitTime: <millisecond>}
    *********************************************************/
    socket.on('check delay', function(data) {
        console.log(data);
    });

    /*********************************************************
    * check user answer is right or wrong
    * data - {result: <true or false>}
    *********************************************************/
    socket.on('check answer', function(data) {
        console.log(data);
    });

    /*********************************************************
    * get the top 10 score 
    * data: {score: [
    *               {username: <name>, userScore: <score>}
    *               <more users score>
    *       ]}
    *********************************************************/
    socket.on('top score', function(data){
        console.log(data);
    });

};

$(document).ready(main);
