@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 台詞 JSON 匯出工具

if "%~1"=="" (
  echo.
  echo  請把「編輯器匯出的 JSON」拖到這個 bat 上，
  echo  或：匯出.bat "D:\完整路徑\booth_01_flow.json"
  echo.
  echo  注意：相對路徑是相對「本工具資料夾」，
  echo  檔案若在別處請用完整路徑或直接拖曳。
  echo.
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo [錯誤] 需要 Node.js：https://nodejs.org/
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo 首次使用，安裝套件中…
  call npm install
  if errorlevel 1 (
    echo [錯誤] npm install 失敗
    pause
    exit /b 1
  )
)

echo.
node src\cli.mjs "%~1"
echo.
echo 完成後請到本工具 exports 資料夾查看。
if exist "%~dp0exports\" explorer "%~dp0exports"
pause
