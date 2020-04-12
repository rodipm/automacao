# Implementação back-end projeto automação

Utiliza um container docker para hospedar o servidor em Node.js (utilizando o framework Express) e o modelo de machine learning em python no mesmo ambiente.

Hospedado (gratuitamente) no Azure: https://automacao-backend.azurewebsites.net

A pasta "scripts" contém shell-scripts uteis para buildar e publicar o container, assim como testa-lo localmente

# Endpoints

## /tarifa-branca

Verifica em qual faixa da tarifa branca se encaixa

+ Params: 
    + horario (formato YYYY-MM-DDTHH:mm:ss) - Caso nao seja enviado pega o horario atual

+ Exemplos
```
    $ curl -q 'https://automacao-backend.azurewebsites.net/tarifa-branca?horario=2020-03-19T18:00:00'
    $ ponta
```

## /medicoes

Obtém as medicoes ao longo do tempo

+ Params:
    + dataInicio (formato YYYY-MM-DDTHH:mm:ss)
    + dataFim (formato YYYY-MM-DDTHH:mm:ss)
    + estacao (iluminacao, servidor, rede, ar_cond, bancadas) - Caso nao seja enviado pega todas as estacoes

+ Exemplos
```
$ curl -q 'https://automacao-backend.azurewebsites.net/medicoes?dataInicio=2020-03-19T10:00:00&dataFim=2020-03-19T10:00:10&estacao=rede'
$ [{"time":"2020-03-19T10:00:00.682Z","rede":144},{"time":"2020-03-19T10:00:01.733Z","rede":143},{"time":"2020-03-19T10:00:02.784Z","rede":144},{"time":"2020-03-19T10:00:03.894Z","rede":144},{"time":"2020-03-19T10:00:04.946Z","rede":146},{"time":"2020-03-19T10:00:05.998Z","rede":144},{"time":"2020-03-19T10:00:07.051Z","rede":151},{"time":"2020-03-19T10:00:08.103Z","rede":152},{"time":"2020-03-19T10:00:09.154Z","rede":145}]
```

## /valor

Obtém os valores calculados para o consumo ao longo do tempo

+ Params:
    + dataInicio (formato YYYY-MM-DDTHH:mm:ss)
    + dataFim (formato YYYY-MM-DDTHH:mm:ss)
    + estacao (iluminacao, servidor, rede, ar_cond, bancadas) - Caso nao seja enviado pega todas as estacoes

+ Exemplos
```
$ curl -q 'https://automacao-backend.azurewebsites.net/valor?dataInicio=2020-03-19T10:00:00&dataFim=2020-03-19T10:00:10&estacao=rede'
$ {"rede":0.00015938361111111113}

$ curl -q 'https://automacao-backend.azurewebsites.net/valor?dataInicio=2020-03-19T10:00:00&dataFim=2020-03-19T10:00:10'
$ {"total":0.0003807969444444445,"iluminacao":0,"servidor":0.00006773500000000001,"rede":0.00015938361111111113,"ar_cond":0.00000437,"bancadas":0.00014930833333333334}
```