if ([...document.querySelectorAll("video")] && [...document.querySelectorAll("video")].length) {
    for (let i = 0; i < [...document.querySelectorAll("video")].length; i++) {
        let video = [...document.querySelectorAll("video")][i];
        if (video.readyState === 4) {
            pictureInPicture(video)
        } else {
            chrome.runtime.sendMessage({
                'action': 'notification',
                'type': 'Warning 😬',
                'message': 'The video is not ready. Try to start it manually!'
            });
        }
    }
}

function pictureInPicture(video) {
    videoInit(video);
    if (video.requestPictureInPicture) {
        video.requestPictureInPicture()
            .then(() => true)
            .catch(e => {
                console.log(e);
                chrome.runtime.sendMessage({
                    'action': 'notification',
                    'type': 'Error 😔',
                    'message': 'FloatVideo is not supported in your window!'
                });
            })
    } else {
        chrome.runtime.sendMessage({
            'action': 'notification',
            'type': 'Error 😔',
            'message': 'Video playback from this resource should be played directly on in the same tab.'
        });
    }
}

function videoInit(video) {
    video.play();
    video.muted = false;
    video.volume = 1;
}



