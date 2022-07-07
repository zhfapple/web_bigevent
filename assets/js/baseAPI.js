// 每次调用$.get()或$.post()或$.ajax()的时候都会先调 用ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (option) {
    // 在发起ajax请求之前，统一拼接完整的根路径
    option.url = 'http://www.liulongbin.top:3007' + option.url
    console.log(option.url);
})