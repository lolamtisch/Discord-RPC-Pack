  chrome.runtime.sendMessage(extensionId, {mode: 'passive'}, function(response) {
    console.log('Presence registred', response);
  });
  
  // Wait for presence Requests
  chrome.runtime.onMessage.addListener(function(info, sender, sendResponse) {
    console.log('Presence requested', info)
    sendResponse(getPresence(info));
  });
  
  var today = Date.now();
  var todayI = today;  
  function getPresence(info){
    todayI = today;
      try{
        return {
          clientId: '707557815639605298',
            presence: {
                  state: 'Watching ' + document.getElementsByClassName('tw-c-text-base tw-font-size-4 tw-line-height-heading tw-strong')[0].textContent,
                  details: document.getElementsByClassName('tw-ellipsis tw-font-size-5 tw-line-clamp-2 tw-strong tw-word-break-word')[0].textContent,
                  startTimestamp: todayI,
                  largeImageKey: 'header',
                  largeImageText: 'on ' + window.location.host.toString(),
                  smallImageKey: 'play',
                  smallImageText: 'playing',
                  instance: true,

              }
        }
      } catch(e){
        console.error(e);
        todayI = today;
        return {};
      }
    }
