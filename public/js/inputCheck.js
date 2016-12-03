var answer = "Google"
var main = function(){

  buildBut(answer);

  $('.EachChar').on("click", function(){
    console.log(this.innerHTML);
    $('.answerChar').append(this.innerHTML);
    this.disabled = true;
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
        $('.inChar').append('<button class="EachChar">'+wordIn[i]+'</button>');
  }
}
