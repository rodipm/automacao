const tarifas = require('./tarifas');
var moment = require('moment');
const express = require('express');
const BodyParser = require('body-parser');
const pg = require('pg');
const spawn = require("child_process").spawn;
const db = require('./queries');
const mlModel = require('./mlmodel');
const cors = require('cors');

// Instancia do servidor
const app = express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ 'extended': true }));
app.use(cors());

app.post('/test-model', (req, res) => {
    const args = req.body.args;
    mlModel.useModel(args)
        .then((data) => res.send(data))
        .catch(console.error);
});

// Verifica em qual faixa da tarifa branca se encaixa
// Params: 
//      horario (formato YYYY-MM-DDTHH:mm:ss) - Caso nao seja enviado pega o horario atual
app.get('/tarifa-branca', (req, res) => {
    const horarioQuery = req.query.horario;
    let horario;

    if (horarioQuery)
        try {
            horario = moment(horarioQuery);
        } catch (error) {
            return res.status(500).send({ error: `Erro no formato do parametro horario. ${horarioQuery}` });
        }

    res.send(tarifas.verificarTarifaBranca(horario));
});

// Obtém as medicoes ao longo do tempo
// Params:
//      dataInicio (formato YYYY-MM-DDTHH:mm:ss)
//      dataFim (formato YYYY-MM-DDTHH:mm:ss)
//      estacao (iluminacao, servidor, rede, ar_cond, bancadas)
app.get('/medicoes', (req, res) => {
    db.getMedLabprog(req.query.dataInicio, req.query.dataFim, req.query.estacaoList)
        .then(medicoes => {
            let result = {}
            let estacaoList = req.query.estacaoList ? req.query.estacaoList.split(",") : db.estacoes;

            estacaoList.forEach(function(estacao) {
                result[estacao] = medicoes.map(medicao => {
                        return {
                            't': medicao.time,
                            'y': medicao[estacao],
                        }
                    })
            });

            res.send(result);
        })
        .catch(console.error);
});

// Obtém os valores calculados para o consumo ao longo do tempo
// Params:
//      dataInicio (formato YYYY-MM-DDTHH:mm:ss)
//      dataFim (formato YYYY-MM-DDTHH:mm:ss)
//      estacao (iluminacao, servidor, rede, ar_cond, bancadas)
app.get('/valor', (req, res) => {
    db.getMedLabprog(req.query.dataInicio, req.query.dataFim, req.query.estacao)
        .then(medicoes => {
            let valores = tarifas.calcularValor(medicoes);
            console.log(valores)
            res.send(valores);
        })
        .catch(console.error);
});

// Obtém os valores calculados para o consumo ao longo do tempo em cada tipo de tarifa
// Params:
//      dataInicio (formato YYYY-MM-DDTHH:mm:ss)
//      dataFim (formato YYYY-MM-DDTHH:mm:ss)
//      estacao (iluminacao, servidor, rede, ar_cond, bancadas)
// TODO
app.get('/valoresTarifas', (req, res) => {
    db.getMedLabprog(req.query.dataInicio, req.query.dataFim, req.query.estacaoList)
        .then(medicoes => {
            let estacaoList = req.query.estacaoList ? req.query.estacaoList.split(",") : db.estacoes;
            let valores = tarifas.calcularValor(medicoes);
            let consumo = 100;
            //db.getConsumoTotal(req.query.dataInicio, req.query.dataFim, req.query.estacaoList)

            let result = {
                'labels': estacaoList,
                'tarifa_branca': estacaoList.map(estacao => valores[estacao]),
                'tarifa_vermelha': estacaoList.map(estacao => valores[estacao]), //tarifas.custoBandeiraVermelha(consumo),
                'tarifa_amarela': estacaoList.map(estacao => valores[estacao]), //tarifas.custoBandeiraAmarela(consumo),
                'tarifa_verde': estacaoList.map(estacao => valores[estacao]), //tarifas.custoBandeiraVerde(consumo),
            }

            res.send(result);
        })
        .catch(console.error);
});

// Inicia o servidor
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => { console.log(`Server running on port ${PORT}`) })
