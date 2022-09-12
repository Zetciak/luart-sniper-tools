// >> Modules
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

// >> Imports
const dbCon = require('../../../dbConnect.js');

// >> Main function
function send(
	data,
	lunaPrice,
	collectionDBName,
	collectionName,
	collectionLogo,
	collectionAddress,
	channelId,
	globalClient
) {
	let tokenUSTPrice = 0;
	let tokenLunaPrice = 0;
	if (data[1].events[6].attributes[7].value === 'uluna') {
		tokenLunaPrice = convertPrice(data[1].events[6].attributes[6].value);
		tokenUSTPrice = convertPrice(
			data[1].events[6].attributes[6].value * lunaPrice
		);
	} else if (data[1].events[6].attributes[7].value === 'uusd') {
		tokenUSTPrice = convertPrice(data[1].events[6].attributes[6].value);
		tokenLunaPrice = convertPrice(
			data[1].events[6].attributes[6].value / lunaPrice
		);
	}

	//Check mistake
	if (tokenUSTPrice <= 10) {
		let tokenId = data[1].events[6].attributes[5].value;
		dbCon.query(
			`SELECT id FROM nftSniper_${collectionDBName}`,
			async function (error1, result1, fields1) {
				if (error1) {
					console.log(error1);
				} else {
					if (result1.length > 0) {
						dbCon.query(
							`SELECT * FROM nftSniper_${collectionDBName} WHERE tokenId="${tokenId}"`,
							async function (error, result, fields) {
								if (error) {
									console.log(error);
								} else {
									if (result.length > 0) {
										let countTraits = 0;
										let liczTraits = 0;
										let traits = '';
										for (const [
											key,
											value,
										] of Object.entries(result[0])) {
											if (!key.search('trait_')) {
												countTraits = countTraits + 1;
											}
										}
										for (const [
											key,
											value,
										] of Object.entries(result[0])) {
											if (!key.search('trait_')) {
												//Cache traits from db
												dbCon.query(
													`SELECT * FROM nftSniper_${collectionDBName}_Traits WHERE traitType="${key}" AND traitName="${value}" LIMIT 1`,
													async function (
														traitError,
														traitResult,
														traitFields
													) {
														if (traitError) {
															console.log(
																traitError
															);
														} else {
															if (
																traitResult.length >
																0
															) {
																liczTraits =
																	liczTraits +
																	1;
																if (
																	Number(
																		traitResult[0]
																			.traitRare
																	) === 1
																) {
																	traits = `${traits} **${key.replace(
																		'trait_',
																		''
																	)}:** \`🔥 ${value} (${
																		traitResult[0]
																			.traitRarity
																	}%) 🔥\`\n`;
																} else {
																	traits = `${traits} **${key.replace(
																		'trait_',
																		''
																	)}:** \`${value} (${
																		traitResult[0]
																			.traitRarity
																	}%)\`\n`;
																}
															}

															//Cached traits
															if (
																liczTraits ===
																countTraits
															) {
																let rarityProc =
																	(
																		(Number(
																			result[0]
																				.rarityKolejnosc
																		) /
																			Number(
																				result1.length
																			)) *
																		100
																	).toFixed(
																		2
																	);

																const embed =
																	new MessageEmbed()
																		.setColor(
																			'#fca103'
																		)
																		.setTitle(
																			result[0]
																				.name
																		)
																		.setURL(
																			`https://marketplace.luart.io/collections/${collectionAddress}/${tokenId}`
																		)
																		.setTimestamp()
																		.setImage(
																			result[0]
																				.imageURL
																		)
																		.setAuthor(
																			{
																				name: collectionName,
																				iconURL:
																					collectionLogo,
																				url: `https://marketplace.luart.io/collections/${collectionAddress}/${tokenId}`,
																			}
																		)
																		.setFooter(
																			{
																				text: collectionName,
																				iconURL:
																					collectionLogo,
																			}
																		)
																		.addFields(
																			{
																				name: '✨ Rarity',
																				value: `\`${rarityProc}% (${result[0].rarityKolejnosc}/${result1.length})\``,
																				inline: true,
																			},
																			{
																				name: '💸 Price',
																				value: `\`${tokenLunaPrice}$LUNA (${tokenUSTPrice}$UST)\``,
																				inline: true,
																			},
																			{
																				name: '⠀\n👕 Traits',
																				value: traits,
																				inline: false,
																			}
																		);
																const sendChannel =
																	await globalClient.channels.fetch(
																		channelId
																	);
																if (
																	sendChannel
																) {
																	await sendChannel.send(
																		{
																			content: `<@&${process.env.ustMistakes}>\nhttps://marketplace.luart.io/collections/${collectionAddress}/${tokenId}`,
																			embeds: [
																				embed,
																			],
																		}
																	);
																}
															}
														}
													}
												);
											}
										}
									}
								}
							}
						);
					}
				}
			}
		);
	}
}

//Converting price
function convertPrice(amount) {
	return Number(amount / 1000000).toFixed(2);
}
module.exports = { send };
