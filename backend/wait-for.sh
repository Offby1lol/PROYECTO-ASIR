#!/bin/sh

host="$1"
port="$2"
shift 2
cmd="$@"

while ! mysqladmin ping -h "$host" -P "$port" -u root -p0208 --silent; do
  >&2 echo "MySQL está inactivo - esperando..."
  sleep 2
done

>&2 echo "MySQL está activo - ejecutando comando"
exec $cmd