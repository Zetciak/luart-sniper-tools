// >> Modules
require('dotenv').config();
const snekfetch = require('snekfetch');

// >> Imports
const dbCon = require('../../../dbConnect.js');
const cacheNfts = require('./../../otherFunctions/cacheCollection/cacheNfts.js');

// >> Variables
let zapytanie = '';
let zapytanie2 = '';

// >> Main function
function get(client, interaction, colName, colAddress) {
	snekfetch
		.get(
			`https://cdn.luart.io/mainnet/${colAddress}/nft-compact-metadata.json`
		)
		.then((response) => {
			let licz1 = 0;
			zapytanie = `CREATE TABLE \`nftSniper_${colName}\` (`;
			zapytanie = `${zapytanie}\`id\` int(11) NOT NULL AUTO_INCREMENT,`;
			zapytanie = `${zapytanie}\`imageURL\` text NOT NULL,`;
			zapytanie = `${zapytanie}\`name\` text NOT NULL,`;
			zapytanie = `${zapytanie}\`tokenId\` text NOT NULL,`;
			zapytanie = `${zapytanie}\`rarity\` float NOT NULL DEFAULT 0,`;
			zapytanie = `${zapytanie}\`rarityKolejnosc\` int(11) NOT NULL DEFAULT 0,`;
			for (const [key1, value1] of Object.entries(response.body)) {
				if (licz1 === 0) {
					licz1 = licz1 + 1;
					for (const [key2, value2] of Object.entries(
						value1.traits
					)) {
						zapytanie = `${zapytanie}\`trait_${key2}\` text NOT NULL,`;
					}
				}
			}
			zapytanie = `${zapytanie} PRIMARY KEY (\`id\`)) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4;`;

			licz1 = 0;
			let maxTraits = 0;
			for (const [key1, value1] of Object.entries(response.body)) {
				if (licz1 === 0) {
					licz1 = licz1 + 1;
					for (const [key2, value2] of Object.entries(
						value1.traits
					)) {
						maxTraits = maxTraits + 1;
					}
				}
			}

			licz1 = 0;
			let licz2 = 0;
			zapytanie2 = `INSERT INTO \`nftSniper_${colName}\` (`;
			zapytanie2 = `${zapytanie2}\`imageURL\`,`;
			zapytanie2 = `${zapytanie2}\`name\`,`;
			zapytanie2 = `${zapytanie2}\`tokenId\`,`;
			for (const [key1, value1] of Object.entries(response.body)) {
				if (licz1 === 0) {
					licz1 = licz1 + 1;
					for (const [key2, value2] of Object.entries(
						value1.traits
					)) {
						licz2 = licz2 + 1;
						if (licz2 === maxTraits) {
							zapytanie2 = `${zapytanie2}\`trait_${key2}\``;
						} else {
							zapytanie2 = `${zapytanie2}\`trait_${key2}\`,`;
						}
					}
				}
			}
			zapytanie2 = `${zapytanie2}) VALUES(`;
			// Create Table
			dbCon.query(
				`${zapytanie}`,
				//`SET NAMES 'utf8mb4';`,
				async function (error1, result1, fields1) {
					if (error1) {
						console.log(error1);
					} else {
						cacheNfts.set(
							client,
							interaction,
							colName,
							colAddress,
							response,
							zapytanie2,
							maxTraits
						);
					}
				}
			);
		});
}

module.exports = { get };
