
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

$(document).ready(main);
