$(function() {
let bannerIndex = 0; // 初始轮播图片索引
const bannerImgs = $(".banner-imgs"); // 获取轮播图容器
const imgItems = bannerImgs.find("img"); // 图片元素集合
const imgCount = imgItems.length; // 获取图片数量
const imgWidth = 100 / imgCount; // 每张图的宽度百分比
function updateBannerPosition() {//轮播图位置的函数
    bannerImgs.css({//轮播图容器容器样式
        "transform": `translateX(-${bannerIndex * imgWidth}%)`,//索引 x 宽度 = 对应图片位置
        "transition": "transform 0.6s ease" //平滑过渡
    });
}

function autoBanner() {// 自动轮播函数
    bannerIndex++;//索引自增一
    if (bannerIndex >= imgCount) {
        bannerIndex = 0;//索引大于当前图片数量时重置
    }
    updateBannerPosition();//索引变化都更新位置
}

let bannerTimer = setInterval(autoBanner, 3000);//初始化自动轮播

$(".banner-prev").click(function() {//上一张按钮点击事件
    clearInterval(bannerTimer); //清除自动轮播
    bannerIndex--;
    if (bannerIndex < 0) {//索引小于0时
        bannerIndex = imgCount - 1;//返回第四张
    }
    updateBannerPosition(); //更新位置
    bannerTimer = setInterval(autoBanner, 3000); //重启自动轮播
});

$(".banner-next").click(function() {//下一张按钮点击事件
    clearInterval(bannerTimer);//清除自动轮播
    bannerIndex++;//索引自增一
    if (bannerIndex >= imgCount) {//索引大于当前图片数量时重置
        bannerIndex = 0;
    }
    updateBannerPosition();
    bannerTimer = setInterval(autoBanner, 3000);
});

    $("#submit-message").click(function() {//留言功能
        const userName = $("#user-name").val().trim();//获取用户名，去除首尾空格
        const content = $("#message-content").val().trim();//获取内容，去除首尾空格
        if ( userName=== "" || content === "") {//如果用户名或内容为空
            return alert("昵称和留言内容不能为空！");;
        }
        const now = new Date();// 获取当前时间
        //时间字符串，先把数字转成字符串，十位不足补0
        const timeStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        // 生成留言HTML
        const messageHtml = `
            <div class="message-item">
                <div class="message-user">${userName}</div>
                <div class="message-time">${timeStr}</div>
                <div class="message-content">${content}</div>
            </div>
        `;
        $("#message-list").prepend(messageHtml);//添加到留言列表，最新发布的在最前面
        $("#user-name").val("");//清空用户名输入框
        $("#message-content").val("");// 清空内容输入框
        // alert("您的留言提交成功！😄");//弹出提示
    });
    $("#search-weather").click(function() {
  
  const cityName = $("#city-input").val().trim();//获取输入的城市名称
  if (cityName === "") {
    return alert("请输入城市名称！");
  }

  const WEATHER_KEY = "5df136fb67d94a8eb18a10f4452517ca";//和风天气Key
  $.getJSON(`https://geoapi.qweather.com/v2/city/lookup?location=${cityName}&key=${WEATHER_KEY}`, function(cityRes) {//先通过“城市搜索接口”获取城市ID
    if (cityRes.code !== "200" || cityRes.location.length === 0) {//如果搜不了或搜不到，则提示
      return $("#weather-result").html(`<p style="color: red;">未找到该城市，请检查名称！</p>`).addClass("active");;
    }
    const cityId = cityRes.location[0].id;//拿到城市ID
    const realCityName = cityRes.location[0].name; //实际城市名
    $.getJSON(`https://devapi.qweather.com/v7/weather/3d?location=${cityId}&key=${WEATHER_KEY}`, function(weatherRes) {
      if (weatherRes.code !== "200") {//如果搜得到，但是没网或其他原因，则提示
        return $("#weather-result").html(`<p style="color: red;">查询失败：${weatherRes.msg}</p>`).addClass("active");;
      }

      const todayWeather = weatherRes.daily[0]; //3天预报数据，取今日的
      //构造HTML
      const html = `
        <h3>${realCityName} 今日天气</h3>
        <p>日期：${todayWeather.fxDate}</p>
        <p>天气：${todayWeather.textDay}（白天） / ${todayWeather.textNight}（夜间）</p>
        <p>气温：${todayWeather.tempMin}℃ - ${todayWeather.tempMax}℃</p>
        <p>风向：${todayWeather.windDirDay} ${todayWeather.windScaleDay}级</p>
      `;
      $("#weather-result").html(html).addClass("active");

    }).fail(function() {//如果城市找到了，但天气没搜大
      $("#weather-result").html(`<p style="color: red;">天气接口请求失败，请重试！</p>`).addClass("active");
    });

  }).fail(function() {//城市没搜到
    $("#weather-result").html(`<p style="color: red;">城市搜索接口请求失败，请重试！</p>`).addClass("active");
  });
});

});