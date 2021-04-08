var HTML = document.documentElement.innerHTML;

// Function que pega algo dentro dentro do html.
function pegaString(str, first_character, last_character) {
	if(str.match(first_character + "(.*)" + last_character) == null){
		return null;
	}else{
	    new_str = str.match(first_character + "(.*)" + last_character)[1].trim()
	    return(new_str)
    }
}
// Function que mudar o player para um mais simples.
function importPlayer(){
		console.log("[Crunchyroll Plus] Removendo player da Crunchyroll...");
		var elem = document.getElementById('showmedia_video_player');
    	elem.parentNode.removeChild(elem);

		console.log("[Crunchyroll Plus] Pegando dados da stream...");
		var video_config_media = JSON.parse(pegaString(HTML, "vilos.config.media = ", ";"));

    	console.log("[Crunchyroll Plus] Adicionando o jwplayer...");
    	ifrm = document.createElement("iframe");
    	ifrm.setAttribute("id", "frame"); 
		ifrm.setAttribute("src", "https://NedcloarBR.github.io/Crunchyroll_Plus/"); 
		ifrm.setAttribute("width","100%");
		ifrm.setAttribute("height","100%");
		ifrm.setAttribute("frameborder","0");
		ifrm.setAttribute("scrolling","no");
		ifrm.setAttribute("allowfullscreen","allowfullscreen");
		ifrm.setAttribute("allow","autoplay; encrypted-media *");

		if(document.body.querySelector("#showmedia_video_box") != null){
			document.body.querySelector("#showmedia_video_box").appendChild(ifrm);
		}else{
			document.body.querySelector("#showmedia_video_box_wide").appendChild(ifrm);
		}

		// Remove Nota do topo sobre experimentar o premium
		if (document.body.querySelector(".freetrial-note") != null) {
			console.log("[Crunchyroll Plus] Removendo Free Trial Note...");
			document.body.querySelector(".freetrial-note").style.display = "none";
		}

		// Remove avisos que o video não pode ser visto
		if(document.body.querySelector(".showmedia-trailer-notice") != null){
			console.log("[Crunchyroll Plus] Removendo Trailer Notice...");
			document.body.querySelector(".showmedia-trailer-notice").style.display = "none";
		}

		// Remove sugestão de inscrever-se para o trial gratuito
		if(document.body.querySelector("#showmedia_free_trial_signup") != null){
			console.log("[Crunchyroll Plus] Removendo Free Trial Signup...");
			document.body.querySelector("#showmedia_free_trial_signup").style.display = "none";
		}

		// Simular interação do usuário para deixar em fullscreen automaticamente
		var element = document.getElementById("template_scroller");
		if (element) element.click();

		const series = document.querySelector('meta[property="og:title"]');
		const up_next = document.querySelector('link[rel=next]');
		chrome.storage.sync.get(['darkmode', 'aseguir', 'cooldown'], function(items) {
			ifrm.onload = function(){
				ifrm.contentWindow.postMessage({
           			'video_config_media': [JSON.stringify(video_config_media)],
				   	'lang': [pegaString(HTML, 'LOCALE = "', '",')],
				   	'series': series ? series.content : undefined,
				   	'up_next': up_next ? up_next.href : undefined,
				   	'up_next_cooldown': items.cooldown === undefined ? 5 : items.cooldown,
				   	'up_next_enable': items.aseguir === undefined ? true : items.aseguir,
					'darkmode': items.darkmode === undefined ? true : items.darkmode,
				   	'version': "1.0.4"
        		},"*");
			};
		});

		//console.log(video_config_media);
}
// Function ao carregar pagina.
function onloadfunction() {
	if(pegaString(HTML, "vilos.config.media = ", ";") != null){
		importPlayer();
	}
}
document.addEventListener("DOMContentLoaded", onloadfunction());
