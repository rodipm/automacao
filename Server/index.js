const tarifas = require('./tarifas');
var moment = require('moment');
const express = require('express');
const BodyParser = require('body-parser');
const pg = require('pg');
const spawn = require("child_process").spawn;
const db = require('./queries');
const mlModel = require('./mlmodel');

// Instancia do servidor
const app = express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ 'extended': true }));

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
            horario = moment(`${horario.hour() - 3}:${horario.minutes()}`, "HH:mm");
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
    db.getMedLabprog(req.query.dataInicio, req.query.dataFim, req.query.estacao)
        .then(data => res.send(data))
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

// Inicia o servidor
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => { console.log(`Server running on port ${PORT}`) })