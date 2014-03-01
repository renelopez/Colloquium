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
        var $inputUserName = $(this);
        var $labelUserName=$("label[for='UserName']")
        var $spanUserName = $("#feedback");
        var $userSection = $("#userNameSection");
    
        var options = {
            url: "/Account/IsUserAvailable",
            data: {userName:$inputUserName.val()}
        };

        $.ajax(options).done(function (data) {
            if (data == true) {
                $userSection.removeClass("has-error has-success has-feedback");
                $spanUserName.removeClass();
                $spanUserName.addClass("glyphicon glyphicon-ok form-control-feedback")
                $userSection.addClass("has-success has-feedback");
            }
            else {
                $userSection.removeClass("has-error has-success has-feedback");
                $spanUserName.removeClass();
                $spanUserName.addClass("glyphicon glyphicon-remove form-control-feedback")
                $userSection.addClass("has-error has-feedback");
                $labelUserName.html(data);
            }

        });
    };
});