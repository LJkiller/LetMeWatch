
window.onload = function () {
    //checkLocalStore();

    let playerIframe = document.getElementById('falsified-media-player');
    let videoIdValueSpan = document.getElementById('video-id');
    let videoLink = document.getElementById('video-link');

    let storedWidth = localStorage.getItem('videoWidth');
    let storedVideoID = localStorage.getItem('videoId');
    let storedVideoSource = localStorage.getItem('videoSource');
    let storedVideoLink = localStorage.getItem('videoLink');

    if (storedWidth) {
        restoreIframeSize(playerIframe, storedWidth);
    }

    // Update videoID.
    videoIdValueSpan.innerHTML = `<span style="color: var(--darker-gray);">LastVideoID:</span> ${storedVideoID} : `;
    // Update videoLink.
    videoLink.href = storedVideoLink;
    // Update videoSrc.
    playerIframe.src = storedVideoSource;
};

/**
 * Method responsible of checking all locally stored information.
 */
function checkLocalStore() {
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = localStorage.getItem(key);
        console.log(key + ' => ' + value);
    }
}

/**
 * Method responsible of restoring iframe size.
 * 
 * @param {HTMLIFrameElement} playerIframe - Iframe to be handled.
 * @param {number} storedWidth - Stored iframe width to be updated.
 */
function restoreIframeSize(playerIframe, storedWidth) {
    let baseWidth = 426;
    let baseHeight = 240;
    let aspectRatio = baseWidth / baseHeight;
    let calculatedHeight = storedWidth / aspectRatio;

    //Update iframe dimensions
    playerIframe.width = storedWidth;
    playerIframe.height = calculatedHeight;
}
