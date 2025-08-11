const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: ['CHANNEL'] // Needed to receive DMs
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
        let user = interaction.options.getUser('user');
        const userIdInput = interaction.options.getString('userid');
        const message = interaction.options.getString('message');

        // If no user selected, try to fetch from userid input
        if (!user) {
            if (!userIdInput) {
                return interaction.reply({ content: '❌ Please provide a user or user ID.', ephemeral: true });
            }
            // Extract ID from mention or plain ID
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
});

client.login(process.env.TOKEN);
