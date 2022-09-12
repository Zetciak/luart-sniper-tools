// >> Modules
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

// >> Imports
const dbCon = require('../../../dbConnect.js');

let rarityTable = new Array();
let rarityKolejnosc = new Array();
let error = false;
let numtraits = 0;
let jakieslicz = 0;
let liczonko = 0;

// >> Main function
function cache(client, interaction, colName, result, fields) {
	rarityTable = new Array();
	rarityKolejnosc = new Array();
	error = false;
	numtraits = 0;
	jakieslicz = 0;
	liczonko = 0;
	for (const [key, value] of Object.entries(result[0])) {
		if (!key.search('trait_')) {
			numtraits = numtraits + 1;
		}
	}
	for (let i = 0; i < result.length; i++) {
		rarityTable[result[i].tokenId] = 0;
		result[i].traitnum = 0;
		for (const [key, value] of Object.entries(result[i])) {
			if (!key.search('trait_')) {
				dbCon.query(
					`SELECT traitRarity FROM nftSniper_${colName}_Traits WHERE traitName="${value}" AND traitType="${key}" LIMIT 1`,
					async function (err1, result1, fields1) {
						if (err1) {
							console.log(err1);
							error = true;
						} else {
							if (result1.length > 0) {
								result[i].traitnum = result[i].traitnum + 1;
								rarityTable[result[i].tokenId] =
									rarityTable[result[i].tokenId] +
									100 / Number(result1[0].traitRarity);
								if (result[i].traitnum === numtraits) {
									console.log(
										`${result[i].tokenId} rarity cached: ${
											rarityTable[result[i].tokenId]
										}!`
									);
									if (i === result.length - 1) {
										//pętla i export all do db
										for (const [
											key3,
											value3,
										] of Object.entries(rarityTable)) {
											jakieslicz = jakieslicz + 1;
											rarityKolejnosc[key3] = 1;
											for (const [
												key4,
												value4,
											] of Object.entries(rarityTable)) {
												if (value4 > value3) {
													rarityKolejnosc[key3] =
														rarityKolejnosc[key3] +
														1;
												}
											}
											dbCon.query(
												`UPDATE nftSniper_${colName} SET rarity="${value3}", rarityKolejnosc="${rarityKolejnosc[key3]}" WHERE tokenId="${key3}";`,
												async function (
													err5,
													result5,
													fields5
												) {
													if (err5) {
														console.log(err5);
														error = true;
													} else {
														liczonko = liczonko + 1;
														console.log(
															`${key3} rarity cached to db: ${value3} (${rarityKolejnosc[key3]}/${result.length})!`
														);
														if (
															liczonko ===
															result.length
														) {
															// rarity cached
															const interactionReply =
																await interaction.fetchReply();
															let newEmbed;

															if (
																error === true
															) {
																newEmbed =
																	new MessageEmbed()
																		.setColor(
																			'#f22222'
																		)
																		.setTitle(
																			'Error!'
																		)
																		.setDescription(
																			`${colName} rarity caching error!`
																		)
																		.setTimestamp()
																		.setFooter(
																			{
																				text: interaction
																					.member
																					.user
																					.username,
																				iconURL:
																					interaction.member.user.displayAvatarURL(),
																			}
																		);
															} else {
																newEmbed =
																	new MessageEmbed()
																		.setColor(
																			'#42f542'
																		)
																		.setTitle(
																			'Success!'
																		)
																		.setDescription(
																			`${colName} rarity cached!`
																		)
																		.setTimestamp()
																		.setFooter(
																			{
																				text: interaction
																					.member
																					.user
																					.username,
																				iconURL:
																					interaction.member.user.displayAvatarURL(),
																			}
																		);
															}

															//Reply
															interactionReply.reply(
																{
																	embeds: [
																		newEmbed,
																	],
																}
															);
														}
													}
												}
											);
										}
									}
								}
							} else {
								error = true;
							}
						}
					}
				);
			}
		}
	}
}

module.exports = { cache };
