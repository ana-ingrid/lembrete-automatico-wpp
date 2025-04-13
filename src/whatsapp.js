const fs = require('fs');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Carregar os grupos do arquivo JSON
let gruposJson = [];
try {
  gruposJson = JSON.parse(fs.readFileSync('lembretes/grupos.json', 'utf8'));
} catch (error) {
  console.error('Erro ao carregar o arquivo grupos.json:', error);
}

// Iniciar o cliente WhatsApp Web
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Gerar QR code para autenticação
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

// Quando o cliente estiver pronto, vamos buscar os grupos e fazer a validação
client.on('ready', async () => {
  console.log('✅ WhatsApp pronto!');

  // Obter todos os chats (grupos e individuais)
  const chats = await client.getChats();

  // Filtrar apenas os chats que são grupos
  const gruposWhatsApp = chats.filter(chat => chat.isGroup);

  // Verificar se os grupos do JSON estão presentes nos grupos do WhatsApp
  gruposJson.forEach(grupoJson => {
    const grupoEncontrado = gruposWhatsApp.find(grupo => grupo.name.trim().toLowerCase() === grupoJson.grupo.trim().toLowerCase());

    if (grupoEncontrado) {
      console.log(`✅ Grupo "${grupoJson.grupo}" encontrado!`);
    } else {
      console.log(`❌ Grupo "${grupoJson.grupo}" NÃO encontrado.`);
    }
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
});
