const http = require('http')
const client = require('discord-rich-presence')('760548730541310013');
const port = 3000

const requestHandler = (request, response) => {
    console.log(request.url)
  var data = JSON.parse('{"' + decodeURI(request.url).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')["/?data"]
  console.log(data)
  if(data !== "closed_tab") {
    client.updatePresence({
      state: 'Naruto Shippuden',
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
    return console.log('[Crunchyroll Plus RPC]Algo ruim aconteceu', err)
  }

  console.log(`Server ligado a Porta: ${port}`)
})