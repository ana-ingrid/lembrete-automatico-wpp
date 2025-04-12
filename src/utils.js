const moment = require("moment");

function getProximaData(diaSemana, hora, frequencia, semanaInicial) {
  let data = moment().day(diaSemana).hour(hora.split(":")[0]).minute(hora.split(":")[1]).second(0);

  if (moment().isAfter(data)) {
    data.add(7, 'days');
  }

  if (frequencia === "quinzenal") {
    const semanasDesdeInicial = moment().diff(moment(semanaInicial), 'weeks');
    if (semanasDesdeInicial % 2 !== 0) {
      data.add(7, 'days');
    }
  }

  return data;
}

module.exports = { getProximaData };
