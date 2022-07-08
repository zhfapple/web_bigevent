// 每次调用$.get()或$.post()或$.ajax()的时候都会先调 用ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (option) {
    // 在发起ajax请求之前，统一拼接完整的根路径
    option.url = 'http://www.liulongbin.top:3007' + option.url
    // 统一为有权限的接口设置headers请求头
    // 添加判断，如果路径包含my再加header
    if (option.url.indexOf('/my') !== -1) {  //如果包含
        option.headers = { Authorization: localStorage.getItem('token') || '' }
    }
    //全局统一挂在   complete  回调函数
    option.complete = function (res) {
        // 在complete回调函数中，可以使用res.responseJSON得到回调结果
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token') //清空指定token值
            location.href = '/login.html'
        }
    }

})