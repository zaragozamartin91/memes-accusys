#!/bin/bash
docker run --rm --name memesacc-postgres -e POSTGRES_PASSWORD=root -e POSTGRES_USER=root -e POSTGRES_DB=memesacc -p 5432:5432 -d postgres
