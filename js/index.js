// 动态网页标题特效
var Origintitle = document.title,titleTime;//获取原始标题，和定义动画时间
// 监听页面可见性变化，当用户离开当前页面，回来
document.addEventListener("visibilitychange",function(){
if (document.hidden) {// 用户离开时
    document.title = "你别走吖 Σ(っ °Д °;)っ";
    clearTimeout(titleTime);//清除定时器
}
else{//用户回到页面时
    document.title = "你可算回来了 (｡•ˇ‸ˇ•｡)" + Origintitle;
    titleTime = setTimeout(function(){//定时切换到原标题
    document.title = Origintitle 
        },2000)
    }
});


// 导航栏固定特效
const nav = document.querySelector("#nav");//查找id为nav的元素
const navList = document.querySelector(".nav-list");//查找类为nav-list的元素
window.addEventListener("scroll",e => {//监听滚动
    if (window.scrollY > nav.offsetHeight + 100){//当页面滚动距离 > 导航栏自身高度 + 100px时
        nav.classList.add("active");//给导航栏添加"active"类
    }
    else{
        nav.classList.remove("active");//滚动距离不足时，移除"active"类，恢复默认样式
    }
})

// 轮播特效
$(function() {
  const bannerItems = $('.banner-item');//所有轮播图项
  const bannerDots = $('.banner-dots');//获取轮播点容器
  let currentIndex = 0;//记录当前显示的轮播图索引
  let timer = null;//存储自动轮播的定时器ID

  bannerItems.each((index) => {//自动生成轮播点，根据轮播图数量
  // 结构：<div class="banner-dot 初始第1个加active" data-index="当前索引"></div>
  bannerDots.append(`<div class="banner-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`);
  });

  //切换轮播函数
  function switchBanner(index) {
    bannerItems.removeClass('active').eq(index).addClass('active');//所有轮播图移除active，目标索引添加active
    $('.banner-dot').removeClass('active').eq(index).addClass('active');//所有轮播点移除active，目标索引添加active
    currentIndex = index;//当前索引为目标索引
  }

  //自动轮播
  function autoPlay() {//每隔5秒执行一次
    timer = setInterval(() => {
      currentIndex = (currentIndex + 1) % bannerItems.length;//索引自增1，超出最大索引时重置为0
      switchBanner(currentIndex);//切换到新索引对应的轮播图
    }, 5000);
  }
  autoPlay();//切换完成后重启自动轮播

  //点击轮播点切换
  $('.banner-dot').click(function() {
    clearInterval(timer);//点击时暂停自动轮播
    switchBanner($(this).data('index'));//获取点击轮播点的data-index属性值，切换到对应轮播图
    autoPlay();//切换完成后重启自动轮播
  });

  //同时绑定移入和移出事件
  $('.banner').hover(// 鼠标悬浮banner暂停轮播，离开时重启
    () => clearInterval(timer),//鼠标移入，清除定时器，暂停轮播
    () => autoPlay()//鼠标移出，重启自动轮播
  );

  $('.card-item').click(function() {//给所有类为"card-item"的元素绑定点击事件
    const href = $(this).data('href');//获取卡片的data-href属性值
    if (href) {//若链接存在
      //页面body元素2秒淡出，动画结束后跳转到目标链接
      $('body').fadeOut(2000, () => window.location.href = href);
    }
  });

  $('.news-item').each((index, item) => {//遍历所有类为"news-item"的元素
    //初始状态，透明度0，每个元素延迟执行动画，第1个0ms，第2个200ms，第3个400ms... ，实现渐入效果
    $(item).css('opacity', 0).delay(index * 200).animate({ opacity: 1 }, 800);
  });
});

