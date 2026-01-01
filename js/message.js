$(function() {
  // 定义一个常量作为本地存储的数据名
  const DATEKEY = 'blogMessages';
  // localStorage浏览器提供的本地存储 API,只能存储字符串
  // localStorage.getItem(DATEKEY)如果本地存储中有这个数据，返回字符串格式的内容,如果没有，返回null
  // 把本地存储的字符串数据，转回 JS 能识别的数组,如果getItem返回 nullJSON.parse也会返回null 
  let messages = JSON.parse(localStorage.getItem(DATEKEY)) || [];
  // messages = [{id: 1712345678901, username: "张三", content: "测试", time: "2025-11-05 12:34"}]
  // console.log(messages)//测试
  // 判断留言列表和添加留言
  function Msg() {
    const list = $('#messageList');//获取留言列表位置
    if (messages.length === 0) {//如果留言为空，则在列表位置留下此段文字
      list.html('<div class="empty-message">暂无留言，快来抢沙发～</div>');
    }
    else{
    //拷贝数组
    let copyMessages = messages.slice();
    //反转数组（最新留言在前
    let reversedMessages = copyMessages.reverse();
    //遍历数组，生成每个留言的HTML片段
    let htmlArr = [];
    for (let i = 0; i < reversedMessages.length; i++) {
      // msg等于最新值
      let msg = reversedMessages[i];
      // 生成留言条
      let html = `
        <div class="message-item" data-id="${msg.id}">
          <div class="message-header">
            <span class="message-username">${msg.username}</span>
            <span class="message-time">${msg.time}</span>
          </div>
          <div class="message-content">${msg.content}</div>
        </div>
       `;
      htmlArr.push(html);
    }
    // 拼接成完整HTML字符串
    let MessageItem = htmlArr.join('');
    //插入到页面
    list.html(MessageItem);
  }
  }
  // Msg();//测试
    // 时间格式化
    function formatTime(date) {
      //定义一个函数，如果n<10，则在n前补0，否则直接输出
      const pad = n => n < 10 ? `0${n}` : n;
      // 格式化字符串输出日期
      return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    //提交表单
    $('#messageFrom').submit(function(e) {
      e.preventDefault();//拦截原生提交
      // console.log("qewtrew")//测试
      const name = $('#username').val().trim();//获取留言表单中昵称输入框的内容，并清理掉内容首尾的无用空格
      // console.log(name);//测试
      const content = $('#content').val().trim();////获取留言表单中内容输入框的内容，并清理掉内容首尾的无用空格
      // console.log(content);//测试
      // 验证是否符合要求
      if (name.length < 2 || name.length > 8){return alert('昵称请控制在2-8字之间～')} ;
      if (content.length < 1 || content.length > 50){return alert('留言内容请控制在1-50字之间～')} ;
  
      // 创建留言对象
      const newMsg = {
        id: Date.now(),//留言ID
        username: name,//留言名称
        content: content,//留言内容
        time: formatTime(new Date())
      };
      console.log(newMsg);//测试
  
      // 保存数据
      messages.push(newMsg);
      localStorage.setItem(DATEKEY, JSON.stringify(messages));
      // 添加到留言墙里
      Msg();
      // 创建弹幕
      createDanmu(newMsg);
      // 清空填写
      $('#username').val('');
      $('#content').val('');
    });
  // 创建弹幕,并立即播放
  function createDanmu(msg) {
    // console.log("adsdsaads")//测试
    const container = $('#danmuContainer');
    const height = container.height();//弹幕高度
  // 弹幕随机值计算
    const width = Math.random() * 200 + 100;//弹幕宽度100-300px
    const top = Math.random() * (height - 40);//距头部距离
    const colors = ['rgba(66,153,225,0.8)','rgba(159,122,234,0.8)','rgba(56,178,172,0.8)','rgba(46,125,50,0.8)','rgba(237,137,54,0.8)'];//随机颜色
    const color = colors[Math.floor(Math.random() * colors.length)];//弹幕颜色抽取
    const speed = Math.random() * 10 + 8;//弹幕速度8到18秒

  // 先创建弹幕元素并赋值给变量
    $('<div class="danmu-item"></div>')
      .text(`${msg.username}: ${msg.content}`)//文本格式
      .css({width:`${width}px`,top: `${top}px`, backgroundColor: color, animationDuration: `${speed}s`,borderRadius:'8px',cursor: 'pointer',})//css样式
      .data('id', msg.id)//数据id
      .click(function() {//filter返回新数组,数组过滤方法，遍历 messages 数组，只保留id不等于被点击弹幕id的留言
        messages = messages.filter(m => m.id !== $(this).data('id'));
        localStorage.setItem(DATEKEY, JSON.stringify(messages));//把删除后的新数组同步到浏览器本地存储，避免刷新页面后删除的留言 “恢复”
        Msg();//重新加载页面上的留言列表
        $(this).remove();//从页面上移除被点击的这个弹幕元素
      })
      .appendTo(container);//添加到弹幕容器中去

    // 自动移除弹幕
    setTimeout(() => $(`.danmu-item[data-id="${msg.id}"]`).remove(), speed * 1000);
  }

  //播放历史弹幕
  function playHistoryDanmu() {
    // 判断是否有历史留言，没有则直接退出
    if (messages.length === 0) {return;};
    // 简化随机选3条逻辑
    // 拷贝原数组
    const copyMessages = [...messages];
    // 随机打乱拷贝后的数组,截取前3条
    const randomMsgs = copyMessages.sort(() => 0.5 - Math.random()).slice(0, 3);
    // 遍历3条留言，分批生成弹幕
    randomMsgs.forEach(function(msg){
      // 生成 0~3秒的随机延迟 
      const delayTime = Math.random() * 3000;
    //延迟生成弹幕
    setTimeout(function(){
      createDanmu(msg); // 为这条留言创建弹幕
    }, delayTime);
  });
}
  // 清空所有留言
  $('#clearAllMsg').click(function() {
  if (confirm('确定要清空所有留言吗？')) { // 二次确认，防止误点
    localStorage.removeItem('blogMessages'); // 删除本地存储数据
    messages = []; // 重置内存中的数组
    Msg(); // 重新开始，显示暂无留言
    //清空所有正在显示的弹幕
    $('#danmuContainer').empty();
    alert('已清空所有留言！');
    }
  });

  Msg();//开始执行判断
  setTimeout(playHistoryDanmu, 2000);//先延迟2秒播放一次历史弹幕
  setInterval(playHistoryDanmu, 30000);//每隔30秒自动播放一次历史弹幕
});
