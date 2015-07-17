$(document).ready(function(){
	var outDateInput = $('.outDateInput');
	var inDateInput = $('.inDateInput');
	var outTimeInput = $('.outTimeInput');
	var inTimeInput = $('.inTimeInput');
	var editOutButton = $('.editOutButton');
	var editInButton = $('.editInButton');
	var outConfirmButton = $('.outConfirmReturn > .confirmButton');
	var outReturnButton = $('.outConfirmReturn > .returnButton');
	var inConfirmButton = $('.inConfirmReturn > .confirmButton');
	var inReturnButton = $('.inConfirmReturn > .returnButton');

	editOutButton.on('click', function(){
		var parentTd = $(this).closest("td");
		var timeTd = parentTd.prev("td");
		var dateTd = parentTd.prev().prev("td");

		timeTd.find(".outTimeInput").removeClass("hidden");
		dateTd.find(".outDateInput").removeClass("hidden");

		timeTd.find(".outTime> span").addClass("hidden");
		dateTd.find(".outDate> span").addClass("hidden");

		$(this).addClass("hidden")
		$(this).siblings().removeClass("hidden");
	});

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

	outConfirmButton.on('click', function(){
		var parentTd = $(this).closest("td");
		var timeTd = parentTd.prev("td");
		var dateTd = parentTd.prev().prev("td");
		var outTimeSpan = timeTd.find(".outTime> span");
		var outDateSpan = dateTd.find(".outDate> span");
		var outTimeInput = timeTd.find(".outTimeInput");
		var outDateInput = dateTd.find(".outDateInput");

		var dateRegEx = /^\d\d\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/;
		var timeRegEx = /^[01]?[0-9]:[0-5][0-9] [AP]M$/;

		var outDateInputVal = outDateInput.val();
		var outTimeInputVal = outTimeInput.val();
		var checkTimeDate = true;

		if(dateRegEx.test(outDateInputVal)){

			outDateSpan.html(outDateInputVal);
			if(outDateInput.hasClass("inputError")){
				outDateInput.removeClass("inputError");
			}

		}else if(!dateRegEx.test(outDateInputVal)){

			outDateInput.addClass("inputError");
			checkTimeDate= false;
		}

		if(timeRegEx.test(outTimeInputVal)){
			outTimeSpan.html(outTimeInputVal);
			if(outTimeInput.hasClass("inputError")){
				outTimeInput.removeClass("inputError");
			}

		}else if(!timeRegEx.test(outTimeInputVal)){
			
			outTimeInput.addClass("inputError");
			checkTimeDate= false;
		}


		if(checkTimeDate){
			outTimeInput.addClass("hidden");
			outDateInput.addClass("hidden");

			outTimeSpan.removeClass("hidden");
			outDateSpan.removeClass("hidden");


			$(this).parent().addClass("hidden");
			$(this).parent().siblings().removeClass("hidden");
		}
	});

	outReturnButton.on('click', function(){
		var parentTd = $(this).closest("td");
		var timeTd = parentTd.prev("td");
		var dateTd = parentTd.prev().prev("td");

		timeTd.find(".outTimeInput").addClass("hidden");
		dateTd.find(".outDateInput").addClass("hidden");

		timeTd.find(".outTime> span").removeClass("hidden");
		dateTd.find(".outDate> span").removeClass("hidden");

		$(this).parent().addClass("hidden");
		$(this).parent().siblings().removeClass("hidden");
	});

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


});