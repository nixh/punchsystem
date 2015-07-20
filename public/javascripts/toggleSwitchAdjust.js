$(document).ready(function(){

	if($(".emailToggle").hasClass("toggle-off")){
		$(".toggleTarget").hide();
	}
	
	if($(".overTimeToggle").hasClass("toggle-off")){
		$(".toggleTarget1").hide();
	}

	$('.emailToggle').click(function(e) {
		var toggle = this;

		e.preventDefault();


		if($(toggle).hasClass('toggle-on')){
			$(".toggleTarget").slideUp("slow");
		}else if($(toggle).hasClass('toggle-off')){
			$(".toggleTarget").slideDown("slow");
		}

		$(toggle).toggleClass('toggle-on')
		.toggleClass('toggle-off')
		.addClass('toggle-moving');

		setTimeout(function() {
		$(toggle).removeClass('toggle-moving');
		}, 200);
	});

	$('.overTimeToggle').click(function(e) {
		var toggle = this;

		e.preventDefault();


		if($(toggle).hasClass('toggle-on')){
			$(".toggleTarget1").slideUp("slow");
		}else if($(toggle).hasClass('toggle-off')){
			$(".toggleTarget1").slideDown("slow");
		}

		$(toggle).toggleClass('toggle-on')
		.toggleClass('toggle-off')
		.addClass('toggle-moving');

		setTimeout(function() {
		$(toggle).removeClass('toggle-moving');
		}, 200);
	});
});