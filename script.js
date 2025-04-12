document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 完全加載');
    
    // 獲取覆蓋層元素
    const initialOverlay = document.getElementById('initial-overlay');
    const dllmLogo = document.getElementById('dllm-logo');
    const headerLogo = document.getElementById('header-logo');
    
    // 獲取HTML元素
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('play');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const coverImage = document.getElementById('cover-image');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const progressBar = document.querySelector('.progress');
    const progressContainer = document.querySelector('.progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const volumeEl = document.getElementById('volume');
    const volumeIcon = document.getElementById('volume-icon');
    const songList = document.getElementById('song-list');
    
    // 讓音樂播放器在背景中可見，但交互被覆蓋層擋住
    document.querySelector('.music-player').style.opacity = '1';
    
    // 播放列表 - 使用mp3格式以提高兼容性和減小文件大小
    const songs = [
        {
            name: "抒情花車",
            artist: "動力花車",
            path: "music/song1.mp3",
            cover: "covers/song1.jpg"
        },
        {
            name: "花車時代rap",
            artist: "動力花車",
            path: "music/song2.mp3",
            cover: "covers/song2.jpg"
        },
        {
            name: "錯位時空",
            artist: "動力花車",
            path: "music/song3.mp3",
            cover: "covers/song3.jpg"
        }
    ];

    console.log('歌曲列表定義完成', songs);
    
    // 狀態變數
    let songIndex = 0;
    let isPlaying = false;
    let isLoopEnabled = false;
    let userInteracted = false;
    
    // 初始設置
    audio.volume = 0.7;
    volumeEl.value = 0.7;
    
    // 點擊覆蓋層處理邏輯
    initialOverlay.addEventListener('click', function() {
        // 標記用戶已交互
        userInteracted = true;
        
        // 播放動畫：logo向上滑動
        initialOverlay.classList.add('slide-up');
        
        // 動畫結束後隱藏覆蓋層，顯示頂部logo
        setTimeout(() => {
            initialOverlay.style.display = 'none';
            headerLogo.style.display = 'block';
            
            // 將頂部logo定位到正中間
            headerLogo.style.textAlign = 'center';
            headerLogo.style.left = '0';
            headerLogo.style.right = '0';
            
            // 開始播放音樂
            playSong();
        }, 1000); // 1000ms = 動畫持續時間
    });
    
    // 創建歌曲列表
    function createSongList() {
        songList.innerHTML = '';
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.textContent = `${song.name} - ${song.artist}`;
            li.classList.add('song-item');
            if (index === songIndex) {
                li.classList.add('current-song');
            }
            li.addEventListener('click', () => {
                songIndex = index;
                loadSong(songs[songIndex]);
                playSong();
            });
            songList.appendChild(li);
        });
    }
    
    // 更新當前選中的歌曲
    function updateActiveSong() {
        document.querySelectorAll('.song-item').forEach((item, index) => {
            if (index === songIndex) {
                item.classList.add('current-song');
            } else {
                item.classList.remove('current-song');
            }
        });
    }
    
    // 加載歌曲
    function loadSong(song) {
        console.log('加載歌曲:', song.name);
        songTitle.textContent = song.name;
        songArtist.textContent = song.artist;
        audio.src = song.path;
        coverImage.src = song.cover;
    }
    
    // 播放歌曲
    function playSong() {
        if (!isPlaying) {
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isPlaying = true;
                    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                }).catch(error => {
                    console.error('播放錯誤:', error);
                    alert('播放失敗，請重試');
                });
            }
        }
    }
    
    // 暫停歌曲
    function pauseSong() {
        audio.pause();
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
    
    // 播放/暫停切換
    function togglePlay() {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    }
    
    // 上一首歌曲
    function prevSong() {
        songIndex--;
        if (songIndex < 0) {
            songIndex = songs.length - 1;
        }
        loadSong(songs[songIndex]);
        updateActiveSong();
        if (isPlaying) playSong();
    }
    
    // 下一首歌曲
    function nextSong() {
        songIndex++;
        if (songIndex > songs.length - 1) {
            songIndex = 0;
        }
        loadSong(songs[songIndex]);
        updateActiveSong();
        if (isPlaying) playSong();
    }
    
    // 更新進度條
    function updateProgress(e) {
        const { duration, currentTime } = e.target;
        if (duration) {
            // 計算進度百分比
            const progressPercent = (currentTime / duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            
            // 更新時間顯示
            currentTimeEl.textContent = formatTime(currentTime);
            durationEl.textContent = formatTime(duration);
        }
    }
    
    // 格式化時間顯示
    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    
    // 設置進度條位置
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }
    
    // 設置音量
    function setVolume() {
        audio.volume = volumeEl.value;
        updateVolumeIcon();
    }
    
    // 更新音量圖標
    function updateVolumeIcon() {
        if (audio.volume === 0) {
            volumeIcon.className = 'fas fa-volume-mute';
        } else if (audio.volume <= 0.5) {
            volumeIcon.className = 'fas fa-volume-down';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
    }
    
    // 單曲循環按鈕
    function addLoopButton() {
        const loopBtn = document.createElement('button');
        loopBtn.id = 'loop';
        loopBtn.innerHTML = '<i class="fas fa-sync"></i>';
        loopBtn.title = '單曲循環';
        loopBtn.addEventListener('click', toggleLoop);
        
        // 添加到控制欄
        document.querySelector('.controls').appendChild(loopBtn);
    }
    
    // 切換單曲循環
    function toggleLoop() {
        isLoopEnabled = !isLoopEnabled;
        audio.loop = isLoopEnabled;
        
        const loopBtn = document.getElementById('loop');
        if (isLoopEnabled) {
            loopBtn.classList.add('active');
        } else {
            loopBtn.classList.remove('active');
        }
    }
    
    // 事件監聽器
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    audio.addEventListener('timeupdate', updateProgress);
    progressContainer.addEventListener('click', setProgress);
    volumeEl.addEventListener('input', setVolume);
    volumeIcon.addEventListener('click', () => {
        if (audio.volume > 0) {
            audio.volume = 0;
        } else {
            audio.volume = 0.7;
        }
        volumeEl.value = audio.volume;
        updateVolumeIcon();
    });
    
    // 當歌曲結束時播放下一首 (除非開啟了單曲循環)
    audio.addEventListener('ended', () => {
        if (!isLoopEnabled) {
            nextSong();
        }
    });
    
    // 初始化
    createSongList();
    addLoopButton();
    loadSong(songs[songIndex]);
    updateVolumeIcon();
});