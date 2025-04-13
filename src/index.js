const { client } = require("./whatsapp");
const { agendarLembretes } = require("./scheduler");

client.initialize();

client.on("ready", () => {
  console.log("🤖 Cliente pronto no index.js");
  agendarLembretes();
});
