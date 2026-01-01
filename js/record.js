$(function() {
    const correctPassword = "123456";// 密码
    
    function loadNotes() {// 加载本地记录
        const notes = JSON.parse(localStorage.getItem("blogNotes")) || [];
        renderNotes(notes);
    }

    function updateTime() {//实时时间显示
        const now = new Date();//创建一个Date实例
        // 格式化时间：年-月-日 时:分:秒
        const timeStr = now.toLocaleString("zh-CN", {// 获取本地时间
            year: "numeric",  
            month: "2-digit",   //月份补零为两位
            day: "2-digit",     //日期补零为两位
            hour: "2-digit",    //小时补零为两位
            minute: "2-digit",  //分钟补零为两位
            second: "2-digit"   //秒数补零为两位
        });
        $("#current-time").text(timeStr);//显示到当前时间处
    }

    $("#verify-btn").click(function() {//密码验证功能
        const inputPwd = $("#password-input").val().trim();//获取输入密码
        if (inputPwd === correctPassword) {
            // 验证通过，隐藏密码框，显示博客模块
            $("#password-box").hide();
            $("#blog-box").show();
            // 启动时间显示
            updateTime();
            setInterval(updateTime, 1000);// 每秒更新一次
            // 加载本地保存的记录
            loadNotes();
        } else {//验证不通过则提示
            $("#password-tip").text("密码错误，请重新输入");
        }
    });

    //记录本功能,本地存储，刷新不丢失
    $("#save-btn").click(function() {//保存记录
        const content = $("#note-content").val().trim();//获取内容
        if (content === "") {
            return alert("记录内容不能为空哦~");
        }

        //获取当前时间
        const now = new Date();
        const noteTime = now.toLocaleString("zh-CN", {//笔记时间
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });

        //构造记录对象
        const note = {
            time: noteTime,
            text: content
        };

        //从本地存储读取已有记录
        let notes = JSON.parse(localStorage.getItem("blogNotes")) || [];
        //添加新记录到最前面
        notes.unshift(note);
        //保存回本地存储
        localStorage.setItem("blogNotes", JSON.stringify(notes));
        //更新记录列表显示
        renderNotes(notes);
        //清空输入框
        $("#note-content").val("");
    });

    // 清空内容
    $("#clear-btn").click(function() {
        $("#note-content").val("");
    });

    // 添加记录列表
    function renderNotes(notes) {
        let note_list = "";
        if (notes.length === 0) {
            note_list = "<p>暂无记录，开始写点什么吧~</p>";
        } else {
            notes.forEach(note => {
                note_list += `
                    <div class="note-item">
                        <div class="note-time">${note.time}</div>
                        <div class="note-text">${note.text}</div>
                    </div>
                `;
            });
        }
        $("#note-list").html(note_list);//添加到页面中去
    }
});