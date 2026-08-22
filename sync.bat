@echo off
:loop
echo Pushing to Dayflow repo...
git add .
git commit -m "sync: auto push %date% %time%"
git push origin main
git push aradhya main --force
echo Done. Waiting 1 hour...
timeout /t 3600
goto loop
