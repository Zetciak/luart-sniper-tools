// >> Modules
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

// >> Imports
const dbCon = require('../../../dbConnect.js');
const cacheTraits = require('./../../otherFunctions/cacheTraits/cacheTraits.js');

// >> Function
module.exports = {
	data: new SlashCommandBuilder()
		.setName('cachetraits')
		.setDescription('📛 Cache traits into database (Owner)')
		.addStringOption((option) =>
			option
				.setName('collectionname')
				.setRequired(true)
				.setDescription("The collection name you'd like to cache")
		),
	async execute(interaction, client) {
		if (
			interaction.member.roles.cache.some(
				(role) => role.id === process.env.ownerRole
			)
		) {
			let collectionName =
				interaction.options.getString('collectionname');
			//Check is in database
			dbCon.query(
				`SELECT * FROM nftSniper_${collectionName}`,
				async function (err, result, fields) {
					if (err) {
						//Embed creation
						const embed = new MessageEmbed()
							.setColor(process.env.text_permissions_error_color)
							.setTitle(process.env.text_permissions_error_title)
							.setDescription(
								'There is no such collection in the database!'
							)
							.setTimestamp()
							.setFooter({
								text: interaction.member.user.username,
								iconURL:
									interaction.member.user.displayAvatarURL(),
							});

						//Reply
						await interaction.reply({
							embeds: [embed],
							ephemeral: true,
						});
					} else {
						if (result.length > 0) {
							//Reply embed creation
							const replyEmbed = new MessageEmbed()
								.setColor('#3392ff')
								.setTitle('Information')
								.setDescription(
									`${collectionName} traits cache in progress...`
								)
								.setTimestamp()
								.setFooter({
									text: interaction.member.user.username,
									iconURL:
										interaction.member.user.displayAvatarURL(),
								});

							//Reply
							await interaction.reply({
								embeds: [replyEmbed],
							});

							cacheTraits.cache(
								client,
								interaction,
								collectionName,
								result,
								fields
							);
						}
					}
				}
			);
		} else {
			//Embed creation
			const embed = new MessageEmbed()
				.setColor(process.env.text_permissions_error_color)
				.setTitle(process.env.text_permissions_error_title)
				.setDescription(process.env.text_permissions_error_desc)
				.setTimestamp()
				.setFooter({
					text: interaction.member.user.username,
					iconURL: interaction.member.user.displayAvatarURL(),
				});

			//Reply
			await interaction.reply({
				embeds: [embed],
				ephemeral: true,
			});
		}
	},
};
