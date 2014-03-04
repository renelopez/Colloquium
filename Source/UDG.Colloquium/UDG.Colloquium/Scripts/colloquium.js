$(function () {
    $(".body-content").on("click", "a.modalActionLink", processLinkConfirmation);
    $(".body-content").on("click", "input.modalActionForm", processFormConfirmation);
    $("#UserName").blur(checkUserAvailability);

    function processLinkConfirmation() {

        var $a = $(this);
        var $modalMessage = $("#modalMessage");
        var modalText = $modalMessage.html() + $a.attr("id")+"?";
        $modalMessage.html(modalText);
        $('#roleModal').modal('show');

        $("#closeModal").click(function () {
            var clearedModalMessage = modalMessage.innerHTML.split(':')[0] + ":";
            modalMessage.innerHTML = clearedModalMessage;
        });

        $("#confirmModal").click(function () {
            var linkUrl = $a.attr("href");
            window.location.href = linkUrl;
        });

        return false;
    };

    function processFormConfirmation() {
        var $form = $(this).closest("form");
        var confirmValue = $(".modalActionValue").val();
        var $modalMessage = $("#modalMessage");

        if ($form.valid()) {
            var modalText = $modalMessage.html() + confirmValue + "?";
            $modalMessage.html(modalText);
            $('#roleModal').modal('show');
        }

        $("#closeModal").click(function () {
            var modalMessage = document.getElementById("modalMessage");
            var clearedModalMessage = modalMessage.innerHTML.split(':')[0] + ":";
            modalMessage.innerHTML = clearedModalMessage;
        });

        $("#confirmModal").click(function () {
            $form.submit();
        });

        return false;

    };

    function checkUserAvailability() {

        var $refreshSpan = $("#refresh");
        var animateClass = "refresh-animation";
        var idleClass = "idle-refresh-animation";
        $refreshSpan.removeClass(idleClass);
        $refreshSpan.addClass(animateClass);



        var $inputUserName = $(this);
        var $labelUserName = $("label[for='UserName']");
        var $userSection = $("#userNameSection");
    
        var options = {
            url: "/Account/IsUserAvailable/"+$inputUserName.val(),
            data: null
        };

        $.ajax(options).done(function (data) {
            $refreshSpan.removeClass(animateClass);
            $refreshSpan.addClass(idleClass);
            if (data == true) {
                $userSection.removeClass("has-error has-success");
                $userSection.addClass("has-success");
                $labelUserName.html($inputUserName.val()+" is available.");
            }
            else {
                $userSection.removeClass("has-error has-success");
                $userSection.addClass("has-error");
                $labelUserName.html($inputUserName.val() + " is not available.");
            }

        });
    };
});