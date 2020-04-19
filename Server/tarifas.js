var moment = require('moment');
const spawn = require("child_process").spawn;

const convencional = 0.516;

const diasUteis = [1, 2, 3, 4, 5];
const fimDeSemana = [0, 6];

const pegarValoresTarifaBranca = () => {
    return new Promise((resolve, reject) => {
        const pythonModel = spawn('python3', ['./TarifasWebScrapping/tarifas_web_scrapping.py']);
        pythonModel.stdout.on('data', (data) => {
            let valores = data.toString().split(",");
            branca = {};
            branca["ponta"] = parseFloat(valores[0]);
            branca["intermediario"] = parseFloat(valores[1]);
            branca["fora"] = parseFloat(valores[2]);
            resolve(branca);
        })
    })
}

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
    return new Promise((resolve, reject) => {
        pegarValoresTarifaBranca()
            .then(branca => {
                console.log(branca)
                let valorFinal = {};

                if (!medicoes)
                    resolve(valorFinal);


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
                resolve(valorFinal)
            });
    })
};

module.exports = { verificarTarifaBranca, calcularValor };