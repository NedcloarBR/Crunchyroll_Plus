@echo off
cd ..
cd Server
echo Stopping Crunchyroll Plus RPC
pm2 stop Crunchyroll Plus RPC
pm2 delete Crunchyroll Plus RPC
echo Crunchyroll Plus RPC stopped.
pause