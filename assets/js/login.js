$(function () {
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })


    // 表单验证,从layui中获取form对象
    let form = layui.form
    let layer = layui.layer
    // 通过form.verify自定义校验规则
    form.verify({
        //自定义pwd校验规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致规则
        repwd(value) { //形参value是该input中的值
            let pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致哦！'
            }
        }
    })

    //监听注册表单事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        let data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
        $.post('/api/reguser', data, (res) => {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg(res.message + '请登录');
            $(this)[0].reset() //重置页面 使用箭头函数试试
            $('#link_login').click()
        })
    })
    //监听登录表单事件
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        // let data = { username: $('#form_login [name=username]').val(), password: $('#form_login [name=password]').val() }
        $.ajax({
            method: 'post',
            url: '/api/login',
            //快速获取表单中的数据
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('登录成功');
                // 将token值存在localstorage中，后续访问接口需要这个值
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })

    })
})