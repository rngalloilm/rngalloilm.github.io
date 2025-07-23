#!/bin/sh
set -e

host="$1"
shift
cmd="$@"

until nc -z -v -w30 "$host" 3306
do
  echo "Waiting for database connection..."
  sleep 5
done

>&2 echo "Database is up - executing command" 
exec $cmd