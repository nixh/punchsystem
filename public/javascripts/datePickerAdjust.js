$(document).ready(function(){
	var isShowing = false;
	$('.useDatePicker').datepicker({
		container:"body"
	});

	$('.useDatePicker').on('click', function(ev){
		if(isShowing){
			$(this).datepicker('hide');
			isShowing= false;
			console.log("hiding");
		}else {
			$(this).datepicker('show');
			isShowing= true;
			console.log("showing");
		}
	});
	
	$('.useDatePicker').on('changeDate', function(ev){
		$(this).datepicker('hide');
		isShowing= false;
	});
	
});