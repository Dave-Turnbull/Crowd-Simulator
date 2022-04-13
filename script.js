//make an animation bounce from start point to end then back to start using 'easeBounceBack'
$.easing.easeBounceBack = function (x, t, b, c, d) {
  return c - $.easing.easeBounceBack(x, d - t, 0, c, d) + b;
};
$.easing.easeBounceBack = function (x, t, b, c, d) {
  //Bounce down
  if ((t /= d) < 1 / 2) {
    return c * (4.2 * t * t) + b;
    //Bounce back up
  } else if (t < 2 / 2) {
    return c * (4.2 * (t -= 2 / 2) * t) + b;
  } else if (t < 2.5 / 2.75) {
  }
};

var triggerWalk = false;
var setLoading = true;
//personCounter is how many people currently exist
var personCounter = 0;
//peopleList is an array containing all the images in the 'people' folder
var peopleList = [];
//distanceDistribution feeds into how far up the screen the people appear, 10 is at the bottom (theres more 10's so the people further up are covered at the waist)
var distanceDistribution = [
  10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 8, 8, 8,
  8, 8, 8, 6, 6, 6, 6, 6, 6, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 2, 2, 1, 0,
];

/*for the below variable, open a graph calculator and put this in:

"x + l - x(f/n+1)" 
replace: l = half the distribution array length f=the personCounter, n=skewDistribution

where 'x = 0' is the maximum amount of numbers removed off the distanceDistribution array (i.e. the people will only be close to the bottom)
where 'y = 0' is where no numbers are removed off the distribution array (i.e. the full range of people)
*/
var skewDistribution = 1350;

//Find every image inside the folder called 'people' and for each one, push the value to the peopleList array
$(document).ready(function () {
  $.ajax({
    //the folder (starting at root)
    url: "people",
    success: function (data) {
      $(data)
        .find("a:contains(.png)")
        .each(function () {
          // will loop through
          var images = $(this).attr("href");
          peopleList.push(images);
          //Once the request is done, trigger the getWalking function
          setLoading = false;
        });
    },
  });
});

var getWalking = function () {
  //set max amount of people to 200
  if (personCounter < 200) {
    personCounter++;
    console.log(Math.round(personCounter + 20 - personCounter * 1.1));
    //create the block variables
    let speedTotal;
    let speedMove;
    let speedBounce;
    let directionMove;
    let stepsNumber;
    let imageURL;
    let distanceAway;

    //pick an image url at random from the array
    imageURL = peopleList[Math.floor(Math.random() * peopleList.length)];

    /* set the distance from the bottom of the screen using a random number from the distanceDistribution array, 
    this is so the people are more likely to walk at the bottom of the screen */
    distanceAway =
      distanceDistribution[ //the number calculated on the next 7 lines goes in this array box[]
        Math.round(
          //round to nearest interger
          Math.random() * //pick at random
            (distanceDistribution.length - //minus a number off the array length, this is so that a number closer to the start of the array is picked if there are less people
              Math.round(
                personCounter +
                  distanceDistribution.length / 2 -
                  personCounter * (personCounter / skewDistribution + 1)
              ))
        )
      ];
    if (distanceAway == null) {
      distanceAway = 10;
    }
    //set the speed a person moves across the screen
    speedTotal = Math.round(Math.random() * 6 + 3);
    //set the number of steps a person does through the whole screen
    stepsNumber = Math.floor(Math.random() * 12 + 7);
    //set the direction to random
    directionMove = Math.random() > 0.5;

    //Animate the div dependant on the window width
    speedMove = $(window).width() * speedTotal;

    //set the rate of bouncing based on the speed
    speedBounce = speedMove / stepsNumber;

    //create the div with ID of "bouncingdiv", append it to "wrapper", then for each version of it add the CSS and animation
    $("<img />", {
      id: "bouncingdiv",
      src: imageURL,
      width: 150 + distanceAway * 12, // the higher the value distanceAway, the larger the people are
    })
      .appendTo("#wrapper")
      .on("dragstart", function (event) {
        event.preventDefault();
      })
      .each(function () {
        //check the directionMove boolean, if its true move the div right and dont flip it
        if (directionMove == true) {
          $(this)
            .css({
              left: "-300px",
              "-webkit-transform": "scaleX(1)",
              transform: "scaleX(1)",
              "margin-top": "-10px",
              "z-index": distanceAway,
              "padding-top": distanceAway * 25, //the higher the value of distanceAway, the further down the page the person is, also the higher the z-index.
            })
            .animate(
              { left: $(window).width() },
              {
                duration: speedMove,
                easing: "linear",
                queue: false,
                complete: function () {
                  $(this).remove();
                  personCounter--;
                },
              }
            );
        } else {
          //check the directionMove boolean, if its false move the div left and flip it
          $(this)
            .css({
              left: $(window).width(),
              "-webkit-transform": "scaleX(-1)",
              transform: "scaleX(-1)",
              "margin-top": "-10px",
              "z-index": distanceAway,
              "padding-top": distanceAway * 25,
            })
            .animate(
              { left: "-300px" },
              {
                duration: speedMove,
                easing: "linear",
                queue: false,
                complete: function () {
                  $(this).remove();
                  personCounter--;
                },
              }
            );
        }
        //Add the bounce animation to the current object for the amount of stepsNumber there are (animations are queued by default)
        for (let i = 0; i < stepsNumber; i++) {
          $(this).each(function () {
            $(this).animate(
              { "margin-top": "0px" },
              speedBounce,
              "easeBounceBack"
            );
          });
          //IDEA: I could have the sprites have 2 instances and swap between them on each step here
        }
      });
  }
};

let root = document.getElementById("root");
$(document).ready(function () {
  $("#root").click(function () {
    if (root.value === "on") {
      root.value = "off";
      triggerWalk = false;
    } else {
      root.value = "on";
      triggerWalk = true;
      theLoop();
    }
  });
});

function theLoop() {
  if (triggerWalk) {
    setTimeout(function () {
      getWalking();
      theLoop();
    }, 50);
  }
}

/*
document.body.addEventListener("mousemove", function (evt) {
  getWalking();
});*/
