document.addEventListener('DOMContentLoaded', () => {
    feather.replace(); 

    const playPauseButton = document.getElementById('play-pause');
    const audio = document.getElementById('audio');
    const songDuration = document.getElementById('song-duration');
    const lyricsContainer = document.getElementById('lyrics-container');
    let intervalId;

    const lyrics = [
        { time: 0, text: "....." },
        { time: 3, text: "Dapatkah aku memeluknya?" },
        { time: 6, text: "Menjadikan bintang di surga" },
        { time: 9, text: "Memberikan warna yang bisa menjadikan indah" },
        { time: 16, text: "Aku tak mampu tuk mengatakan" },
        { time: 20, text: "Aku tak mampu tuk mengungkapkan" },
        { time: 23, text: "Hingga sampai saat ini, perasaan ku telah tertinggal" },
        { time: 30, text: "Dapatkah aku memeluknya?" },
        { time: 33, text: "Menjadikan bintang-bintang di surga" },
        { time: 37, text: "Memberikan warna yang bisa dan teruslah bisa menjadikan indah" },
        { time: 44, text: "....." },
    ];

    playPauseButton.addEventListener('click', () => {
        togglePlay();
    });

    function togglePlay() {
        if (audio.paused) {
            audio.play();
            playPauseButton.innerHTML = '<i data-feather="pause"></i>'; 
            feather.replace(); 
            displayDuration(); 
            startPageTransition(); 
            syncLyrics(); 
        } else {
            audio.pause();
            playPauseButton.innerHTML = '<i data-feather="play"></i>';
            feather.replace(); 
            clearInterval(intervalId); 
            clearInterval(lyricsInterval); 
        }
    }

    function displayDuration() {
        audio.addEventListener('loadedmetadata', () => {
            const duration = formatTime(audio.duration);
            songDuration.textContent = duration; 
        });

        audio.addEventListener('timeupdate', () => {
            const currentTime = formatTime(audio.currentTime);
            const duration = formatTime(audio.duration);
            songDuration.textContent = currentTime + ' / ' + duration; 
        });
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedTime = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        return formattedTime;
    }

    function preloadImages(pages) {
        return new Promise((resolve) => {
            let loadedCount = 0;
            const totalImages = pages.length;

            pages.forEach(page => {
                const img = page.querySelector('img');
                if (img.complete) {
                    loadedCount++;
                    if (loadedCount === totalImages) resolve();
                } else {
                    img.onload = () => {
                        loadedCount++;
                        if (loadedCount === totalImages) resolve();
                    };
                }
            });
        });
    }

    const rightPages = document.querySelectorAll('.right-page');
    let currentPage = 0;

    function showPage(pageIndex) {
        rightPages.forEach((page, index) => {
            if (index === pageIndex) {
                page.style.transform = 'rotateY(0deg)';
                page.style.zIndex = 2;
                page.style.visibility = 'visible';
            } else if (index < pageIndex) {
                page.style.transform = 'rotateY(-180deg)';
                page.style.zIndex = 1;
                page.style.visibility = 'visible';
            } else {
                page.style.transform = 'rotateY(0deg)';
                page.style.zIndex = 0;
                page.style.visibility = 'visible';
            }
        });

        if (pageIndex < rightPages.length - 1) {
            rightPages[pageIndex + 1].style.transform = 'rotateY(0deg)';
            rightPages[pageIndex + 1].style.zIndex = 1;
            rightPages[pageIndex + 1].style.visibility = 'visible';
        }
    }

    function nextPage() {
        if (currentPage < rightPages.length - 1) {
            currentPage++;
        } else {
            currentPage = 0; 
        }
        showPage(currentPage);
    }

    function startPageTransition() {
        intervalId = setInterval(nextPage, 4000);
    }

    function syncLyrics() {
        const lyricsInterval = setInterval(() => {
            const currentTime = audio.currentTime;
            const currentLyric = lyrics.find(lyric => Math.floor(lyric.time) === Math.floor(currentTime));
            if (currentLyric) {
                lyricsContainer.textContent = currentLyric.text;
            }
        }, 1000);
    }

    preloadImages(rightPages).then(() => {
        showPage(currentPage);
    });
});
