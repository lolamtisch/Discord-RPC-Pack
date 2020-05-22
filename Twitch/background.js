chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
	if(request.action == "join" && request.clientId === '611467991938367518'){
    //Game launch request.
    chrome.tabs.create({url: 'https://www.twitch.tv'+request.secret}, function (tab) {
    });
    return true;
  }else if(request.action == "joinRequest" && request.clientId === '611467991938367518'){
    sendResponse('YES');
    return true;
  }
});

//Register party listener. Needed for reacting to invitations
chrome.runtime.sendMessage(extensionId, {action: 'party', clientId: '611467991938367518'}, function(response) {
  console.log('Party registred', response);
});