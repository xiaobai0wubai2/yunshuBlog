$(function() {
    $('.tool-btn').click(function() {//工具按钮点击提示
      const toolName = $(this).parent().find('h4').text();//获取工具名称
      alert(`已打开「${toolName}」工具`);//弹出提示
    });

    
    $('.link-list a').click(function(e) {
      alert(`已跳转至「${$(this).text()}」页面`);//弹出提示
    });
  });