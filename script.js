document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 完全加載');
    
    // 獲取覆蓋層元素
    const initialOverlay = document.getElementById('initial-overlay');
    const dllmLogo = document.getElementById('dllm-logo');
    const headerLogo = document.getElementById('header-logo');
    
    // 獲取HTML元素
    const audio = document.querySelector('#audio');
    const backupAudio = document.querySelector('#backup-audio');
    const songTitle = document.querySelector('#song-title');
    const songArtist = document.querySelector('#song-artist');
    const coverImage = document.querySelector('#cover-image');
    const playBtn = document.querySelector('#play');
    const prevBtn = document.querySelector('#prev');
    const nextBtn = document.querySelector('#next');
    const progress = document.querySelector('.progress');
    const progressContainer = document.querySelector('.progress-bar');
    const currentTimeEl = document.querySelector('#current-time');
    const durationEl = document.querySelector('#duration');
    const volumeEl = document.querySelector('#volume');
    const volumeIcon = document.querySelector('#volume-icon');
    const songList = document.querySelector('#song-list');
    
    // 讓音樂播放器在背景中可見，但交互被覆蓋層擋住
    document.querySelector('.music-player').style.opacity = '1';
    
    // 點擊覆蓋層處理邏輯
    initialOverlay.addEventListener('click', function() {
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
            
            // 啟用音頻並開始播放
            enableAudioAndPlay();
        }, 1000); // 1000ms = 動畫持續時間
    });
    
    // 啟用音頻並播放的函數
    function enableAudioAndPlay() {
        // 取消靜音
        audio.muted = false;
        if (backupAudio) backupAudio.muted = false;
        
        // 設置音量
        const targetVol = volumeEl.value || 0.7;
        audio.volume = targetVol;
        if (backupAudio) backupAudio.volume = targetVol;
        
        // 開始播放
        playSong();
        
        console.log('用戶交互已完成，音樂開始播放');
    }
    
    // 添加循環按鈕
    let loopBtn;
    if (!document.querySelector('#loop')) {
        // 創建循環按鈕
        loopBtn = document.createElement('button');
        loopBtn.id = 'loop';
        loopBtn.innerHTML = '<i class="fas fa-sync"></i>';
        loopBtn.title = '單曲循環';
        
        // 添加到控制區域
        const controls = document.querySelector('.controls');
        if (controls) {
            controls.appendChild(loopBtn);
        }
    } else {
        loopBtn = document.querySelector('#loop');
    }
    
    // 播放列表 - 使用mp3格式以提高兼容性和減小文件大小
    const songs = [
        {
            name: "抒情花車",
            artist: "動力花車",
            path: "https://github.com/weien0610/DLLM-Music/raw/audio-files/music/song1.mp3",
            cover: "covers/song1.jpg"
        },
        {
            name: "花車時代rap",
            artist: "動力花車",
            path: "https://github.com/weien0610/DLLM-Music/raw/audio-files/music/song2.mp3",
            cover: "covers/song2.jpg"
        },
        {
            name: "錯位時空",
            artist: "動力花車",
            path: "https://github.com/weien0610/DLLM-Music/raw/audio-files/music/song3.mp3",
            cover: "covers/song3.jpg"
        }
    ];

    console.log('歌曲列表定義完成', songs);
    
    // 狀態變數
    let songIndex = 0;
    let isPlaying = false;
    let autoplayAttempted = false;
    let isLoopEnabled = false; // 新增單曲循環狀態
    let userInteracted = false; // 跟踪用戶是否已經交互
    
    // 確保音頻元素始終設置為靜音（解決跨瀏覽器自動播放問題）
    audio.muted = true;
    if (backupAudio) backupAudio.muted = true;
    
    // 設置預設循環播放
    audio.loop = false; // 初始不設置HTML標籤的loop屬性，使用自定義邏輯
    if (backupAudio) backupAudio.loop = false;
    
    // 初始化音頻並嘗試自動播放
    function initAudio() {
        if (songs.length > 0) {
            // 設置音頻源
            audio.src = songs[0].path;
            console.log('初始化時設置音頻源:', songs[0].path);
            songTitle.textContent = songs[0].name;
            songArtist.textContent = songs[0].artist;
            
            // 設置初始封面圖片
            if (songs[0].cover) {
                coverImage.src = songs[0].cover;
                coverImage.alt = `${songs[0].name} 封面`;
            }
            
            // 強制設置靜音和初始音量（確保自動播放）
            audio.muted = true;
            audio.volume = 0;
            
            // 設置備用音頻
            if (backupAudio) {
                backupAudio.src = songs[0].path;
                backupAudio.muted = true;
                backupAudio.volume = 0;
            }
            
            // 加載音頻
            audio.load();
            if (backupAudio) backupAudio.load();
            
            // 加載歌曲列表
            loadSongs();
            
            // 不再自動嘗試播放，等待用戶點擊覆蓋層
        }
    }
    
    // 嘗試自動播放 - 現在僅在用戶交互後調用
    function attemptAutoplay() {
        if (autoplayAttempted) return;
        autoplayAttempted = true;
        
        console.log('嘗試播放音樂');
        
        // 播放
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('播放成功！');
                isPlaying = true;
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(error => {
                console.error('播放失敗:', error);
                
                // 嘗試備用音頻
                tryBackupAudio();
            });
        } else {
            console.log('瀏覽器不支持Promise API');
            tryBackupAudio();
        }
    }
    
    // 嘗試使用備用音頻
    function tryBackupAudio() {
        if (!backupAudio) return;
        
        console.log('嘗試使用備用音頻元素');
        
        // 嘗試播放備用音頻
        const backupPlayPromise = backupAudio.play();
        if (backupPlayPromise !== undefined) {
            backupPlayPromise.then(() => {
                console.log('備用音頻播放成功！');
                isPlaying = true;
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(error => {
                console.error('備用音頻播放也失敗:', error);
                isPlaying = false;
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
            });
        }
    }
    
    // 設置音量 - 現在直接設置音量而非漸變
    function fadeInVolume(targetAudio = audio) {
        const fadeAudio = targetAudio || audio;
        
        // 先取消靜音
        fadeAudio.muted = false;
        
        // 直接設置目標音量而非漸變
        const targetVol = volumeEl.value || 0.7;
        fadeAudio.volume = targetVol;
        
        // 更新音量圖標
        updateVolumeIcon();
        
        // 同步另一個音頻元素
        if (fadeAudio === audio && backupAudio) {
            backupAudio.muted = false; // 確保備用音頻也取消靜音
            backupAudio.volume = targetVol;
        } else if (fadeAudio === backupAudio && audio) {
            audio.muted = false; // 確保主音頻也取消靜音
            audio.volume = targetVol;
        }
        
        console.log('已直接設置音量為: ' + targetVol);
    }
    
    // 加載歌曲列表
    function loadSongs() {
        songList.innerHTML = '';
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.textContent = `${song.name} - ${song.artist}`;
            li.addEventListener('click', () => {
                songIndex = index;
                loadSong(songs[songIndex]);
                
                // 用戶已交互，可以取消靜音播放
                audio.muted = false;
                if (backupAudio) backupAudio.muted = false;
                
                playSong();
            });
            
            if (index === songIndex) {
                li.classList.add('active');
            }
            
            songList.appendChild(li);
        });
    }
    
    // 更新當前活躍歌曲
    function updateActiveSong() {
        document.querySelectorAll('#song-list li').forEach((item, index) => {
            if (index === songIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // 加載歌曲 - 不會自動播放
    function loadSong(song) {
        songTitle.textContent = song.name;
        songArtist.textContent = song.artist;
        
        // 設置音頻源
        audio.src = song.path;
        console.log('設置音頻源:', song.path);
        
        // 設置封面圖片
        if (song.cover) {
            coverImage.src = song.cover;
            coverImage.alt = `${song.name} 封面`;
        } else {
            coverImage.src = 'covers/default.jpg';
            coverImage.alt = '預設封面';
        }
        
        // 同時更新備用音頻源
        if (backupAudio) {
            backupAudio.src = song.path;
        }
        
        // 更新歌曲列表高亮
        updateActiveSong();
    }
    
    // 播放歌曲
    function playSong() {
        try {
            console.log('嘗試播放歌曲:', songs[songIndex].path);
            
            // 播放
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('播放成功');
                    isPlaying = true;
                    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                }).catch(error => {
                    console.error('播放失敗:', error);
                    
                    // 如果失敗，嘗試使用備用音頻
                    if (backupAudio) {
                        backupAudio.play().then(() => {
                            console.log('備用音頻播放成功');
                            isPlaying = true;
                            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                        }).catch(err => {
                            console.error('備用音頻也失敗:', err);
                            isPlaying = false;
                            playBtn.innerHTML = '<i class="fas fa-play"></i>';
                        });
                    }
                });
            }
        } catch (e) {
            console.error('播放過程中發生錯誤:', e);
            isPlaying = false;
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }
    
    // 暫停歌曲
    function pauseSong() {
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        audio.pause();
        
        // 同時暫停備用音頻
        if (backupAudio) {
            backupAudio.pause();
        }
    }
    
    // 上一首歌曲
    function prevSong() {
        songIndex--;
        if (songIndex < 0) {
            songIndex = songs.length - 1;
        }
        loadSong(songs[songIndex]);
        
        // 用戶已交互，可以取消靜音播放
        audio.muted = false;
        if (backupAudio) backupAudio.muted = false;
        
        playSong();
    }
    
    // 下一首歌曲
    function nextSong() {
        songIndex++;
        if (songIndex > songs.length - 1) {
            songIndex = 0;
        }
        loadSong(songs[songIndex]);
        
        // 用戶已交互，可以取消靜音播放
        audio.muted = false;
        if (backupAudio) backupAudio.muted = false;
        
        playSong();
    }
    
    // 更新進度條
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        if (duration) {
            // 更新進度條
            const progressPercent = (currentTime / duration) * 100;
            progress.style.width = `${progressPercent}%`;
            
            // 更新時間顯示
            currentTimeEl.textContent = formatTime(currentTime);
            durationEl.textContent = formatTime(duration);
        }
    }
    
    // 格式化時間為分:秒
    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        return `${minutes}:${seconds}`;
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
        const newVolume = volumeEl.value;
        audio.volume = newVolume;
        
        // 更新音量圖標
        updateVolumeIcon();
        
        // 同步備用音頻音量
        if (backupAudio) {
            backupAudio.volume = newVolume;
        }
        
        // 如果音量大於0，取消靜音（用戶已交互）
        if (newVolume > 0) {
            audio.muted = false;
            if (backupAudio) backupAudio.muted = false;
        }
    }
    
    // 更新音量圖標
    function updateVolumeIcon() {
        if (!volumeIcon) return;
        
        if (audio.volume === 0 || audio.muted) {
            volumeIcon.className = 'fas fa-volume-mute';
        } else if (audio.volume < 0.5) {
            volumeIcon.className = 'fas fa-volume-down';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
    }
    
    // 切換單曲循環模式
    function toggleLoop() {
        isLoopEnabled = !isLoopEnabled;
        
        // 更新按鈕狀態和HTML音頻標籤的loop屬性
        if (isLoopEnabled) {
            loopBtn.classList.add('active');
            loopBtn.innerHTML = '<i class="fas fa-sync fa-spin"></i>';
            
            // 音頻元素設置循環
            audio.loop = true;
            if (backupAudio) backupAudio.loop = true;
            
            console.log('單曲循環已開啟');
        } else {
            loopBtn.classList.remove('active');
            loopBtn.innerHTML = '<i class="fas fa-sync"></i>';
            
            // 音頻元素取消循環
            audio.loop = false;
            if (backupAudio) backupAudio.loop = false;
            
            console.log('單曲循環已關閉');
        }
    }
    
    // 事件監聽器
    playBtn.addEventListener('click', () => {
        // 用戶已交互，可以取消靜音
        audio.muted = false;
        if (backupAudio) backupAudio.muted = false;
        
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });
    
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    
    // 循環按鈕點擊事件
    if (loopBtn) {
        loopBtn.addEventListener('click', toggleLoop);
    }
    
    // 音量圖標點擊切換靜音
    if (volumeIcon) {
        volumeIcon.addEventListener('click', () => {
            if (audio.volume > 0 && !audio.muted) {
                // 存儲之前的音量並靜音
                audio.dataset.prevVolume = audio.volume;
                audio.muted = true;
                audio.volume = 0;
                volumeEl.value = 0;
                
                if (backupAudio) {
                    backupAudio.muted = true;
                    backupAudio.volume = 0;
                }
            } else {
                // 恢復之前的音量
                const prevVol = audio.dataset.prevVolume || 0.7;
                audio.volume = prevVol;
                audio.muted = false;
                volumeEl.value = prevVol;
                
                if (backupAudio) {
                    backupAudio.volume = prevVol;
                    backupAudio.muted = false;
                }
            }
            updateVolumeIcon();
        });
    }
    
    // 監聽播放錯誤事件
    audio.addEventListener('error', function(e) {
        console.error('音頻錯誤:', e);
        
        // 嘗試使用備用音頻
        if (backupAudio && isPlaying) {
            console.log('音頻錯誤，嘗試使用備用音頻...');
            backupAudio.play();
        }
    });
    
    // 監聽播放成功事件
    audio.addEventListener('playing', function() {
        console.log('音頻成功播放中');
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    });
    
    // 進度和音量控制
    audio.addEventListener('timeupdate', updateProgress);
    progressContainer.addEventListener('click', setProgress);
    volumeEl.addEventListener('change', setVolume);
    volumeEl.addEventListener('input', setVolume);
    
    // 歌曲結束時的處理邏輯
    audio.addEventListener('ended', function() {
        console.log('歌曲播放結束');
        
        // 根據循環模式決定下一步操作
        if (isLoopEnabled) {
            // 單曲循環模式，會由audio.loop自動處理，此處無需額外動作
            console.log('單曲循環中，自動重新播放當前歌曲');
        } else {
            // 非單曲循環模式，進入下一首歌曲（自動循環播放列表）
            console.log('播放列表循環中，自動播放下一首歌曲');
            nextSong();
        }
    });
    
    // 移除舊的用戶交互監聽器，現在通過覆蓋層處理
    
    // 初始化音頻（但不嘗試自動播放，等待用戶交互）
    initAudio();
});