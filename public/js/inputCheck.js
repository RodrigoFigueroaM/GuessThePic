var main = function()
{
    var answer = "Google";
//     var factory = new ButtonFactory(answer);
//     factory.createWordButton();
//     factory.appendTo('.inChar');
     var arrayButtons = createWordButton(answer, '.inChar');
     var answerString='';

     $(arrayButtons).each(function(element)
     {
         $('#button'+ element).on('click', function()
         {
              arrayButtons[element].clicked();
            if( arrayButtons[element].numOfClicks % 2 !==0 )
            {
                $('.answerChar').append(this);
                 answerString+=arrayButtons[element].letterIn;

            }
            else
            {
                $('.inChar').append(this);
                answerString-=arrayButtons[element].letterIn;
            }

         });
     });

     $('#answer').on("click", function()
     {
         console.log(answerString);
     });


};
$(document).ready(main);

function createWordButton(wordIn,element)
{
    var wordButton=[];
    var i = 0;
    for(i = 0; i < wordIn.length; i++)
    {
        wordButton[i]= new BuildBut(wordIn[i],0,i);
    }
    for(i = 0; i < wordButton.length; i++)
    {
        $(element).append(wordButton[i].build());
    //    $(wordButton[i]).bind('click',function(){console.log(":");});
    }
    return wordButton;
}



var ButtonFactory = function (wordIn)
{
    var self = this;
    self.wordIn = wordIn;
    self.wordButton =[];
    self.createWordButton = function()
    {
        var i=0;
        for(i = 0; i < self.wordIn.length; i++)
        {
            console.log(self.wordIn.length);
            self.wordButton[i] = new BuildBut(self.wordIn[i],0,i);
            console.log(self.wordButton.length);
        }
    };
    self.appendTo = function(element)
    {
        for(i = 0; i < self.wordButton.length; i++)
        {
            $(element).append(self.wordButton[i].build());
        }
    };
};

var BuildBut = function (letterIn, numOfClicks,id)
{
    var self = this;
    self.letterIn = letterIn;
    self. numOfClicks =numOfClicks;
    self.id= id;
    self.build = function()
    {
        var bttn ='<button class="EachChar ui violet button" id="button'+id+'">'+self.letterIn+' '+self.numOfClicks+'</button>';
        return bttn;
    };
    self.clicked = function()
    {
            self.numOfClicks++;
    };
};
