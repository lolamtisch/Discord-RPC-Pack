// Register Presence
function init() {
  waitForRegister();
  setTimeout(() => {
    chrome.runtime.sendMessage(extensionId, {mode: 'active'}, function(response) {
      console.log('Presence registred', response)
    });
  }, 500);
};

init();

var registerInterval;
function waitForRegister(){
  clearInterval(registerInterval);
  registerInterval = waitUntilTrue(() => {
    return document.getElementsByTagName("video").length;
  },
  () => {
    var video = document.getElementsByTagName("video")[0]
    video.onpause = function() {
      console.info('pause');
      chrome.runtime.sendMessage(extensionId, {mode: 'active'}, function(response) {
        console.log('Presence registred', response)
      });
    }
    video.onplaying = function() {
      console.info('playing');
      chrome.runtime.sendMessage(extensionId, {mode: 'active'}, function(response) {
        console.log('Presence registred', response)
      });
    }
    video.oncanplay = function() {
      console.info('canplay');
      setTimeout(() => {
        chrome.runtime.sendMessage(extensionId, {mode: 'active'}, function(response) {
          console.log('Presence registred', response)
        });
      }, 500)
    }

  })
}

// Wait for presence Requests
chrome.runtime.onMessage.addListener(function(info, sender, sendResponse) {
  console.log('Presence requested', info);
  sendResponse(getPresence());
});

// Return Presence
function getPresence(){
  try{
    var video = document.getElementsByTagName("video")[document.getElementsByTagName("video").length-1]
    if (video !== null && !isNaN(video.duration)) {
	  var live = !Boolean(document.querySelector(".live-indicator.tw-hidden"))
	  try{
        if(document.getElementsByTagName("video").length>1){
		  var title=""  
        }else{
		  var title=document.querySelector(".channel-info-bar__content-top")!=undefined?document.querySelector(".channel-info-bar__content-top").querySelector(".tw-line-height-body").innerText:document.querySelector("title").innerText
	    }
	  }catch(e){
        console.error('Could not retrive title', e);
        var title = '';
      }
		
	  if (live) {
        var startTime = (Date.now() - Math.floor((video.currentTime * 1000)));
      } else {
        var endTime = (Date.now() + Math.floor((video.duration * 1000)) -Math.floor((video.currentTime * 1000)));
      }
      try{
        var channel = document.querySelector(".channel-header-user-tab__user-content").querySelector(".tw-c-text-inherit").textContent
      }catch(e){
        console.error('Could not retrive uploader', e);
        var channel = '';
      }


      if (video.paused == true) {
        return {
          clientId: '703369063099007088',
          presence: {
            state: 'Paused',
            details: title,
            largeImageKey: "twitch",
            smallImageKey: "pause",
            instance: true,
          }
        };
      } else if (!live) {
        return {
          clientId: '703369063099007088',
          presence: {
            state: channel,
            details: title,
            endTimestamp: endTime,
            largeImageKey: "twitch",
            smallImageKey: "play",
            instance: true,
          }
        };
      } else {
        return {
          clientId: '703369063099007088',
          presence: {
            state: channel,
            details: title,
            startTimestamp: startTime,
            largeImageKey: "twitch",
            smallImageKey: "play",
            instance: true,
          }
        };
      }
    } else {
      return {};
    }
  }catch(e){
    console.error(e);
    return {};
  }
};

//helper

function waitUntilTrue(condition, callback){
  var Interval = null;
  Interval = setInterval(function(){
      if (condition()){
          clearInterval(Interval);
          callback();
      }
  }, 100);
  return Interval;
}
