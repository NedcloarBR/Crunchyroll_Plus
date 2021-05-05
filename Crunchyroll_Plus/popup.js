const darktheme = document.getElementById('darkmode');
const aseguir = document.getElementById('aseguir');
const cooldown = document.getElementById('cooldown');

darktheme.onchange = () => {
    chrome.storage.sync.set({'darkmode' : darktheme.checked})
}

aseguir.onchange = () => {
    chrome.storage.sync.set({'aseguir': aseguir.checked});
}

cooldown.onchange = () => {
    chrome.storage.sync.set({'cooldown': cooldown.value});
}

chrome.storage.sync.get(['darkmode', 'aseguir', 'cooldown'], function(items) {
    if (items.aseguir === undefined) {
        chrome.storage.sync.set({'darkmode': true, 'aseguir': true, 'cooldown': 5});
        aseguir.checked = true;
        cooldown.value = 5;
    } else {
        aseguir.checked = items.aseguir;
        darktheme.checked = items.darkmode;
        cooldown.value = items.cooldown;
    }
});