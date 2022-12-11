$(function(){

    var layer = layui.layer
    var form = layui.form

    initArtCateList()

    //获取文章分类的列表
    function initArtCateList(){
        $.ajax({
            method: 'GET',
            url:'/my/article/cates',
            success:function(res){
                //调用渲染模版引擎template(id, 数据)
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //为添加类别按钮绑定点击事件
    var indexAdd = null

    $('#btnAddCate').on('click', function(){
        indexAdd = layer.open({
            //打开弹出框
            //type属性 1代表页面层 2代表信息框
            type: 1,
            //area属性 设置宽高
            area: ['500px', '250px'],
            title:'添加文章分类',
            //在html页面中放一个script脚本 编辑内容再通过id选择html()拿过来
            content:$('#dialog-add').html()
        })
    })

    //通过代理的形式 为form-add表单绑定submit事件
    //因为#form-add不是页面中原有的元素 所以不能直接选择
    //要通过选择body 阻止冒泡 将按钮代理到#form-add身上
    $('body').on('submit', '#form-add', function(e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('新增文章分类失败！')
                }
                initArtCateList()
                layer.msg('新增文章分类成功！')
                //根据索引 关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    //通过代理的形式 为btn-edit 按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function(e){
        //弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            //打开弹出框
            //type属性 1代表页面层 2代表信息框
            type: 1,
            //area属性 设置宽高
            area: ['500px', '250px'],
            title:'添加文章分类',
            //在html页面中放一个script脚本 编辑内容再通过id选择html()拿过来
            content:$('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')//attr()拿到id的值
        //发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success:function(res){
                // form-edit 是 lay-filter 用于填充内容属性的值 识别填充
                // res.data 是从回调参数中获取的数据
                form.val('form-edit', res.data)
            }
        })
    })

    //通过代理的形式 为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                // 关闭弹出层 用layer.close(放弹出层的索引)
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    //通过代理的形式 为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function(e){
        e.preventDefault()
        var id = $(this).attr('data-id')//attr()拿到属性的值
        //提示用户是否要删除
        layer.confirm('确认删除？', { icon: 3, title: '提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                    return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })
})