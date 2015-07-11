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
            rateSH.find("span").html("hiderate");
        }else{
            rateSH.find("span").html("showrate");
        }
    }
});