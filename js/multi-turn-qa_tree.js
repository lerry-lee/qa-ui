$(document).ready(function () {
    layui.use('table', function () {

        //更新多轮问答树到redis
        $("#update_multi_round_qa_tree").on("click", function () {
            layer.confirm('确定要更新多轮问答树到redis么', {icon: 3, title: '提示'}, function (index) {
                //do something
                $.ajax({
                    type: "GET",
                    url: g_host_manage + "/management/update_multi_turn_qa_tree",
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

    });
});

