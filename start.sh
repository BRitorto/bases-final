#!/bin/bash
osascript <<END
tell app "Terminal"
    do script "cd \"`pwd`\"; docker-compose up"
end tell
END

sleep 15

python back/fill_dbs.py