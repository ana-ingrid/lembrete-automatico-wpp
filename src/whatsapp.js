const fs = require('fs');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let gruposJson = [];
try {
  gruposJson = JSON.parse(fs.readFileSync('lembretes/grupos.json', 'utf8'));
} catch (error) {
  console.error('Erro ao carregar o arquivo grupos.json:', error);
}

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  console.log('✅ WhatsApp pronto!');

  const chats = await client.getChats();
  const gruposWhatsApp = chats.filter(chat => chat.isGroup);

  gruposJson.forEach(grupoJson => {
    const grupoEncontrado = gruposWhatsApp.find(grupo => grupo.name.trim().toLowerCase() === grupoJson.grupo.trim().toLowerCase());

    if (grupoEncontrado) {
      console.log(`✅ Grupo "${grupoJson.grupo}" encontrado!`);
    } else {
      console.log(`❌ Grupo "${grupoJson.grupo}" NÃO encontrado.`);
    }
  });
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
