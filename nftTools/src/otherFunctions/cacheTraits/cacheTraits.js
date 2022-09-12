// >> Modules
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

// >> Imports
const dbCon = require('../../../dbConnect.js');

let traitsTable = new Array();
let liczExport = 0;
let maxTraits = 0;
let error = false;

// >> Main function
function cache(client, interaction, colName, result, fields) {
	traitsTable = new Array();
	for (let i = 0; i < fields.length; i++) {
		if (!fields[i].name.search('trait_')) {
			traitsTable[fields[i].name] = new Array();
		}
	}
	for (let i = 0; i < result.length; i++) {
		for (const [key, value] of Object.entries(result[i])) {
			if (traitsTable[key]) {
				if (traitsTable[key][value]) {
					traitsTable[key][value] = traitsTable[key][value] + 1;
				} else {
					traitsTable[key][value] = 1;
				}
			}
		}
	}
	// Create Table
	dbCon.query(
		`CREATE TABLE \`nftSniper_${colName}_Traits\` (\`id\` int(11) NOT NULL AUTO_INCREMENT, \`traitType\` text NOT NULL, \`traitName\` text NOT NULL, \`traitRarity\` float NOT NULL DEFAULT 0, \`traitRare\` int(1) NOT NULL DEFAULT 0, \`traitFloor\` float NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
		async function (error1, result1, fields1) {
			if (error1) {
				console.log(error1);
			} else {
				liczExport = 0;
				maxTraits = 0;
				error = false;
				for (const [key, value] of Object.entries(traitsTable)) {
					for (const [key2, value2] of Object.entries(value)) {
						maxTraits = maxTraits + 1;
					}
				}
				for (const [key, value] of Object.entries(traitsTable)) {
					for (const [key2, value2] of Object.entries(value)) {
						let rarity = ((value2 / result.length) * 100).toFixed(
							2
						);
						let rare = 0;
						if (Number(rarity) <= 0.5) {
							rare = 1;
						}
						dbCon.query(
							`INSERT INTO \`nftSniper_${colName}_Traits\` (\`traitType\`, \`traitName\`, \`traitRarity\`, \`traitRare\`) VALUES ("${key}", "${key2}", "${rarity}", "${rare}");`,
							async function (error2, result2, fields2) {
								if (error2) {
									liczExport = liczExport + 1;
									console.log(error2);
									console.log(
										`${liczExport} ${colName} ${key2} ERROR!!!!!`
									);
									error = true;
								} else {
									liczExport = liczExport + 1;
									console.log(
										`${liczExport} ${colName} ${key2} Exported!`
									);
									if (liczExport === maxTraits) {
										const interactionReply =
											await interaction.fetchReply();
										let newEmbed;

										if (error === true) {
											newEmbed = new MessageEmbed()
												.setColor('#f22222')
												.setTitle('Error!')
												.setDescription(
													`${colName} traits caching error!`
												)
												.setTimestamp()
												.setFooter({
													text: interaction.member
														.user.username,
													iconURL:
														interaction.member.user.displayAvatarURL(),
												});
										} else {
											newEmbed = new MessageEmbed()
												.setColor('#42f542')
												.setTitle('Success!')
												.setDescription(
													`${colName} traits cached!`
												)
												.setTimestamp()
												.setFooter({
													text: interaction.member
														.user.username,
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
			}
		}
	);
}

module.exports = { cache };
