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

var personCounter = 0;
var peopleList = [];

//Find every image inside the folder called 'people' and for each one, push the value to the peopleList array
$.ajax({
  url: "people",
  success: function (data) {
    $(data)
      .find("a:contains(.png)")
      .each(function () {
        // will loop through
        var images = $(this).attr("href");
        peopleList.push(images);
        //Once the request is done, trigger the getWalking function
        getWalking();
      });
  },
});

var getWalking = function () {
  let speedTotal;
  let speedMove;
  let speedBounce;
  let directionMove;
  let stepsNumber;
  let imageURL;
  let distanceAway;

  imageURL = peopleList[Math.floor(Math.random() * peopleList.length)];
  //set the speed of the animation to a random
  distanceAway = Math.floor(Math.random() * 3 + 1);
  //set the number of steps a person does
  speedTotal = Math.floor(Math.random() * 3 + 1.5);
  //set the number of steps a person does
  stepsNumber = Math.floor(Math.random() * 12 + 7);
  //set the direction to random
  directionMove = Math.random() > 0.5;

  //Animate the div dependant on the window width by adding window width to the left margin
  speedMove = $(window).width() * speedTotal;

  //set the rate of bouncing based on the speed
  speedBounce = speedMove / stepsNumber;

  console.log(distanceAway);

  //create the div with ID of "bouncingdiv", append it to "wrapper", then for each version of it add the CSS and animation
  $("<img />", {
    id: "bouncingdiv",
    src: imageURL,
    width: 100 + distanceAway * 50,
  })
    .appendTo("#wrapper")
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
          })
          .animate(
            { left: $(window).width() },
            {
              duration: speedMove,
              easing: "linear",
              queue: false,
              complete: function () {
                $(this).remove();
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
          })
          .animate(
            { left: "-300px" },
            {
              duration: speedMove,
              easing: "linear",
              queue: false,
              complete: function () {
                $(this).remove();
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
};

document.body.addEventListener("click", function (evt) {
  getWalking();
});
