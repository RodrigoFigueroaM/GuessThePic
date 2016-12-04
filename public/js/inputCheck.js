var main = function()
{
    var test = "GOOGLE".addChar();
    var answer = test.shuffle();
//     var factory = new ButtonFactory(answer);
//     factory.createWordButton();
//     factory.appendTo('.inChar');

    //var answer = shuffleWord(test1);
    //console.log(answer);
     var arrayButtons = createWordButton(answer, '.inChar');
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

     $('#answer').on("click", function()
     {
         answerString='';
         $('.answerChar .EachChar').each(function(value,element)
         {
             answerString+=$(element).html();
         });

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

//Original : http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
String.prototype.addChar = function makeid()
{
    var text = "";
    var possible = "ACDEFGHILNORSTUW";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return this + text;
}

//original : http://stackoverflow.com/questions/3943772/how-do-i-shuffle-the-characters-in-a-string-in-javascript
String.prototype.shuffle = function () {
    var a = this.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
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
