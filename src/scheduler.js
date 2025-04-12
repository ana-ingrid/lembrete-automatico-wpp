const cron = require("node-cron");
const moment = require("moment");
const { enviarMensagem } = require("./whatsapp");
const { getProximaData } = require("./utils");
const lembretes = require("../lembretes/grupos.json");

function agendarLembretes() {
  lembretes.forEach(({ grupo, diaSemana, hora, frequencia, semanaInicial }) => {
    const proximaData = getProximaData(diaSemana, hora, frequencia, semanaInicial);

    // Lembrete 1 dia antes
    const dataLembrete1 = moment(proximaData).subtract(1, 'day');
    const cronLembrete1 = dataLembrete1.format("m H D M d");
    cron.schedule(cronLembrete1, () => {
      enviarMensagem(grupo, `📢 Reunião marcada para amanhã às ${hora}. Todas confirmadas?`);
    });

    // Lembrete 3 horas antes
    const dataLembrete2 = moment(proximaData).subtract(3, 'hours');
    const cronLembrete2 = dataLembrete2.format("m H D M d");
    cron.schedule(cronLembrete2, () => {
      enviarMensagem(grupo, `⏰ Lembrete: reunião hoje às ${hora}.`);
    });
  });
}

module.exports = { agendarLembretes };

