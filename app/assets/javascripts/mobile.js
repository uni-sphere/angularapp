//= require jquery
//= require swiper/dist/js/swiper.min

$(document).ready(function(){
  var myHeight = $('#slide1-mob').width() * 7 / 10;
  console.log(myHeight)
  $('.mobile-image').css('height', myHeight)
  $('.share-image').css('height', myHeight * 5 / 10)

})

