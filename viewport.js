// Dynamic viewport height for mobile devices
(function(){
  function setRealVh(){
    let vh = window.visualViewport ? window.visualViewport.height * 0.01 : window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  setRealVh();
  window.addEventListener('resize', setRealVh);
  window.addEventListener('orientationchange', setRealVh);
  
  if(window.visualViewport){
    window.visualViewport.addEventListener('resize', setRealVh);
    window.visualViewport.addEventListener('scroll', setRealVh);
  }
  
  let touchStartY = 0;
  document.addEventListener('touchstart', e => touchStartY = e.touches[0].clientY, {passive: true});
  document.addEventListener('touchend', e => {
    if(Math.abs(touchStartY - e.changedTouches[0].clientY) < 100) setTimeout(setRealVh, 300);
  }, {passive: true});
  
  window.addEventListener('hashchange', () => setTimeout(setRealVh, 100));
})();