$(function() {
  $('<div class="load-tip">页面加载完成~</div>').appendTo('body');// 页面加载提示
  $('.load-tip').css({
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '8px 15px',
    background: '#42b983',
    color: '#fff',
    borderRadius: '4px',
    zIndex: 999
  }).fadeOut(3000);
  //页面加载完成后执行
  $('.avatar img').hide().fadeIn(3000); //头像加载动画
  $('.content-list li').hover(//内容列表项悬浮效果
    function() {//鼠标移进来，文字颜色改变
      $(this).find('a').css('color', '#42b983');
    },
    function() {//鼠标移出去，文字颜色改变
      $(this).find('a').css('color', '#333');
    }
  );
    
    function updateClock() {//定义更新时钟的函数
      //获取当前时间
      const now = new Date();
      //提取年、月、日、时、分、秒
      const year = String(now.getFullYear())
      const month = String(now.getMonth()+1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      //拼接成时间格式
      const timeStr = `${year}年:${month}月:${day}日:${hours}点:${minutes}分:${seconds}秒`;
      //将时间显示到页面的#clock元素中
      $('#clock').text(timeStr);
    }
  
    //页面加载后立即显示一次时间
    updateClock();
    //每1秒执行一次updateClock，实现动态时钟
    setInterval(updateClock, 1000);
});