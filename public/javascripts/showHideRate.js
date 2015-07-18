
function initConfig(config) {

  if(!config) {
    config = {};
    config.tr = function(str) { return str; };
  }

  var rateSH = $(".showHideRate");
  var cover = $(".imageCover");
  var hrRate = $(".hourRate");

  var showCover = true;
  rateSH.on("click", function(e){

      var cover = $(".imageCover");
      if(showCover) {
        showCover = false;
        cover.css("visibility", "hidden");
      } else {
        showCover = true;
        cover.css("visibility", "");
      }
    /*
     var hidingDiv =$(".paidRateBox").find(".hidden");
     hidingDiv.removeClass("hidden");
     hidingDiv.siblings().addClass("hidden");
     */
     changeWord();
  });

  function changeWord(){
      if(showCover){
          rateSH.find("span").html(config.tr("hiderate"));
      }else{
          rateSH.find("span").html(config.tr("showrate"));
      }
  }
}
