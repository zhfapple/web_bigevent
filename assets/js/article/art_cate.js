$(function () {
    let form = layui.form
    initArtCateList()
    //获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('文章列表获取失败')
                }
                let htmlStr = template("tpl_list", res)
                $('tbody').html(htmlStr)
            }
        })
    }
    //添加类别按钮绑定点击事件
    let indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,  //页面层，而不是信息框
            area: ['500px', '250px'], //宽高
            title: '添加文章分类',   //标题
            // 通过选择器拿到相应标签 .html()拿到里面结构
            content: $('#dialog-add').html()

        });
    })
    // 给表单添加监听，表单是动态生成不能直接绑定事件
    // 通过代理形式给表单绑定事件，给页面中已经有的元素绑定事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()

        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) {
                    layer.close(indexAdd)
                    return layer.msg('新增分类失败')

                }
                initArtCateList()
                layer.msg('新增分类成功')
                //根据索引关闭指定弹出层
                layer.close(indexAdd)
            }
        })
    })
    let indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {//
        // 通过代理绑定事件
        // 弹出修改信息层
        indexEdit = layer.open({
            type: 1,  //页面层，而不是信息框
            area: ['500px', '250px'], //宽高
            title: '修改文章分类',   //标题
            // 通过选择器拿到相应标签 .html()拿到里面结构
            content: $('#dialog-edit').html()  //属于新加的元素
        })

        let id = $(this).attr('data-id')
        //发请求获取对应id的数据
        $.ajax({
            method: 'get',  //type也可以指定类型
            url: '/my/article/cates/:' + id,
            success(res) {
                // 通过form.val(form, { 填充数据 })
                form.val('form-edit', res.data)
            }
        })
    })
    //委托submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                }
                layer.msg('更新分类数据成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })
    //删除按钮事件绑定
    $('tbody').on('click', '.btn-delete', function () {
        let id = $(this).attr('data-id')
        // 提示框提示是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')
                    layer.close(index);
                    initArtCateList()
                }
            })

        });
    })
})