#!/bin/sh
# This sctips ssumes localhost:3001
set -eu

SITE="http://localhost:3001"

npm run build 
npm run start &
PID=$!
PGID=$(ps axjf --sort=-pid | egrep $PID | head -1 | tr -s - " "  | cut -d " " -f 3)
echo "PGID: $PGID"
echo "$PGID" > .lock.pgid
echo "Application is staring with PID: $PID"
until $(curl --output /dev/null --silent --head --fail $SITE); do
   printf '.'
   sleep 1
done
set +e
cypress $1
EXIT_CODE=$?
set -e
echo "Killing app"
pkill --pgroup $PGID
exit $EXIT_CODE