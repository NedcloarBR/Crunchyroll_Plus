@echo off
cd ..
cd Server
echo To install Crunchyroll Plus RPC, you need node.js and Git installed. If it is, just wait and let the magic do it's stuff.
mkdir node_modules
npm install pm2 -g
npm install discord-rich-presence
echo Everything should work now, just open start_rpc and you should be good to go.
pause
