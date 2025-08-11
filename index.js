const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'reply') {
        const site = interaction.options.getString('site');
        const message = interaction.options.getString('message');
        await interaction.reply(`📡 Sending to ${site}: ${message}`);
    }

    if (interaction.commandName === 'dm') {
        const user = interaction.options.getUser('user');
        const message = interaction.options.getString('message');
        try {
            await user.send(`💌 Message from ${interaction.user.username}: ${message}`);
            await interaction.reply(`✅ DM sent to ${user.tag}`);
        } catch {
            await interaction.reply(`❌ Could not DM ${user.tag}`);
        }
    }
});

client.login(process.env.TOKEN);
