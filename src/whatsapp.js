const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  }
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ WhatsApp pronto!");
});

async function enviarMensagem(grupo, mensagem) {
  const chats = await client.getChats();
  const grupoChat = chats.find(c => c.isGroup && c.name === grupo);

  if (grupoChat) {
    await client.sendMessage(grupoChat.id._serialized, mensagem);
    console.log(`📨 Mensagem enviada para ${grupo}`);
  } else {
    console.log(`❌ Grupo "${grupo}" não encontrado.`);
  }
}

module.exports = { client, enviarMensagem };
