var main = function()
{
    //ajax when the score need update
        GetScore();

    //    topScoreModel.players([{name:'XXXXX',score:'100'}]);
};

function GetScore()
{
  'use strict';
  console.log('retieve score');
  $.ajax({
          type: 'GET',
          dataType: 'json',
          contentType: 'application/json',
          url: 'http://localhost:3000/score',
          success: function(data){
            topScoreModel.players(data);
            console.log(data);
            console.log('Clear-- score');
          }
  });
}

// Class to represent a row in the seat reservations grid
function TopPlayer(name, score) {
    var self = this;
    self.name = name;
    self.score = score;
}

// Overall viewmodel for this screen, along with initial state
var topScoreModel =
{
    players:ko.observableArray(),

    addpayer:function()
        {
            self.players.push(new TopPlayer(dataIn.scoreSort[0].UserName,dataIn.scoreSort[0].UserScore));
        }
};
/*function topScoreModel()
{
    var self = this;

    // Editable data
    self.players= ko.observableArray();

    self.addpayer=function()
        {
            self.players.push(new TopPlayer(dataIn.scoreSort[0].UserName,dataIn.scoreSort[0].UserScore));
        };
}*/

ko.applyBindings( topScoreModel);


$(document).ready(main);
