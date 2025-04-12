const { client } = require("./whatsapp");
const { agendarLembretes } = require("./scheduler");

client.initialize();

client.on("ready", () => {
  agendarLembretes();
});


