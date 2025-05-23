#!/usr/bin/bash
[ -d "$HOME/storage" ] || termux-setup-storage
pkg update && pkg upgrade -y
pkg install ffmpeg -y
pkg install wget -y
pkg install tesseract -y
pkg install git -y
pkg install build-essential -y
pkg install python -y
pkg install libjpeg-turbo libpng libwebp -y
pkg uninstall nodejs -y
pkg install nodejs-lts -y
clear
npm install --dev --force