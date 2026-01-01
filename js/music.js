$(function() {
  // 全局变量
  const audio = $('#audio-player');//音频
  let currentSongId = null;//当前播放歌曲ID
  let collectedSongs = JSON.parse(localStorage.getItem('collectedSongs')) || [];//从浏览器本地存储中读取名为collectedSongs的数据，解析为 JavaScript 数组,若该数据不存在,则默认赋值为空数组[],收藏歌曲功能
    //播放歌曲功能
    function playSong(songItem) {
      const songId = songItem.data('id');//获取id
      const audioUrl = songItem.data('audio');//获取音频
      const songTitle = songItem.find('.song-title').text();//获取歌名
      const songSinger = songItem.find('.song-singer').text();//获取歌手名
      const songCover = songItem.find('.song-cover img').attr('src');//获取图片
      const songDuration = songItem.find('.song-duration').text();//获取时长
      // 更新播放器信息
      audio.attr('src', audioUrl);//添加音频路径
      $('.playing-title').text(songTitle);
      $('.playing-singer').text(songSinger);
      $('.playing-cover').attr('src', songCover);
      $('.total-time').text(songDuration);
      audio[0].play();// 播放音频
      currentSongId = songId;
      updatePlayButton(true);// 更新播放按钮状态
      $('.song-item').removeClass('active');//移除其他高亮
      songItem.addClass('active');//给当前歌曲添加高亮
    }
  //随机播放功能
  $('.random-btn').click(function() {
    const songItems = $('.song-item');
    if (songItems.length === 0) {
      return alert("目前歌曲列表没有歌曲，请添加歌曲");
    };
    // 随机选择一首歌曲
    const randomIndex = Math.floor(Math.random() * songItems.length);
    const randomSong = songItems.eq(randomIndex);
    playSong(randomSong);//执行播放
  });
  //歌曲播放功能
  $('.play-song').click(function(e) {
    e.stopPropagation(); // 阻止事件冒泡
    const songItem = $(this).closest('.song-item');//保存当前歌曲条
    playSong(songItem);//执行播放
  });
  // 底部播放/暂停切换
  $('.toggle-play').click(function() {
    if (audio[0].paused) {//判断音频是否处于暂停状态
      if (currentSongId) {//是，但有当前选中的歌曲ID
        audio[0].play();//恢复播放当前歌曲
        updatePlayButton(true);//更换按钮为暂停状态
      } else {//无当前歌曲ID，首次点击播放，还没选过任何歌
        const firstSong = $('.song-item').first();// 无当前歌曲时默认播放第一首
        if (firstSong.length){
          playSong(firstSong);//若存在第一首歌，调用 playSong 播放它
        };
      }
    } else {//音频处于播放中状态,执行暂停
      audio[0].pause();//暂停音频
      updatePlayButton(false);//更新按钮为播放状态
    }
  });
  //收藏歌曲功能
  $('.collect-song').click(function(e) {
    e.stopPropagation();// 阻止事件冒泡
    const btn = $(this);//当前收藏按钮
    const songItem = btn.closest('.song-item');//保存当前歌曲条
    const songId = songItem.data('id');//保存当前歌曲ID
    const songData = {//保存当前歌曲信息
      id: songId,
      title: songItem.find('.song-title').text(),
      singer: songItem.find('.song-singer').text(),
      cover: songItem.find('.song-cover img').attr('src'),
      audio: songItem.data('audio'),
      duration: songItem.find('.song-duration').text()
    };

    // 切换收藏状态
    if (btn.hasClass('active')) {//如果已收藏，再次点击取消收藏
      // 取消收藏
      btn.removeClass('active').find('i').removeClass('fas').addClass('far');
      collectedSongs = collectedSongs.filter(song => song.id !== songId);//从收藏数组中删除当前歌曲
    } else {
      // 添加收藏
      btn.addClass('active').find('i').removeClass('far').addClass('fas');
      collectedSongs.push(songData);//将当前歌曲数据添加到收藏数组中
    }
    localStorage.setItem('collectedSongs', JSON.stringify(collectedSongs));// 保存到本地存储
    CollectedList();// 更新收藏列表
  });
  //上传翻唱功能
  $('#cover-upload').change(function(e) {
    const file = e.target.files[0];//获取用户选择的第一个文件
    if (!file){ return };//若未选择文件，直接终止函数
    // 验证文件类型仅音频
    if (!file.type.startsWith('audio/')) {
      return alert('请上传音频文件（MP3、WAV等）');;
    }
    // 创建临时URL播放
    const audioUrl = URL.createObjectURL(file);//为浏览器本地的对象生成一个临时的、可直接访问的 URL 地址
    const songTitle = file.name.replace(/\.[^/.]+$/, ""); // 去除文件后缀，则是歌曲名
    // 更新播放器信息并播放
    $('.playing-title').text(songTitle);//显示歌曲名
    $('.playing-singer').text('本地文件');//歌手栏标记为“本地文件”
    $('.playing-cover').attr('src', 'images/upload-icon.png');//封面图替换为上传图标
    audio.attr('src', audioUrl);//给音频播放器设置临时播放地址
    audio[0].play();//自动播放上传的音频
    currentSongId = 'local-' + Date.now();//标记当前播放的是本地文件
    updatePlayButton(true);// 更新播放按钮状态
    alert(`已加载本地歌曲：${songTitle}`);// 提示上传成功
  });

  //排序功能
  $('.sort-btn button').click(function() {
    const btn = $(this);//当前按钮
    const sortType = btn.data('sort');//读取按钮的 data-sort 属性值
    btn.addClass('active').siblings().removeClass('active');//当前按钮加 active 类，兄弟按钮移除 active 类
    const songList = $('.song-list');//歌曲列表容器
    const songItems = songList.find('.song-item').detach();//从 DOM 中移除所有.song-item元素，但保留其 jQuery 数据和事件
    if (sortType === 'hot') {
      // 如果是热度排序，则收藏数多的在前
      songItems.sort(function(a, b) {
         // a和b是原生DOM元素，需转jQuery对象读取 data-id
        const aId = $(a).data('id');
        const bId = $(b).data('id');
        // 判断a和b歌曲是否在收藏数组中
        const aCollected = collectedSongs.some(song => song.id === aId);//检查数组中是否存在满足条件的元素，存在则返回 true，不存在返回 false
        const bCollected = collectedSongs.some(song => song.id === bId);//检查数组中是否存在满足条件的元素，存在则返回 true，不存在返回 false
        return aCollected ? -1 : 1;//这里是返回顺序号，-1排在前，1排在后
      });
    } else {
      // 默认排序，按原顺序
      songItems.sort(function(a, b) {
        //用id数值相减：小id在前，大id在后
        return $(a).data('id') - $(b).data('id');
      });
    }
    songList.append(songItems);//将排序后的歌曲元素重新添加到列表容器中
  });
    //格式化时间，秒转分:秒
    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);//计算分钟：总秒数 ÷ 60，向下取整
      const secs = Math.floor(seconds % 60);//计算剩余秒数：总秒数 % 60，取余数）
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;//补零并拼接：分钟/秒数不足2位时补0
    }
  //音频播放事件监听
   audio.on('timeupdate', function() {
    // 更新进度条
    const currentTime = audio[0].currentTime;//获取当前播放时间
    const duration = audio[0].duration;// 获取总时长
    if (duration) {//duration 为NaN（音频未加载）时不执行
      const progressPercent = (currentTime / duration) * 100;//计算已播放百分比
      $('.progress-fill').css('width', progressPercent + '%');//更新进度条填充宽度
      // 更新时间显示
      $('.current-time').text(formatTime(currentTime));//格式化时间并更新显示
      $('.total-time').text(formatTime(duration));//格式化时间并更新显示
    }
  });

  //播放器进度条控制
  $('.progress-bar').click(function(e) {
    const barWidth = $(this).width();//获取进度条宽度，也是歌曲时长
    const clickPosition = e.offsetX;//获取鼠标点击位置相对于进度条左侧的水平偏移
    const progressPercent = (clickPosition / barWidth) * 100; //计算点击位置占进度条总宽度的百分比
    const audioDuration = audio[0].duration;//获取音频总时长
    audio[0].currentTime = (progressPercent / 100) * audioDuration;//设置音频当前播放时间 = 点击百分比 × 总时长
    $('.progress-fill').css('width', progressPercent + '%');//更新进度条填充宽度
  });

  audio.on('ended', function() {//音频播放完毕时触发
    const currentSong = $(`.song-item[data-id="${currentSongId}"]`);// 找到当前播放的歌曲条目
    const nextSong = currentSong.next('.song-item');//找到当前歌曲的下一首兄弟条目
    if (nextSong.length) {
      playSong(nextSong);//有下一首,调用 playSong 播放下一首
    } else {
      //无下一首,重置播放器状态
      currentSongId = null;//清空当前歌曲ID
      updatePlayButton(false);//播放按钮切回源态
      $('.playing-title').text('暂无播放歌曲');//清空歌曲名
      $('.playing-singer').text('--');//清空歌手名
      $('.progress-fill').css('width', '0%');//进度条归0
      $('.current-time').text('00:00');//当前时间归0
      $('.total-time').text('00:00');//总时长归0
    }
  });

  //更新播放按钮图标
  function updatePlayButton(isPlaying) {
    const toggleBtn = $('.toggle-play i');//获取总控播放按钮内的图标元素
    if (isPlaying) {
      toggleBtn.removeClass('fa-play').addClass('fa-pause').css("background","url(../image/pause.png)");//播放中：图标从“播放（fa-play）”切换为“暂停（fa-pause）”
      $('.play-song i').removeClass('fa-play').addClass('fa-pause');//同时更新所有歌曲条目内的播放按钮图标
    } else {
      toggleBtn.removeClass('fa-pause').addClass('fa-play');//暂停或未播放：图标从“暂停”切换为“播放”
      $('.play-song i').removeClass('fa-pause').addClass('fa-play');
    }
  }

  //渲染收藏列表
  function CollectedList() {
    const collectList = $('.collected-list');//获取收藏列表容器
    const collectCount = $('.collect-count');//获取收藏数量显示元素
    collectCount.text(`(${collectedSongs.length})`);// 更新收藏数量
    if (collectedSongs.length === 0) {//无收藏歌曲时显示提示语
      collectList.html('<p class="empty-tip">暂无收藏歌曲，点击歌曲旁的⭐添加</p>');
      $(".empty-tip").css("text-align","center")
      $(".empty-tip").css("line-height","120px")
      return;// 终止函数
    }
    let html = '';//有收藏歌曲时,添加到列表李
    collectedSongs.forEach(song => {
      html += `
        <div class="song-item" data-id="${song.id}" data-audio="${song.audio}">
          <div class="song-cover">
            <img src="${song.cover}" alt="${song.title}">
          </div>
          <div class="song-info">
            <h4 class="song-title">${song.title}</h4>
            <p class="song-singer">${song.singer}</p>
          </div>
          <div class="song-duration">${song.duration}</div>
          <div class="song-actions">
            <button class="play-song"><i class="fas fa-play"></i></button>
            <button class="collect-song active"><i class="fas fa-heart"></i></button>
          </div>
        </div>
      `;
    });
    collectList.html(html);

    // 为收藏列表的按钮绑定事件
    collectList.find('.play-song').click(function(e) {
      e.stopPropagation();// 阻止事件冒泡
      const songItem = $(this).closest('.song-item');// 找到当前按钮所属的收藏列表歌曲条目
      playSong(songItem);//调用播放函数，播放该歌曲
    });

    collectList.find('.collect-song').click(function(e) {
      e.stopPropagation();//阻止事件冒泡
      const songId = $(this).closest('.song-item').data('id');//找到当前条目并获取歌曲 ID
      collectedSongs = collectedSongs.filter(song => song.id !== songId);//从收藏数组中删除该歌曲
      localStorage.setItem('collectedSongs', JSON.stringify(collectedSongs));//同步到本地存储
      CollectedList();//重新执行收藏列表函数
      // 同步更新主列表的收藏状态，取消主列表中该歌曲的“已收藏”标记
      $(`.song-item[data-id="${songId}"] .collect-song`).removeClass('active').find('i').removeClass('fas').addClass('far');
    });
  }
  // 初始化收藏列表和收藏状态
  function init() {
    CollectedList();
    // 同步主列表的收藏状态
    collectedSongs.forEach(song => {
      $(`.song-item[data-id="${song.id}"] .collect-song`).addClass('active').find('i').removeClass('far').addClass('fas');
    });
  }
  init();// 启动初始化
});