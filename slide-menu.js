// Dynamic Slide Menu
(function(){
  const getSlides = () => Array.from(document.querySelectorAll('.slide')).filter(s => !s.closest('.modal'));

  const getTitle = (slide, i) => (
    slide.getAttribute('data-slide-title') ||
    slide.getAttribute('data-title') ||
    slide.querySelector('.slide-title,h1,h2,h3,[data-title]')?.textContent ||
    `Slide ${i+1}`
  ).trim();

  function renderInto(container){
    if(!container.hasAttribute('data-allow-scroll')) container.setAttribute('data-allow-scroll','true');

    let ul = container.querySelector('.slide-menu_list');
    if(!ul){
      ul = document.createElement('ul');
      ul.className = 'slide-menu_list';
      container.appendChild(ul);
    }

    const slides = getSlides();
    ul.innerHTML = '';

    slides.forEach((s, i) => {
      const li = document.createElement('li');
      li.className = 'slide-menu_list-item';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'slide-menu_button';
      btn.textContent = `${i+1}. ${getTitle(s, i)}`;
      btn.addEventListener('click', () => {
        if (typeof window.snapToSection === 'function') window.snapToSection(i);
        else window.scrollTo({ top: s.offsetTop, behavior: 'smooth' });
      });

      li.appendChild(btn);
      ul.appendChild(li);
    });
  }

  function renderAll(){
    const menus = document.querySelectorAll('.slide-menu');
    if (menus.length === 0) return;
    menus.forEach(renderInto);
    highlightAll();
  }

  function highlightAll(idx){
    const slides = getSlides();
    const activeIdx = Number.isInteger(idx) ? idx : slides.findIndex(s => s.classList.contains('active'));
    document.querySelectorAll('.slide-menu').forEach(menu => {
      menu.querySelectorAll('.slide-menu_button').forEach((b,i)=>b.classList.toggle('is-active', i===activeIdx));
    });
  }

  window.addEventListener('slidechange', e => highlightAll(e.detail?.index));

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAll);
  } else {
    renderAll();
  }
})();