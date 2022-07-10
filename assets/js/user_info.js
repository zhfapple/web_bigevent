$(function () {
    let form = layui.form
    let layer = layui.layer
    form.verify({
        nickname(value) {
            if (value.length > 6) {
                return '昵称长度在1-6个字符之间'
            }
        }
    })
    initUserInfo()

    //初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }

                // 调用form.val()快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }
    //重置表单数据
    $('#btnReset').on('click', function (e) {
        e.preventDefault() //阻止表单默认重置
        initUserInfo()
    })
    //监听表单的提交事件
    $(".layui-form").on('submit', function (e) {
        e.preventDefault()
        // let data = form.val('formUserInfo')
        // console.log(data);
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败！')
                }
                layer.msg('修改用户信息成功！')
                //调用父页面中的方法渲染用户头像和信息
                window.parent.getUserInfo() //window相当于iframe，parent就是父页面
            }
        })
    })
})