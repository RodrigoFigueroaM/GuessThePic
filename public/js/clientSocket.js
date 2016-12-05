var socket = io.connect('http://localhost:8080');
//process
$('.ui.progress').progress({
    duration    : 800,
    total       : 30,
    percent     : 100,
    value       : 30,
    text        : {
        active: '{value} sec'
    }
});
//testing only
var userLife = 3;
var myRestart;

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
        topScoreModel.onlineUsers(JSON.parse(data));
    });

    /*********************************************************
    * received new question, image, and timer
    * data - {picture: <url>, answerId: <id>, timer: <num>}
    *********************************************************/
    socket.on('get question', function(data)
     {
        var $progress       = $('.ui.progress');

        // reset to default
        clearInterval(window.fakeProgress)
        $progress.progress('set value', 30);

        // updates every 1 sec until 0
        window.fakeProgress = setInterval(function() {
            $progress.progress('decrement', 1);

            // stop timer when 0
            if($progress.progress('get value') <= 0) {
                if(userLife >0) {
                    socketSend('end round');
                }
                clearInterval(window.fakeProgress);

            }
        }, 1000);
        var pictureData= JSON.parse(data);
        console.log(pictureData.question);
        $('#questionSpace').empty();
        $('#questionSpace').append(pictureData.question);
        clearCanvas();

        Setup(pictureData.picture);
        buttonMan(pictureData.answerEn);
    //    console.log(data);
    });

    /*********************************************************
    * check how many life that user still have after end round
    * data - {userLife: <num>}
    *********************************************************/
    socket.on('check userLife', function(data) {
        data = JSON.parse(data);
        userLife = data.userLife;
        console.log(userLife);
        //var test = JSON.parse(data);
        if(userLife === 0)
        {
          //execute end game
          $('#setMain').empty();
          $('#setMain').append(
              '<div> GAME OVER </div>' +
              '<button class="ui button" onclick="myRestart()">Play Again</button>'
          );
        }
        else
        {

          $('#lives').empty();
          for(var i = 0 ; i < userLife ; i++)
          {
            $('#lives').fadeIn("slow").append('<i class="red heart icon" ></i>');
          }
        }
    });

    /*********************************************************
    * check how delay user want play again when user join in middle of game
    * data - {waitTime: <millisecond>}
    *********************************************************/
    socket.on('check delay', function(data)
    {
        console.log(data);
    });

    /*********************************************************
    * check user answer is right or wrong
    * data - {result: <true or false>}
    *********************************************************/
    socket.on('check answer', function(data) {
        data = JSON.parse(data);
        if(data.result === 'true')
        {
          $('#checkAnswer').prop("disabled", true);
          $('.EachChar').prop("disabled", true);
          $('#warningMess').empty();
          $('#warningMess').append('wrong');

          $('#scoreMain').empty();
          $('#scoreMain').append(data.score);
        }
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


function myRestart(){
  location.reload();
}
