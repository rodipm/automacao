#!/bin/bash

docker build -t automacao-backend .
docker run -p 5000:5000 -it automacao-backend