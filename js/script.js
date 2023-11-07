$("#hamburguer-menu").click(function() {
  $(this).toggleClass("off");
  $("#bottom-menu ul").slideToggle();

//
  
    $("#bottom-menu ul").toggleClass("menu-position");
  
    $("#hamburguer-menu span:first-child").toggleClass("deg45");
  
     $("#hamburguer-menu span:nth-child(2)").toggleClass("deg0");
  
    $("#hamburguer-menu span:last-child").toggleClass("deg-45");

});