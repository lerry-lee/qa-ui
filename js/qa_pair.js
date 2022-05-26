const g_host_query_stdq_stda=g_host_manage+'/management/query_stdq_stda';
const g_host_add_stdq_stda=g_host_manage+'/management/batch_insert_into_stdq_stda';
const g_host_delete_from_stdq_stda=g_host_manage+'/management/delete_from_stdq_stda';
const g_host_update_stdq_stda=g_host_manage+'/management/update_stdq_stda';
const g_host_search_stdq_stda=g_host_manage+'/management/search_stdq_stda';
const g_host_total_synchronize=g_host_manage+'/management/total_synchronize';

const g_host_query_stdq_simq=g_host_manage+'/management/query_stdq_simq';
const g_host_add_stdq_simq=g_host_manage+'/management/batch_insert_into_stdq_simq';
const g_host_delete_from_stdq_simq=g_host_manage+'/management/delete_from_stdq_simq';
const g_host_update_stdq_simq=g_host_manage+'/management/update_stdq_simq';
const g_host_search_stdq_simq=g_host_manage+'/management/search_stdq_simq';



$(document).ready(function () {
    layui.use('table', function () {
        const table = layui.table;

        //stdq_stda
        table.render({
            elem: '#stdq_stda'
            , url: g_host_query_stdq_stda //数据接口
            , page: true //开启分页
            , limit: 10
            , cols: [[ //表头
                // {field: 'id', title: 'ID', width: 80, sort: true, fixed: 'left'}
                {field: 'qa_id', title: 'qa_id', width: 80, sort: true, fixed: 'left'}
                , {field: 'category1', title: '一级类别', width: 100, sort: true}
                , {field: 'category2', title: '二级类别', width: 100, sort: true}
                , {field: 'standard_question', title: '标准问', sort: true}
                , {field: 'standard_answer', title: '标准答'}
                , {field: '#', title: '操作', toolbar: '#barDemo', width: 120}
            ]]
        });

        //stdq_stda工具条事件
        table.on('tool(stdq_stda)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
            const data = obj.data; //获得当前行数据
            const layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            if (layEvent === 'del') { //删除
                layer.confirm('确定要删除该行吗', function (index) {
                    $.ajax({
                        type: "POST",
                        contentType: "application/x-www-form-urlencoded",
                        url: g_host_delete_from_stdq_stda,
                        data: {
                            "qa_id": data['qa_id'],
                            "category1": data['category1'],
                            "category2": data['category2'],
                            "standard_question": data['standard_question'],
                            "standard_answer": data['standard_answer']
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
                                    table.reload('stdq_stda', {
                                        url: g_host_query_stdq_stda,
                                    });
                                    table.reload('stdq_simq', {
                                        url: g_host_query_stdq_simq,
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
                        $('#qa_id').val(data['qa_id']);
                        $('#category1').val(data['category1']);
                        $('#category2').val(data['category2']);
                        $('#standard_question').val(data['standard_question']);
                        $('#standard_answer').val(data['standard_answer']);
                        layui.use('form', function () {
                            const form = layui.form;
                            //监听提交
                            form.on('submit(formDemo)', function (formData) {
                                const row = formData.field;
                                // console.log(row);
                                $.ajax({
                                    type: "POST",
                                    contentType: "application/x-www-form-urlencoded",
                                    url: g_host_update_stdq_stda,
                                    data: {
                                        "qa_id": row['qa_id'],
                                        "category1": row['category1'],
                                        "category2": row['category2'],
                                        "standard_question": row['standard_question'],
                                        "standard_answer": row['standard_answer']
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
                                                table.reload('stdq_stda', {
                                                    url: g_host_query_stdq_stda,
                                                });
                                                table.reload('stdq_simq', {
                                                    url: g_host_query_stdq_simq,
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
                                $('#qa_id').val(data['qa_id']);
                                $('#category1').val(data['category1']);
                                $('#category2').val(data['category2']);
                                $('#standard_question').val(data['standard_question']);
                                $('#standard_answer').val(data['standard_answer']);
                                return false;
                            });
                        });
                    }
                });
            }
        });

        //stdq_stda搜索事件
        $("#search").on("click", function () {
            const stdq = $("#stdq").val();
            if (stdq == null || stdq.trim() === '') {
                layer.msg("标准问搜索词不能为空！");
                return false;
            }

            table.reload('stdq_stda', {
                url: g_host_search_stdq_stda
                ,method: 'post'
                ,where: {"standard_question": stdq} //设定异步数据接口的额外参数
                ,page: {
                    curr: 1 //重新从第 1 页开始
                }
            });

        });

        //stdq_simq
        table.render({
            elem: '#stdq_simq'
            , url: g_host_query_stdq_simq //数据接口
            , page: true //开启分页
            , limit: 10
            , cols: [[ //表头
                // {field: 'id', title: 'ID', width: 80, sort: true, fixed: 'left'}
                {field: 'qa_id', title: 'qa_id', width: 80, sort: true, fixed: 'left'}
                , {field: 'standard_question', title: '标准问', sort: true}
                , {field: 'similar_question', title: '相似问',}
                , {field: '#', title: '操作', toolbar: '#barDemo', width: 120,}
            ]]
        });

        //stdq_simq工具条事件
        table.on('tool(stdq_simq)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
            const data = obj.data; //获得当前行数据
            const layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            if (layEvent === 'del') { //删除
                layer.confirm('确定要删除该行吗', function (index) {
                    $.ajax({
                        type: "POST",
                        contentType: "application/x-www-form-urlencoded",
                        url: g_host_delete_from_stdq_simq,
                        data: {
                            "qa_id": data['qa_id'],
                            "standard_question": data['standard_question'],
                            "similar_question": data['similar_question']
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
                                    table.reload('stdq_simq', {
                                        url: g_host_query_stdq_simq,
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
                    , content: $("#edit-window-stdq_simq")
                    , success: function (layero, index) {
                        $('#qa_id-stdq_simq').val(data['qa_id']);
                        $('#standard_question-stdq_simq').val(data['standard_question']);
                        $('#similar_question-stdq_simq').val(data['similar_question']);
                        layui.use('form', function () {
                            const form = layui.form;
                            //监听提交
                            form.on('submit(formDemo-stdq_simq)', function (formData) {
                                const row = formData.field;
                                // console.log(row);
                                $.ajax({
                                    type: "POST",
                                    contentType: "application/x-www-form-urlencoded",
                                    url: g_host_update_stdq_simq,
                                    data: {
                                        "qa_id": row['qa_id-stdq_simq'],
                                        "standard_question": row['standard_question-stdq_simq'],
                                        "old_similar_question": row['similar_question-stdq_simq'],
                                        "new_similar_question": row['similar_question-stdq_simq-new'],
                                    },
                                    xhrFields: {
                                        withCredentials: true
                                    },
                                    success: function (data) {
                                        const res = data.data;
                                        if (res.code === 20000) {
                                            setTimeout(function () {
                                                layer.close(index);
                                                table.reload('stdq_simq', {
                                                    url: g_host_query_stdq_simq,
                                                });
                                            }, 3000);
                                        }
                                        layer.msg(res);
                                    },
                                    error: function (data) {
                                        alert("请求失败，原因为" + data.responseText);
                                    }
                                });
                                return false;
                            });
                        });
                    }
                });
            }
        });

        //stdq_simq搜索事件
        $("#search2").on("click", function () {
            const stdq = $("#stdq2").val();
            if (stdq == null || stdq.trim() === '') {
                layer.msg("标准问搜索词不能为空！");
                return false;
            }

            table.reload('stdq_simq', {
                url: g_host_search_stdq_simq
                ,method: 'post'
                ,where: {"standard_question": stdq} //设定异步数据接口的额外参数
                ,page: {
                    curr: 1 //重新从第 1 页开始
                }
            });

        });


        //全量同步stdq_stda
        $("#total_sync1").on("click", function () {
            layer.confirm('确定要同步该表数据到elasticsearch么', {icon: 3, title: '提示'}, function (index) {
                //do something
                $.ajax({
                    type: "GET",
                    url: g_host_total_synchronize + "?table_index_name=stdq_stda",
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (data) {
                        const res = data.data;
                        layer.msg(res);
                        if (res.code === 20000) {
                            setTimeout(function () {
                                layer.close(index);
                            }, 3000)
                        }
                    },
                    error: function (data) {
                        alert("请求失败，原因为" + data.responseText);
                    }
                });
            });
        });

        //添加数据stdq_stda
        $("#add").on("click", function () {
            layer.open({
                type: 1 //Page层类型
                , skin: 'layui-layer-molv'
                , area: ['700px', '500px']
                , title: ['添加行数据']
                , shadeClose: true
                , shade: 0 //遮罩透明度
                , maxmin: true //允许全屏最小化
                , content: $("#add-window-stdq_stda")
                , success: function (layero, index) {
                    layui.use('form', function () {
                        const form = layui.form;
                        //监听提交
                        form.on('submit(formDemo-add-stdq_stda)', function (formData) {
                            const row = formData.field;
                            $.ajax({
                                type: "POST",
                                contentType: "application/json",
                                url: g_host_add_stdq_stda,
                                data: JSON.stringify([{
                                    "qa_id": row['qa_id-add-stdq_stda'],
                                    "category1": row['category1-add-stdq_stda'],
                                    "category2": row['category2-add-stdq_stda'],
                                    "standard_question": row['standard_question-add-stdq_stda'],
                                    "standard_answer": row['standard_answer-add-stdq_stda']
                                }]),
                                xhrFields: {
                                    withCredentials: true
                                },
                                success: function (data) {
                                    const res = data.data;
                                    if (res.code === 20000) {
                                        setTimeout(function () {
                                            layer.close(index);
                                            table.reload('stdq_stda', {
                                                url: g_host_query_stdq_stda,
                                            });
                                            table.reload('stdq_simq', {
                                                url: g_host_query_stdq_simq,
                                            });
                                        }, 3000);
                                    }
                                    layer.msg(res);
                                },
                                error: function (data) {
                                    alert("请求失败，原因为" + data.responseText);
                                }
                            });
                            return false;
                        });
                    });
                }
            });
        });

        //全量同步stdq_simq
        $("#total_sync2").on("click", function () {
            layer.confirm('确定要同步该表数据到elasticsearch么', {icon: 3, title: '提示'}, function (index) {
                //do something
                $.ajax({
                    type: "GET",
                    url: g_host_total_synchronize + "?table_index_name=stdq_simq",
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (data) {
                        const res = data.data;
                        layer.msg(res);
                        if (res.code === 20000) {
                            setTimeout(function () {
                                layer.close(index);
                            }, 3000)
                        }
                    },
                    error: function (data) {
                        alert("请求失败，原因为" + data.responseText);
                    }
                });
                return false;
            });
        });

        //添加数据stdq_simq
        $("#add2").on("click", function () {
            layer.open({
                type: 1 //Page层类型
                , skin: 'layui-layer-molv'
                , area: ['700px', '500px']
                , title: ['添加行数据']
                , shadeClose: true
                , shade: 0 //遮罩透明度
                , maxmin: true //允许全屏最小化
                , content: $("#add-window-stdq_simq")
                , success: function (layero, index) {
                    layui.use('form', function () {
                        const form = layui.form;
                        //监听提交
                        form.on('submit(formDemo-add-stdq_simq)', function (formData) {
                            const row = formData.field;
                            $.ajax({
                                type: "POST",
                                contentType: "application/json",
                                url: g_host_add_stdq_simq,
                                data: JSON.stringify([{
                                    "qa_id": row['qa_id-add-stdq_simq'],
                                    "standard_question": row['standard_question-add-stdq_simq'],
                                    "similar_question": row['similar_question-add-stdq_simq']
                                }]),
                                xhrFields: {
                                    withCredentials: true
                                },
                                success: function (data) {
                                    const res = data.data;
                                    if (res.code === 20000) {
                                        setTimeout(function () {
                                            layer.close(index);
                                            table.reload('stdq_simq', {
                                                url: g_host_query_stdq_simq,
                                            });
                                        }, 3000);
                                    }
                                    layer.msg(res);
                                },
                                error: function (data) {
                                    alert("请求失败，原因为" + data.responseText);
                                }
                            });
                            return false;
                        });
                    });
                }
            });
        });

    });

});

