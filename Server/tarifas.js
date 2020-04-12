var moment = require('moment');

const convencional = 0.516;

const branca = {
    "ponta": 0.961,
    "intermediario": 0.617,
    "fora": 0.437
};

const diasUteis = [1, 2, 3, 4, 5];
const fimDeSemana = [0, 6];


const verificarTarifaBranca = (horario) => {
    const periodoPonta = [moment('17:30', 'HH:mm'), moment('20:30', 'HH:mm')];
    const periodoIntermediario = [moment('16:30', 'HH:mm'), moment('21:30', 'HH:mm')];
    let horarioTratado;
    if (!horario)
        horarioTratado = moment().format('HH:mm');

    horarioTratado = moment(`${horario.hour() + 3}:${horario.minutes()}`, "HH:mm");
    if (horarioTratado >= periodoPonta[0] && horarioTratado <= periodoPonta[1])
        return "ponta"
    else if (horarioTratado >= periodoIntermediario[0] && horarioTratado <= periodoIntermediario[1])
        return "intermediario"
    else
        return "fora"

}

const calcularValor = (medicoes) => {
    let valorFinal = {};

    if (!medicoes)
        return valorFinal;


    for (let medicao of medicoes) {
        let tipoTarifa = verificarTarifaBranca(moment(medicao.time));
        for (let key of Object.keys(medicao)) {
            if (key == "time")
                continue;
            let valor = (medicao[key] * (1 / (60 * 60))) / 1000 * branca[tipoTarifa]; //kwh * tarifa
            if (valorFinal[key] == undefined)
                valorFinal[key] = 0;
            valorFinal[key] += valor;
        }
    }
    return (valorFinal)
};

module.exports = { verificarTarifaBranca, calcularValor };