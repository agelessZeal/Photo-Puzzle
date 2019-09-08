// $('.upload_container').click(function () {
//    $('#file').trigger('click');
// });

$('#file').change(function (ev) {
    $('.upload_container').hide();
    $('#see-live-example').hide();
    $('#uploading_step-wrapper').show();

    if(this.files[0]) {
        $('#src-image-pick-step .quiz-step-title p').html(this.files[0].name);
        $('#grid-size-pick-step a').click();

        $('#grid-size-pick-step a').attr('href','#ppp');
        $('#cover-color-pick-step a').attr('href','#ppp');

        $('.step-page-title').removeClass('sel');
        $('#step-2-title').addClass('sel');
    } else {
        $('#src-image-pick-step .quiz-step-title p').html('');
    }

});

function onChangeImage() {
    $('#file').trigger('click');
}

$('#quiz-menu-toggle-btn').click(function () {
    console.log('quiz-menu-toggle-btn');
    var isExpanded = $(this).attr('aria-expanded');
    setTimeout(function () {
        if (isExpanded == 'false') {
            $('#quiz-menu-toggle-btn').css('padding', '9px 19px');
            $('#quiz-menu-toggle-btn').html('&#10006;');
        } else {
            $('#quiz-menu-toggle-btn').css('padding', '.25rem .75rem');
            $('#quiz-menu-toggle-btn').html('<span class="navbar-toggler-icon"></span>');
        }
    }, 100);

});

$('.grid-size-item').click(function () {
    if ($(this).hasClass('premium-grid')) return;
    $('.grid-size-item').removeClass('sel');
    $(this).addClass('sel');
    $('#grid-size-pick-step .quiz-step-img img').attr('src', '/assets/img/step1.svg');

    $('#grid-size-pick-step a').attr('href','#step-2');
    $('#grid-size-pick-step a').click();

    $('#grid-size-pick-step .quiz-step-link').css('display','block');

    if($('#cover-color-pick-step').hasClass('disable-step')) {
        $('#cover-color-pick-step a').attr('href','#step-3');
        $('#cover-color-pick-step a').click();
        $('#cover-color-pick-step a').attr('href','#ppp');
        $('#cover-color-pick-step').removeClass('disable-step');
    }

    $('input[name="gridSize"]').val($(this).data('size'));

    if(isPremium) {
        $('#custom-cover-color-pick').removeClass('disable-step');
        $('#createImgForm').append('<input type="file" name="cover_img" hidden id="cover_img"  accept="image/*" onchange="onChangeCoverImage(this)">');
    }

});

$('.cv-color-item').click(function () {
    $('.cv-color-item').removeClass('sel');
    $(this).addClass('sel');

    $('#cover-color-pick-step .quiz-step-img img').attr('src', '/assets/img/step1.svg');

    var curColor = $(this).data('color');
    $('#cover-color-mark').css('background-color', curColor);
    $('#cover-color-value').html(curColor);

    $('input[name="coverColor"]').val(curColor);

    $('#cover-color-pick-step .quiz-step-title p').css('display','block');
    $('#cover-color-pick-step .quiz-step-link').css('display','block');

    $('#cover-color-pick-step a').attr('href','#step-3');
    $('#cover-color-pick-step a').click();

    $('.quiz-action-btn').prop('disabled', false);

    $('.step-page-title').removeClass('sel');
    $('#step-3-title').addClass('sel');

});

function onChangeCoverImage(self){
    $('#cover-image-name').html(self.files[0].name);
    $('#cover-image-name').show();
    $('#custom-cover-color-pick .quiz-step-link').show();
    $('.quiz-action-btn').prop('disabled', false);
}

$(window).resize(function () {
    resizeHandler();
});

function resizeHandler() {
    if (window.innerWidth < 992) {
        $('#navbarResponsive').addClass('quiz-mobile-menu')
    } else {
        $('#navbarResponsive').removeClass('quiz-mobile-menu')
    }
}

function onCancelConfirm() {
    window.sweetAlert.close();
    // alert('cancel window');
}

function onCancelSub() {
    window.sweetAlert.close();
    location.href  ='/user/update/cancel-plan';
}

function onCancelSubscriptionConfirm() {
    var cancelSubscriptionHTML = `<p>Sure?</p>`;
    cancelSubscriptionHTML += `<h4 class="ask-cancel-sub-title">CANCEL</h4>`;
    cancelSubscriptionHTML += `<h4 class="ask-cancel-sub-title" style="margin-top: 0">YOUR SUBSCRIPTION</h4>`;
    cancelSubscriptionHTML += `<p style="margin-top: 30px">Are you sure want to cancel</p>`;
    cancelSubscriptionHTML += `<p>your subscription</p>`;
    cancelSubscriptionHTML += `<a class="btn quiz-action-btn no-bg-btn" onclick="onCancelConfirm()">NO. I CHANGED MY MIND</a>`;
    cancelSubscriptionHTML += `<a href="/user/update/cancel-plan" class="btn quiz-action-btn no-bg-btn" onclick="onCancelSub()">CANCEL MY SUBSCRIPTION</a>`;
    swal({
        title: "",
        text: cancelSubscriptionHTML,
        // type: "success",
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        customClass: "ask-cancel-subscription",
        html: true,
    }, function () {

    });
}

resizeHandler();

$('#custom-cover-color-pick').click(function () {
    $('#cover_img').click();
});

function onUpdateCoverColor(color) {
    $('.color-picker-icon').css('background-color', color.toHEXString());
    $('.custom-js-picker').val(color.toHEXString());
}
$('.custom-js-picker').blur(function () {

    $('.cv-color-item').removeClass('sel');

    var curColor = $('.custom-js-picker').val();
    $('#cover-color-mark').css('background-color', curColor);
    $('#cover-color-value').html(curColor);
    $('input[name="coverColor"]').val(curColor);

    $('#cover-color-pick-step .quiz-step-title p').css('display','block');
    $('#cover-color-pick-step .quiz-step-link').css('display','block');

    $('#cover-color-pick-step a').attr('href','#step-3');
    $('#cover-color-pick-step a').click();

    $('.quiz-action-btn').prop('disabled', false);

    $('.step-page-title').removeClass('sel');
    $('#step-3-title').addClass('sel');
});