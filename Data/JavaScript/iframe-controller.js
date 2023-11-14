const playerIframe = document.getElementById('falsifiedMediaPlayer');
const widthInput = document.getElementById('widthInput');

const heightValueSpan = document.getElementById('heightValue');
const widthValueSpan = document.getElementById('widthValue');
const videoIdValueSpan = document.getElementById('videoID');

const baseWidth = 426;
const baseHeight = 240;
const scaleFactor = 3;

let defaultWidth = baseWidth * scaleFactor;
let defaultHeight = baseHeight * scaleFactor;
let aspectRatio = defaultWidth / defaultHeight;


//Saves the different values:
function saveVideoDimensionValues(width = defaultWidth) {
    localStorage.setItem('videoWidth', width);
}
function saveVideoIDValue(videoID = "NOT FOUND") {
    localStorage.setItem('videoID', videoID);
}


//Updates old values to new values:
function updateVideoSize() {
    const newWidth = parseInt(widthInput.value);

    if (isNaN(newWidth)) {
        return;
    }

    const newHeight = Math.round(newWidth / aspectRatio);

    saveVideoDimensionValues(newWidth);
    updatePlayerDimensions(newWidth, newHeight);
    displaySizeValues();

    widthInput.value = '';
}
function updatePlayerDimensions(width, height) {
    playerIframe.width = width;
    playerIframe.height = height;
}
function updateVideoID(videoID) {
    videoIdValueSpan.textContent = `videoID: ${videoID}`;
}


//Gets the link and then analyses the link and then sets as source:
function extractAndSetVideoID() {
    const linkInput = document.getElementById('linkInput').value;
    const videoID = extractVideoId(linkInput);
    updateVideoID(videoID);
    return videoID;
}
//Extracts the id:
function extractVideoId(link) {
    const watchPattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const shortPattern = /https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})/;
    const watchMatch = link.match(watchPattern);
    const shortMatch = link.match(shortPattern);
    const videoID = watchMatch ? watchMatch[1] : (shortMatch ? shortMatch[1] : null);

    return videoID;
}
//Sets the new ID as video/iframe src:
function extractAndSetVideo(event) {
    event.preventDefault();
    const linkInput = document.getElementById('linkInput').value;
    const videoID = extractAndSetVideoID();
    const iframeSrc = `https://www.youtube-nocookie.com/embed/${videoID}?start=0&autoplay=1&autohide=1`;

    if (iframeSrc) {
        console.log('Updated iframe src:', iframeSrc);
        playerIframe.src = iframeSrc;
        document.getElementById('linkInput').value = '';
    } else {
        console.error('Invalid YouTube link');
    }

    saveVideoIDValue(videoID);
}


//Displays the new values:
function displaySizeValues() {
    let storedWidth = localStorage.getItem('videoWidth');
    let storedHeight = Math.round(storedWidth / aspectRatio);

    heightValueSpan.textContent = `Height: ${storedHeight}px`;
    widthValueSpan.textContent = `Width: ${storedWidth}px`;
}
function displayVideoId() {
    const storedVideoId = localStorage.getItem('videoID');
    videoIdValueSpan.textContent = `videoID: ${storedVideoId}`;
}


//Resets displayValues, displays to default values.
function resetVideoSize() {
    updatePlayerDimensions(defaultWidth, defaultHeight);
    saveVideoDimensionValues();
    displaySizeValues();
    displayVideoId();
}

displaySizeValues();
displayVideoId();