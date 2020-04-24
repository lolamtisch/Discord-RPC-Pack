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
    return document.getElementsByClassName("vjs-tech").length;
  },
  () => {
    var video = document.getElementsByClassName("vjs-tech")[0];
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
    var video = document.querySelector(".vjs-tech");
    if (video !== null && !isNaN(video.duration)) {
      var title=document.querySelector(".video-details__title")!=undefined?document.querySelector(".video-details__title").innerText:document.querySelector(".player-title").innerText
      var live = Boolean(document.querySelector(".livestream-schedule"))
      if (live) {
        var startTime = (Date.now() - Math.floor((video.currentTime * 1000)));
      } else {
  	    try{
          var uploader=document.querySelector(".video-details__show").innerText
        }catch(e){
          console.error('Could not retrive uploader', e);
          var uploader = '';
        }
        var endTime = (Date.now() + Math.floor((video.duration * 1000)) -Math.floor((video.currentTime * 1000)));
      }

      if (video.paused == true) {
        return {
          clientId: '703327607550378084',
          presence: {
            state: 'Paused',
            details: title,
            largeImageKey: "roosterteeth",
            smallImageKey: "pause",
            instance: true,
          }
        };
      } else if(!live){
        return {
          clientId: '703327607550378084',
          presence: {
            state: uploader,
            details: title,
            endTimestamp: endTime,
            largeImageKey: "roosterteeth",
            smallImageKey: "play",
            instance: true,
          }
        };
      }else{
	        return {
          clientId: '703327607550378084',
          presence: {
            state: "RT-TV",
            details: title,
            startTimestamp: startTime,
            largeImageKey: "roosterteeth",
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
