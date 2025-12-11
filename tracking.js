// GA4 Audio & Video Tracking
(function(){'use strict';
if(typeof gtag==='undefined'){console.error('GA4: gtag is not defined');return}
function extractURLParameters(){try{const params=new URLSearchParams(window.location.search);return{code:params.get('code')||null,utm_source:params.get('utm_source')||null,utm_medium:params.get('utm_medium')||null,utm_campaign:params.get('utm_campaign')||null}}catch(error){const params={};const query=window.location.search.substring(1);const pairs=query.split('&');for(let i=0;i<pairs.length;i++){const pair=pairs[i].split('=');if(pair.length===2){params[decodeURIComponent(pair[0])]=decodeURIComponent(pair[1].replace(/\+/g,' '))}}return{code:params.code||null,utm_source:params.utm_source||null,utm_medium:params.utm_medium||null,utm_campaign:params.utm_campaign||null}}}
const urlParams=extractURLParameters();
const userCode=urlParams.code;
const audioProgressTrackers=new Map();
class AudioProgressTracker{constructor(audioTitle){this.title=audioTitle;this.progressMilestones=new Set();this.sessionStartTime=Date.now()}trackProgress(percentage){let milestone=null;if(percentage>=75&&!this.progressMilestones.has(75)){milestone=75}else if(percentage>=50&&percentage<75&&!this.progressMilestones.has(50)){milestone=50}else if(percentage>=25&&percentage<50&&!this.progressMilestones.has(25)){milestone=25}if(milestone){this.progressMilestones.add(milestone);return milestone}return null}reset(){this.progressMilestones.clear();this.sessionStartTime=Date.now()}}
window.addEventListener('audioPlay',function(event){const{title,duration,isFirstPlay}=event.detail;if(!title)return;if(!audioProgressTrackers.has(title)){audioProgressTrackers.set(title,new AudioProgressTracker(title))}else{audioProgressTrackers.get(title).reset()}gtag('event','audio_start',{'audio_title':title,'audio_duration':Math.round(duration)||0,'audio_provider':'custom_player','user_code':userCode||'anonymous','page_location':window.location.href,'page_title':document.title,'is_first_play':isFirstPlay||!1})});
window.addEventListener('audioProgress',function(event){const{title,percent,currentTime,duration}=event.detail;if(!title||!percent)return;const tracker=audioProgressTrackers.get(title);if(!tracker)return;const milestone=tracker.trackProgress(percent);if(milestone){gtag('event','audio_progress',{'audio_title':title,'audio_percent':milestone,'audio_current_time':Math.round(currentTime)||0,'audio_duration':Math.round(duration)||0,'user_code':userCode||'anonymous','page_location':window.location.href})}});
window.addEventListener('audioPause',function(event){const{title,pausedAt,percent}=event.detail;if(!title)return;gtag('event','audio_pause',{'audio_title':title,'audio_paused_at':Math.round(pausedAt)||0,'audio_percent_watched':percent||0,'user_code':userCode||'anonymous','page_location':window.location.href})});
window.addEventListener('audioEnded',function(event){const{title,duration}=event.detail;if(!title)return;const tracker=audioProgressTrackers.get(title);if(tracker){const sessionDuration=Math.round((Date.now()-tracker.sessionStartTime)/1000);gtag('event','audio_complete',{'audio_title':title,'audio_duration':Math.round(duration)||0,'audio_percent':100,'session_duration':sessionDuration,'user_code':userCode||'anonymous','page_location':window.location.href})}});
window.addEventListener('audioStopped',function(event){const{title}=event.detail;if(title){gtag('event','audio_stopped',{'audio_title':title,'user_code':userCode||'anonymous','page_location':window.location.href,'reason':'another_audio_started'})}});
window.addEventListener('audioError',function(event){const{title,error}=event.detail;gtag('event','audio_error',{'audio_title':title||'unknown','error_message':error?.message||'unknown_error','user_code':userCode||'anonymous','page_location':window.location.href})});
gtag('event','page_view_with_audio',{'page_location':window.location.href,'page_title':document.title,'user_code':userCode||'anonymous','has_audio_player':!0,'audio_buttons_count':document.querySelectorAll('.audio-button').length})})();

// Video tracking - only runs if Vimeo API is loaded
window.addEventListener('load',function(){
if(typeof Vimeo==='undefined'){console.warn('Vimeo Player API not loaded - video tracking disabled');return}
function getUserCode(){const urlParams=new URLSearchParams(window.location.search);return urlParams.get('code')||'anonymous'}
function extractVimeoId(embedlyUrl){const decodedUrl=decodeURIComponent(embedlyUrl);const match=decodedUrl.match(/vimeo\.com%2F(\d+)/i)||decodedUrl.match(/vimeo\.com\/(\d+)/i);return match?match[1]:null}
const embedlyFrames=document.querySelectorAll('iframe.embedly-embed[src*="vimeo.com"]');
embedlyFrames.forEach(function(embedlyFrame,index){
let videoTitle=embedlyFrame.getAttribute('title')||'Untitled Video';
const vimeoId=extractVimeoId(embedlyFrame.src);
if(!vimeoId)return;
const vimeoUrl=`https://player.vimeo.com/video/${vimeoId}`;
const newIframe=document.createElement('iframe');
newIframe.src=vimeoUrl;
newIframe.width=embedlyFrame.width;
newIframe.height=embedlyFrame.height;
newIframe.setAttribute('frameborder','0');
newIframe.setAttribute('allow','autoplay; fullscreen; picture-in-picture');
newIframe.setAttribute('allowfullscreen','');
newIframe.setAttribute('title',videoTitle);
newIframe.className=embedlyFrame.className;
embedlyFrame.parentNode.replaceChild(newIframe,embedlyFrame);
setTimeout(function(){
const player=new Vimeo.Player(newIframe);
let playCount=0;let lastTrackedPercentage=0;let hasStarted=!1;
player.on('play',function(){playCount++;const userCode=getUserCode();gtag('event','video_start',{video_title:videoTitle,video_provider:'vimeo',video_url:`https://vimeo.com/${vimeoId}`,user_code:userCode,play_count:playCount,event_category:'video_engagement',event_label:videoTitle});hasStarted=!0});
player.on('timeupdate',function(data){if(!hasStarted)return;const percent=Math.round(data.percent*100);const milestones=[25,50,75,100];milestones.forEach(function(milestone){if(percent>=milestone&&lastTrackedPercentage<milestone){const userCode=getUserCode();gtag('event','video_progress',{video_title:videoTitle,video_provider:'vimeo',video_url:`https://vimeo.com/${vimeoId}`,video_percent:milestone,user_code:userCode,play_count:playCount,event_category:'video_engagement',event_label:`${videoTitle} - ${milestone}%`});lastTrackedPercentage=milestone}})});
player.on('ended',function(){const userCode=getUserCode();gtag('event','video_complete',{video_title:videoTitle,video_provider:'vimeo',video_url:`https://vimeo.com/${vimeoId}`,user_code:userCode,play_count:playCount,event_category:'video_engagement',event_label:videoTitle})});
player.on('pause',function(data){const percent=Math.round(data.percent*100);const userCode=getUserCode();gtag('event','video_pause',{video_title:videoTitle,video_provider:'vimeo',video_url:`https://vimeo.com/${vimeoId}`,video_percent:percent,user_code:userCode,play_count:playCount,event_category:'video_engagement',event_label:`${videoTitle} - Paused at ${percent}%`})})},1000)})});
