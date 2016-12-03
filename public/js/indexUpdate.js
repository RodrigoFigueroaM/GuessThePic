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
              topScoreModel.players(data.scoreSort);

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

function user(username)
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
    players : ko.observableArray(),
    newUserText :  ko.observable(),
    addplayer: function()
        {
            players.push(new TopPlayer(UserName,UserScore));
        },
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
            var player = new user( this.newUserText());
            return player;
        }
};

ko.applyBindings(topScoreModel) ;


$(document).ready(main);
