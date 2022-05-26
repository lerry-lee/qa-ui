$(document).ready(function () {
    layui.use('table', function () {
        const table = layui.table;

        //feedback_table
        table.render({
            elem: '#feedback_table'
            , url: g_host_manage + '/management/query_all_feedback' //数据接口
            , page: true //开启分页
            , limit: 10
            , cols: [[ //表头
                {field: 'id', title: 'ID', width: 80, sort: true, fixed: 'left'}
                , {field: 'question', title: '用户提问', width: 100, sort: true}
                , {field: 'type', title: '类型', width: 100, sort: true}
                , {field: 'reason', title: '原因'}
                , {field: '#', title: '操作', toolbar: '#barDemo', width: 120}
            ]]
        });

        //feedback_table工具条事件
        table.on('tool(feedback_table)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
            const data = obj.data; //获得当前行数据
            const layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            if (layEvent === 'del') { //删除
                layer.confirm('确定要删除该行吗', function (index) {
                    $.ajax({
                        type: "POST",
                        contentType: "application/x-www-form-urlencoded",
                        url: g_host_manage + "/delete_from_feedback",
                        data: {
                            "id": data['id'],
                            "question": data['question'],
                            "type": data['type'],
                            "reason": data['reason'],
                        },
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (data) {
                            const res = data.data;
                            layer.msg(res);
                            if (res.code === 20000) {
                                setTimeout(function () {
                                    layer.close(index);
                                    table.reload('feedback_table', {
                                        url: g_host_manage + "management/query_all_feedback",
                                    });
                                }, 3000);
                            }
                        },
                        error: function (data) {
                            alert("请求失败，原因为" + data.responseText);
                        }
                    });
                });
            } else if (layEvent === 'edit') { //编辑
                //do something
                layer.open({
                    type: 1 //Page层类型
                    , skin: 'layui-layer-molv'
                    , area: ['700px', '500px']
                    , title: ['编辑行数据']
                    , shadeClose: true
                    , shade: 0 //遮罩透明度
                    , maxmin: true //允许全屏最小化
                    , content: $("#edit-window")
                    , success: function (layero, index) {
                        $('#id').val(data['id']);
                        $('#question').val(data['question']);
                        $('#type').val(data['type']);
                        $('#reason').val(data['reason']);
                        layui.use('form', function () {
                            const form = layui.form;
                            //监听提交
                            form.on('submit(formDemo)', function (formData) {
                                const row = formData.field;
                                // console.log(row);
                                $.ajax({
                                    type: "POST",
                                    contentType: "application/x-www-form-urlencoded",
                                    url: g_host_manage + "management/update_feedback",
                                    data: {
                                        "id": data['id'],
                                        "question": data['question'],
                                        "type": data['type'],
                                        "reason": data['reason'],
                                    },
                                    xhrFields: {
                                        withCredentials: true
                                    },
                                    success: function (data) {
                                        const res = data.data;
                                        layer.msg(res);
                                        if (res.code === 20000) {
                                            setTimeout(function () {
                                                layer.close(index);
                                                table.reload('feedback_table', {
                                                    url: g_host_manage + "management/query_all_feedback",
                                                });
                                            }, 3000);
                                        }
                                    },
                                    error: function (data) {
                                        alert("请求失败，原因为" + data.responseText);
                                    }
                                });
                                return false;
                            });
                            //监听重置
                            $("#reset").on("click", function () {
                                $('#id').val(data['id']);
                                $('#question').val(data['question']);
                                $('#type').val(data['type']);
                                $('#reason').val(data['reason']);
                                return false;
                            });
                        });
                    }
                });
            }
        });

    });

});

