window.addEventListener("message", function (e) {
	//console.log(e.currentTarget.document.referrer);
	console.log('[CR Premium] Player encontrado!')

	var video_config_media = JSON.parse(e.data.video_config_media);
	var user_lang = e.data.lang;
	var video_stream_url = "";
	var video_id = video_config_media['metadata']['id'];
	var rows_number = 0;
	var video_m3u8_array = [];
	var video_m3u8 = "";
	var episode_title = "";
	var episode_translate = "";
	var series_title = "";
	var series_url = e.currentTarget.document.referrer;
	var is_ep_premium_only = null;
	var video_dash_playlist_url_old = "";
	var video_dash_playlist_url = "";

	if (user_lang == "enUS")
		var series_rss = "https://www.crunchyroll.com/" + series_url.split("/")[3] + ".rss";
	else
		var series_rss = "https://www.crunchyroll.com/" + series_url.split("/")[4] + ".rss";

	for (var i = 0; i < video_config_media['streams'].length; i++) {
		if (video_config_media['streams'][i].format == 'trailer_hls' && video_config_media['streams'][i].hardsub_lang == user_lang)
			if (rows_number <= 4) {
				const url = video_config_media['streams'][i].url.replace(/\/clipFrom.*?index.m3u8/, '').replace('_,', '_').replace(video_config_media['streams'][i].url.split("/")[2], "fy.v.vrv.co");
				video_m3u8_array.push(url);
				rows_number++;
			}
		if (video_config_media['streams'][i].format == 'adaptive_hls' && video_config_media['streams'][i].hardsub_lang == user_lang) {
			video_stream_url = video_config_media['streams'][i].url;
			break;
		}
	}

	is_ep_premium_only = video_stream_url == ""
	let allorigins = 'https://api.allorigins.win/get?url=';

	console.log('[CR Premium] Linkando stream...')
	$.ajax({
		async: true,
		type: "GET",
		url: allorigins + encodeURIComponent(series_rss),
		contentType: "text/xml; charset=utf-8",
		complete: response => {
			//Pega o titulo da serie
			series_title = $(response.responseXML).find("image").find("title").text();

			//Pega o numero e titulo do episodio
			langs = { "ptBR": "Episódio ", "enUS": "Episode ", "enGB": "Episode ", "esLA": "Episodio ", "esES": "Episodio ", "ptPT": "Episódio ", "frFR": "Épisode ", "deDE": "Folge ", "arME": "الحلقة ", "itIT": "Episodio ", "ruRU": "Серия " };
			episode_translate = langs[user_lang[0]] ? langs[user_lang[0]] : "Episode ";

			if (video_config_media['metadata']['up_next'] == undefined)
				episode_title = series_title + ' - ' + episode_translate + video_config_media['metadata']['display_episode_number'];
			else {
				var prox_ep_number = video_config_media['metadata']['up_next']['display_episode_number'];
				episode_title = video_config_media['metadata']['up_next']['series_title'] + ' - ' + prox_ep_number.replace(/\d+/g, '') + video_config_media['metadata']['display_episode_number'];
			}

			// Procura URLs
			const r = { 0: '720p', 1: '1080p', 2: '480p', 3: '360p', 4: '240p' };
			const u = {}, p1=[], p2= [], pM1 = [], pM2 = [], s = [];
			for (let i in r) p1[i] = new Promise((resolve, reject) => pM1[i] = { resolve, reject });
			for (let i in r) p2[i] = new Promise((resolve, reject) => pM2[i] = { resolve, reject });

			//function que pega algo dentro dentro do html.
			function pegaString(str, first_character, last_character) {
				if (str.match(first_character + "(.*?)" + last_character) == null) {
					return null;
				} else {
					new_str = str.match(first_character + "(.*?)" + last_character)[1].trim()
					return (new_str)
				}
			}

			//function que decodifica caracteres html de uma string
			function htmlDecode(input) {
				var e = document.createElement('textarea');
				e.innerHTML = input;
				// handle case of empty input
				return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
			}

			function addSource(url, id, n) {
				pM2[id].resolve();
				s[id] = 'empty';
			}

			function addSourceOld(url, id, needs_proxy) {
				var fileSize = "";
				var http = (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
				if (needs_proxy) final_url = allorigins + url;
				else final_url = url;

				http.onreadystatechange = xhr => {
					if (http.readyState == 4 && http.status == 200) {
						fileSize = http.getResponseHeader('content-length');
						if (!fileSize && !needs_proxy) {
							console.log('- Source', r[id], 'precisa de proxy...')
							addSource(url, id, true);
						} else {
							var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
							if (fileSize == 0) return pM2[id].reject('addSource#fileSize == 0');
							var i = parseInt(Math.floor(Math.log(fileSize) / Math.log(1024)));
							if (i == 0) return pM2[id].reject('addSource#i== 0');
							var return_fileSize = (fileSize / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];

							console.log(`[CR Premium] Adicionando source: ${r[id]} (${returnFileSize})`);
							pM2[id].resolve();
							s[id] = return_fileSize;
						}
					} else if (http.readyState == 4 && http.status===0) {
						console.log('- Source', r[id], 'precisa de proxy...')
						addSource(url, id, true);
					} else if (needs_proxy) {
						console.log('Falha ao encontrar com proxy', r[id]);
						return pM2[id].resolve('Falha com proxy')
					}
				}
				http.open("HEAD", final_url, true);
				http.send(null);
			}

			//Se o episodio não for apenas para premium pega as urls de um jeito mais facil
			if (is_ep_premium_only == false) {
				console.log('- Baixando stream')
				const video_m3u8_array = m3u8ListFromStream(allorigins + encodeURIComponent(video_stream_url));
				if (!video_m3u8_array.length)
					return;
				function linkDownload(id) {		
					console.log('- Baixando: ', r[id])
					var video_mp4_url = video_m3u8_array[id];
					u[id] = video_mp4_url;
					pM1[id].resolve();
				}

				for (id in r)
					linkDownload(id);
			}

			//Se o episodio for apenas para usuarios premium
			if (is_ep_premium_only == true) {
				function linkDownload(id) {
					console.log('- Baixando: ', r[id])
					var video_mp4_url = video_m3u8_array[id];

					function cb(result, status, xhr) {
						if (xhr.status !== 200)
							return setTimeout(() => linkDownload(id), 5000);
						u[id] = video_mp4_url;
						pM1[id].resolve();
					}

					$.ajax({
						async: true,
						type: "HEAD",
						url: video_mp4_url,
						success: cb
					});
				}

				for (id in r)
					linkDownload(id);
			}

			let sources = [];
			Promise.all(p1).then(() => {
				for (id in r)
					addSource(u[id], id, false);
				Promise.all(p2).then(() => {
					for (i of [1, 0, 2, 3, 4]) {
						const idx = i;
						p2[idx].then(msg => {
							if (msg) sources.push({ file: u[idx], label: r[idx] + '<sup><sup>Não encontrado</sup></sup>'})
							else sources.push({ file: u[idx], label: r[idx] + (idx<2 ? '<sup><sup>HD</sup></sup>' : '')})
						});
					}

					Promise.all(p2).then(() => startPlayer());
				})
			})

			function startPlayer() {
				// Inicia o player
				var playerInstance = jwplayer("player_div")
				playerInstance.setup({
					"title": episode_title,
					"description": video_config_media['metadata']['title'],
					"sources": sources,
					"image": video_config_media['thumbnail']['url'],
					"width": "100%",
					"height": "100%",
					"autostart": false,
					"displayPlaybackLabel": true,
					"primary": "html5"
				});

				//Variaveis para o botao de baixar.
				var button_iconPath = "assets/icon/download_icon.svg";
				var button_tooltipText = "Baixar Vídeo";
				var buttonId = "download-video-button";

				//funcion ao clicar no botao de fechar o menu de download
				document.querySelectorAll("button.close-modal")[0].onclick = () => {
					document.querySelectorAll(".modal")[0].style.visibility = "hidden";
				};

				//function ao clicar no botao de baixar
				function download_ButtonClickAction() {
					//Se estiver no mobile, muda um pouco o design do menu
					if (jwplayer().getEnvironment().OS.mobile == true) {
						document.querySelectorAll(".modal")[0].style.height = "170px";
						document.querySelectorAll(".modal")[0].style.overflow = "auto";
					}

					//Mostra o menu de download
					document.querySelectorAll(".modal")[0].style.visibility = "visible";
					return;
				}

				playerInstance.addButton(button_iconPath, button_tooltipText, () => download_ButtonClickAction(), buttonId);

				// Definir URL e Tamanho na lista de download
				for (let id in r) {
					document.getElementById(r[id] + "_down_url").href = u[id];
					//document.getElementById(r[id] + "_down_size").innerText = s[id];
				}

				//Funções para o player
				jwplayer().on('ready', e => {
					//Seta o tempo do video pro salvo no localStorage		
					if (localStorage.getItem(video_id) != null) {
						document.getElementsByTagName("video")[0].currentTime = localStorage.getItem(video_id);
					}
					document.body.querySelector(".loading_container").style.display = "none";
				});
				//Mostra uma tela de erro caso a legenda pedida não exista.
				jwplayer().on('error', e => {
					console.log(e)
					if (e.code == 232011) {
						jwplayer().load({
							file: "https://i.imgur.com/OufoM33.mp4"
						});
						jwplayer().setControls(false);
						jwplayer().setConfig({
							repeat: true
						});
						jwplayer().play();
					}
				});
				
				//Fica salvando o tempo do video a cada 5 segundos.
				setInterval(() => {
					if (jwplayer().getState() == "playing")
						localStorage.setItem(video_id, jwplayer().getPosition());
				}, 5000);
			}
		}
	});

	const rgx = /http.*$/gm;
	function m3u8ListFromStream(url) {
		console.log(url)
		m3u8list = []
		const m3u8 = $.ajax({
			async: false,
			type: "GET",
			url: url,
			responseType: 'json'
		}).responseJSON.contents;

		if (m3u8) {
			streams = m3u8.match(rgx)
			m3u8list = streams.filter((el, idx) => idx%2===0)
		} else 
			return [];
		
		const res = [];
		for (let m3u8_url of m3u8list) {
			const video_m3u8 = $.ajax({
				async: false,
				type: "GET",
				url: allorigins + encodeURIComponent(m3u8_url),
				responseType: 'json'
			}).responseJSON.contents;
			
			var blob = new Blob([video_m3u8], {
				type: "text/plain; charset=utf-8"
			});
			res.push(URL.createObjectURL(blob) + "#.m3u8");
		}

		return res;
	}
});