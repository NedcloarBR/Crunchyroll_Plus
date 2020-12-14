@echo off
cd ..
cd Server
echo Starting Crunchyroll Plus RPC
pm2 start Root.js --name CrunchyrollPlusRPC
echo Crunchyroll Plus RPC started.
pause