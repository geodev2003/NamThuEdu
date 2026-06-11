@echo off
"C:\Program Files\MySQL\MySQL Server 9.4\bin\mysql.exe" -u root -p1001 namthuedu_test < _schema2.sql
echo IMPORT_EXIT=%ERRORLEVEL%
