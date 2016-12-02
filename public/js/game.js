var main = function () {
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

        } else if (LivesLeft === 2) {

        } else if (LivesLeft === 1) {

        } else {
            showGameOver();
        }
    }

    var showGameOver = function () {
        //Display game over screen overlay
    }
};
$(document).ready(main);