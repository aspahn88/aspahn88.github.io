const DEVICE_WIDTH = 900;
const DEVICE_HEIGHT = 926;
//const DPIofYourDeviceScreen = 460; //you will need to measure or look up the DPI or PPI of your device/browser to make sure you get the right scale!!
const DPIofYourDeviceScreen = 110; //you will need to measure or look up the DPI or PPI of your device/browser to make sure you get the right scale!!
const sizeOfInputArea = DPIofYourDeviceScreen*1; //aka, 1.0 inches square!


let totalTrialNum = 2; //the total number of phrases to be tested - set this low for testing. Might be ~10 for the real bakeoff!
let currTrialNum = 0; // the current trial number (indexes leto trials array above)
let startTime = 0; // time starts when the first letter is entered
let finishTime = 0; // records the time of when the final trial ends
let lastTime = 0; //the timestamp of when the last trial was completed
let lettersEnteredTotal = 0; //a running total of the number of letters the user has entered (need this for final WPM computation)
let lettersExpectedTotal = 0; //a running total of the number of letters expected (correct phrases)
let errorsTotal = 0; //a running total of the number of errors (when hitting next)
let currentPhrase = ""; //the current target phrase
let currentTyped = ""; //what the user has typed so far

//Variables for my silly implementation. You can delete this:
var currentLetter = 'a';

const scaleFactor = DPIofYourDeviceScreen/110;

let textStartY = 300;
let textStartX = 900;

let btnTextColor = "#ffffff";
let btnFillColor = "#646464";
let pressedButton = -1;
let pressed = false;
let screen = 0;
//String[] screenLetters0 = ["E", "T", "A", "O", "I", "N", "S", "R", "H", "L", "D", "C"];
//String[] screenLetters1 = ["U", "M", "F", "P", "G", "W", "Y", "B", "V", "K", "X", "J", "Q", "Z", " ", " "];
let screenLetters0 = ["A", "C", "D", "E", "H", "I", "L", "N", "O", "R", "S", "T", "Del", "Spc", ">"];
let screenLetters1 = ["B", "F", "G", "J", "K", "M", "P", "Q", "U", "V", "W", "X", "Y", "Z", "<"];

let clickStart = 0;
let clickX = 0;
let clickY = 0;
let clicked = false;

class Button
{
  x;
  y;
  width;
  height;
  label;
  txtColor;
  btnColor;
  pressed = false;

  constructor(x, y, width, height, label, txtColor, btnColor)
  {  
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.label = label;
    this.txtColor = txtColor;
    this.btnColor = btnColor;
   }
   
   setButtonColor(newColor)
   {
     this.btnColor = newColor;
   }

   setTextColor(newColor)
   {
     this.txtColor = newColor;
   }

   setPressed(pressed)
   {
     this.pressed = pressed;
   }

   setLabel (newLabel)
   {
     this.label = newLabel;
   }

   getLabel()
   {
    return this.label;
   }

   insideButton(x, y)
   {
    return (x > this.x && x<this.x+this.width && y>this.y && y<this.y+this.height); //check to see if it is in button bounds
   }

   draw() 
   {
     if (!this.pressed)
      fill(this.btnColor);
    else
      fill(this.txtColor);
    stroke(153);
    rect(this.x, this.y, this.width, this.height); //draw button
    noStroke();
    textSize(14);
    textAlign(CENTER, CENTER);
    if (!this.pressed)
      fill(this.txtColor);
    else
      fill(this.btnColor);

    text(this.label, this.x+this.width/2,this.y+this.height/2);
   }
}


let inputAreaX = DEVICE_WIDTH/2-sizeOfInputArea/2;
let inputAreaY = DEVICE_HEIGHT/2-sizeOfInputArea/2;
let buttons = new Array(16);

