
// #region Media Events

/**
 * Method responsible of handling link event.
 * 
 * @param {Event} event - Event. 
 */
function handleLinkEvent(event) {
    event.preventDefault();
    handleLinkInput(document.getElementById('link-input').value);
}

document.getElementById('media-link-button').addEventListener('click', handleLinkEvent);
document.getElementById('link-form').addEventListener('submit', handleLinkEvent);

/**
 * Event for checking how many times reset button has been pressed and operates accordingly.
 */
document.getElementById('reset-size-button').addEventListener('click', function () {
    resetVideoSize(pressedButtonForVideoURL !== 0);
    pressedButtonForVideoURL++;
});

/**
 * Event for initating update of media player size.
 */
document.getElementById('update-size-button').addEventListener('click', function (event) {
    event.preventDefault();
    updateVideoSize(document.getElementById('width-input'));
});

/**
 * Method responsible of reseting video size.
 * 
 * @param {boolean} displayAsLastVideo - Boolean for checking if it's displayed as last video.
 */
function resetVideoSize(displayAsLastVideo) {
    updatePlayerDimensions(defaultWidth, defaultHeight);
    saveVideoWidth();
    displayVideoSize();
    displayVideoId(displayAsLastVideo);
}

// #endregion



// #region Playlist Events

/**
 * Event for starting playlist.
 */
startPlaylistButton.addEventListener('click', function (event) {
    event.preventDefault();
    handleStartPlaylist();
});

/**
 * Event for closing iframe-controls for playlist.
 */
exitPlaylistButton.addEventListener('click', function(event){
    event.preventDefault();
    handleExitPlaylist(event);
});

// #endregion



// #region Library Buttons Events


// Area for attaching events.
for (let i = 0; i < qButtonConfigs.length; i++){
    let button = qButtonConfigs[i];
    button.buttonLocation.addEventListener('mouseenter', (event) => handleHoverEvent(event, button));
    button.buttonLocation.addEventListener('mouseleave', (event) => handleHoverEvent(event, button));
    button.buttonLocation.addEventListener('click', (event) => handleClickQAddEvent(event, button));
}
for (let i = 0; i < buttonConfigs.length; i++){
    let button = buttonConfigs[i];
    button.buttonLocation.addEventListener('mouseenter', (event) => handleHoverEvent(event, button));
    button.buttonLocation.addEventListener('mouseleave', (event) => handleHoverEvent(event, button));
    button.buttonLocation.addEventListener('click', (event) => handleClickAddEvent(event, button));
}

// #endregion



// #region Settings Events

let settingsButton = document.getElementById('settings-button');
let closePopupButton = document.getElementById('close-settings-button');

addCustomButton.addEventListener('click', () => {displayError('Not a working function', addCustomButton)});

settingsButton.addEventListener('click', (event) => { openPopup(event, 'settings')});
closePopupButton.addEventListener('click', closePopup);
popup.addEventListener('click', closePopupOutside);
document.getElementById('preference-area').addEventListener('submit', function (event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    let formDataArray = [];
    formData.forEach((value, key) => {
        formDataArray.push({ formInput: key, value: value });
    });
    handleSettingsForm(formDataArray);
    closePopup(event);
    siteSettingsCorrection();
});

/**
 * Method responsible of checking if multiple boxes are checked.
 * 
 * @param {NodeList} checkboxes - All checkboxes in the same area.
 */
function multipleBoxCheck(checkboxes){
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener('change', function(event) {
            disableOtherCheckboxes(checkboxes[i], checkboxes);
        });
    }
}

// #endregion
