#!/bin/bash

# curl -q -X POST https://automacao-backend.azurewebsites.net/test-model \
# curl -q -X POST http://localhost:5000/test-model \
# -H 'Content-Type: application/json; charset=utf-8' \
# --data-binary @- << EOF
# {
#   "args": ["arg1", "arg2", "arg3"]
# }
# EOF

# curl -q 'http://localhost:5000/medicoes?dataInicio=2020-03-19T10:00:00&dataFim=2020-03-19T10:00:10&estacao=rede'
# curl -q 'http://localhost:5000/valor?dataInicio=2020-03-19T10:00:00&dataFim=2020-03-19T10:00:10&estacao=rede'
curl -q 'http://localhost:5000/valor?dataInicio=2020-03-19T10:00:00&dataFim=2020-03-19T10:00:10'
# curl -q 'http://localhost:5000/tarifa-branca?horario=2020-03-19T18:00:00'