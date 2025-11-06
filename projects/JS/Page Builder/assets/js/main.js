window.onload = function() {
    if (typeof(Storage) === "undefined") {
        alert("Your browser does not support local storage");
        return;
    }

    if (localStorage.getItem('boardData')) {
        document.getElementById('mainBoard').innerHTML = JSON.parse(localStorage.getItem('boardData'));
        let containers = document.getElementById('mainBoard').children;
        
        for (let container of containers) {
            createRemoveButton(container);
        }
    }

    if (localStorage.getItem('autoSave')) {
        document.getElementById('checkboxAutoSave').checked = localStorage.getItem('autoSave');
    }

    if (localStorage.getItem('background')) {
        const background = localStorage.getItem('background');
        const sideBar = document.getElementById('sideBar');
        sideBar.style.backgroundImage = "url('./assets/img/" + background + "')";
        
        // Set the background size based on the data-size attribute
        const selectedOption = document.querySelector(`#selectBackground option[value="${background}"]`);
        if (selectedOption) {
            sideBar.style.backgroundSize = selectedOption.getAttribute('data-size');
        }
    }
}

function createRemoveButton(container) {
    let removeButton = document.createElement('button');
    removeButton.innerText = 'X';
    removeButton.style.marginLeft = '10px';
    removeButton.style.padding = '5px 10px';
    removeButton.style.border = 'none';
    removeButton.style.backgroundColor = '#ff4d4d';
    removeButton.style.color = '#fff';
    removeButton.style.borderRadius = '5px';
    removeButton.style.cursor = 'pointer';
    removeButton.style.display = 'none';
    removeButton.onclick = function() {
        container.remove();

        if (localStorage.getItem('autoSave')) {
            saveBoard();
        }
    }

    container.onmouseover = function() {
        removeButton.style.display = 'block';
    }

    container.onmouseout = function() {
        removeButton.style.display = 'none';
    }

    container.appendChild(removeButton);
}

function addElement() {
    let elementChoice = document.getElementById('selectElement').value;

    if (elementChoice === '') {
        alert('Please select an element type.');

        return
    }

    let element = document.createElement(elementChoice);
    element.style.width = document.getElementById('inputWidth').value + document.getElementById('selectWidthUnit').value;
    element.style.height = document.getElementById('inputHeight').value + document.getElementById('selectHeightUnit').value;
    element.style.backgroundColor = document.getElementById('checkboxTransparentBg').checked ? 'transparent' : document.getElementById('inputBgColor').value;
    element.style.color = document.getElementById('inputTextColor').value;
    element.style.textAlign = document.getElementById('selectAlignment').value;
    element.style.fontSize = document.getElementById('inputFontSize').value + document.getElementById('selectFontSizeUnit').value;
    element.style.fontWeight = document.getElementById('inputFontWeight').value;
    element.style.borderStyle = document.getElementById('selectBorderStyle').value;
    element.style.borderWidth = document.getElementById('inputBorder').value + document.getElementById('selectBorderWidthUnit').value;
    element.style.margin = document.getElementById('inputMargin').value + document.getElementById('selectMarginUnit').value;
    element.style.padding = document.getElementById('inputPadding').value + document.getElementById('selectPaddingUnit').value;

    element.innerText = document.getElementById('contentText').value;

    let container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.position = 'relative';
    container.style.justifyContent = document.getElementById('selectContentAlignment').value;

    container.appendChild(element);
    createRemoveButton(container);

    document.getElementById('mainBoard').appendChild(container);

    if (document.getElementById('checkboxAutoSave').checked) {
        saveBoard();
    }
}

function clearBoard() {
    document.getElementById('mainBoard').innerHTML = '';
    
    if (localStorage.getItem('autoSave')) {
        saveBoard();
    }
}

function saveBoard() {
    localStorage.setItem('boardData', JSON.stringify(document.getElementById('mainBoard').innerHTML));
}

function saveSettings() {
    let boolAutoSave = document.getElementById('checkboxAutoSave').checked
    let selectedBackground = document.getElementById('selectBackground').value;
    let sideBar = document.getElementById('sideBar');

    if (boolAutoSave) {
        localStorage.setItem('autoSave', 'true');
    } else {
        localStorage.removeItem('autoSave');
    }

    if (selectedBackground !== '') {
        localStorage.setItem('background', selectedBackground);
        sideBar.style.backgroundImage = "url('./assets/img/" + selectedBackground + "')";
        
        // Set the background size based on the data-size attribute
        const selectedOption = document.querySelector(`#selectBackground option[value="${selectedBackground}"]`);
        if (selectedOption) {
            sideBar.style.backgroundSize = selectedOption.getAttribute('data-size');
        }
    }
}

function toggleSettings() {
    let settingsElement = document.getElementById('settings');
    
    if (settingsElement.style.display === '' || settingsElement.style.display === 'none') {
        settingsElement.style.display = 'block';
    } else {
        settingsElement.style.display = 'none';
    }
}

function toggleBackgroundColor() {
    const bgColorInput = document.getElementById('inputBgColor');
    const transparentBgCheckbox = document.getElementById('checkboxTransparentBg');

    if (transparentBgCheckbox.checked) {
        bgColorInput.disabled = true;
        bgColorInput.value = '#000000'; // Reset to default color
    } else {
        bgColorInput.disabled = false;
    }
}
