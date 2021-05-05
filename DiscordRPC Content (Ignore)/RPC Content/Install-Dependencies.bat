@echo off
cd ..
cd Server
echo Para Instalar o Crunchyroll Plus RPC, Você precisa do Node.JS e Git instalado em seu PC.
mkdir node_modules
npm install pm2 -g
npm install discord-rich-presence
echo Tudo deve funcionar agora, Abrir Start_RPC e a RichPresence deve iniciar!
pause
