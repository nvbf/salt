#!/bin/sh
# This scripts assumes localhost:3001

SITE="http://localhost:3001"
CYPRESS_ARGUMENT="$1"

if [ -z $CYPRESS_ARGUMENT ]; then
    echo "Please provide an argument to cypress to run. e.g run or open or another valid cypress command"
    exit 2
fi
NODE_ENV="production" npm run build 
NODE_ENV="production" npm run start &
PID=$!
PGID=$(ps axjf --sort=-pid | egrep $PID | head -1 | tr -s - " "  | cut -d " " -f 3)
echo "PGID: $PGID"
echo "$PGID" > .lock.pgid
echo "Application is staring with PID: $PID"
until $(curl --output /dev/null --silent --head --fail $SITE); do
   printf '.'
   sleep 1
done
cypress $1
EXIT_CODE=$?
echo "Killing app"
pkill --pgroup $PGID
exit $EXIT_CODE