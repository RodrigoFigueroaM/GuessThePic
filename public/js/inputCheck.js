var buttonMan = function(answerGlobal)
{
    //var answer = shuffleWord(test1);
     $('#testChar').empty();
     $('.inChar').empty();
    console.log(answerGlobal);
     var arrayButtons = createWordButton(answerGlobal, '.inChar');
     var answerArray=[];
     var answerString='';

     $(arrayButtons).each(function(element)
     {
         $('#button'+ element).on('click', function()
         {
              arrayButtons[element].clicked();
            if( arrayButtons[element].numOfClicks % 2 !==0 )
            {
                $('.answerChar').append(this);
            }
            else
            {
                $('.inChar').append(this);
            }
         });
     });

     $('#checkAnswer').on("click", function()
     {
         answerString='';
         $('.answerChar .EachChar').each(function(value,element)
         {
             answerString+=$(element).html();
         });
        //send to socket
        socketSend("answer", JSON.stringify({"answer": answerString}));
         //$('#checkAnswer').prop("disabled", true);
        $('.EachChar').prop("disabled", true);
        console.log(answerString);
     });

};

function createWordButton(wordIn,element)
{
    var wordButton=[];
    var i = 0;
    $('#checkAnswer').prop("disabled", false);
    for(i = 0; i < wordIn.length; i++)
    {
        wordButton[i]= new BuildBut(wordIn[i],0,i);
    }
    for(i = 0; i < wordButton.length; i++)
    {
        $(element).append(wordButton[i].build());
    }
    return wordButton;
}


var BuildBut = function (letterIn, numOfClicks,id)
{
    var self = this;
    self.letterIn = letterIn;
    self. numOfClicks =numOfClicks;
    self.id= id;
    self.build = function()
    {
        var bttn ='<button class="EachChar ui violet button" id="button'+id+'">'+self.letterIn+'</button>';
        return bttn;
    };
    self.clicked = function()
    {
            self.numOfClicks++;
    };
};
