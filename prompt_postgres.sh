#!/bin/bash
docker run -it --rm --link memesacc-postgres:postgres postgres psql -h postgres -U root memesacc
