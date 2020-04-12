#!/bin/bash

docker login automacaobackend.azurecr.io --username automacaobackend -p r3B=JrbGykgRTREp13NOLDRlk8Wx9fuT
docker build -t automacaobackend.azurecr.io/automacao-backend:latest .
docker push automacaobackend.azurecr.io/automacao-backend:latest