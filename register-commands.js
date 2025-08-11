const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
        .setName('reply')
        .setDescription('Reply to a site with a message')
        .addStringOption(option => option.setName('site').setDescription('Site name').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Message').setRequired(true)),

    new SlashCommandBuilder()
        .setName('dm')
        .setDescription('Send a DM to a user')
        .addUserOption(option => option.setName('user').setDescription('User to DM').setRequired(false))
        .addStringOption(option => option.setName('userid').setDescription('User ID or mention (if no user selected)').setRequired(false))
        .addStringOption(option => option.setName('message').setDescription('Message to send').setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('⏳ Registering slash commands...');
const GUILD_ID = 'your_test_server_id_here'; // Replace with your Discord server ID
await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, GUILD_ID), // Guild commands for instant update
    { body: commands }
);

        console.log('✅ Slash commands registered.');
    } catch (error) {
        console.error(error);
    }
})();
