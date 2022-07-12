$(function () {
    ///定义加载文章分类
    let form = layui.form
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('请求文章分类失败')
                }
                let htmlStr = template('tpl_cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    initCate()
    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')  //获取dom

    // 2. 裁剪选项  设定参数
    var options = {
        aspectRatio: 400 / 280,   //宽高比
        preview: '.img-preview'    //预览区
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    //模拟点击选择封面
    $('#btnChooseImg').on('click', function () {
        $('#coverFile').click()
    })
    //监听文件选择框change事件
    $('#coverFile').on('change', function (e) {
        let files = e.target.files    //获取选择文件列表
        if (files.length === 0) { //判断用户是否选择文件 
            return
        }
        //根据选择的文件，创建一个对应的 URL 地址：
        let newImgURL = URL.createObjectURL(files[0])
        //为裁剪区重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //定义文章状态变量
    art_state = '已发布'
    //为存为草稿按钮绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })


    //为表单绑定submit提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 2.基于表单创建formdata对象
        // 应为涉及文件上传,必须是formdata格式
        let fd = new FormData($('#form-pub')[0])  //将表单原生对象存入formdata中
        //向fd追加一些参数
        fd.append('state', art_state)  //将发布状态通过append存入参数中
        // 4.将封面裁剪后的图片输出为文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将文件对象,存入fd中
                fd.append('cover_img', blob)
                // 6.发起请求
                publishAritlcle(fd)
            })

    })

    //定义一个发表文章的方法
    function publishAritlcle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            //  注意   如果向服务器提交的是formdata格式数据
            //必须添加以下两个配置项
            contentType: false,
            processData: false,
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('文章发布失败')
                }
                layer.msg('文章发布成功')
                //发布文章成功后跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})