/*********************************************************
*  Draws Image into the canvas
* image -  current interval on the window
* numberOfRows -  number of rows
* ynumberOfTiles - number  of colums
* array - array with indexes in format [[row,col]]
*********************************************************/
function drawImage(image,numberOfRows,numberOfColumns,array)
{
    var ctx = getContext();
    ctx.imageSmoothingEnabled = true;
    var img = new Image();   // Create new img element
    img.src = image; // Set source path

    // Elements that will be used to draw on canvas
    var randomIndex= 0,
        randomXpoint=0,
        randomYpoint=0;

    // Canvas elements
    var sx=0, // source initial X position
        sy=0, // source initial Y position
        sWidth, // source width
        sHeight, // source height
        dx=0,  // destionation initial X position
        dy=0, // destionation initial Y position
        dWidth=canvas.width/numberOfRows,  // destionation width
        dHeight=canvas.height/numberOfColumns; // destionation height

    /*********************************************************
    * When image is finished loading do...
    *********************************************************/
    img.onload = function()
    {
        /* Check if the there's still elements to draw on canvas*/
        if(array.length > 0)
        {
            sWidth=img.width/(numberOfRows); /*Scale width of image*/
            sHeight=img.height/(numberOfColumns);/*Scale height of image*/

            randomIndex = Math.floor(Math.random() * array.length);
            randomXpoint= array[randomIndex][0];
            randomYpoint = array[randomIndex][1];
            ctx.drawImage(
                            img,
                            randomXpoint *(sx+sWidth),
                            randomYpoint  *(sy+sHeight),
                            sWidth,
                            sHeight,
                            randomXpoint * (dx+dWidth),
                            randomYpoint * (dy+dHeight),
                            dWidth,
                            dHeight
                        );
            array.splice(randomIndex,1); /*Delete element in the array */
        }
    };
}

/*********************************************************
*  stops the timer on the window
* interval -  current interval on the window
*********************************************************/
function clearTimer(interval)
{
        clearInterval(interval);
}

/*********************************************************
*  sets the configuration for the animation on displaying
*   picture
*
* img -  a url. or local image name
* callback - function that will be called in this function
*********************************************************/
var Setup = function(img)
{
    var counter=20; /*seconds*/
    var refreshRate=2; /*tiles per seconds*/
    var images= img;
    var imageIndex=0;
    var numberOfRows=10;
    var numberOfColumns=5;
    var interval;
    var array=[];
    var timer=counter*refreshRate;


    array= twoDimAraray(numberOfRows,numberOfColumns);

    interval = setInterval(function()
    {
        if(timer===0)
        {
                clearInterval(interval);
        }
        $('body p').remove();
        $('body').prepend('<p>time left:'+ Math.floor(timer / refreshRate)+' seconds  </p>');
        timer--;
        drawImage(images,numberOfRows,numberOfColumns,array );

    },1000/refreshRate);

};

function clearCanvas()
{
    var ctx = getContext();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/*********************************************************
* Returns the context of the canvas fot re-use
*
*********************************************************/
function getContext()
{
    var canvas = $('#canvas').get(0);
    var ctx = canvas.getContext("2d");

    return ctx;
}
/*********************************************************
* initialize a two dimentional array with indexes
*       [[0,0],[0,1],[0,2]...[row,col]]
* row - Number of rows
* col - Number of columns
* returns a 2D array
*********************************************************/
var twoDimAraray = function (row,col)
{
    var twoDArray=[];
    var i=0,j=0;

    for(i =0; i < row; i++)
    {
        for (j = 0; j < col; j++)
        {
            twoDArray.push([i ,j]);
        }
    }
return twoDArray;
};




//ajax when answer the question
//end AnswerQuestion
