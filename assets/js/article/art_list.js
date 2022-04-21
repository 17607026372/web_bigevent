$(function () {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage;


    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())
        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    //定义数字补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // console.log(dataFormat)
    //定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1,      //页码值，默认请求第一页的数据
        pagesize: 2,     //每页显示多少条数据
        cate_id: '',      //文章分类的 Id
        state: ''      //文章的状态，可选值有：已发布、草稿
    }
    initTable()
    initCate()
    //获取文章列表数据的函数
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                //  console.log(res)

                // layer.msg('获取文章列表成功！')
                //使用模板引擎渲染页面数据
                let htmlStr = template('tpl-tale', res)
                // console.log(htmlStr)
                $('tbody').html(htmlStr)
                //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    //初始化文章的分类方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                //调用模板引擎渲染非雷达的可选项
                let htmlStr = template('tpl-cate', res)
                // console.log(htmlStr)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        //获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        //为查询参宿对象q中对应的属性复制
        q.cate_id = cate_id
        q.state = state
        //根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        // 周用laypage.render()方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox',   //分页容器的id
            count: total,      //总数据条数
            limit: q.pagesize,  //每页显示几条数据
            curr: q.pagenum,    //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页发生切换时，触发 jump 回调
            jump: function (obj, first) {
                // console.log(obj.curr)
                //把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }
    //通过代理的方式为删除绑定点击事件
    $('body').on('click', '.btn-delete', function () {
        //获取文章页剩余删除按钮的个数
        let len = $('.btn-delete').length
        // console.log(len)
        // 获取到文章的id
        let id = $(this).attr('data-id')
        // console.log(id)
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something 
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    //当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    //如果没有剩余的数据了,则让页码值-1之后，
                    //再重新调用initTable方法
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })

    //文章的修改
    //通过代理的方式为编辑绑定点击事件
    
}) 