const bot = new ChatSDK({
    // 初始化query
    // query: '你好',
    config: {
        navbar: {
            title: '智能客服'
        },
        avatarWhiteList: ['knowledge', 'recommend'],
        // 机器人头像
        robot: {
            avatar: 'img/robot.jpg'
        },
        // 用户头像
        user: {
            avatar: 'img/user.jpeg',
        },
        messages: [
            {
                type: 'system',
                content: {
                    text: '智能客服进入对话，为您服务',
                },
            },
            {
                type: 'text',
                content: {
                    text: '智能客服为您服务，请问有什么可以帮您？'
                }
            }
        ],
        // 快捷短语
        quickReplies: [
            {name: '你好'},
            {name: '你会什么功能'},
            {name: '推荐一个景点'},
        ],
        // 输入框占位符
        placeholder: '输入您想要咨询的问题',
        // （可选）配置按钮文案
        loadMoreText: '点击查看更多历史记录',
        // 侧边栏
        sidebar: [
            {
                title: '公告',
                code: 'richtext',
                data: {
                    text: '目前已实现了和对话接口的交互，请在左侧区域和智能客服机器人聊天吧！',
                },
            },
        ],
        feedback: {
            // 点赞后出的文本
            textOfGood: '感谢您的评价，我们会继续努力的哦！',
            // 点踩后出的文本
            textOfBad: '抱歉，给您带来不好的体验，我会继续学习，下次为您提供更好的服务。',
            // 点踩后是否显示反馈表单
            needFeedback: true,
            // 不满意原因列表
            options: [
                {
                    // 选项值
                    value: '我没有得到我想要的答案',
                    // 选项显示文本，当与 value 相同时可省略
                    label: '我没有得到我想要的答案',
                },
                {
                    value: '界面太难用了',
                }
            ],
            // 原因是否必选
            isReasonRequired: true,
            // 提交反馈后出的文本
            textAfterSubmit: '',
        },
        loadMoreText: '点击查看更多历史记录',
    },
    requests: {
        /**
         *
         * 问答接口
         * @param {object} msg - 消息
         * @param {string} msg.type - 消息类型
         * @param {string} msg.content - 消息内容
         * @return {object}
         */
        send: function (msg) {
            // console.log(msg._id);
            const data = msg.content;
            // 发送文本消息时
            if (msg.type === 'text') {
                return {
                    url: g_host_dialogue+'/dialogue/ask',
                    data: {
                        user_id: 1,
                        question: data.text
                    }
                };
            }
        },
        // 历史消息配置接口
        history: function () {
            return {
                url: g_host_manage+"/user/get_chat_history?user_id=1",
            };
        },
        /**
         *
         * 点赞点踩接口（可选）
         * @param {string} data.msgId - 消息ID
         * @param {string} data.type - 点赞: good, 点踩: bad
         * @return {object}
         */
        evaluate(data) {
            // console.log(data);
            return {
                url: g_host_manage+'/user/feedback',
                data: {
                    messageId: data.msgId,
                    evaluateType: data.type,
                },
            };
        },
        /**
         *
         * 反馈（可选）
         * @param {string} data.msgId - message id
         * @param {string} data.category - 原因
         * @param {string} data.text - 其他原因
         * @return {object}
         */
        feedback(data) {
            // console.log(data);
            return {
                url: '/api/feedback',
                data: {
                    messageId: data.msgId,
                    category: data.category,
                    text: data.text,
                },
            };
        }
    },
    // 收到消息的数据处理
    handlers: {
        /**
         *
         * 解析请求返回的数据
         * @param {object} res - 请求返回的数据
         * @param {object} requestType - 请求类型
         * @return {array}
         */
        parseResponse: function (res, requestType) {
            console.log(res);
            // 根据 requestType 处理数据
            // 如果是send
            if (requestType === 'send') {
                // 是单轮
                if (res.code === 20001) {
                    return {
                        type: 'card',
                        content: {
                            code: 'knowledge',
                            data:{
                                text: res.data.answer.content
                            }
                        },
                        meta: {
                            evaluable: true // 是否展示点赞点踩按钮
                        }
                    }
                }
                // 是多轮
                else if (res.code === 20002) {
                    option_list = [];
                    let i = 0;
                    const options = res.data.answer.options;
                    // 判断是否到达叶节点，即无后续选项
                    if (options.length > 0) {
                        for (idx in options) {
                            option_list[i] = {title: options[idx]};
                            i++;
                        }
                        return [
                            {
                                type: 'card',
                                content: {
                                    code: 'knowledge',
                                    data:{
                                        text: res.data.answer.content
                                    }
                                },
                                meta: {
                                    evaluable: true // 是否展示点赞点踩按钮
                                }
                            },
                            {
                                type: 'card',
                                content: {
                                    code: 'slot',
                                    data: {
                                        hideShortcuts: true,
                                        list: option_list
                                    }
                                }
                            }]
                    } else {
                        return {
                            type: 'text',
                            content: {
                                text: res.data.answer.content,
                            },
                        }
                    }
                }
                else if(res.code===40001){
                    return {
                        type: 'text',
                        content: {
                            text: res.data.answer.content,
                        },
                    }
                }
                // 否则，非单轮和多轮，即未正常得到回复
                return {
                    type: 'text',
                    content: {
                        text: res.msg,
                    },
                }
            }
            //如果是history
            else if (requestType === 'history') {
                //show
                const msg_list=res.data;
                for(let i=0; i < msg_list.length; i++){
                    delete msg_list[i].id;
                    msg_list[i]["content"]={
                        "text":msg_list[i].contentText
                    }
                    delete msg_list[i]["content_text"];
                }
                // console.log(msg_list);
                return {
                    "list": msg_list,
                    "noMore": true
                }
            }
            // 不需要处理的数据直接返回
            else {
                return res;
            }
        },
    },
});

bot.run();