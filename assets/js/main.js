(function ($) {
  "use strict";
  function hideLoader() {
    $("#loading").hide();

    // setTimeout(function() {
    //     document.getElementById("loading").style.display="none";
    // }, 3800);
  }

  // $(window).ready(hideLoader);
  // const loaderTimeComplete = false;
  // setTimeout(() => {
  //   $("#cover").hide();
  //   hideLoader();
  //   loaderTimeComplete = true;
  // }, 3.8 * 1000);
  // $(window).on("load", function () {
  //   if (loaderTimeComplete) {
  //     $("#cover").hide();
  //     hideLoader();
  //   }
  // });
  setTimeout(() => {
    if (document.readyState) {
      $("#cover").hide();
      hideLoader();
    } else {
      $(window).on("load", function () {
        $("#cover").hide();
        hideLoader();
      });
    }
  }, 3.8 * 1000);

  /*Page Loader active
    ========================================================*/
  $("#preloader").fadeOut();

  // Sticky Nav
  $(window).on("scroll", function () {
    if ($(window).scrollTop() > 200) {
      $(".scrolling-navbar").addClass("top-nav-collapse");
    } else {
      $(".scrolling-navbar").removeClass("top-nav-collapse");
    }
  });

  /* ==========================================================================
       countdown timer
       ========================================================================== */
  jQuery("#clock").countdown("2020/03/28", function (event) {
    var $this = jQuery(this).html(
      event.strftime(
        "" +
          '<div class="time-entry days"><span>%-D</span> Days</div> ' +
          '<div class="time-entry hours"><span>%H</span> Hours</div> ' +
          '<div class="time-entry minutes"><span>%M</span> Minutes</div> ' +
          '<div class="time-entry seconds"><span>%S</span> Seconds</div> '
      )
    );
  });

  /* slicknav mobile menu active  */
  $(".mobile-menu").slicknav({
    prependTo: ".navbar-header",
    parentTag: "liner",
    allowParentLinks: true,
    duplicate: true,
    label: "",
  });

  /* WOW Scroll Spy
    ========================================================*/
  var wow = new WOW({
    //disabled for mobile
    mobile: false,
  });
  wow.init();

  /* Nivo Lightbox 
    ========================================================*/
  $(".lightbox").nivoLightbox({
    effect: "fadeScale",
    keyboardNav: true,
  });

  // one page navigation
  $(".navbar-nav").onePageNav({
    currentClass: "active",
  });

  /* Back Top Link active
    ========================================================*/
  var offset = 200;
  var duration = 500;
  $(window).scroll(function () {
    if ($(this).scrollTop() > offset) {
      $(".back-to-top").fadeIn(400);
    } else {
      $(".back-to-top").fadeOut(400);
    }
  });

  $(".back-to-top").on("click", function (event) {
    event.preventDefault();
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      600
    );
    return false;
  });
})(jQuery);
