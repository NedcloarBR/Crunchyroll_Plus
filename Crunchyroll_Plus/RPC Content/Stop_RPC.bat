@echo off
cd ..
cd Server
echo Parando Crunchyroll Plus RPC
pm2 stop CrunchyrollPlusRPC
pm2 delete CrunchyrollPlusPC
echo Crunchyroll Plus RPC Parado!
pause