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

    let removeInterval;
    removeInterval = waitUntilTrue(() => {
      return !document.body.contains(video);
    },
    () => {
      clearInterval(removeInterval);
      waitForRegister()
    });

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
    if (video && !isNaN(video.duration) && document.querySelector('[data-a-target="stream-title"]')) {
	  var live = Boolean(document.querySelector(".video-player .tw-channel-status-text-indicator"))
	  try{
        if(document.getElementsByTagName("video").length>1){
		  var title=""
        }else{
		  var title=document.querySelector('[data-a-target="stream-title"]')!=undefined?document.querySelector('[data-a-target="stream-title"]').childNodes[0].nodeValue:document.querySelector("title").innerText.replace('- twitch','')
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
        var channel = document.querySelector("h1.tw-line-height-heading").textContent
      }catch(e){
        console.error('Could not retrive uploader', e);
        var channel = '';
      }

      console.log(title);
      console.log(channel);


      if (video.paused == true) {
        return {
          clientId: '611467991938367518',
          presence: {
            state: 'Paused',
            details: channel? channel+' - '+title: title,
            largeImageKey: "twitch",
            smallImageKey: "pause",
            instance: true,
          }
        };
      } else if (!live) {
        var buttons = [];
        try {
          buttons.push({
            label: 'Watch',
            url: window.location.href
          })
        } catch (e) {
          console.error('Could not retrive buttons', e);
          buttons = []
        }

        return {
          clientId: '611467991938367518',
          presence: {
            state: channel,
            details: title,
            endTimestamp: endTime,
            largeImageKey: "twitch",
            smallImageKey: "play",
            buttons: buttons,
            instance: true,
          }
        };
      } else {
        var buttons = [];
        try {
          buttons.push({
            label: 'Join',
            url: window.location.href
          })
        } catch (e) {
          console.error('Could not retrive buttons', e);
          buttons = []
        }

        let presence = {
          clientId: '611467991938367518',
          presence: {
            state: channel,
            details: title,
            startTimestamp: startTime,
            largeImageKey: "twitch",
            smallImageKey: "live",
            //partyId: "party:"+channel,
            //joinSecret: window.location.pathname,
            buttons: buttons,
            instance: true,
          }
        };

        let viewers = document.querySelector('[data-a-target="animated-channel-viewers-count"]');
        if(viewers){
          var views = parseInt(viewers.textContent.replace('.', ''));
          if(views) {
            if(views < 5) views = 5;
            //presence.presence.partySize = 1;
            //presence.presence.partyMax = views;
          }
        }

        return presence;
      }
    } else {

      var details = document.querySelector("title").innerText.replace(' - Twitch','').replace(/^Twitch$/i,'Home');
      console.log('Browsing', details);
      return {
        clientId: '611467991938367518',
        presence: {
          state: 'Browsing',
          details: details,
          largeImageKey: "twitch",
          instance: true,
        }
      };
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
  }, 500);
  return Interval;
}