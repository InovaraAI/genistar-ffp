// Slide & Modal Navigation with Audio Builds
(function(){
  let curSec=0,isScr=0,aTmrs=[],isAB=0,curAS=null;
  const slds=Array.from(document.querySelectorAll('.slide')),
        sldCnt=slds.length,
        mdls=Array.from(document.querySelectorAll('.modal')),
        sOG=[],sBBO=[],sOI=[],sHBO=[],
        mOG=[],mBBO=[],mOI=[],mHBO=[];
  
  // Init slides
  slds.forEach((s,i)=>{
    const els=Array.from(s.querySelectorAll('.build')),
          map=els.reduce((m,e)=>{const o=parseInt(e.dataset.buildOrder,10)||1;(m[o]=m[o]||[]).push(e);return m},{});
    sOG[i]=Object.keys(map).map(n=>+n).sort((a,b)=>a-b);
    sBBO[i]=map;sOI[i]=0;els.forEach(e=>e.classList.remove('visible'));
    const hEls=Array.from(s.querySelectorAll('.build-out')),
          hMap=hEls.reduce((m,e)=>{const o=parseInt(e.dataset.buildOrder,10)||1;(m[o]=m[o]||[]).push(e);return m},{});
    sHBO[i]=hMap;hEls.forEach(e=>e.classList.remove('hidden'));
  });
  
  // Init modals
  mdls.forEach((m,i)=>{
    const els=Array.from(m.querySelectorAll('.build')),
          map=els.reduce((m,e)=>{const o=parseInt(e.dataset.buildOrder,10)||1;(m[o]=m[o]||[]).push(e);return m},{});
    mOG[i]=Object.keys(map).map(n=>+n).sort((a,b)=>a-b);
    mBBO[i]=map;mOI[i]=0;els.forEach(e=>e.classList.remove('visible'));
    const hEls=Array.from(m.querySelectorAll('.build-out')),
          hMap=hEls.reduce((m,e)=>{const o=parseInt(e.dataset.buildOrder,10)||1;(m[o]=m[o]||[]).push(e);return m},{});
    mHBO[i]=hMap;hEls.forEach(e=>e.classList.remove('hidden'));
  });
  
  // Audio helpers with pause/resume support
  let aStT=0,aElps=0,aPndBlds=[],curABtn=null,isPaused=0,curAMdl=null;
  const clrAT=()=>{aTmrs.forEach(t=>clearTimeout(t));aTmrs=[];isAB=0;curAS=null;curAMdl=null;aStT=0;aElps=0;aPndBlds=[];curABtn=null;isPaused=0},
        pauseAT=()=>{if(!isAB||!aStT)return;const now=Date.now();aElps+=now-aStT;aTmrs.forEach(t=>clearTimeout(t));aTmrs=[];isAB=0;isPaused=1},
        schAB=(el,resume=false)=>{
          if(!resume){
            aTmrs.forEach(t=>clearTimeout(t));aTmrs=[];
            const bds=Array.from(el.querySelectorAll('.build[data-build-delay]')),bdMap={};
            bds.forEach(e=>{const d=parseFloat(e.dataset.buildDelay)||0,o=parseInt(e.dataset.buildOrder,10)||1,k=`${d}-${o}`;(bdMap[k]||(bdMap[k]={d:d*1000,o,els:[]})).els.push(e)});
            aPndBlds=Object.values(bdMap).sort((a,b)=>a.d!==b.d?a.d-b.d:a.o-b.o);if(!aPndBlds.length)return;aElps=0;isPaused=0;
          }
          isAB=1;const isSlide=el.classList.contains('slide'),isMdl=el.classList.contains('modal');
          if(isSlide){curAS=el;curAMdl=null}else if(isMdl){curAMdl=el;curAS=null}
          aStT=Date.now();const elIdx=isSlide?slds.indexOf(el):mdls.indexOf(el);aTmrs=[];
          aPndBlds.forEach(g=>{
            if(g.els.some(e=>e.classList.contains('visible')))return;
            const delay=g.d-aElps;
            const fire=()=>{
              if(!(isAB&&((isSlide&&curAS===el)||(isMdl&&curAMdl===el))))return;
              if(g.els.some(e=>e.classList.contains('visible')))return;
              g.els.forEach(e=>e.classList.add('visible'));
              if(isSlide){
                (sHBO[elIdx][g.o]||[]).forEach(e=>e.classList.add('hidden'));
                if(elIdx>=0){const oI=sOG[elIdx].indexOf(g.o);if(oI>=0&&oI>=sOI[elIdx]){sOI[elIdx]=oI+1;updSN()}}
              }else{
                (mHBO[elIdx][g.o]||[]).forEach(e=>e.classList.add('hidden'));
                if(elIdx>=0){const oI=mOG[elIdx].indexOf(g.o);if(oI>=0&&oI>=mOI[elIdx]){mOI[elIdx]=oI+1;updMN(elIdx)}}
              }
            };
            if(delay>0){const t=setTimeout(fire,delay);aTmrs.push(t)} else fire();
          });
          isPaused=0;
        };
  
  // Core functions
  const updH=()=>history.replaceState(null,'',`#${curSec+1}`),
        updSN=()=>{const f=curSec===0&&sOI[0]===0,l=curSec===sldCnt-1&&sOI[curSec]===sOG[curSec].length;
          document.querySelectorAll('.link_slide-nav.prev').forEach(b=>{b.disabled=f;b.classList.toggle('disabled',f)});
          document.querySelectorAll('.link_slide-nav.next').forEach(b=>{b.disabled=l;b.classList.toggle('disabled',l)});
        },
        updMN=i=>{const f=mOI[i]===0,l=mOG[i].length===mOI[i];
          mdls[i].querySelectorAll('.modal-nav.prev').forEach(b=>{b.disabled=f;b.classList.toggle('disabled',f)});
          mdls[i].querySelectorAll('.modal-nav.next').forEach(b=>{b.disabled=l;b.classList.toggle('disabled',l)});
        },
        rstSec=(i,g,b,t,h)=>{g[i].forEach(o=>b[i][o].forEach(e=>{e.classList.add('no-transition');e.classList.remove('visible');void e.offsetWidth;e.classList.remove('no-transition')}));Object.values((h||((g===sOG)?sHBO:mHBO))[i]||{}).flat().forEach(e=>{e.classList.add('no-transition');e.classList.remove('hidden');void e.offsetWidth;e.classList.remove('no-transition')});t[i]=0},
        snapTo=n=>{
          if(n<0||n>=sldCnt||isScr)return;
          isScr=1;clrAT();if(window.pauseAllAudio)window.pauseAllAudio();
          slds[curSec].classList.remove('active');rstSec(curSec,sOG,sBBO,sOI,sHBO);
          curSec=n;rstSec(curSec,sOG,sBBO,sOI,sHBO);slds[curSec].classList.add('active');updSN();updH();
          window.dispatchEvent(new CustomEvent('slidechange',{detail:{index:curSec}}));
          window.scrollTo({top:slds[curSec].offsetTop,behavior:'auto'});setTimeout(()=>isScr=0,50);
        },
        sBF=()=>{const p=sOI[curSec];if(p<sOG[curSec].length){const o=sOG[curSec][p];sBBO[curSec][o].forEach(e=>e.classList.add('visible'));(sHBO[curSec][o]||[]).forEach(e=>e.classList.add('hidden'));sOI[curSec]++;updSN();return 1}return 0},
        sBB=()=>{if(sOI[curSec]>0){const o=sOG[curSec][sOI[curSec]-1];sBBO[curSec][o].forEach(e=>e.classList.remove('visible'));(sHBO[curSec][o]||[]).forEach(e=>e.classList.remove('hidden'));sOI[curSec]--;updSN();return 1}return 0},
        mBF=i=>{const p=mOI[i];if(p<mOG[i].length){const o=mOG[i][p];mBBO[i][o].forEach(e=>e.classList.add('visible'));(mHBO[i][o]||[]).forEach(e=>e.classList.add('hidden'));mOI[i]++;updMN(i);return 1}return 0},
        mBB=i=>{if(mOI[i]>0){const o=mOG[i][mOI[i]-1];mBBO[i][o].forEach(e=>e.classList.remove('visible'));(mHBO[i][o]||[]).forEach(e=>e.classList.remove('hidden'));mOI[i]--;updMN(i);return 1}return 0},
        hSN=e=>{e.preventDefault();clrAT();if(sBF())return;snapTo(curSec+1)},
        hSP=e=>{e.preventDefault();clrAT();if(sBB())return;snapTo(curSec-1)},
        hMN=e=>{e.preventDefault();clrAT();const i=mdls.indexOf(e.currentTarget.closest('.modal'));mBF(i)},
        hMP=e=>{e.preventDefault();clrAT();const i=mdls.indexOf(e.currentTarget.closest('.modal'));mBB(i)},
        hKb=e=>{
          if(['INPUT','TEXTAREA'].includes(e.target.tagName)||e.target.contentEditable==='true')return;
          if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))return;
          e.preventDefault();clrAT();
          const h=location.hash;
          if(h){const mE=document.getElementById(h.substring(1));if(mE&&mE.classList.contains('modal')){const mi=mdls.indexOf(mE);['ArrowDown','ArrowRight'].includes(e.key)?mBF(mi):mBB(mi);return}}
          ['ArrowDown','ArrowRight'].includes(e.key)?hSN(e):hSP(e);
        };

  // Scroll lock (only allow inside [data-allow-scroll="true"])
  (function(){
    const SEL='[data-allow-scroll="true"]';
    const canScroll=(el,dy)=>{const t=el.scrollTop,max=el.scrollHeight-el.clientHeight;return max>0 && !((dy<0&&t<=0)||(dy>0&&t>=max-1))};
    const onWheel=e=>{const s=e.target?.closest?.(SEL);if(!s||!canScroll(s,e.deltaY||0))e.preventDefault();else e.stopPropagation()};
    let lastY=0;
    const onTS=e=>{lastY=e.touches?.[0]?.clientY||0};
    const onTM=e=>{
      const s=e.target?.closest?.(SEL); if(!s){e.preventDefault();return}
      const y=e.touches?.[0]?.clientY||lastY, dy=lastY?lastY-y:0; lastY=y;
      if(!canScroll(s,dy)) e.preventDefault(); else e.stopPropagation();
    };
    window.addEventListener('wheel',onWheel,{passive:false});
    window.addEventListener('touchstart',onTS,{passive:true});
    window.addEventListener('touchmove',onTM,{passive:false});
  })();

  const setEvts=()=>{
    document.querySelectorAll('.link_slide-nav.next').forEach(b=>{b.removeEventListener('click',hSN);b.addEventListener('click',hSN)});
    document.querySelectorAll('.link_slide-nav.prev').forEach(b=>{b.removeEventListener('click',hSP);b.addEventListener('click',hSP)});
    mdls.forEach((m,i)=>{
      m.querySelectorAll('.modal-nav.next').forEach(b=>{b.removeEventListener('click',hMN);b.addEventListener('click',hMN)});
      m.querySelectorAll('.modal-nav.prev').forEach(b=>{b.removeEventListener('click',hMP);b.addEventListener('click',hMP)});
      updMN(i);
    });
  },
  setAud=()=>{
    setTimeout(()=>{
      document.addEventListener('click',(evt)=>{
        const b=evt.target.closest('.audio-button'); if(!b)return;
        setTimeout(()=>{
          const ic=b.querySelector('img'),pI="https://cdn.prod.website-files.com/6842ab48c8037b8cd7bd9b04/6899c7eefc269da2e4148bda_pause-icon.svg";
          const container=b.closest('.modal, .slide');
          if(ic&&ic.src===pI){
            if(container){
              const isSame=(container.classList.contains('slide')&&curAS===container)||(container.classList.contains('modal')&&curAMdl===container);
              const shouldResume=(curABtn===b)&&isPaused&&isSame;curABtn=b;setTimeout(()=>schAB(container,shouldResume),100);
            }
          }else if(curABtn===b&&isAB){pauseAT()}
        },50);
      });
      ['audioEnded','audioStopped','audioReset'].forEach(e=>window.addEventListener(e,clrAT));
      const oPA=window.pauseAllAudio;window.pauseAllAudio=function(){clrAT();if(oPA)oPA.call(this)};
    },500);
  };
  
  // Init
  const init=()=>{
    const m=location.hash.match(/^#(\d+)$/);if(m){const i=parseInt(m[1],10)-1;if(!isNaN(i)&&i>=0&&i<sldCnt)curSec=i}
    setEvts();setAud();updSN();snapTo(curSec);
    window.addEventListener('keydown',hKb);
    window.addEventListener('resize',()=>snapTo(curSec));
  };
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
  
  // Expose
  window.slideOrderGroups=sOG;window.slideBuildsByOrder=sBBO;window.slideOrderIdx=sOI;
  window.updateSlideNav=updSN;window.handleSlideNext=hSN;window.handleSlidePrev=hSP;window.snapToSection=snapTo;
})();