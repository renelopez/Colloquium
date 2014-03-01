$(function() {

    $("form[data-colloquium-ajax='true']").submit(ajaxFormSubmit);
    $(".body-content").on("click", ".pagedList a", getPage);
    $(".body-content").on("click", ".orderLink a", getOrderedPage);

    function ajaxFormSubmit() {
        var $form = $(this);
        
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
        var $a = $(this);

        var options = {
            url: $a.attr("href"),
            data: $("form").serialize(),
            type:"get"
        };

        $.ajax(options).done(function(data) {
            var $target = $($a.parents("div.pagedList").attr("data-colloquium-target"));
            $target.replaceWith(data);
        });
        
        return false;
    }

    
    function getOrderedPage() {
        var $a = $(this);

        var options = {
            url: $a.attr("href"),
            data: $("form").serialize(),
            type: "get"
        };

        $.ajax(options).done(function (data) {
            var $target = $($a.parents("div.orderLink").attr("data-colloquium-target"));
            $target.replaceWith(data);
        });

        return false;
    }

    
});