var moment = require('moment');
const spawn = require("child_process").spawn;

const convencional = 0.516;
const bandeiraVermelha = 0.00417;
const bandeiraAmarela = 0.00135;
const bandeiraVerde = 0.0;

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
    let horarioTratado = horario ? horario : moment();

    horarioTratado = moment(`${horarioTratado.hour()}:${horarioTratado.minutes()}`, "HH:mm");

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
                let valorFinal = {};

                if (!medicoes)
                    resolve(valorFinal);

                for (let medicao of medicoes) {
                    let tipoTarifa = verificarTarifaBranca(moment(medicao.time).utcOffset(0));

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

const consumoTotal = (medicoes) => {
    let valorFinal = {};

    if (!medicoes)
        resolve(valorFinal);

    for (let medicao of medicoes) {
        for (let key of Object.keys(medicao)) {
            if (key == "time")
                continue;

            if (valorFinal[key] == undefined)
                valorFinal[key] = 0;

            valorFinal[key] += medicao[key];
        }
    }
    
    return valorFinal;
}

const custoBandeiraVermelha = (medicoes) => (convencional + bandeiraVermelha) * medicoes / 3600000;
const custoBandeiraAmarela = (medicoes) => (convencional + bandeiraAmarela) * medicoes / 3600000;
const custoBandeiraVerde = (medicoes) => (convencional + bandeiraVerde) * medicoes / 3600000;

module.exports = { verificarTarifaBranca, calcularValor, consumoTotal, custoBandeiraVermelha, custoBandeiraAmarela, custoBandeiraVerde };