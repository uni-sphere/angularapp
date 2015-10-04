(function () {

  angular
    .module('mainApp.directives')
    .directive('slide', slide)

  slide.$inject = ['$rootScope','Restangular', 'Notification', '$translate'];
  function slide($rootScope, Restangular, Notification, $translate){

    var directive = {
      link: link,
      templateUrl: 'home/slide.html',
      scope:{
      }
    };
    return directive;

    function link(scope, elem, attrs){

      var request_success,
        error;

      // init controller
      var controller = new ScrollMagic.Controller();

      /*----------  Scroll animation for the test app  ----------*/

      var timeLineTestApp = new TimelineLite()
      .from('#test-app-advise', .5, {
        left: -400,
        opacity: 0
      })
      .fromTo('#test-app', .1, {
        left: - 10,
      },{
        left: 10,
        yoyo: true,
        repeat: 2
      }, .3)
      .add("end", .7)
      .from('.tutorial-round', .1,{
        display: 'none'
      }, "end")

      new ScrollMagic.Scene({
        offset: 10,
        reverse: false
      })
      .setTween(timeLineTestApp)
      // .addIndicators()
      .addTo(controller);

      /*----------  scroll animation for features  ----------*/

      triggers = ["feature-collaborate", "feature-share", "feature-analyse", "feature-deploy"];

      triggers.forEach(function (trigger, index) {
        // make timeline
        var timeLineFeature = new TimelineLite()
        .from('#' + trigger + ' .feature-left', .2, {
          opacity: 0,
          left: -400
        })
        .from('#' + trigger + ' .feature-right', .2, {
          opacity: 0,
          right: -400
        },0)


        // make scene
        new ScrollMagic.Scene({
          triggerElement: '#' + trigger
          // reverse: false
        })
        .setTween(timeLineFeature)
        // .addIndicators()
        .addTo(controller);
      });

      /*----------  Scroll animation for the form  ----------*/

      var tweenMaxContact = new TweenMax.from('#contact-wrapper', .5, {
        bottom: -50,
        opacity: 0
      })

      new ScrollMagic.Scene({
        triggerElement: "#contact-wrapper"
        // reverse: false
      })
      .setTween(tweenMaxContact)
      // .addIndicators()
      .addTo(controller);


      $translate(['ERROR', 'REQUEST_SUCCESS']).then(function (translations) {
        request_success = translations.REQUEST_SUCCESS;
        error = translations.ERROR;
      });

      scope.viewHome = true
      scope.viewDashboard = false

      scope.newContact = function() {
        if(scope.webEmail == undefined){
          Notification.error("You made a mistake in your email")
        } else if(scope.webUniversity == undefined){
          Notification.error("Please input your university")
        } else{
          Restangular.one('new_contact').get({email: scope.webEmail, university: scope.webUniversity, message: scope.webMessage}).then(function (res) {
            console.log(res)
            Notification.success(request_success);
            scope.webEmail = ""
            scope.webUniversity = undefined
            scope.webMessage = undefined
            console.log("Ok: send contact request")
          }, function(d){
            console.log("Error: send contact request");
            console.log(d)
            Notification.error(error);
          });
        }
      }
    }
  }

}());
