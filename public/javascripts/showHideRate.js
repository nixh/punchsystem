$(document).ready(function(){
    var rateSH = $(".showHideRate");
    var cover = $(".imageCover");
    var hrRate = $(".hourRate");

    rateSH.on("click", function(e){
       var hidingDiv =$(".paidRateBox").find(".hidden");
       hidingDiv.removeClass("hidden");
       hidingDiv.siblings(cover).addClass("hidden");
       changeWord();
    });

    function changeWord(){
        if(cover.hasClass("hidden")){
            rateSH.find("pre").html("HIDE<br>RATE");
        }else{
            rateSH.find("pre").html("SHOW<br>RATE");
        }
    }
});