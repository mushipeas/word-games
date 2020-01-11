//remember to test scalability of screen.


//define variables
var $h1 = $('h1');
var blockSpace = $('#blockSpace');
var wordSpace = $('#wordSpace');
var gameHeading = $('#heading');
var scoreCount = $('#scoreCount');

//word display items
var oldWord = [];
var activeWord = [];
var prevWord = [];
var newWord = [];
var activeChar = "";
var charCount = 0;
var wordCount = 0;
var score = 0;
var startTime = 0;

var scrollDist = "0rem";
var activeWordWidth = "";
var prevWordWidth = "";

//start code - possibly request choice of word source
$(document).ready(function(){
  $(document).click(function() {
    $(document).off("click");
    $h1.fadeOut(3000, function() { //was 3000
      askChoice();
    });
  });
});

//ask for word source
askChoice = function() {
  $("#textSelectionBox").html("<h3>What words would you like?</h3>");
  //create list of options
  for (var option in wordOptions) {
    //console.log(wordOptions[option]); //debugging
    var optionBlock = $("<div class='card text-center' style='padding: 1rem'></div>");
    optionBlock.append($("<h2 class='card-title'></h2>").text(wordOptions[option].name));
    optionBlock.append($("<p class='card-text'></p>").text(wordOptions[option].description));
    let thisOption = option; //to enable the click hook below to work. Not sure how else to
    optionBlock.click(function(){
      console.log("Game Started : " + wordOptions[thisOption].name); //debug code
      startGame(wordOptions[thisOption]); //should start game with unique inputs per block
    });
    var optionBlockContainer = $("<div class='block col-sm-3'></div>").append(optionBlock);
    blockSpace.append(optionBlockContainer);
  };
};

//start the game
var startGame = function(choice) {
  console.log("startGame")

  $("#textSelectionBox").fadeOut(1000); //should be >= blockSpace fadeOut
  blockSpace.fadeOut(1000, function(){ //was 1000

    //create array from words
    lswords = choice.wordsCombined.split(" ");
    console.log("created word array");

    //create heading during word game
    gameHeading.append($("<h2></h2>").text(choice.name));
    gameHeading.css('visibility', 'visible');

    //display words (+initialise variables)

    wordChange();
    startTimer();
    //activate keypress hook
    $(document).keypress(function( event ) {
      if ( event.which == 13 ) {
        event.preventDefault();
      }
      //console.log(event.key); //testing keypress output
      if (event.key == activeChar || event.key.toUpperCase() == activeChar) {
        charCount++;
        //console.log("event.key.toUpperCase(): " + event.key.toUpperCase());
        //console.log("activeChar: " + activeChar + ", activeWord: " + activeWord);
        if (activeChar == activeWord.slice(-1)) {
          //$("#active-word").effect( "bounce" );
          wordChange(1);
          score++;
        }
        activeChar = activeWord[charCount];
      }
      else {
        console.log("wrong word");
        wordChange(-1);
        score = score - 0.5;
      }
      updateTimer()
    });
  });
  //rolling function with each word - depending on complete or fail,
  //function on the word either appends new word to wordSpace or does a step back
  //write
  //some sort of indication of word needing to be written
  //words scroll up (fast) as each line is finished
  //words go back one line if incorrect key is hit
  //key event listener? - possibly needs document on function.
  //must go through each word (letter by letter) and equate that letter to a key press.
  //use <br> breaks to go up or down a line.
}

var wordChange = function(change){
  charCount = 0;
  //console.log("change: " + change);
  if (wordCount != 0 || change == 1) {
    wordCount = wordCount + change;
  }
  if (wordCount == 0) {
    oldWord = [];
  } else if (wordCount <= 5) {
    oldWord = lswords.slice(0,wordCount).join(" ");
  } else {
    oldWord = lswords.slice(wordCount-5,wordCount).join(" ");
  }
  prevWord = activeWord;
  activeWord = lswords[wordCount] + " ";
  //console.log("wordCount: " + wordCount);
  //console.log("new activeWord: " + activeWord);
  activeChar = activeWord[charCount];
  newWord = " " + lswords.slice(wordCount+1,wordCount+5).join(" "); //was +10

  refreshWordSpace(change);
}

