$(document).ready(function(){
	var outDateInput = $('.outDateInput');
	var inDateInput = $('.inDateInput');
	var outTimeInput = $('.outTimeInput');
	var inTimeInput = $('.inTimeInput');
	var editButton = $('.editButton');
	//var editOutButton = $('.editOutButton');
	//var editInButton = $('.editInButton');
	var confirmButton = $('.confirmReturnDelete > .confirmButton');
	var returnButton = $('.confirmReturnDelete > .returnButton');
	/*
	var outConfirmButton = $('.outConfirmReturn > .confirmButton');
	var outReturnButton = $('.outConfirmReturn > .returnButton');
	var inConfirmButton = $('.inConfirmReturn > .confirmButton');
	var inReturnButton = $('.inConfirmReturn > .returnButton');
	*/

	editButton.on('click', function(){
		var parentTd = $(this).closest("td");
		var timeTd = parentTd.prev("td");
		var dateTd = parentTd.prev().prev("td");

		timeTd.find(".timeInput").removeClass("hidden");
		dateTd.find(".dateInput").removeClass("hidden");

		timeTd.find(".time> span").addClass("hidden");
		dateTd.find(".date> span").addClass("hidden");

		$(this).addClass("hidden")
		$(this).siblings().removeClass("hidden");
	});
	/*
	editInButton.on('click', function(){
		var parentTd = $(this).closest("td");
		var timeTd = parentTd.prev("td");
		var dateTd = parentTd.prev().prev("td");

		timeTd.find(".inTimeInput").removeClass("hidden");
		dateTd.find(".inDateInput").removeClass("hidden");

		timeTd.find(".inTime> span").addClass("hidden");
		dateTd.find(".inDate> span").addClass("hidden");

		$(this).addClass("hidden")
		$(this).siblings().removeClass("hidden");
	});
	*/
	function checkDateTime(input, regEx, span){
		var correct = true;
		if(!regEx.test(input.val())){
			input.addClass("inputError");
			correct = false;
		}else{
			span.html(input.val());
			input.removeClass("inputError");
			correct = true;
		}
		return correct;
	}

	confirmButton.on('click', function(){
		var parentTd = $(this).closest("td");
		var timeTd = parentTd.prev("td");
		var dateTd = parentTd.prev().prev("td");
		
		var dateSpan = dateTd.find(".date> span");
		var timeSpan = timeTd.find(".time> span");
		var timeInput= timeTd.find(".timeInput");
		var dateInput= dateTd.find(".dateInput");
		
		var outTimeSpan = timeTd.find(".outTime> span");
		var outDateSpan = dateTd.find(".outDate> span");
		var outTimeInput = timeTd.find(".outTimeInput");
		var outDateInput = dateTd.find(".outDateInput");
		var inTimeSpan = timeTd.find(".inTime> span");
		var inDateSpan = dateTd.find(".inDate> span");
		var inTimeInput = timeTd.find(".inTimeInput");
		var inDateInput = dateTd.find(".inDateInput");

		var dateRegEx = /^\d\d\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/;
		var timeRegEx = /^[01]?[0-9]:[0-5][0-9] [AP]M$/;
		var check = true;

		check = checkDateTime(outDateInput, dateRegEx, outDateSpan);
		check = checkDateTime(outTimeInput, timeRegEx, outTimeSpan);
		check = checkDateTime(inDateInput, dateRegEx, inDateSpan);
		check = checkDateTime(inTimeInput, timeRegEx, inTimeSpan);

		if(check){
			timeInput.addClass("hidden");
			dateInput.addClass("hidden");

			timeSpan.removeClass("hidden");
			dateSpan.removeClass("hidden");


			$(this).parent().addClass("hidden");
			$(this).parent().siblings().removeClass("hidden");
		}
	
	});



	returnButton.on('click', function(){
		var parentTd = $(this).closest("td");
		var timeTd = parentTd.prev("td");
		var dateTd = parentTd.prev().prev("td");

		timeTd.find(".timeInput").addClass("hidden");
		dateTd.find(".dateInput").addClass("hidden");

		timeTd.find(".time> span").removeClass("hidden");
		dateTd.find(".date> span").removeClass("hidden");

		$(this).parent().addClass("hidden");
		$(this).parent().siblings().removeClass("hidden");
	});

	/*
	inConfirmButton.on('click', function(){
		var parentTd = $(this).closest("td");
		var timeTd = parentTd.prev("td");
		var dateTd = parentTd.prev().prev("td");
		var inTimeSpan = timeTd.find(".inTime> span");
		var inDateSpan = dateTd.find(".inDate> span");
		var inTimeInput = timeTd.find(".inTimeInput");
		var inDateInput = dateTd.find(".inDateInput");

		var dateRegEx = /^\d\d\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/;
		var timeRegEx = /^[01]?[0-9]:[0-5][0-9] [AP]M$/;

		var inDateInputVal = inDateInput.val();
		var inTimeInputVal = inTimeInput.val();
		var checkTimeDate = true;

		if(dateRegEx.test(inDateInputVal)){

			inDateSpan.html(inDateInputVal);
			if(inDateInput.hasClass("inputError")){
				inDateInput.removeClass("inputError");
			}

		}else if(!dateRegEx.test(inDateInputVal)){

			inDateInput.addClass("inputError");
			checkTimeDate= false;
		}

		if(timeRegEx.test(inTimeInputVal)){
			inTimeSpan.html(inTimeInputVal);
			if(inTimeInput.hasClass("inputError")){
				inTimeInput.removeClass("inputError");
			}

		}else if(!timeRegEx.test(inTimeInputVal)){
			
			inTimeInput.addClass("inputError");
			checkTimeDate= false;
		}


		if(checkTimeDate){
			inTimeInput.addClass("hidden");
			inDateInput.addClass("hidden");

			inTimeSpan.removeClass("hidden");
			inDateSpan.removeClass("hidden");


			$(this).parent().addClass("hidden");
			$(this).parent().siblings().removeClass("hidden");
		}
	});

	inReturnButton.on('click', function(){
		var parentTd = $(this).closest("td");
		var timeTd = parentTd.prev("td");
		var dateTd = parentTd.prev().prev("td");

		timeTd.find(".inTimeInput").addClass("hidden");
		dateTd.find(".inDateInput").addClass("hidden");

		timeTd.find(".inTime> span").removeClass("hidden");
		dateTd.find(".inDate> span").removeClass("hidden");

		$(this).parent().addClass("hidden");
		$(this).parent().siblings().removeClass("hidden");
	});
	*/
});