$(function(){
    // 测试
    // console.log("代码执行了");
    // 点击式轮播图
    $(".banner_about > .about-play").on("click",function(){
        // const $this = $(this);
        // console.log("点击触发了");
        // console.log("当前元素：", this); 
        // console.log("兄弟元素：", $(this).siblings().length); // 看兄弟元素数量
        // 移除兄弟元素的right-move
        $(this).siblings().removeClass('right-move');
        // 给当前元素添加right-move
        $(this).addClass("right-move");
    })
})