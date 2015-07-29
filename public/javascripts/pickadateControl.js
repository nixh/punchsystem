 $(document).ready(function(){
    $(".useDatePicker").pickadate({
    	format: 'yyyy-mm-dd'
    });
    $(".useTimePicker").pickatime({
    	interval:10,
        format: 'hh:i A'
    });

    $('.preview').on('click', function(){
        $('#searchform').submit();

    });
   

});
