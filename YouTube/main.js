function urlChangeDetect(callback){
  var currentPage = window.location.href;
  return setInterval(function(){
      if (currentPage != window.location.href){
          currentPage = window.location.href;
          callback();
      }
  }, 100);
}
// Register Presence
window.onload = function() {
  chrome.runtime.sendMessage(extensionId, {mode: 'active'}, function(response) {
    console.log('Presence registred', response)
  });
};

urlChangeDetect(function() {
  chrome.runtime.sendMessage(extensionId, {mode: 'active'}, function(response) {
    console.log('Presence registred', response)
  });
});

// Wait for presence Requests
chrome.runtime.onMessage.addListener(function(info, sender, sendResponse) {
  console.log('Presence requested', info);
  sendResponse(getPresence());
});

// Return Presence
function getPresence(){
 try{
  var video = document.querySelector(".video-stream");
  if (video !== null && !isNaN(video.duration)) {
    var oldYouTube;
    var title;

    var live = Boolean(document.querySelector(".ytp-live"))

    document.querySelector(".watch-title") !== null
    ? (oldYouTube = true)
    : (oldYouTube = false);

    if (!oldYouTube) {
      title =
      document.location.pathname !== "/watch"
      ? document.querySelector(".ytd-miniplayer .title").firstElementChild.textContent
      : document.querySelector(".title.ytd-video-primary-info-renderer").firstElementChild.textContent
    } else {
      if (document.location.pathname == "/watch")
        title = document.querySelector(".watch-title").textContent;
    }

    if (live) {
      var startTime = (Date.now() - Math.floor((video.currentTime * 1000)));
    } else {
      var endTime = (Date.now() + Math.floor((video.duration * 1000)) -Math.floor((video.currentTime * 1000)));
    }
    var uploader =
    document.querySelector("#owner-name a") !== null
    ? document.querySelector("#owner-name a").textContent
    : document.querySelector(".yt-user-info a").textContent

    if (video.paused == true) {
      return {
        clientId: '607934326151053332',
        presence: {
          state: 'Paused',
          details: title,
          largeImageKey: "youtube",
          smallImageKey: "pause",
          instance: true,
        }
      };
    } else if (!live) {
      return {
        clientId: '607934326151053332',
        presence: {
          state: uploader,
          details: title,
          endTimestamp: endTime,
          largeImageKey: "youtube",
          smallImageKey: "play",
          instance: true,
        }
      };
    } else {
      return {
        clientId: '607934326151053332',
        presence: {
          state: uploader,
          details: title,
          startTimestamp: startTime,
          largeImageKey: "youtube",
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
