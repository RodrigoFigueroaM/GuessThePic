
var main = function()
{
    //ajax when the score need update
        GetScore();

};

function GetScore()
{
  'use strict';
  $.ajax({
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    url: 'http://localhost:3000/score',
    success: function(data){
        MasterController.scoreModel.player(data.scoreSort);

    }
  });
}


/******************************
*        Classes
*******************************/

// Class to represent a row in the seat reservations grid
function TopPlayer(UserName,UserScore)
 {
    var self = this;
    self.UserName = UserName;
    self.UserScore = UserScore;
}

function User(username)
{
    var self = this;
    self.username = username;
    self.lives = 3;
}


/******************************
*        Models
*******************************/
// Overall viewmodel for this screen, along with initial state
var topScoreModel =
{
    player : ko.observableArray(),
    addplayer: function()
        {
            player.push(new TopPlayer(UserName,UserScore));
        }
};

var loginModel =
{
    newUserText :  ko.observable(),
    /*loging controller */
    loginFunction : function()
    {
            var userInput = $('#usernameInput').val();
            var user = this.createNewUser(this.newUserText());
            socketSend('new user', user);
            $('.homepage').hide();
            $('.game').show();
    },
        /*user controller */
        createNewUser: function()
        {
            var player = new User( this.newUserText());
            return player;
        }
};

var onlineUsersModel =
{
    onlineUsers: ko.observableArray([]),
};

var gameStatusModel =
{
    checkFunction: function()
    {
            answerString='';
            $('.answerChar .EachChar').each(function(value,element)
            {
                answerString+=$(element).html();
            });
           //send to socket
           socketSend("answer", JSON.stringify({"answer": answerString}));
           console.log(answerString);
    }

};

/******************************
*        Main controller in charge of models
*******************************/

var MasterController =
{
    scoreModel: topScoreModel,
    loging: loginModel,
    userOnlineController :onlineUsersModel,
    gameStatusController:gameStatusModel
};

ko.applyBindings(MasterController);

$('.ui.form').submit(function(event) {
  event.preventDefault();
});

$('#usernameInput').on('keypress', function(event) {
  if (event.keyCode === 13) {
    console.log("enter pressed");
    MasterController.loging.loginFunction();
  }
});

$(document).ready(main);
