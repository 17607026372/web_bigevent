$(function () {
    //点击去注册账号的链接
    $('#link_reg').on('click', function () {
        //   alert(11)
        $('.login-box').hide()
        $('.reg-box').show()
    })
    //点击去登录的连接
    $('#link_login').on('click', function () {
        //   alert(11)
        $('.login-box').show()
        $('.reg-box').hide()
    })
    //从layui中获取from对象
    const form = layui.form
    const layer = layui.layer
    //通过form.verify（）函数自定义校验规则
    form.verify({
        //自定义了一个名为pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位,且不能出现空格'
        ],


        repwb: function (value) {
            let pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次输入的密码不一致！'
            }
        },
    })
    //监听注册表单的提交事件
    $('#from_reg').on('submit', function (e) {
        e.preventDefault()
        let data = { username: $('#from_reg [name=username]').val(), password: $('#from_reg [name=password]').val() }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录!')
            //模拟点击去登陆的链接
            $('#link_login').click()
        })
    })
    //监听登录表单的提交事件
    $('#from_login').on('submit', function (e) {
        //阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            //快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                // console.log(res.token)
                //将登陆成功得到的token字符串，保存到localStorage中
                localStorage.setItem('token',res.token)
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})
