// Audio Progress Indicator (Circular Ring)
(function() {
  'use strict';
  
  const progressStates = new Map();
  
  function initProgressIndicators() {
    document.querySelectorAll('.audio-button').forEach(button => {
      const progressRing = button.querySelector('.audio-progress-ring');
      if (!progressRing) {
        // Silently skip buttons without progress rings - they'll work fine without them
        return;
      }
      
      const circle = progressRing.querySelector('.audio-progress-circle');
      if (!circle) {
        return;
      }
      
      const radius = circle.r.baseVal.value;
      const circumference = radius * 2 * Math.PI;
      
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = circumference;
      
      progressStates.set(button, {
        circle: circle,
        circumference: circumference,
        currentPercent: 0
      });
    });
  }
  
  function setProgress(button, percent) {
    const state = progressStates.get(button);
    if (!state) return;
    
    const offset = state.circumference - (percent / 100) * state.circumference;
    state.circle.style.strokeDashoffset = offset;
    state.currentPercent = percent;
  }
  
  function resetProgress(button) {
    const state = progressStates.get(button);
    if (!state) return;
    
    state.circle.style.strokeDashoffset = state.circumference;
    state.currentPercent = 0;
  }
  
  function resetAllProgress() {
    progressStates.forEach((state, button) => {
      resetProgress(button);
    });
  }
  
  window.addEventListener('audioProgress', function(event) {
    const { title, percent } = event.detail;
    if (!title || percent === undefined) return;
    
    const button = Array.from(document.querySelectorAll('.audio-button'))
      .find(btn => btn.dataset.title === title);
    
    if (button) {
      setProgress(button, percent);
    }
  });
  
  window.addEventListener('audioEnded', function(event) {
    const { title } = event.detail;
    if (!title) return;
    
    const button = Array.from(document.querySelectorAll('.audio-button'))
      .find(btn => btn.dataset.title === title);
    
    if (button) {
      resetProgress(button);
    }
  });
  
  window.addEventListener('audioStopped', function(event) {
    const { title } = event.detail;
    if (!title) return;
    
    const button = Array.from(document.querySelectorAll('.audio-button'))
      .find(btn => btn.dataset.title === title);
    
    if (button) {
      resetProgress(button);
    }
  });
  
  window.addEventListener('audioReset', function() {
    resetAllProgress();
  });
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProgressIndicators);
  } else {
    initProgressIndicators();
  }
})();
