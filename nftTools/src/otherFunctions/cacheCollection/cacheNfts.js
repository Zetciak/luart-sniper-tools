// >> Modules
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

// >> Imports
const dbCon = require('../../../dbConnect.js');

let testTable = new Array();

// >> Main function
function set(
	client,
	interaction,
	colName,
	colAddress,
	response,
	zapytanie2,
	maxTraits
) {
	let licz1 = 0;
	let liczExport = 0;
	let error = false;
	testTable = new Array();
	for (const [key1, value1] of Object.entries(response.body)) {
		licz1 = licz1 + 1;
		testTable[key1] = 0;
		value1.zapytanie = zapytanie2;
		value1.zapytanie = `${value1.zapytanie}"${value1.imageURL}", "${value1.name}", "${value1.tokenId}", `;
		for (const [key2, value2] of Object.entries(value1.traits)) {
			testTable[key1] = testTable[key1] + 1;
			if (testTable[key1] === maxTraits) {
				value1.zapytanie = `${value1.zapytanie}"${value2}"`;
			} else {
				value1.zapytanie = `${value1.zapytanie}"${value2}", `;
			}
		}
		value1.zapytanie = `${value1.zapytanie});`;
		value1.zapytanie = value1.zapytanie
			.replace('"",);', ');')
			.replace('"", );', ');');
		dbCon.query(
			`${value1.zapytanie}`,
			async function (error1, result1, fields1) {
				if (error1) {
					liczExport = liczExport + 1;
					console.log(error1);
					console.log(`${liczExport} ${colName} ERROR!!!!!!!!!!!`);
					console.log(`${value1.zapytanie}`);
					error = true;
				} else {
					liczExport = liczExport + 1;
					console.log(`${liczExport} ${colName} Exported!`);
					if (liczExport === licz1) {
						const interactionReply = await interaction.fetchReply();
						let newEmbed;

						if (error === true) {
							newEmbed = new MessageEmbed()
								.setColor('#f22222')
								.setTitle('Error!')
								.setDescription(`${colName} caching error!`)
								.setTimestamp()
								.setFooter({
									text: interaction.member.user.username,
									iconURL:
										interaction.member.user.displayAvatarURL(),
								});
						} else {
							newEmbed = new MessageEmbed()
								.setColor('#42f542')
								.setTitle('Success!')
								.setDescription(`${colName} cached!`)
								.setTimestamp()
								.setFooter({
									text: interaction.member.user.username,
									iconURL:
										interaction.member.user.displayAvatarURL(),
								});
						}

						//Reply
						interactionReply.reply({
							embeds: [newEmbed],
						});
					}
				}
			}
		);
	}
}

module.exports = { set };