//You can add stuff in here. This is just a basic implementation.
function setup()
{
  textSize(12*scaleFactor);
  createCanvas(DEVICE_WIDTH, DEVICE_HEIGHT); //Sets the createCanvas of the app. You should modify this to your device's native createCanvas. Many phones today are 1080 wide by 1920 tall.
  noStroke(); //my code doesn't use any strokes.

  shuffler(phrases)

  buttons[0]  = new Button(inputAreaX, inputAreaY, sizeOfInputArea/4, sizeOfInputArea/4, "A", btnTextColor, btnFillColor);     
  buttons[1]  = new Button(inputAreaX+sizeOfInputArea/4, inputAreaY, sizeOfInputArea/4, sizeOfInputArea/4, "C", btnTextColor, btnFillColor);     
  buttons[2]  = new Button(inputAreaX+2*sizeOfInputArea/4, inputAreaY, sizeOfInputArea/4, sizeOfInputArea/4, "D", btnTextColor, btnFillColor);
  buttons[3]  = new Button(inputAreaX+3*sizeOfInputArea/4, inputAreaY, sizeOfInputArea/4, sizeOfInputArea/4, "E", btnTextColor, btnFillColor);    

  buttons[4]  = new Button(inputAreaX, inputAreaY+sizeOfInputArea/4, sizeOfInputArea/4, sizeOfInputArea/4, "H", btnTextColor, btnFillColor);    
  buttons[5]  = new Button(inputAreaX+sizeOfInputArea/4, inputAreaY+sizeOfInputArea/4, sizeOfInputArea/4, sizeOfInputArea/4, "I", btnTextColor, btnFillColor);  
  buttons[6]  = new Button(inputAreaX+2*sizeOfInputArea/4, inputAreaY+sizeOfInputArea/4, sizeOfInputArea/4, sizeOfInputArea/4, "L", btnTextColor, btnFillColor);
  buttons[7]  = new Button(inputAreaX+3*sizeOfInputArea/4, inputAreaY+sizeOfInputArea/4, sizeOfInputArea/4, sizeOfInputArea/4, "N", btnTextColor, btnFillColor);

  buttons[8]  = new Button(inputAreaX, inputAreaY+2*sizeOfInputArea/4, sizeOfInputArea/4, sizeOfInputArea/4, "O", btnTextColor, btnFillColor);    
  buttons[9]  = new Button(inputAreaX+sizeOfInputArea/4, inputAreaY+2*sizeOfInputArea/4, sizeOfInputArea/4, sizeOfInputArea/4, "R", btnTextColor, btnFillColor);  
  buttons[10]  = new Button(inputAreaX+2*sizeOfInputArea/4, inputAreaY+2*sizeOfInputArea/4, sizeOfInputArea/4, sizeOfInputArea/4, "S", btnTextColor, btnFillColor);
  buttons[11]  = new Button(inputAreaX+3*sizeOfInputArea/4, inputAreaY+2*sizeOfInputArea/4, sizeOfInputArea/4, sizeOfInputArea/4, "T", btnTextColor, btnFillColor);

  buttons[12]  = new Button(inputAreaX, inputAreaY+3*sizeOfInputArea/4, sizeOfInputArea/4, sizeOfInputArea/4, "Del", btnTextColor, btnFillColor);    
  buttons[13]  = new Button(inputAreaX+sizeOfInputArea/4, inputAreaY+3*sizeOfInputArea/4, sizeOfInputArea/4, sizeOfInputArea/4, "Spc", btnTextColor, btnFillColor);  
  buttons[14]  = new Button(inputAreaX+2*sizeOfInputArea/4, inputAreaY+3*sizeOfInputArea/4, sizeOfInputArea/2, sizeOfInputArea/4, ">", btnTextColor, btnFillColor);

  buttons[15]  = new Button(DEVICE_WIDTH-240, DEVICE_HEIGHT-240, 240, 240, "NEXT>", "#000000", "#ff0000");
}

