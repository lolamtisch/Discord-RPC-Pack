chrome.runtime.sendMessage(extensionId, {mode: 'passive'}, function(response) {
    console.log('Presence registred', response);
  });
  
  // Wait for presence Requests
  chrome.runtime.onMessage.addListener(function(info, sender, sendResponse) {
    console.log('Presence requested', info)
    sendResponse(getPresence(info));
  });
  

/* 
 some explination:
 today is the Date.now() function packed into
 a variable for usage in todayI.
 todayI gets saved after a request, but changes when the 
 request changes.
*/
  var today = Date.now();
  var todayI = today;  
  function getPresence(info){
    todayI = today;
      try{
        return {
          clientId: '707323113922101268',
            presence: {
                  state: 'Watching',
                  details: document.getElementsByClassName('title')[0].textContent,
                  startTimestamp: todayI,
                  largeImageKey: "header",
                  largeImageKeyText: 'on ' + window.location.host.toString(),
                  smallImageKey: "play",
                  instance: true,

              }
        }
      } catch(e){
        console.error(e);
        todayI = today;
        return {};
      }
    }
