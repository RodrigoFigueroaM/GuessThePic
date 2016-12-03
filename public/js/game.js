var main = function () {
  'use strict'
  $('.game').hide();

  $('#playBtn').click(function () {
    var userInput = $('#usernameInput').val();
    var data = {
      'username': userInput
    };
    socketSend('new user', data);
    $('.homepage').hide();
    $('.game').show();
  });

  //Show number of hearts that represents lives
  var changeLives = function (LivesLeft) {
    if (LivesLeft === 3) {
      $('#lives').text = '<i class="heart icon"></i>' +
        '<i class="heart icon"></i><i class="heart icon"></i>';
    } else if (LivesLeft === 2) {
      $('#lives').text = '<i class="heart icon"></i>' +
        '<i class="heart icon"></i><i class="empty heart icon"></i>';
    } else if (LivesLeft === 1) {
      $('#lives').text = '<i class="heart icon"></i>' +
        '<i class="empty heart icon"></i><i class="empty heart icon"></i>';
    } else {
      $('#lives').text = '<i class="empty heart icon"></i>' +
        '<i class="empty heart icon"></i><i class="empty heart icon"></i>';
      showGameOver();
    }
  };

  //Display game over screen overlay
  var showGameOver = function () {
    $('.game').dimmer('show');
  };

};
$(document).ready(main);