//You can modify stuff in here. This is just a basic implementation.
function draw()
{
  background(255); //clear background

  //check to see if the user finished. You can't change the score computation.
  if (finishTime!=0)
  {
    fill(0);
    textAlign(CENTER);
    text("Trials complete!",400,200); //output
    text("Total time taken: " + (finishTime - startTime),400,200+20*scaleFactor); //output
    text("Total letters entered: " + lettersEnteredTotal,400,200+40*scaleFactor); //output
    text("Total letters expected: " + lettersExpectedTotal,400,200+60*scaleFactor); //output
    text("Total errors entered: " + errorsTotal,400,200+80*scaleFactor); //output
    let wpm = (lettersEnteredTotal/5.0)/((finishTime - startTime)/60000); //FYI - 60K is number of milliseconds in minute
    text("Raw WPM: " + wpm,400,200+100*scaleFactor); //output
    let freebieErrors = lettersExpectedTotal*.05; //no penalty if errors are under 5% of chars
    text("Freebie errors: " + nf(freebieErrors,1,3),400,200+120*scaleFactor); //output
    let penalty = max(errorsTotal-freebieErrors, 0) * .5;
    text("Penalty: " + penalty,400,200+140*scaleFactor);
    text("WPM w/ penalty: " + (wpm-penalty),400,200+160*scaleFactor); //yes, minus, because higher WPM is better

    return;
  }

  //draw 1" watch area
  fill(100);
  rect(width/2-sizeOfInputArea/2, height/2-sizeOfInputArea/2, sizeOfInputArea, sizeOfInputArea); //input area should be 1" by 1"

  //check to see if the user hasn't started yet
  if (startTime==0 & !mouseIsPressed)
  {
    fill(128);
    textAlign(CENTER);
    text("Click to start time!", 280, 150); //display this message until the user clicks!
  }

  if (startTime==0 & mouseIsPressed)
  {
    nextTrial(); //start the trials!
  }

  //if start time does not equal zero, it means we must be in the trials
  if (startTime!=0)
  {
    //you can very slightly adjust the position of the target/entered phrases and next button
    textAlign(LEFT); //align the text left
    fill(128);
    text("Phrase " + (currTrialNum+1) + " of " + totalTrialNum, 70, 50); //draw the trial count
    fill(128);
    text("Target:   " + currentPhrase, 70, 100); //draw the target string
    text("Entered:  " + currentTyped + "|", 70, 140); //draw what the user has entered thus far 
    
    if (pressedButton == -1 && clicked)
    {
       for ( i = 0; i < buttons.length; i++)
      {
        if (buttons[i].insideButton(clickX, clickY))
        {
          buttons[i].setPressed(true);
          pressedButton = i;
          break;
        }
      }
     
    }
  
    for (i = 0; i < buttons.length; i++)
    {
      buttons[i].draw();
    }
    
    if (pressedButton != -1 && clicked && !pressed) {
      commitChar();
      clicked = false;
    }

  }
}

//you can replace all of this logic.
function singleTap()
{
  console.log(startTime)
  if (millis()-startTime<=100) {
    return;
  }
}

function commitChar()
{
 if (pressedButton != -1) {
    // the different cases of what the button should do
    
    if (buttons[pressedButton].insideButton(mouseX, mouseY)){
      switch (buttons[pressedButton].label)
      {
        case "Del" :
          if (currentTyped.length > 0)
          {
            currentTyped = currentTyped.substring(0, currentTyped.length - 1);
          }
          break;
        case "Spc" :
            currentTyped = currentTyped + " ";
            break;
        case "NEXT>" :
          nextTrial(); //if so, advance to next trial
          break;
        // screen var is just to keep track of what screen you are on it's not super necessary when you only have 2 screens but if you wanna have more then it's helpful
        case ">" :
          screen = screen + 1;
          changeScreens();
          break;
        case "<" :
          screen = screen - 1;
          changeScreens();
          break;
        // default is for the buttons that have a letter on it
        default:
          currentTyped = currentTyped + buttons[pressedButton].getLabel().toLowerCase();
          screen = 0;
          changeScreens();
          break;
      }
    }
    else 
    {
       // code for if you want to do a swipe
      // this code swipes if you start on the ">" and swipe to the left (doesn't work on 2nd screen)
      // I found that swipe isn't super useful so this code is pretty basic but you would use this idea for a swipe
      if (buttons[pressedButton].getLabel() == "Spc" &&  mouseX < buttons[pressedButton].x)
      {
        screen = screen + 1;
      changeScreens();
      }
    }
    // reset variables to represent that no button is pressed
    buttons[pressedButton].setPressed(false);
    pressedButton = -1;
  }
}

