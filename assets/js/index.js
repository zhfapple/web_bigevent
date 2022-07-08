$(function () {
    //调用获取用户基本信息
    getUserInfo()

})
//定义获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // headers 就是请求头配置对象
        // 如果内存里没有这个对象就填空字段
        // headers: { Authorization: localStorage.getItem('token') || '' },
        success(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败，请重新登录')
                // return location.href = '/login.html'
            }
            renderAvator(res.data) //调用渲染头像函数
        }


    })
}
function renderAvator(res) {
    //1.获取用户名称
    let name = res.nickname || res.username

    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    if (res.user_pic) {
        //渲染图片头像
        $('.layui-nav-img').attr('src', res.user_pic).show()
        $('.text-avator').hide()
    } else {
        //渲染文本头像
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avator').html(first).show()

    }

    $('#btnLoginout').on('click', function () {
        layer.confirm('确定退出?', { icon: 3, title: '提示' }, function (index) {
            location.href = '/login.html'
            localStorage.clear()
            layer.close(index);
        });
    })
}