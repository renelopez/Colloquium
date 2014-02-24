$(function() {

    $("form[data-colloquium-ajax='true']").submit(ajaxFormSubmit);
    $(".body-content").on("click", ".pagedList a", getPage);


    function ajaxFormSubmit() {
        $form = $(this);
        
        var options = {
            url: $form.attr("action"),
            type: $form.attr("method"),
            data:$form.serialize()
        };
        $.ajax(options).done(function (data) {
            var $target = $($form.attr("data-colloquium-target"));
            $target.replaceWith(data); 
        });

        return false;
    };
    
    function getPage() {
        $a = $(this);

        var options = {            
            url: $a.attr("href"),
            type:"get"
        };

        $.ajax(options).done(function(data) {
            var $target = $($a.parents("div.pagedList").attr("data-colloquium-target"));
            $target.replaceWith(data);
        });
        
        return false;
    }
    
});