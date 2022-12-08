$(function(){
    var form = layui.form

    form.verify({
        nickname:function(value){
            if(value.length > 6){
                return '昵称长度必须在1～6个字符之间！'
            }
        }
    })

    //初始化用户信息
    initUserInfo()
    function initUserInfo(){
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取用户信息失败！')
                }
                // 调用 form.val() 快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    //重置表单的数据
    $('#btnReset').on('click', function(e) {
        //阻止表单的默认重置行为
        e.preventDefault()
        initUserInfo()
    })

    //监听表单的提交事件
    $('.layui-form').on('submit', function(e){
        //阻止表单的默认提交行为
        e.preventDefault()
        // 发起ajax数据请求
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                //在子页面中调用父页面中的方法，重新渲染用户的头像和用户的信息
                //window代表的是iframe本身 parent就是index的页面
                window.parent.getUserInfo() 
            }
        })
    })
})