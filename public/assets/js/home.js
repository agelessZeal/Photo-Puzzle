
$('#create-quiz-img-btn').click(function (e) {
    e.preventDefault();
    var fileName = $('#src-image-pick-step .quiz-step-title p').html();
    if(fileName) {
        // $('#vfx_loader_block').css('display','flex');
        var waitHTML = `<p class="please-wait-title"><i>PlEASE WAIT...<i></i></p>`;
        waitHTML += `<div class="loading-square-wrapper"><div class="loader">
                      <div class="square" ></div>
                      <div class="square"></div>
                      <div class="square last"></div>
                      <div class="square clear"></div>
                      <div class="square"></div>
                      <div class="square last"></div>
                      <div class="square clear"></div>
                      <div class="square "></div>
                      <div class="square last"></div>
                    </div></div>`;
        waitHTML += `<p class="please-wait-modal-description">Your images are being created. This can take up to <b>1 minute</b></p>`;

        swal({
            title: "",
            text: waitHTML,
            // type: "success",
            showCancelButton: false,
            showConfirmButton: false,
            allowOutsideClick: false,
            customClass: "please-wait-sweet-modal",
            html: true,
        }, function () {

        });


        $('#createImgForm').submit();

    } else {
        alert('Please again upload source Image file');
    }
});

function onGenerateQuizImages() {
    var dataimg = new FormData();
    dataimg.append('coverColor', $("#cover-color-value").text());
    dataimg.append('girdSize', $(".grid-size-item.sel").data('size'));
    dataimg.append('imageType', 'Quiz');
    dataimg.append('file', $("#file")[0].files[0]);

    $.ajax("/generate-quiz-images", {
        type: "post",
        cache: false,
        contentType: false,
        processType: false,
        data: dataimg,
        success: function (res) {
            if (res.status == 'success') {
            } else {

            }
            console.log(res);
        },
        error: function (res) {
            alert('Ajax error');
            console.log(res);
        }
    });
}

function onDownloadQuizImages() {

    var imgList = [];
    var imgTagList = $('.grid-item img');
    imgTagList.each(function () {
        imgList.push($(this).attr('src'));
    });
    if (imgList.length == 0) return;
    var fname = imgList[0].replace(/^.*[\\\/]/, '');
    fname = fname.substr(0, fname.lastIndexOf('-'));

    $.ajax("/download-images", {
        type: 'post',
        data: {fname: fname, imgList: imgList},
        beforeSend: function(xhr) {
            $('#vfx_loader_block').css('display','flex');
        },
        success: function (res) {
            if (res.status == 'success') {
                var anchor = document.createElement('a');
                anchor.href = res.data;
                anchor.download = `${fname}.zip`;
                document.body.appendChild(anchor);
                anchor.click();
            } else {
                alert(res.data);
            }
            $('#vfx_loader_block').css('display','none');
        },
        error: function (err) {
            alert('Server error');
            console.log(err);
            $('#vfx_loader_block').css('display','noe');
        }
    })
}

