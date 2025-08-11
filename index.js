const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: ['CHANNEL'], // Required to receive DM messages
});

// Minimal webserver to keep Railway container alive
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is alive!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Webserver running on port ${PORT}`);
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === 'reply') {
      const site = interaction.options.getString('site');
      const message = interaction.options.getString('message');
      await interaction.reply(`📡 Sending to ${site}: ${message}`);
    }

    if (interaction.commandName === 'dm') {
      let user = interaction.options.getUser('user');
      const userIdInput = interaction.options.getString('userid');
      const message = interaction.options.getString('message');

      if (!user) {
        if (!userIdInput) {
          return interaction.reply({ content: '❌ Please provide a user or user ID.', ephemeral: true });
        }
        const idMatch = userIdInput.match(/\d{17,19}/);
        if (!idMatch) {
          return interaction.reply({ content: '❌ Invalid user ID format.', ephemeral: true });
        }
        try {
          user = await interaction.client.users.fetch(idMatch[0]);
        } catch {
          return interaction.reply({ content: '❌ Could not find user with that ID.', ephemeral: true });
        }
      }

      try {
        await user.send(`💌 Message from ${interaction.user.tag}: ${message}`);
        await interaction.reply({ content: `✅ DM sent to ${user.tag}` });
      } catch {
        await interaction.reply({ content: `❌ Could not DM ${user.tag}` });
      }
    }

    if (interaction.commandName === 'test') {
      await interaction.reply('✅ Test command works!');
    }
  } catch (error) {
    console.error('Error handling interaction:', error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: '❌ There was an error executing this command.', ephemeral: true });
    } else {
      await interaction.reply({ content: '❌ There was an error executing this command.', ephemeral: true });
    }
  }
});

// Process exit and error logging
process.on('exit', (code) => {
  console.log(`Process exiting with code: ${code}`);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

client.login(process.env.TOKEN);
