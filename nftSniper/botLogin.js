// >> Modules
const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

// >> Imports
const { dbCon } = require('./dbConnect.js');

// >> Bot startup
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_INVITES,
	],
});

client.commands = new Collection();
client.invites = new Collection();

const functions = fs
	.readdirSync('./src/functions')
	.filter((file) => file.endsWith('.js'));
const eventFiles = fs
	.readdirSync('./src/events')
	.filter((file) => file.endsWith('.js'));
const commandFolders = fs.readdirSync('./src/commands');

(async () => {
	for (files of functions) {
		require(`./src/functions/${files}`)(client);
	}
	client.handleEvents(eventFiles, './src/events');
	client.handleCommands(commandFolders, './src/commands');
	client.login(process.env.botToken);
})();
