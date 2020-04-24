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
	  console.log(document.getElementsByClassName("vjs-tech"))
    var video = document.getElementsByClassName("vjs-tech")[0];
	console.log("Registering callbacks on: ")
	console.log(video)
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
var title="Loading..."
var uploader="Loading..."
window.addEventListener('message', event => {
    if (event.origin.startsWith('https://vrv.co')) { 
		try{
			if(title!=event.data.title.substr(event.data.title.indexOf(" - ")+3)){
				title=event.data.title.substr(event.data.title.indexOf(" - ")+3)
				uploader=event.data.series
				setTimeout(waitForRegister,1000)
			}
		}catch(e){
			console.error(e)
		}
    }
}); 

// Return Presence
function getPresence(){
  try{
    var video = document.querySelector(".vjs-tech");
	
    if (video !== null && !isNaN(video.duration)) {
      var endTime = (Date.now() + Math.floor((video.duration * 1000)) -Math.floor((video.currentTime * 1000)));
 
      if (video.paused == true) {
        return {
          clientId: '703273834299523072',
          presence: {
            state: 'Paused',
            details: title,
            largeImageKey: "vrv",
            smallImageKey: "pause",
            instance: true,
          }
        };
      } else {
        return {
          clientId: '703273834299523072',
          presence: {
            state: uploader,
            details: title,
            endTimestamp: endTime,
            largeImageKey: "vrv",
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
