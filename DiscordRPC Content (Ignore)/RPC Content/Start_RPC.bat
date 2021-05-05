@echo off
cd ..
cd Server
echo Iniciando Crunchyroll Plus RPC
pm2 start Root.js --name CrunchyrollPlusRPC
echo Crunchyroll Plus RPC Iniciado!
