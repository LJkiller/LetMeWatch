
// #region Events

/**
 * Method responsible for closing popup.
 * 
 * @param {Event} event - Event.
 */
function closePopup(event){
    event.preventDefault();
    let activeSections = popup.querySelectorAll('section.active');
    for (let i = 0; i < activeSections.length; i++){
        activeSections[i].classList.remove('active');
    }
    popup.classList.remove('active');
}

/**
 * Method responsible for opening the popup.
 * 
 * @param {Event} event - Event.
 * @param {string} sectionId - Section id to be displayed.
 */
function openPopup(event, sectionId){
    event.preventDefault();
    let section = popup.querySelector(`section#${sectionId}`);
    popup.classList.add('active');
    section.classList.add('active');
}

/**
 * Method responsible for closing the popup when clicking outside the settings section.
 * 
 * @param {Event} event - Event.
 */
function closePopupOutside(event){
    if (!event.target.closest('section')) {
        closePopup(event);
    }
}

/**
 * Method responsible of disabling other checkboxes in the same area.
 * 
 * @param {HTMLInputElement} checkedCheckbox - Checkbox that was checked.
 * @param {NodeList} checkboxes - All checkboxes in the same area.
 */
function disableOtherCheckboxes(checkedCheckbox, checkboxes) {
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i] !== checkedCheckbox) {
            checkboxes[i].disabled = checkedCheckbox.checked;
            if (!checkedCheckbox.checked) {
                checkboxes[i].disabled = false;
            }
        }
    }
}

// #endregion



// #region HTML Manipulation

/**
 * Method responsible of creating settings list.
 * 
 * @param {Array} options - Array of options.
 * @param {string} type - String to which html should be generated
 * @param {string} settingsValue - Setting that is applied.
 * @param {HTMLElement} location - HTML location to add the settings list to.
 */
function createSettingsList(options, type, settingsValue, location){
    switch (type){
        case themeCase.string:
            location.innerHTML = createHTMLSettingsList(options, type, settingsValue);
            multipleBoxCheck(location.querySelectorAll('.option'));
            break;
        case colorCase.string:
            location.innerHTML = createHTMLSettingsList(options, type, settingsValue);
            multipleBoxCheck(location.querySelectorAll('.option'));
            break;
        case playlistCase.string:
            location.innerHTML = createHTMLSettingsList(options, type, settingsValue);
            break;
        default:
            break;
    }
}

/**
 * Method responsible of creating HTML settings list.
 * 
 * @param {Array} options - Array of options.
 * @param {string} type - String to which html should be generated
 * @param {string} settingsValue - Setting that is applied.
 * @returns {HTMLElement} - HTML element of the list.
 */
function createHTMLSettingsList(options, type, settingsValue) {
    let html = '';
    let text = '';
    for (let i = 0; i < options.length; i++) {
        let option = options[i];
        let checkedOrDisabled = '';
        if (settingsValue !== null){
            checkedOrDisabled = option.includes(settingsValue) ? 'checked': 'disabled';
        }
        let isCurrent = checkedOrDisabled === 'checked' ? '<i>(Active)</i>' : '';

        let displayText = '';
        switch (type) {
            case themeCase.string:
                text = option === themeCase.defaultValue ? themeCase.defaultValue : option;
                html += `
                    <label>
                        <input type="checkbox" ${checkedOrDisabled} name="${text}-theme" id="${text}-theme-option" class="option" style="--checkbox-color: var(--${text}-theme);">
                        ${capitalizeFirstLetter(text)} Mode ${isCurrent}
                        ${checkedOrDisabled === 'disabled' ? `<input type="hidden" name="${text}-theme" value=""}>`: ''}
                    </label>`
                ;
                break;
            case colorCase.string:
                text = option === colorCase.defaultValue ? colorCase.defaultValue : option;
                html += `
                    <label>
                        <input type="checkbox" ${checkedOrDisabled} name="primary-color-${option}" id="${option}-option" class="option" style="--checkbox-color: var(--${option});">
                        ${capitalizeFirstLetter(text)} ${isCurrent}
                        ${checkedOrDisabled === 'disabled' ? `<input type="hidden" name="primary-color-${option}" value=""'}>`: ''}
                    </label>`
                ;
                break;
            case playlistCase.string:
                text = option;
                if (text === playlistCase.options[0]){
                    displayText = 'Remove watched entries upon exiting playlist.';
                }
                html += `
                    <label>
                        <input type="checkbox" ${checkedOrDisabled} name="${text}" id="playlist-option-${i}" class="option">
                        ${displayText}
                        
                    </label>
                `;
                break;
            default:
                break;
        }
    }
    return html;
}

// #endregion



// #region Apply

/**
 * Method responsible of handling settings.
 * 
 * @param {Array} dataArray - Array of data containing objects.
 */
function handleSettingsForm(dataArray) {
    root.style.setProperty('--primary-color', 'var(--blue)');
    document.body.removeAttribute('class');

    let items = getAllItemsSorted(dataArray);
    handleSetting(getActiveValues(items[0]), themeCase.string);
    handleSetting(getActiveValues(items[1]), colorCase.string);
    handleSetting(getActiveValues(items[2]), behaviourCase.string);

    localStorage.setItem('settings', JSON.stringify(dataArray));
}

/**
 * Method responsible of applying settings.
 * 
 * @param {string[]} activeCase - What is currently active.
 * @param {string} settingType - String of what case should be applied.
 */
function handleSetting(activeCases, settingType) {
    let singleCase = activeCases.length === 1 ? true : false;
    let items = activeCases.length === 1 ? activeCases[0] : activeCases;

    if (singleCase === true) {
        switch (settingType) {
            case themeCase.string:
                document.body.className = items === 'dark-theme' ? '' : items;
                break;
            case colorCase.string:
                let color = items.split('primary-color-')[1];
                if (document.body.classList.contains('light-theme')) {
                    color = `dark-${items.split('primary-color-')[1]}`;
                }
                root.style.setProperty('--primary-color', `var(--${color})`);
                break;
            default:
                break;
        }
    } else {
        switch (settingType) {
            case behaviourCase.string:

                break;
            case '':
                break;
            default:
                break;
        }
    }
}

/**
 * Method responsible of getting all data sorted into correct sections.
 * 
 * @param {Array} dataArray - Array containing all different form data. 
 * @returns {Array} - Array of themeItems, colorItems and behaviourItems.
 */
function getAllItemsSorted(dataArray){
    let themeItems = [];
    let colorItems = [];
    let behaviourItems = [];
    for (let i = 0; i < dataArray.length; i++){
        let item = dataArray[i];
        if (item.formInput.includes(themeCase.string)){
            themeItems.push(item);
        } else if (item.formInput.includes(colorCase.string)) {
            colorItems.push(item);
        } else if (item.formInput.includes(behaviourCase.string)) {
            behaviourItems.push(item);
        }
    }
    return [themeItems, colorItems, behaviourItems];
}

/**
 * Method responsible of getting active values.
 * 
 * @param {Array} items - Array of objects to get filtered out.
 * @returns {Array} - Array of active settings.
 */
function getActiveValues(items){
    let activeElement = [];
    for (let i = 0; i < items.length; i++){
        let item = items[i];
        if (item.value === 'on'){
            activeElement.push(item.formInput);
        }
    }
    return activeElement;
}

// #endregion
