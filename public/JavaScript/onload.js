
window.onload = function () {
    displayVideoSize();
    displayVideoId();
    siteSavedCorrection(localStorage.getItem('videoWidth'));
    siteDomainsCorrection();
    siteStyleCorrection();
    siteMetricsCorrection();
    siteLibraryCorrection();
    siteSettingsCorrection();
};

/**
 * Method responsible of correcting HTML on the site by provided information.
 * 
 * @param {number} width - Width of the iframe.
 */
function siteSavedCorrection(width){
    let videoLinks = JSON.parse(localStorage.getItem('videoLinks')) || [];
    let latestLink = videoLinks.length ? videoLinks[videoLinks.length - 1] : { id: 'NOT FOUND', url: 'NOT FOUND', src: 'NOT FOUND'};
    let displayId = `${limitText(latestLink.id, textListLimit)}`;
    if (width) {
        restoreIframeSize(mediaPlayer, width);
    }

    document.getElementById('video-id').innerHTML = `<span style="color: var(--smaller-text-color);">LastVideoID:</span> ${displayId}`;
    document.getElementById('video-link').href = latestLink.url;
    document.getElementById('falsified-media-player').src = latestLink.src;
}

/**
 * Method responsible of restoring iframe size.
 * 
 * @param {HTMLIFrameElement} mediaPlayer - Iframe to be handled.
 * @param {number} storedWidth - Stored iframe width to be updated.
 */
function restoreIframeSize(mediaPlayer, storedWidth) {
    let baseWidth = 426;
    let baseHeight = 240;
    let aspectRatio = baseWidth / baseHeight;
    let calculatedHeight = storedWidth / aspectRatio;

    // Update iframe dimensions.
    mediaPlayer.width = storedWidth;
    mediaPlayer.height = calculatedHeight;
}

/**
 * Method responsible of correcting HTML and CSS of domains sections.
 */
function siteDomainsCorrection(){
    let additionalDomainsHTML = document.getElementById('additional-domains');
    if (typeof additionalDomains !== 'undefined' && typeof additionalMediaInfo === 'function'){
        additionalDomainsHTML.querySelector('h2').textContent = 'Additional Domains';
        document.getElementById('supported-domains').style.gridArea = 'supported-domains';
    } else {
        additionalDomainsHTML.style.display = 'none';
    }
    let publicDomains = typeof domains !== 'undefined' ? domains : {};
    let moreDomains = typeof additionalDomains !== 'undefined' ? additionalDomains : {};
    
    let supportedUl = document.querySelector('#supported-domains > ul');
    let supportedLi = document.createElement('li');
    supportedLi.style.marginLeft = 'calc(var(--standard-spacing) * 2)';
    typeof generateSupportedWebsites === 'function' ? generateSupportedWebsites(publicDomains, moreDomains) : supportedLi.innerHTML = '<i class="fa-solid fa-circle"></i>No domains found';
    supportedUl.appendChild(supportedLi);
}

/**
 * Method responsible of correcting some CSS issues.
 */
function siteStyleCorrection(){
    let siteCopy = document.getElementById('site-info-copy');
    let webRedirect = document.createElement('a');
    webRedirect.href = 'https://letmewatch-dammit.com';
    webRedirect.textContent = 'LetMeWatch-DAMMIT';
    siteCopy.append(webRedirect);
}

/**
 * Method responsible of generating and correcting HTML in the metrics sections.
 */
function siteMetricsCorrection(){
    let videoLinksArray = getVideoLinksArray()[0] || [];
    let frequentDomainData = JSON.parse(localStorage.getItem('frequentDomainData')) || {};
    createMetricsList(videoLinksArray, document.querySelector(`${metricSelectors.lastVideoId} > .metrics`));
    createMetricsList(frequentDomainData, document.querySelector(`${metricSelectors.mostFrequentId} > .metrics`));
}

/**
 * Method responsible of correcting user libraries.
 */
function siteLibraryCorrection(){
    checkLibrary();
    let starLibrary = JSON.parse(localStorage.getItem('starLibrary')) || [];
    let playlistLibrary = JSON.parse(localStorage.getItem('playlistLibrary')) || [];
    createLibraryList(starLibrary, document.querySelector(`#starred-videos > .videos`));
    createLibraryList(playlistLibrary, document.querySelector(`#playlist > .videos`));
    
    playlistNameMaxNotice.textContent = `Max ${playlistNameLimit} characters.`;
    updatePlaylistName();
}

/**
 * Method responsible of correcting settings applications.
 */
function siteSettingsCorrection() {
    let settings = JSON.parse(localStorage.getItem('settings')) || [];
    let items = getAllItemsSorted(settings);

    let activeThemes = getActiveValues(items[0]);
    let themeValue = activeThemes[0] ? activeThemes[0].split('-theme')[0] : themeCase.defaultValue;
    let activeColors = getActiveValues(items[1]);
    let colorValue = activeColors[0] ? activeColors[0].split('primary-color-')[1] : colorCase.defaultValue;
    
    let activePlaylistBehvaiours = getActiveValues(items[2]);
    let activeLayouts = getActiveValues(items[3]);
    handleBehvourSettings(activePlaylistBehvaiours);
    handleLayoutSettings(activeLayouts);

    createSettingsList(themeCase.options, themeCase.string, themeValue, document.getElementById('theme-options-area'));
    createSettingsList(colorCase.options, colorCase.string, colorValue, document.getElementById('primary-color-options-area'));
    createSettingsList(playlistCase.options, playlistCase.string, activePlaylistBehvaiours, document.getElementById('playlist-behaviour-options-area'));
    createSettingsList(playlistLayoutCase.options, playlistLayoutCase.string, activeLayouts, document.getElementById('playlist-layout-options-area'));

    handleSettingsForm(settings);
}

/**
 * Method responsible of handling behaviour settings when website has loaded.
 * 
 * @param {string[]} activePlaylistBehvaiours - Array of active playlist behvaiours to be applied.
 */
function handleBehvourSettings(activePlaylistBehvaiours){
    if (!activePlaylistBehvaiours.includes(playlistCase.options[1])){
        let initialVideoPlaylistPosition = JSON.parse(localStorage.getItem('videoPlaylistPosition'));
        if (initialVideoPlaylistPosition){
            currentPlaylistPosition = initialVideoPlaylistPosition.position;
        }
    }
}

/**
 * Method responsible of handling layout settings.
 * 
 * @param {string[]} activeLayouts - Array of active layout behvaiours to be applied.
 */
function handleLayoutSettings(activeLayouts){
    playlistActiveLayoutSetting = '';
    for (let i = 0; i < activeLayouts.length; i++) {
        if (activeLayouts[i].includes(playlistLayoutCase.string)){
            playlistActiveLayoutSetting = activeLayouts[i];
        }
    }

    handlePlaylistLayout();
}
