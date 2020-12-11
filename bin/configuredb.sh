#!/usr/bin/env bash

export PGPASSWORD='Gj5ZQ8P7$!L*qy9!~AMT#E8J6q<(@d'

database="coverClubDB"

echo "Configuring database: $database"

dropdb -U spruce_admin coverClubDB
createdb -U spruce_admin coverClubDB

psql -U spruce_admin coverClubDB < ./bin/sql/coverClubDB.sql

echo "$database configured"
