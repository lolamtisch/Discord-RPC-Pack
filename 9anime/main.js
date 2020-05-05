  chrome.runtime.sendMessage(extensionId, {mode: 'passive'}, function(response) {
    console.log('Presence registred', response);
  });
  
  // Wait for presence Requests
  chrome.runtime.onMessage.addListener(function(info, sender, sendResponse) {
    console.log('Presence requested', info)
    sendResponse(getPresence(info));
  });
  
  
  function getPresence(info){
      try{
        return {
          clientId: '707323113922101268',
            presence: {
                  state: 'watching',
                  details: document.getElementsByClassName('title')[0].textContent,
                  startTimestamp: Date.now() / 1000,
                  largeImageKey: "header",
                  smallImageKey: "play",
                  instance: true,
              }
        }
      } catch(e){
        console.error(e);
        return {};
      }
    }