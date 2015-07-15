 $(document).ready(function(){
    $(".useDatePicker").pickadate();
    $('.preview').on('click', function(){
        $('#searchform').submit();

    });
    $('.return').on('click', function(){
        location.href = "/supervisor/employees";

    });
});