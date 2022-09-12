// >> Modules
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();

// >> Imports
const dbCon = require('../../../dbConnect.js');
const getTraitsName = require('./../../otherFunctions/cacheCollection/getTraitsName.js');

// >> Function
module.exports = {
	data: new SlashCommandBuilder()
		.setName('cachecollection')
		.setDescription('📛 Cache collection into database (Owner)')
		.addStringOption((option) =>
			option
				.setName('collectionname')
				.setRequired(true)
				.setDescription("The collection name you'd like to cache")
		)
		.addStringOption((option) =>
			option
				.setName('collection')
				.setRequired(true)
				.setDescription("The collection you'd like to cache")
		),
	async execute(interaction, client) {
		if (
			interaction.member.roles.cache.some(
				(role) => role.id === process.env.ownerRole
			)
		) {
			let collectionAddress = interaction.options.getString('collection');
			let collectionName =
				interaction.options.getString('collectionname');
			if (collectionAddress.length === 44) {
				//Reply embed creation
				const replyEmbed = new MessageEmbed()
					.setColor('#3392ff')
					.setTitle('Information')
					.setDescription(`${collectionName} cache in progress...`)
					.setTimestamp()
					.setFooter({
						text: interaction.member.user.username,
						iconURL: interaction.member.user.displayAvatarURL(),
					});

				//Reply
				await interaction.reply({
					embeds: [replyEmbed],
				});

				//Call function
				getTraitsName.get(
					client,
					interaction,
					collectionName,
					collectionAddress
				);
			} else {
				//Reply embed creation
				const replyEmbed = new MessageEmbed()
					.setColor(process.env.text_permissions_error_color)
					.setTitle(process.env.text_permissions_error_title)
					.setDescription('Collection address incorrect!')
					.setTimestamp()
					.setFooter({
						text: interaction.member.user.username,
						iconURL: interaction.member.user.displayAvatarURL(),
					});

				//Reply
				await interaction.reply({
					embeds: [replyEmbed],
					ephemeral: true,
				});
			}
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
