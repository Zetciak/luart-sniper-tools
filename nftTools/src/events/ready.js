// >> Modules
require('dotenv').config();

// >> Imports
const dbCon = require('../../dbConnect.js');
const dbPinger = require('./../otherFunctions/dbPinger.js');

// >> Functions
module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`[BOT]: Logged as ${client.user.tag}!`);
		client.user.setActivity('Zetty#0741', { type: 'LISTENING' });

		// Start other functions
		dbPinger.mainFunction(client);
	},
};
