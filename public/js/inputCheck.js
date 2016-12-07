/********************************************************************
* Handles button listener
* para             -
*                   answerGlobal: string or char
* return           -
*                   none
********************************************************************/
var buttonMan = function(answerGlobal)
{
     $('#testChar').empty(); //empty field for buttons
     $('.inChar').empty();  // empty field for buttons
     var arrayButtons = createWordButton(answerGlobal, '.inChar');
     var answerArray=[];
     var answerString='';

     $(arrayButtons).each(function(element)
     {
         $('#button'+ element).on('click', function()
         {
            arrayButtons[element].clicked();
            if( arrayButtons[element].numOfClicks % 2 !== 0)
            {
                $('.answerChar').append(this);
            }
            else
            {
                $('.inChar').append(this);
            }
         });
     });

};

     /* when checkAnswer button is clicked get in html of inside of element in checkAnswer*/
    $('#checkAnswer').on("click", function()
    {
        answerString=''; //clear answer everytime before use
        $('.checkAnswer .EachChar').each(function(value,element)
        {
            answerString+=$(element).html();
        });
       //send to socket
       socketSend("answer", JSON.stringify({"answer": answerString}));
    });
/********************************************************************
* decomposes a word into chars to create html buttons and
*    append to a html field
* para             -
*                   wordIn a "string"
*                   element html element
* return           -
*                   array with sinamically generated buttons
********************************************************************/
function createWordButton(wordIn,element)
{
    var wordButton=[];
    var i = 0;
    $('#warningMess').hide();
    $('#checkAnswer').prop("disabled", false);
    for(i = 0; i < wordIn.length; i++)
    {
        wordButton[i]= new BuildBut(wordIn[i],i);
    }
    for(i = 0; i < wordButton.length; i++)
    {
        $(element).append(wordButton[i].build());
    }
    return wordButton;
}

/********************************************************************
* creates a dynamically object html object
* para             -
*                   letterIn a char that will be displayed
*                   id to reference the id of the element
* return           -
*                   html object with of button type
*                   <button class="EachChar ui violet button"
*                            id="button'+id+'">
*                    </button>
********************************************************************/
var BuildBut = function (letterIn,id)
{
    var self = this;
    self.letterIn = letterIn;
    self. numOfClicks =0;
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