function changeScreens()
{
  screen = screen % 3;
  if (screen == 0)
  {
     for (i = 0; i < (buttons.length - 1); i++)
    {
      buttons[i].setLabel(screenLetters0[i]);
    }
  }
  else if (screen == 1)
  {
     for (i = 0; i < (buttons.length - 1); i++)
    {
      buttons[i].setLabel(screenLetters1[i]);
    }
  }
}

function nextTrial()
{
  if (currTrialNum >= totalTrialNum) //check to see if experiment is done
    return; //if so, just return

  if (startTime!=0 && finishTime==0) //in the middle of trials
  {
    console.log("==================");
    console.log("Phrase " + (currTrialNum+1) + " of " + totalTrialNum); //output
    console.log("Target phrase: " + currentPhrase); //output
    console.log("Phrase length: " + currentPhrase.length); //output
    console.log("User typed: " + currentTyped); //output
    console.log("User typed length: " + currentTyped.length); //output
    console.log("Number of errors: " + computeLevenshteinDistance(currentTyped.trim(), currentPhrase.trim())); //trim whitespace and compute errors
    console.log("Time taken on this trial: " + (millis()-lastTime)); //output
    console.log("Time taken since beginning: " + (millis()-startTime)); //output
    console.log("==================");
    lettersExpectedTotal+=currentPhrase.length;
    lettersEnteredTotal+=currentTyped.length;
    errorsTotal+=computeLevenshteinDistance(currentTyped.trim(), currentPhrase.trim());
  }

  //probably shouldn't need to modify any of this output / penalty code.
  if (currTrialNum == totalTrialNum-1) //check to see if experiment just finished
  {
    finishTime = millis();
    console.log("==================");
    console.log("Trials complete!"); //output
    console.log("Total time taken: " + (finishTime - startTime)); //output
    console.log("Total letters entered: " + lettersEnteredTotal); //output
    console.log("Total letters expected: " + lettersExpectedTotal); //output
    console.log("Total errors entered: " + errorsTotal); //output
    let wpm = (lettersEnteredTotal/5.0)/((finishTime - startTime)/60000); //FYI - 60K is number of milliseconds in minute
    console.log("Raw WPM: " + wpm); //output
    let freebieErrors = lettersExpectedTotal*.05; //no penalty if errors are under 5% of chars
    console.log("Freebie errors: " + nf(freebieErrors,1,3)); //output
    let penalty = max(errorsTotal-freebieErrors, 0) * .5;
    console.log("Penalty: " + penalty,0,3);
    console.log("WPM w/ penalty: " + (wpm-penalty)); //yes, minus, becuase higher WPM is better
    console.log("==================");
    currTrialNum++; //increment by one so this message only appears once when all trials are done
    return;
  }

  if (startTime==0) //first trial starting now
  {
    console.log("Trials beginning! Starting timer..."); //output we're done
    startTime = millis(); //start the timer!
  } 
  else
  {
    currTrialNum++; //increment trial number
  }

  lastTime = millis(); //record the time of when this trial ended
  currentTyped = ""; //clear what is currently typed preparing for next trial
  currentPhrase = phrases[currTrialNum]; // load the next phrase!
  //currentPhrase = "abc"; // uncomment this to override the test phrase (useful for debugging)
}
