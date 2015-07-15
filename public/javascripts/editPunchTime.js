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

		timeTd.find(".outTimeInput").addClass("hidden");
		dateTd.find(".outDateInput").addClass("hidden");

		timeTd.find(".outTime> span").removeClass("hidden");
		dateTd.find(".outDate> span").removeClass("hidden");

		$(this).parent().addClass("hidden")
		$(this).parent().siblings().removeClass("hidden");
	});

	outReturnButton.on('click', function(){
		var parentTd = $(this).closest("td");
		var timeTd = parentTd.prev("td");
		var dateTd = parentTd.prev().prev("td");

		timeTd.find(".outTimeInput").addClass("hidden");
		dateTd.find(".outDateInput").addClass("hidden");

		timeTd.find(".outTime> span").removeClass("hidden");
		dateTd.find(".outDate> span").removeClass("hidden");

		$(this).parent().addClass("hidden")
		$(this).parent().siblings().removeClass("hidden");
	});

	inConfirmButton.on('click', function(){
		var parentTd = $(this).closest("td");
		var timeTd = parentTd.prev("td");
		var dateTd = parentTd.prev().prev("td");

		timeTd.find(".inTimeInput").addClass("hidden");
		dateTd.find(".inDateInput").addClass("hidden");

		timeTd.find(".inTime> span").removeClass("hidden");
		dateTd.find(".inDate> span").removeClass("hidden");

		$(this).parent().addClass("hidden")
		$(this).parent().siblings().removeClass("hidden");
	});

	inReturnButton.on('click', function(){
		var parentTd = $(this).closest("td");
		var timeTd = parentTd.prev("td");
		var dateTd = parentTd.prev().prev("td");

		timeTd.find(".inTimeInput").addClass("hidden");
		dateTd.find(".inDateInput").addClass("hidden");

		timeTd.find(".inTime> span").removeClass("hidden");
		dateTd.find(".inDate> span").removeClass("hidden");

		$(this).parent().addClass("hidden")
		$(this).parent().siblings().removeClass("hidden");
	});


});