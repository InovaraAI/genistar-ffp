// Audio Player with Progress Events
(function() {
  const playIcon = "https://cdn.prod.website-files.com/6842ab48c8037b8cd7bd9b04/6899c668a2504f1d46a2e919_volume-max.svg";
  const pauseIcon = "https://cdn.prod.website-files.com/6842ab48c8037b8cd7bd9b04/6899c7eefc269da2e4148bda_pause-icon.svg";

  let currentlyPlaying = null;
  let currentIcon = null;

  window.pauseAllAudio = function() {
    if (currentlyPlaying && !currentlyPlaying.paused) {
      currentlyPlaying.pause();
      currentlyPlaying.currentTime = 0;
      if (currentIcon) currentIcon.src = playIcon;
      currentlyPlaying = null;
      currentIcon = null;
      window.dispatchEvent(new CustomEvent('audioReset'));
    }
  };

  function initAudioButtons() {
    document.querySelectorAll('.audio-button').forEach(button => {
      const icon = button.querySelector('img');
      const title = button.dataset.title;
      let audio = null;
      let isFirstClick = true;

      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (!audio) {
          audio = new Audio();
          audio.src = button.dataset.audio;
          audio.load();
          
          audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            icon.src = playIcon;
            window.dispatchEvent(new CustomEvent('audioError', { 
              detail: { title, error: e }
            }));
          });
          
          audio.addEventListener('ended', () => {
            icon.src = playIcon;
            currentlyPlaying = null;
            currentIcon = null;
            window.dispatchEvent(new CustomEvent('audioEnded', { 
              detail: { title, duration: audio.duration }
            }));
          });

          audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
              const percent = Math.round((audio.currentTime / audio.duration) * 100);
              window.dispatchEvent(new CustomEvent('audioProgress', { 
                detail: { 
                  title, 
                  percent,
                  currentTime: audio.currentTime,
                  duration: audio.duration
                }
              }));
            }
          });
        }

        if (currentlyPlaying && currentlyPlaying !== audio) {
          currentlyPlaying.pause();
          currentlyPlaying.currentTime = 0;
          if (currentIcon) currentIcon.src = playIcon;
          window.dispatchEvent(new CustomEvent('audioStopped', { 
            detail: { title: currentIcon?.parentElement?.dataset?.title }
          }));
        }

        if (audio.paused) {
          if (isFirstClick) {
            isFirstClick = false;
            audio.play();
            icon.src = pauseIcon;
            currentlyPlaying = audio;
            currentIcon = icon;
            window.dispatchEvent(new CustomEvent('audioPlay', { 
              detail: { title, duration: audio.duration, isFirstPlay: true }
            }));
          } else {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  icon.src = pauseIcon;
                  currentlyPlaying = audio;
                  currentIcon = icon;
                  window.dispatchEvent(new CustomEvent('audioPlay', { 
                    detail: { title, duration: audio.duration, isFirstPlay: false }
                  }));
                })
                .catch((error) => {
                  console.error('Play error:', error);
                  icon.src = playIcon;
                  window.dispatchEvent(new CustomEvent('audioPlayError', { 
                    detail: { title, error }
                  }));
                });
            }
          }
        } else {
          audio.pause();
          icon.src = playIcon;
          currentlyPlaying = null;
          currentIcon = null;
          window.dispatchEvent(new CustomEvent('audioPause', { 
            detail: { 
              title, 
              pausedAt: audio.currentTime,
              percent: Math.round((audio.currentTime / audio.duration) * 100)
            }
          }));
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAudioButtons);
  } else {
    initAudioButtons();
  }
})();