@echo off
REM Change to the folder where this .bat file is located
cd /d "%~dp0"

REM Get the local IPv4 address (first one found)
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    set ip=%%a
    goto :found
)

:found
REM Trim spaces
set ip=%ip: =%

echo Starting Laravel on %ip%:8000 ...

php artisan serve --host=%ip% --port=8000

pause
