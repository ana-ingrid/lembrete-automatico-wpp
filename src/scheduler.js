const { enviarMensagem } = require("./whatsapp");
const moment = require("moment");
const { getProximaData } = require("./utils");
const lembretes = require("../lembretes/grupos.json");

function agendarLembretes() {
  lembretes.forEach(({ grupo, diaSemana, hora, frequencia, semanaInicial }) => {
    const proximaData = getProximaData(diaSemana, hora, frequencia, semanaInicial);

    // Lembrete 1 dia antes
    const dataLembrete1 = moment(proximaData).subtract(1, "day");
    const msAteLembrete1 = dataLembrete1.diff(moment());

    if (msAteLembrete1 > 0) {
      setTimeout(() => {
        enviarMensagem(grupo, `📢 Reunião marcada para amanhã às ${hora}. Todas confirmadas?`);
      }, msAteLembrete1);
    }

    // Lembrete 3 horas antes
    const dataLembrete2 = moment(proximaData).subtract(3, "hours");
    const msAteLembrete2 = dataLembrete2.diff(moment());

    if (msAteLembrete2 > 0) {
      setTimeout(() => {
        enviarMensagem(grupo, `⏰ Lembrete: reunião hoje às ${hora}.`);
      }, msAteLembrete2);
    }

    console.log(`📅 Lembretes agendados para o grupo "${grupo}" em ${proximaData.format("DD/MM/YYYY HH:mm")}`);
  });
}

module.exports = { agendarLembretes };