var refreshWordSpace = function(change){
  //console.log("refreshing wordSpace...");

  prevWordWidth = activeWordWidth;
  var tempNewWord = $('<p id="active-word"></p>').text(activeWord  + " ");
  activeWordWidth = wordWidth(tempNewWord);
  console.log("Active Word Width: " + activeWordWidth );

  scrollDist = (prevWordWidth + activeWordWidth) / 2 + 10 + "px";
  document.documentElement.style.setProperty('--revWidth', ("-" + scrollDist)); //sets reverse scroll distance
  //scrollDist = (prevWord.length + activeWord.length) / 2 + 2 + "rem";
  //console.log("scrollDist: " + scrollDist);

  var animation = "";
  if (change == 1) {
    animation = "slideInRight";
  } else if (change == -1 || wordCount != 0) {
    animation = "slideInLeft";
  }

  var newWordSpace = $('<div id="wordSpace" class="row"></div>');
  newWordSpace.append($('<p id="old-word" class="animated ' + animation +'"></p>').text(oldWord  + " "));
  newWordSpace.append($('<p id="active-word" class="animated ' + animation +'"></p>').text(activeWord  + " "));
  newWordSpace.append($('<p id="new-word" class="animated ' + animation +'"></p>').text(newWord + "..."));
  document.documentElement.style.setProperty('--width',scrollDist);
  console.log(document.documentElement.style.getPropertyValue('--revWidth'));
  console.log(document.documentElement.style.getPropertyValue('--width'));
  $("#wordSpace").replaceWith(newWordSpace);
}

var startTimer = function(){

  scoreCount.append($("<p id='score'></p>").text("0"));
  var d = new Date();
  startTime = d.getTime();
  //var timer = setInterval(updateTimer(), 100);
}

var updateTimer = function(){
  var d = new Date();
  var currTime = d.getTime();
  var diff = currTime - startTime;
  //console.log(diff);
  $("#score").text(Math.round((500000+score*500000)/diff));
}

function wordWidth(obj){
    var clone = obj.clone();
    clone.css("visibility","hidden");
    $("#wordSpace").append(clone);
    var width = clone.outerWidth();
    clone.remove();
    return width;
}

wordOptions = {
  JCaesar1 : {
    name: "Julius Caesar, Act III Scene II",
    description: "The famous speech, given by Julius Caesar in the similarly named book, by Shakespeare.",
    wordsCombined: "Why, man, he doth bestride the narrow world like a Colossus, and we petty men walk under his huge legs and peep about to find ourselves dishonourable graves. Men at some time are masters of their fates: The fault, dear Brutus, is not in our stars, but in ourselves, that we are underlings. Brutus and Caesar: what should be in that 'Caesar'? Why should that name be sounded more than yours?Write them together, yours is as fair a name; Sound them, it doth become the mouth as well; Weigh them, it is as heavy; conjure with 'em, Brutus will start a spirit as soon as Caesar. Now, in the names of all the gods at once, upon what meat doth this our Caesar feed, that he is grown so great? Age, thou art shamed! Rome, thou hast lost the breed of noble bloods! When went there by an age, since the great flood, but it was famed with more than with one man? When could they say till now, that talk'd of Rome, that her wide walls encompass'd but one man?"
  },
  AConfOfDunces1 : {
    name: "A Confederacy Of Dunces, Opening Paragraph",
    description: "The opening lines of the book by John Kennedy Toole.",
    wordsCombined: "A green hunting cap squeezed the top of the fleshy balloon of a head. The green earflaps, full of large ears and uncut hair and the fine bristles that grew in the ears themselves, stuck out on either side like turn signals indicating two directions at once. Full, pursed lips protruded beneath the bushy black moustache and, at their corners, sank into little folds filled with disapproval and potato chip crumbs. In the shadow under the green visor of the cap Ignatius J. Reilly’s supercilious blue and yellow eyes looked down upon the other people waiting under the clock at the D.H. Holmes department store, studying the crowd of people for signs of bad taste in dress. Several of the outfits, Ignatius noticed, were new enough and expensive enough to be properly considered offenses against taste and decency. Possession of anything new or expensive only reflected a person’s lack of theology and geometry; it could even cast doubts upon one’s soul."
  },
  MDick1 : {
    name: "Moby Dick, Opening Paragraph",
    description: "An extract, from the works of Herman Melville",
    wordsCombined: "Call me Ishmael. Some years ago - never mind how long precisely - having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen, and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off - then, I account it high time to get to sea as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the ship. There is nothing surprising in this."
  }
}
