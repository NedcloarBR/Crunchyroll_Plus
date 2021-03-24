//TODO: check all ports (now hardcoded)
var ports = [6463, 6473];
var windowID;

function updatePresence(title) {
	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;
	xhr.open("POST", "http://localhost:3000/?data="+title);
	xhr.send();
}

function spoofHeader(details){	
	var headers = [ {name: "Content-Type", value: "application/json"} ];
	
	return { requestHeaders: headers };
}

function onTabUpdate(id, status, tab){
	console.log(tab)
	if(tab.url.startsWith("http://www.crunchyroll.com/*")) {
		if(status.status != "complete") return;
		chrome.tabs.query({ active: true }, function (tabs) {
			windowId = tab.windowId
			updatePresence(tabs[0].title.split(" - Assista na Crunchyroll")[0]);
		});
	}
}

function onTabClose(id, status, tab){
	console.log(status)
	if(status.windowId === windowId) {
			updatePresence("closed_tab");
			windowId = undefined
		}
}


chrome.webRequest.onBeforeSendHeaders.addListener(spoofHeader,  {urls: ["http://localhost:3000/*"]}, ["requestHeaders", "blocking"])
chrome.tabs.onUpdated.addListener(onTabUpdate);
chrome.tabs.onRemoved.addListener(onTabClose);