// Register Presence
chrome.runtime.sendMessage(extensionId, {mode: 'passive'}, function(response) {
    console.log('Presence registred', response);
});

// Wait for presence Requests
chrome.runtime.onMessage.addListener(function (info, sender, sendResponse) {
    console.log('Presence requested', info);
    sendResponse(getPresence(info));
});

// Return Presence
function getPresence(info) {
    try {
        var video = document.querySelector(".video-stream");
        if (video !== null && !isNaN(video.duration)) {
            var title = document.querySelector("yt-formatted-string.ytmusic-player-bar.title").textContent;
            var endTime = (Date.now() + Math.floor((video.duration * 1000)) - Math.floor((video.currentTime * 1000)));

            var subtitle;
            try {
                subtitle = [...document.querySelectorAll("span.ytmusic-player-bar.subtitle yt-formatted-string a")].map(el => {
                    return el.textContent;
                }).join(' • ');
            } catch (e) {
                console.error('Could not retrive uploader', e);
                subtitle = '';
            }

            if (video.paused) {
                if(!info.active) return {};
                return {
                    clientId: '816596186781581332',
                    presence: {
                        state: 'Paused',
                        details: title,
                        largeImageKey: "youtube",
                        smallImageKey: "pause",
                        instance: true,
                    }
                };
            } else {
                var buttons = [];
                try {
                    document.querySelectorAll("span.ytmusic-player-bar.subtitle yt-formatted-string a").forEach(el => {
                        if (el && el.textContent && el.href && buttons.length < 3) {
                            buttons.push({
                                label: el.textContent.replace(/\([^\)]*\)/, '',).slice(0, 20),
                                url: el.href
                            })
                        }

                    })

                } catch (e) {
                    console.error('Could not retrive buttons', e);
                    buttons = [];
                }

                return {
                    clientId: '816596186781581332',
                    presence: {
                        state: subtitle,
                        details: title,
                        endTimestamp: endTime,
                        largeImageKey: "youtube",
                        smallImageKey: "play",
                        buttons: buttons,
                        instance: true,
                    }
                };
            }
        } else if(info.active) {
            return {
                    clientId: '816596186781581332',
                    presence: {
                        state: '',
                        details: 'Browsing',
                        largeImageKey: "youtube",
                        instance: true,
                    }
                };
        } else {
            return {};
        }
    } catch (e) {
        console.error(e);
        return {};
    }
};
