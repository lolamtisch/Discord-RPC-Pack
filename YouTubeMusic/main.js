// Register Presence
function init() {
    waitForRegister();
    setTimeout(() => {
        chrome.runtime.sendMessage(extensionId, {mode: 'passive'}, function (response) {
            console.log('Presence registred', response)
        });
    }, 500);
};

init();

var registerInterval;

function waitForRegister() {
    clearInterval(registerInterval);
    registerInterval = waitUntilTrue(() => {
            return document.getElementsByClassName("video-stream").length;
        },
        () => {
            var video = document.getElementsByClassName("video-stream")[0];
            video.onpause = function () {
                console.info('pause');
                chrome.runtime.sendMessage(extensionId, {mode: 'passive'}, function (response) {
                    console.log('Presence registred', response)
                });
            }
            video.onplaying = function () {
                console.info('playing');
                chrome.runtime.sendMessage(extensionId, {mode: 'passive'}, function (response) {
                    console.log('Presence registred', response)
                });
            }
            video.oncanplay = function () {
                console.info('canplay');
                setTimeout(() => {
                    chrome.runtime.sendMessage(extensionId, {mode: 'passive'}, function (response) {
                        console.log('Presence registred', response)
                    });
                }, 500)
            }

        })
}

// Wait for presence Requests
chrome.runtime.onMessage.addListener(function (info, sender, sendResponse) {
    console.log('Presence requested', info);
    sendResponse(getPresence());
});

// Return Presence
function getPresence() {
    try {
        var video = document.querySelector(".video-stream");
        if (video !== null && !isNaN(video.duration)) {
            var title = document.querySelector("yt-formatted-string.ytmusic-player-bar.title").textContent;
            var endTime = (Date.now() + Math.floor((video.duration * 1000)) - Math.floor((video.currentTime * 1000)));

            var subtitle;
            try {
                subtitle = document.querySelector("span.ytmusic-player-bar.subtitle yt-formatted-string").title;
            } catch (e) {
                console.error('Could not retrive uploader', e);
                subtitle = '';
            }

            if (video.paused) {
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
            } else {
                return {
                    clientId: '607934326151053332',
                    presence: {
                        state: subtitle,
                        details: title,
                        endTimestamp: endTime,
                        largeImageKey: "youtube",
                        smallImageKey: "play",
                        instance: true,
                    }
                };
            }
        } else {
            return {};
        }
    } catch (e) {
        console.error(e);
        return {};
    }
};

//helper

function waitUntilTrue(condition, callback) {
    var Interval = null;
    Interval = setInterval(function () {
        if (condition()) {
            clearInterval(Interval);
            callback();
        }
    }, 100);
    return Interval;
}
