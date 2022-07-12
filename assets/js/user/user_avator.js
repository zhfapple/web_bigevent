$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比   相当于长比宽   1 ： 1的裁剪区
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)
    // 上传图片绑定点击事件
    $("#btnChooseImg").on('click', function () {
        $('#file').click()
    })
    // change事件每次选择对象发生改变后触发
    $('#file').on('change', function (e) {
        // 接受用户上传的文件列表
        let fileList = e.target.files
        if (fileList.length === 0) {
            return layer.msg('请选择图片')
        }
        // 1.拿到用户选择的文件
        let file = e.target.files[0]
        // 2.将文件，转化为路径
        let imgURL = URL.createObjectURL(file)
        // 3.重新初始化化裁剪


        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })
    // 为确定按钮绑定事件、
    $('#btnUpload').on('click', function () {
        // 1.拿到用户裁剪的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，
        // 转化为 base64 格式的字符串

        // 2.上传裁剪后的图片
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('头像更换失败')
                }
                layer.msg('头像更换成功')
                window.parent.getUserInfo()
            }
        })

    })
})