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

// Class to represent a row in the seat reservations grid
function TopPlayer(UserName,UserScore) {
    var self = this;
    self.UserName = UserName;
    self.UserScore = UserScore;
}

// Overall viewmodel for this screen, along with initial state
var topScoreModel =
{
    players:ko.observableArray(),

    addpayer: function()
        {
            self.players.push(new TopPlayer(UserName,UserScore));
        }
};

ko.applyBindings(topScoreModel) ;


$(document).ready(main);
