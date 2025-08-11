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
        .addUserOption(option => option.setName('user').setDescription('User to DM').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Message').setRequired(true))
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('⏳ Registering slash commands...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log('✅ Slash commands registered.');
    } catch (error) {
        console.error(error);
    }
})();
