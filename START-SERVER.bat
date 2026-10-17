@echo off
cd /d "%~dp0"
echo Starting ZeroWatt Wind at http://localhost:5500  (close this window to stop)
start "" cmd /c "timeout /t 2 >nul & start http://localhost:5500"
node serve.js
pause
