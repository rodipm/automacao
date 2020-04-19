const Pool = require('pg').Pool;
const moment = require('moment');

const pool = new Pool({
    user: 'postgres',
    host: '189.33.225.4',
    // host: 'localhost',
    database: 'automacao',
    password: 'postgres',
    port: 5432,
});

const estacoes = [
    "total",
    "iluminacao",
    "servidor",
    "rede",
    "ar_cond",
    "bancadas"
];

function isEstacao(estacao) {
    return estacoes.includes(estacao)
}

const getMedLabprog = (dataInicio, dataFim, estacao) => {
    if (!estacao || !estacao.split(",").every(isEstacao))
        estacao = "*";
    else {
        estacao = "time, " + estacao;
    }

    return new Promise((resolve, reject) => {
        if (dataInicio && dataFim) {
            let dataInicioTratada = moment(dataInicio).format("YYYY-MM-DDTHH:mm:ss.SSSS[Z]");
            let dataFimTratada = moment(dataFim).format("YYYY-MM-DDTHH:mm:ss.SSSS[Z]");

            pool.query(`SELECT ${estacao} FROM public.med_labsoft WHERE time BETWEEN '${dataInicioTratada}' AND '${dataFimTratada}' ORDER BY time ASC`, (error, results) => {
                if (error) {
                    console.error(error);
                    return reject(error);
                }
                // console.log(results.rows);
                resolve(results.rows);
            })
        }
        else {
            pool.query(`SELECT ${estacao} FROM public.med_labsoft ORDER BY time DESC LIMIT 500`, (error, results) => {
                if (error) {
                    console.error(error)
                    return reject(error);
                }
                // console.log(results.rows);
                resolve(results.rows);
            })
        }
    });
};

/*
const getConsumoTotal = (dataInicio, dataFim, estacaoList) => {
    estacaoList = estacaoList ? estacaoList.split(",") : estacoes;
    let estacoes = estacaoList.map(estacao => 'SUM(' + estacao + ')')
    console.log(JSON.stringify(estacoes))
    
    return new Promise((resolve, reject) => {
        let dataInicioTratada = moment(dataInicio).format("YYYY-MM-DDTHH:mm:ss.SSSS[Z]");
        let dataFimTratada = moment(dataFim).format("YYYY-MM-DDTHH:mm:ss.SSSS[Z]");

        pool.query(`SELECT ${estacoes} FROM public.med_labsoft WHERE time BETWEEN '${dataInicioTratada}' AND '${dataFimTratada}' ORDER BY time ASC`, (error, results) => {
            if (error) {
                console.error(error);
                return reject(error);
            }
            // console.log(results.rows);
            resolve(results.rows);
        })
    });
};
*/

module.exports = { estacoes, getMedLabprog, /*getConsumoTotal*/ };
