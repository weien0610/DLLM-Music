document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 完全加載');
    
    // 獲取覆蓋層元素
    const initialOverlay = document.getElementById('initial-overlay');
    const dllmLogo = document.getElementById('dllm-logo');
    const headerLogo = document.getElementById('header-logo');
    
    // 獲取HTML元素
    const audio = document.getElementById('audio');
    const audioPermissionOverlay = document.getElementById('audio-permission-overlay');
    const startAudioBtn = document.getElementById('start-audio-btn');
    const playBtn = document.getElementById('play');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const progressContainer = document.getElementById('progress-container');
    const progress = document.getElementById('progress');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const cover = document.getElementById('cover');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const volumeSlider = document.getElementById('volume');
    const volumeIcon = document.getElementById('volume-icon');
    const songListContainer = document.getElementById('song-list');
    const audioError = document.getElementById('audio-error');
    
    // 讓音樂播放器在背景中可見，但交互被覆蓋層擋住
    document.querySelector('.music-player').style.opacity = '1';
    
    // 歌曲列表
    const songs = [
        { title: '歌曲 1', artist: '歌手 1', path: 'music/song1.mp3', cover: 'covers/song1.jpg' },
        { title: '歌曲 2', artist: '歌手 2', path: 'music/song2.mp3', cover: 'covers/song2.jpg' },
        { title: '歌曲 3', artist: '歌手 3', path: 'music/song3.mp3', cover: 'covers/song3.jpg' }
    ];

    console.log('歌曲列表定義完成', songs);
    
    // 播放器狀態
    let songIndex = 0;
    let isPlaying = false;
    let userInteracted = false;
    
    // 確保音頻元素始終設置為靜音（解決跨瀏覽器自動播放問題）
    audio.muted = true;
    
    // 設置預設循環播放
    audio.loop = false; // 初始不設置HTML標籤的loop屬性，使用自定義邏輯
    
    // 檢查用戶是否已經允許音頻播放
    function checkAudioPermission() {
        const hasPermission = localStorage.getItem('audioPermissionGranted');
        if (hasPermission === 'true') {
            audioPermissionOverlay.style.display = 'none';
            userInteracted = true;
            loadSong(songs[songIndex]);
        } else {
            audioPermissionOverlay.style.display = 'flex';
        }
    }
    
    // 標記用戶交互
    function markUserInteraction() {
        userInteracted = true;
        localStorage.setItem('audioPermissionGranted', 'true');
        console.log('用戶交互已標記');
        audioPermissionOverlay.style.display = 'none';
    }
    
    // 開始音頻按鈕點擊事件
    startAudioBtn.addEventListener('click', () => {
        markUserInteraction();
        loadSong(songs[songIndex]);
        playAudio();
    });
    
    // 播放按鈕點擊事件
    playBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止事件冒泡
        markUserInteraction();
        togglePlay();
    });
    
    // 加載歌曲
    function loadSong(song) {
        console.log('加載歌曲:', song.title);
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        audio.src = song.path;
        cover.src = song.cover;
        
        // 預加載下一首歌曲
        if (songIndex < songs.length - 1) {
            const nextSong = songs[songIndex + 1];
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.href = nextSong.path;
            preloadLink.as = 'fetch';
            preloadLink.crossOrigin = 'anonymous';
            document.head.appendChild(preloadLink);
        }
    }
    
    // 播放音頻
    function playAudio() {
        if (userInteracted) {
            console.log('嘗試播放音頻');
            audio.volume = volumeSlider.value;
            audio.muted = false;
            
            // 使用Promise來處理播放嘗試
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('音頻播放成功');
                        isPlaying = true;
                        updatePlayIcon();
                    })
                    .catch(error => {
                        console.error('播放錯誤:', error);
                        alert('音頻播放失敗，請重試。');
                    });
            }
        } else {
            console.log('用戶尚未交互，無法播放音頻');
            audioPermissionOverlay.style.display = 'flex';
        }
    }
    
    // 暫停音頻
    function pauseAudio() {
        audio.pause();
        isPlaying = false;
        updatePlayIcon();
    }
    
    // 切換播放/暫停
    function togglePlay() {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    }
    
    // 更新播放圖標
    function updatePlayIcon() {
        playBtn.textContent = isPlaying ? 'pause_circle_filled' : 'play_circle_filled';
    }
    
    // 上一首歌曲
    function prevSong() {
        songIndex--;
        if (songIndex < 0) {
            songIndex = songs.length - 1;
        }
        loadSong(songs[songIndex]);
        if (isPlaying) {
            playAudio();
        }
    }
    
    // 下一首歌曲
    function nextSong() {
        songIndex++;
        if (songIndex > songs.length - 1) {
            songIndex = 0;
        }
        loadSong(songs[songIndex]);
        if (isPlaying) {
            playAudio();
        }
    }
    
    // 更新進度條
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        
        // 更新進度條寬度
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            progress.style.width = `${progressPercent}%`;
            
            // 更新時間顯示
            const durationMinutes = Math.floor(duration / 60);
            let durationSeconds = Math.floor(duration % 60);
            if (durationSeconds < 10) {
                durationSeconds = `0${durationSeconds}`;
            }
            
            // 延遲顯示以避免NaN
            if (durationSeconds) {
                durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
            }
            
            // 更新當前時間
            const currentMinutes = Math.floor(currentTime / 60);
            let currentSeconds = Math.floor(currentTime % 60);
            if (currentSeconds < 10) {
                currentSeconds = `0${currentSeconds}`;
            }
            currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
        }
    }
    
    // 設置進度條
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }
    
    // 設置音量
    function setVolume() {
        audio.volume = volumeSlider.value;
        updateVolumeIcon();
    }
    
    // 更新音量圖標
    function updateVolumeIcon() {
        if (audio.volume === 0) {
            volumeIcon.textContent = 'volume_off';
        } else if (audio.volume <= 0.5) {
            volumeIcon.textContent = 'volume_down';
        } else {
            volumeIcon.textContent = 'volume_up';
        }
    }
    
    // 創建歌曲列表
    function createSongList() {
        songListContainer.innerHTML = '';
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.classList.add('song-item');
            if (index === songIndex) {
                li.classList.add('current-song');
            }
            li.textContent = `${song.title} - ${song.artist}`;
            li.addEventListener('click', () => {
                songIndex = index;
                loadSong(songs[songIndex]);
                if (userInteracted) {
                    playAudio();
                }
            });
            songListContainer.appendChild(li);
        });
    }
    
    // 更新歌曲列表選中項
    function updateSongList() {
        const songItems = document.querySelectorAll('.song-item');
        songItems.forEach((item, index) => {
            if (index === songIndex) {
                item.classList.add('current-song');
            } else {
                item.classList.remove('current-song');
            }
        });
    }
    
    // 事件監聽器
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextSong);
    progressContainer.addEventListener('click', setProgress);
    volumeSlider.addEventListener('input', setVolume);
    
    // 音量圖標點擊靜音
    volumeIcon.addEventListener('click', () => {
        if (audio.volume > 0) {
            audio.volume = 0;
        } else {
            audio.volume = 0.7;
        }
        volumeSlider.value = audio.volume;
        updateVolumeIcon();
    });
    
    // 添加文檔級別的點擊事件來識別用戶交互
    document.addEventListener('click', function() {
        if (!userInteracted) {
            markUserInteraction();
        }
    });
    
    // 頁面加載時
    window.addEventListener('DOMContentLoaded', () => {
        // 檢查音頻權限
        checkAudioPermission();
        
        // 創建歌曲列表
        createSongList();
        
        // 初始化音量
        volumeSlider.value = 0.7;
        setVolume();
        
        // 如果用戶之前已交互，嘗試自動播放
        if (userInteracted) {
            loadSong(songs[songIndex]);
            audio.addEventListener('canplaythrough', () => {
                if (userInteracted) {
                    playAudio();
                }
            });
        }
    });
});