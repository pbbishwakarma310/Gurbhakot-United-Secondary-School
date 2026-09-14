@echo off
title Gurbhakot United Secondary School - Local Server
echo Starting Local Web Server for Gurbhakot United Secondary School...
powershell -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"
pause
