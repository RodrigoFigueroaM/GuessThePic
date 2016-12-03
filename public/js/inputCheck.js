var answer = "Google"
var numOfClicks = 0;
var main = function(){

  buildBut(answer);
  $('#answer').prop("disabled", true);

  $('.EachChar').on("click", function(){
    numOfClicks++;
    console.log(this.innerHTML);
    $('.answerChar').append(this.innerHTML);
    this.disabled = true;
    this.style.backgroundColor= "#e0b3ff";
    if (numOfClicks == answer.length)
    {
      $('#answer').prop("disabled", false);
    }

  });
  
  $('#clear').on("click", function(){
    $('.answerChar').empty();
    $('.EachChar').prop("disabled", false);

  });

  $('#answer').on("click", function(){

    console.log(document.getElementById("testChar").innerHTML);
    $('#newAnswer').append(document.getElementById("testChar").innerHTML);
  });


};
$(document).ready(main);

function buildBut(wordIn){
  console.log(answer.length);
  var i;
  for(i = 0; i < answer.length; i++)
  {
        $('.inChar').append(  '<button class="EachChar ui violet button">'+wordIn[i]+'</button>');
  }
}


