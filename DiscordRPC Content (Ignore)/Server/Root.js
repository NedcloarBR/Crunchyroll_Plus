const http = require('http')
const client = require('discord-rich-presence')('760548730541310013');
const port = 3000

const requestHandler = (request, response) => {
  console.log(request.url)
var data = JSON.parse('{"' + decodeURI(request.url).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')["/?data"]
console.log(data)
if(data !== "closed_tab") {
client.updatePresence({
  details: data,
  largeImageKey: 'crunchyroll',
  instance: true,
});
} else {
	process.exit()
}
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('Something bad happened', err)
  }

  console.log(`Server is listening on ${port}`)
})





































// var cheerio = require('cheerio');
// const rp = require('request-promise')
 
// var options = {
//     uri: 'http://www.google.com',
//     transform: function (body) {
//         return cheerio.load(body);
//     }
// };


// const req = require('request');
// const cheerio = require('cheerio');

// req('https://www.crunchyroll.com/', (error, response, html) => {
//     if(!error && response.statusCode) {
//         const $ = cheerio.load(html)

//         const home = $('.premium-link-text')

//         console.log(home.html())
//     }
// })


// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;

// const dom = new JSDOM(``, {
//   url: "http://127.0.0.1:5500/Crunchyroll_Plus/popup.html",
// });

// //const serieName = dom.window.document.getElementById('meta[property="og:title"]')

// //console.log(serieName);

// const aaa = dom.window.document.querySelector("p").textContent

// console.log(aaa);



// const RPC = require("discord-rpc");
// const client = new RPC.Client({ 
//   transport: "ipc"
// });

// const clientId = "760548730541310013"

// const serieName = document.querySelector('meta[property="og:title"]');

// client.on("ready", () => {
//   client.setActivity({
//     details: "AAAAA",
//     state: "Hmmm",
//     startTimestamp: new Date(),
//     largeImageKey: "crunchyroll-rich",
//     largeImageText: "Crunchyroll Plus",
//     smallImageKey: "crunchyroll",
//     smallImageText: "Crunchyroll?"
//   });
//   console.log("DiscordRPC Activated")
// });

// client.login({
//   clientId: clientId
// });

// const http = require('http')
// const client = require('discord-rich-presence')('760548730541310013');
// const port = 3000

// const serieName= document.querySelector('meta[property="og:title"]');

// const requestHandler = (request, response) => {
//     console.log(request.url)
//   var data = JSON.parse('{"' + decodeURI(request.url).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')["/?data"]
//   console.log(data)
//   if(data !== "closed_tab") {
//     client.updatePresence({
//       state: "serieName",
//       details: data,
//       largeImageKey: 'crunchyroll',
//       instance: true,
//     });
//   } else {
//   	process.exit()
//   }
// }

// const server = http.createServer(requestHandler)

// server.listen(port, (err) => {
//   if (err) {
//     return console.log('[Crunchyroll Plus RPC]Algo ruim aconteceu', err)
//   }

//   console.log(`Server ligado a Porta: ${port}`)
// })