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

/*//bounce to a stop
        $.easing.easeInBounce = function (x, t, b, c, d) {
            return c - $.easing.easeOutBounce (x, d-t, 0, c, d) + b;
        };
        $.easing.easeOutBounce = function (x, t, b, c, d) {
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            //} else if (t < (2.5/2.75)) {
            //    return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            //} else {
            //    return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        };*/

var personCounter = 0;

var getWalking = function () {
  let speedTotal;
  let speedMove;
  let speedBounce;
  let directionMove;
  let stepsNumber;

  //set the speed of the animation to a random
  speedTotal = Math.floor(Math.random() * 3 + 1.5);
  //set the number of steps a person does
  stepsNumber = Math.floor(Math.random() * 10 + 3);
  //set the direction to random
  directionMove = Math.random() > 0.5;

  //Animate the div dependant on the window width by adding window width to the left margin
  speedMove = $(window).width() * speedTotal;
  //create the div with ID of "bouncingdiv", append it to "wrapper", then for each version of it add the CSS and animation
  $("<div>", {
    id: "bouncingdiv",
  })
    .appendTo("#wrapper")
    .each(function () {
      //check the directionMove boolean, if its true move the div right and dont flip it
      console.log(this);
      if (directionMove == true) {
        $(this)
          .css({
            left: "-300px",
            "-webkit-transform": "scaleX(1)",
            transform: "scaleX(1)",
          })
          .animate(
            { left: $(window).width() },
            {
              duration: speedMove,
              easing: "linear",
              queue: false,
            }
          );
      } else {
        //check the directionMove boolean, if its false move the div left and flip it
        $(this)
          .css({
            left: $(window).width(),
            "-webkit-transform": "scaleX(-1)",
            transform: "scaleX(-1)",
          })
          .animate(
            { left: "-300px" },
            {
              duration: speedMove,
              easing: "linear",
              queue: false,
              complete: personCounter++,
            }
          );
      }
      //THATS NOT HONEY POOH, YOU'RE EATING RECURSION!
      $(this).each(function () {
        console.log(this);
        //set the rate of bouncing based on the speed
        speedBounce = speedMove / stepsNumber;
        //Animate the bounce by changing the top margin
        $(this)
          .css({ "margin-top": "-10px" })
          .animate({ "margin-top": "0px" }, speedBounce, "easeBounceBack");
      });
      for (let i = 0; i < stepsNumber - 1; i++) {
        $(this).each(function () {
          $(this).animate(
            { "margin-top": "0px" },
            speedBounce,
            "easeBounceBack"
          );
        });
      }
    });
};

document.body.addEventListener("click", function (evt) {
  getWalking();
});
getWalking();
getWalking();
getWalking();
getWalking();
getWalking();
getWalking();
