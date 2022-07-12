$(function () {
    let form = layui.form
    let laypage = layui.laypage  //导出渲染分页对象

    //定义一个美化时间的过滤器  通过模板引擎定义
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date)
        let y = addZero(dt.getFullYear())
        let m = addZero(dt.getMonth() + 1)
        let d = addZero(dt.getDate())
        let h = addZero(dt.getHours())
        let mm = addZero(dt.getMinutes())
        let s = addZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s
    }
    function addZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询参数对象  将来请求数据时，
    //将q提交服务器
    let q = {
        pagenum: 1, //页码值默认1
        pagesize: 2, //每页显示多少条数据
        cate_id: '',    //文章分类的id
        state: ''   //文章的发布状态
    }
    initTable()
    initCate()
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //在这里可以调用渲染分页的方法
                renderPage(res.total)  //将总条数传入渲染页码中从而计算出渲染多少个页码
                console.log(res);
            }
        })
    }

    //初始文章分类
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类失败')
                }
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //通知leiui重新渲染表单区域可选项
                form.render()
            }
        })
    }
    //为筛选表单绑定事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 2.获取表单中选中的值
        //通过选择框获得所选项name值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()

        // 为查询参数对象q中更新选定值
        q.cate_id = cate_id
        q.state = state
        initTable()  //根据最新的数据重新渲染
    })

    //定义渲染分页的方法
    function renderPage(total) {
        //调用  laypage.render() 来渲染分页传入4个参数
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total,    //数据总数
            limit: q.pagesize,  //每页显示几条数据
            curr: q.pagenum,    //默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],   //指定显示那些分页组件 顺序决定排列方式
            limits: [2, 3, 5, 10],  //按默认值走
            //每页条数的选择项。如果 layout 参数
            // 开启了 limit，则会出现每页条数的select选择框
            // 触发回调的方式有两种，
            // 1.点击页码时会触发
            // 2.只要调用laypage.render方法就会触发jump回调，所以第一次渲染时jump会打印log1
            jump(obj, first) {  //first是一个布尔值，当用第二种方式触发：true，第一种触发first：undefined
                // console.log(obj.curr);  //当前的页码值
                // 把最新的条目数赋值q查询参数，

                q.pagenum = obj.curr  //把最新的页码值复制到q参数对象上
                // 渲染list
                q.pagesize = obj.limit  //limit获得当前选择条目数
                if (!first) {  //第一种方式触发first
                    initTable()
                }
                //这样会出现死循环
            }
        })
    }
    //事件委托绑定删除事件
    $('tbody').on('click', '.btn-delete', function () {
        //获取当前删除按钮个数从而判断删除后页面是否还有数据
        let len = $('.btn-delete').length
        let id = $(this).attr('data-id')
        // 弹出层
        layer.confirm('是否删除?', { icon: 3, title: '提示' }, function (index) {

            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败')
                    }
                    layer.msg('删除文章分类成功')
                    // 当数据删除完成后，判断当前页是否还有剩余数据，如果没有剩余数据则让页码值减1后重新渲染
                    if (len === 1) {
                        //len===1则页面上就没有数据了
                        // 页码值最小必须等于1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})