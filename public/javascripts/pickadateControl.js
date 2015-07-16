 $(document).ready(function(){
    $(".useDatePicker").pickadate({
    	format: 'yyyy-mm-dd'
    });
    $(".useTimePicker").pickatime({
    	interval:15
    });

    $('.preview').on('click', function(){
        $('#searchform').submit();

    });
    $('.return').on('click', function(){
        location.href = "/supervisor/employees";

    });

});