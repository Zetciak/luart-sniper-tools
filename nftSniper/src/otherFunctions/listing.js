// >> Modules
require('dotenv').config();
const snekfetch = require('snekfetch');
const { WebSocketClient } = require('@terra-money/terra.js');

// >> Imports
const skeletonPunks = require('./skeletonPunks/mainFunction.js');
const genesisWolves = require('./genesisWolves/mainFunction.js');
const hellCats = require('./hellCats/mainFunction.js');
const lunita = require('./lunita/mainFunction.js');
const globalSectionFunctions = require('./globalSection/mainFunction.js');
const dbCon = require('../../dbConnect.js');
let events = 0;

// >> Variables
let globalClient;
const api = `https://api.coingecko.com/api/v3/coins/terra-luna?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
const refreshTime = 1000 * 60; // 1 minute
let countRefreshTraits = 1;
let lunaPrice = 0;
let firstTime = true;
let firstTime2 = true;
let collections = new Array();
collections[process.env.skeletonPunksAddress] = skeletonPunks;
collections[process.env.genesisWolvesAddress] = genesisWolves;
collections[process.env.hellCatsAddress] = hellCats;
collections[process.env.lunitaAddress] = lunita;

let globalSection = new Array();
globalSection[process.env.skeletonPunksAddress] = [
	{
		address: process.env.skeletonPunksAddress,
		logo: process.env.skeletonPunksLogo,
		dbName: process.env.skeletonPunksDBName,
		name: process.env.skeletonPunksName,
		floor: 0,
		traitsFloor: new Array(),
		floorChannel: '963790337749422110',
		floorChannelName: 'SP: 💀┇',
	},
];
globalSection[process.env.hellCatsAddress] = [
	{
		address: process.env.hellCatsAddress,
		logo: process.env.hellCatsLogo,
		dbName: process.env.hellCatsDBName,
		name: process.env.hellCatsName,
		floor: 0,
		traitsFloor: new Array(),
		floorChannel: '963790745720987698',
		floorChannelName: 'HC: 🐱┇',
	},
];
globalSection[process.env.lunaBullsAddress] = [
	{
		address: process.env.lunaBullsAddress,
		logo: process.env.lunaBullsLogo,
		dbName: process.env.lunaBullsDBName,
		name: process.env.lunaBullsName,
		floor: 0,
		traitsFloor: new Array(),
		floorChannel: '963793228392448010',
		floorChannelName: 'LB: 🐮┇',
	},
];
globalSection[process.env.rektWolfAddress] = [
	{
		address: process.env.rektWolfAddress,
		logo: process.env.rektWolfLogo,
		dbName: process.env.rektWolfDBName,
		name: process.env.rektWolfName,
		floor: 0,
		traitsFloor: new Array(),
		floorChannel: '963793329177370664',
		floorChannelName: 'RW: 🐶┇',
	},
];
globalSection[process.env.dystopAiAddress] = [
	{
		address: process.env.dystopAiAddress,
		logo: process.env.dystopAiLogo,
		dbName: process.env.dystopAiDBName,
		name: process.env.dystopAiName,
		floor: 0,
		traitsFloor: new Array(),
	},
];
globalSection[process.env.genesisWolvesAddress] = [
	{
		address: process.env.genesisWolvesAddress,
		logo: process.env.genesisWolvesLogo,
		dbName: process.env.genesisWolvesDBName,
		name: process.env.genesisWolvesName,
		floor: 0,
		traitsFloor: new Array(),
		floorChannel: '963790642335612988',
		floorChannelName: 'GW: 🐺┇',
	},
];
globalSection[process.env.luniLandAddress] = [
	{
		address: process.env.luniLandAddress,
		logo: process.env.luniLandLogo,
		dbName: process.env.luniLandDBName,
		name: process.env.luniLandName,
		floor: 0,
		traitsFloor: new Array(),
	},
];
globalSection[process.env.luniLandPlotsAddress] = [
	{
		address: process.env.luniLandPlotsAddress,
		logo: process.env.luniLandPlotsLogo,
		dbName: process.env.luniLandPlotsDBName,
		name: process.env.luniLandPlotsName,
		floor: 0,
		traitsFloor: new Array(),
	},
];
globalSection[process.env.astroHeroesAddress] = [
	{
		address: process.env.astroHeroesAddress,
		logo: process.env.astroHeroesLogo,
		dbName: process.env.astroHeroesDBName,
		name: process.env.astroHeroesName,
		floor: 0,
		traitsFloor: new Array(),
	},
];
globalSection[process.env.artsyApesAddress] = [
	{
		address: process.env.artsyApesAddress,
		logo: process.env.artsyApesLogo,
		dbName: process.env.artsyApesDBName,
		name: process.env.artsyApesName,
		floor: 0,
		traitsFloor: new Array(),
	},
];

globalSection[process.env.lunitaAddress] = [
	{
		address: process.env.lunitaAddress,
		logo: process.env.lunitaLogo,
		dbName: process.env.lunitaDBName,
		name: process.env.lunitaName,
		floor: 0,
		traitsFloor: new Array(),
		floorChannel: '964154472928538624',
		floorChannelName: 'LT: 👧┇',
	},
];

const nftListingJsonAddress = 'terra1uv9w7aaq6lu2kn0asnvknlcgg2xd5ts57ss7qt';
const nftListingJsonTokenId = '1213';
const nftListingJsonPrice = '15000000';
const nftListingJsonCurrency = 'uluna';
const nftListingJson = [
	{
		events: [
			{
				type: 'execute_contract',
				attributes: [
					{
						key: 'sender',
						value: 'terra1fw6uzm3s95p9nvv6qmlp9g7j6x2kkpy4s9n5r9',
					},
					{
						key: 'contract_address',
						value: nftListingJsonAddress,
					},
				],
			},
			{
				type: 'from_contract',
				attributes: [
					{
						key: 'contract_address',
						value: nftListingJsonAddress,
					},
					{ key: 'action', value: 'approve' },
					{
						key: 'sender',
						value: 'terra1fw6uzm3s95p9nvv6qmlp9g7j6x2kkpy4s9n5r9',
					},
					{
						key: 'spender',
						value: 'terra1fj44gmt0rtphu623zxge7u3t85qy0jg6p5ucnk',
					},
					{ key: 'token_id', value: nftListingJsonTokenId },
				],
			},
			{
				type: 'message',
				attributes: [
					{
						key: 'action',
						value: '/terra.wasm.v1beta1.MsgExecuteContract',
					},
					{ key: 'module', value: 'wasm' },
					{
						key: 'sender',
						value: 'terra1fw6uzm3s95p9nvv6qmlp9g7j6x2kkpy4s9n5r9',
					},
				],
			},
			{
				type: 'wasm',
				attributes: [
					{
						key: 'contract_address',
						value: nftListingJsonAddress,
					},
					{ key: 'action', value: 'approve' },
					{
						key: 'sender',
						value: 'terra1fw6uzm3s95p9nvv6qmlp9g7j6x2kkpy4s9n5r9',
					},
					{
						key: 'spender',
						value: 'terra1fj44gmt0rtphu623zxge7u3t85qy0jg6p5ucnk',
					},
					{ key: 'token_id', value: nftListingJsonTokenId },
				],
			},
		],
	},
	{
		msg_index: 1,
		events: [
			{
				type: 'coin_received',
				attributes: [
					{
						key: 'receiver',
						value: 'terra1fj44gmt0rtphu623zxge7u3t85qy0jg6p5ucnk',
					},
					{ key: 'amount', value: '300000uusd' },
				],
			},
			{
				type: 'coin_spent',
				attributes: [
					{
						key: 'spender',
						value: 'terra1fw6uzm3s95p9nvv6qmlp9g7j6x2kkpy4s9n5r9',
					},
					{ key: 'amount', value: '300000uusd' },
				],
			},
			{
				type: 'execute_contract',
				attributes: [
					{
						key: 'sender',
						value: 'terra1fw6uzm3s95p9nvv6qmlp9g7j6x2kkpy4s9n5r9',
					},
					{
						key: 'contract_address',
						value: 'terra1fj44gmt0rtphu623zxge7u3t85qy0jg6p5ucnk',
					},
					{
						key: 'sender',
						value: 'terra1fj44gmt0rtphu623zxge7u3t85qy0jg6p5ucnk',
					},
					{
						key: 'contract_address',
						value: nftListingJsonAddress,
					},
				],
			},
			{
				type: 'from_contract',
				attributes: [
					{
						key: 'contract_address',
						value: 'terra1fj44gmt0rtphu623zxge7u3t85qy0jg6p5ucnk',
					},
					{ key: 'method', value: 'post_sell_order' },
					{
						key: 'sender',
						value: 'terra1fw6uzm3s95p9nvv6qmlp9g7j6x2kkpy4s9n5r9',
					},
					{
						key: 'order_id',
						value: 'sell_1647035877556_0.06899848037293266',
					},
					{
						key: 'nft_contract_address',
						value: nftListingJsonAddress,
					},
					{ key: 'token_id', value: nftListingJsonTokenId },
					{ key: 'price', value: nftListingJsonPrice },
					{ key: 'denom', value: nftListingJsonCurrency },
					{ key: 'expiration', value: '4800635878' },
					{
						key: 'contract_address',
						value: nftListingJsonAddress,
					},
					{ key: 'action', value: 'transfer_nft' },
					{
						key: 'sender',
						value: 'terra1fj44gmt0rtphu623zxge7u3t85qy0jg6p5ucnk',
					},
					{
						key: 'recipient',
						value: 'terra1fj44gmt0rtphu623zxge7u3t85qy0jg6p5ucnk',
					},
					{ key: 'token_id', value: nftListingJsonTokenId },
				],
			},
			{
				type: 'message',
				attributes: [
					{
						key: 'action',
						value: '/terra.wasm.v1beta1.MsgExecuteContract',
					},
					{ key: 'module', value: 'wasm' },
					{
						key: 'sender',
						value: 'terra1fw6uzm3s95p9nvv6qmlp9g7j6x2kkpy4s9n5r9',
					},
					{
						key: 'sender',
						value: 'terra1fw6uzm3s95p9nvv6qmlp9g7j6x2kkpy4s9n5r9',
					},
					{ key: 'module', value: 'wasm' },
					{
						key: 'sender',
						value: 'terra1fj44gmt0rtphu623zxge7u3t85qy0jg6p5ucnk',
					},
				],
			},
			{
				type: 'transfer',
				attributes: [
					{
						key: 'recipient',
						value: 'terra1fj44gmt0rtphu623zxge7u3t85qy0jg6p5ucnk',
					},
					{
						key: 'sender',
						value: 'terra1fw6uzm3s95p9nvv6qmlp9g7j6x2kkpy4s9n5r9',
					},
					{ key: 'amount', value: '300000uusd' },
				],
			},
			{
				type: 'wasm',
				attributes: [
					{
						key: 'contract_address',
						value: 'terra1fj44gmt0rtphu623zxge7u3t85qy0jg6p5ucnk',
					},
					{ key: 'method', value: 'post_sell_order' },
					{
						key: 'sender',
						value: 'terra1fw6uzm3s95p9nvv6qmlp9g7j6x2kkpy4s9n5r9',
					},
					{
						key: 'order_id',
						value: 'sell_1647035877556_0.06899848037293266',
					},
					{
						key: 'nft_contract_address',
						value: nftListingJsonAddress,
					},
					{ key: 'token_id', value: nftListingJsonTokenId },
					{ key: 'price', value: nftListingJsonPrice },
					{ key: 'denom', value: nftListingJsonCurrency },
					{ key: 'expiration', value: '4800635878' },
					{
						key: 'contract_address',
						value: nftListingJsonAddress,
					},
					{ key: 'action', value: 'transfer_nft' },
					{
						key: 'sender',
						value: 'terra1fj44gmt0rtphu623zxge7u3t85qy0jg6p5ucnk',
					},
					{
						key: 'recipient',
						value: 'terra1fj44gmt0rtphu623zxge7u3t85qy0jg6p5ucnk',
					},
					{ key: 'token_id', value: nftListingJsonTokenId },
				],
			},
		],
	},
];

// >> Main function
function mainFunction(client) {
	console.log(`[BOT]: Listing functions loaded!`);
	globalClient = client;

	//Refresh luna price
	async function refreshPrices() {
		snekfetch.get(api).then((response) => {
			lunaPrice = Number(
				response.body.market_data.current_price.usd.toFixed(2)
			);
			// Test script
			if (firstTime === true) {
				firstTime = false;
				cacheCollectionFloors();
			}
		});
	}

	//Set refresh timer
	refreshPrices();

	setInterval(function () {
		cacheCollectionFloors();
		refreshPrices();
	}, refreshTime);

	// Creating luart client
	const wsLuartClient = new WebSocketClient(
		'https://terra-rpc.easy2stake.com/websocket',
		-1
	);
	wsLuartClient.start();

	// Subscribing new data
	wsLuartClient.subscribeTx(
		{ 'wasm.contract_address': process.env.luartContract },
		(data) => {
			if (lunaPrice > 0) {
				afterSubscribe(JSON.parse(data.value.TxResult.result.log));
			}
		}
	);
}

// >> Function processing data after getting it from subscribe
async function afterSubscribe(data) {
	events = events + 1;
	const currentdate = new Date();
	const datetime =
		'' +
		currentdate.getDate() +
		'.' +
		'' +
		(currentdate.getMonth() + 1) +
		'.' +
		currentdate.getFullYear() +
		' / ' +
		currentdate.getHours() +
		':' +
		currentdate.getMinutes() +
		':' +
		currentdate.getSeconds();
	console.log(`${datetime} ${events}`);
	let dataType = 'none';
	if (data.length === 1) {
		if (data[0].events[1].attributes) {
			if (data[0].events[1].attributes[1].value == 'cancel_order') {
				dataType = 'cancel_order (cancel sell)';
			} else if (
				data[0].events[6].attributes[1].value == 'post_buy_order'
			) {
				dataType = 'post_buy_order (post bid)';
			} else if (data[0].events[6].attributes[1].value == 'add_balance') {
				dataType = 'add_balance (add to balance)';
			} else if (
				data[0].events[6].attributes[1].value == 'withdraw_balance'
			) {
				dataType = 'withdraw_balance (withdraw from balance)';
			}
		}
	} else if (data.length === 2) {
		if (data[1].events[6].attributes) {
			if (data[1].events[6].attributes[1].value == 'post_sell_order') {
				dataType = 'post_sell_order (post sell)';
			} else if (
				data[1].events[6].attributes[1].value == 'execute_order'
			) {
				dataType = 'execute_order (sell)';
			}
		}
	} else if (data.length === 3) {
		if (data[2].events[6].attributes) {
			if (data[2].events[6].attributes[1].value == 'execute_order') {
				dataType = '?? sell (mby from bid)';
			}
		}
	}

	//console.log(dataType);
	//console.log(data);

	// >> Sprawdzanie globalnych funckji kolekcji, wysyłanie eventów
	if (globalSection[data[0].events[0].attributes[1].value]) {
		globalSectionFunctions.sendInfo(
			data,
			dataType,
			lunaPrice,
			globalClient,
			globalSection[data[0].events[0].attributes[1].value]
		);
	}

	// >> BID
	if (
		data[0].events[6] &&
		data[0].events[6].attributes[4] &&
		globalSection[data[0].events[6].attributes[4].value]
	) {
		globalSectionFunctions.sendInfo(
			data,
			dataType,
			lunaPrice,
			globalClient,
			globalSection[data[0].events[6].attributes[4].value]
		);
	}

	// >> Sell
	if (
		data[1] &&
		data[1].events[6] &&
		data[1].events[6].attributes[10] &&
		globalSection[data[1].events[6].attributes[10].value]
	) {
		globalSectionFunctions.sendInfo(
			data,
			dataType,
			lunaPrice,
			globalClient,
			globalSection[data[1].events[6].attributes[10].value]
		);
	}

	// >> Sprawdzanie kolekcji, wysyłanie eventów
	if (collections[data[0].events[0].attributes[1].value]) {
		collections[data[0].events[0].attributes[1].value].sendInfo(
			data,
			dataType,
			lunaPrice,
			globalClient,
			globalSection[data[0].events[0].attributes[1].value]
		);
	}

	// >> BID
	if (
		data[0].events[6] &&
		data[0].events[6].attributes[4] &&
		collections[data[0].events[6].attributes[4].value]
	) {
		collections[data[0].events[6].attributes[4].value].sendInfo(
			data,
			dataType,
			lunaPrice,
			globalClient,
			globalSection[data[0].events[6].attributes[4].value]
		);
	}

	// >> Sell
	if (
		data[1] &&
		data[1].events[6] &&
		data[1].events[6].attributes[10] &&
		collections[data[1].events[6].attributes[10].value]
	) {
		collections[data[1].events[6].attributes[10].value].sendInfo(
			data,
			dataType,
			lunaPrice,
			globalClient,
			globalSection[data[1].events[6].attributes[10].value]
		);
	}
}

async function cacheCollectionFloors() {
	let localCacheFloor = new Array();
	let localCount = new Array();
	let cosLicz = 0;
	let collectionLength = 0;
	countRefreshTraits = countRefreshTraits + 1;
	for (const [key, value] of Object.entries(globalSection)) {
		collectionLength = collectionLength + 1;
		if (countRefreshTraits === 10) {
			cacheCollectionTraitsFloor(value[0].address);
		}
	}
	if (countRefreshTraits === 10) {
		countRefreshTraits = 1;
	}
	for (const [key, value] of Object.entries(globalSection)) {
		snekfetch
			.get(
				`https://luart-marketplace-prices-indexer.2ue2d8tpif5rs.eu-central-1.cs.amazonlightsail.com/nft-collection-prices/${key}`
			)
			.then(async (response) => {
				localCount[key] = 0;
				for (const [key2, value2] of Object.entries(
					response.body.prices
				)) {
					localCount[key] = localCount[key] + 1;
					if (localCount[key] === 1) {
						if (value2.sellPriceCurrency === 'LUNA') {
							localCacheFloor[key] = Number(
								value2.sellPriceAmount
							);
						} else {
							localCacheFloor[key] = Number(
								Number(value2.sellPriceAmount) /
									Number(lunaPrice)
							);
						}
					} else {
						if (value2.sellPriceCurrency === 'LUNA') {
							if (
								localCacheFloor[key] >
								Number(value2.sellPriceAmount)
							) {
								localCacheFloor[key] = Number(
									value2.sellPriceAmount
								);
							}
						} else {
							if (
								localCacheFloor[key] >
								Number(
									Number(value2.sellPriceAmount) /
										Number(lunaPrice)
								)
							) {
								localCacheFloor[key] = Number(
									Number(value2.sellPriceAmount) /
										Number(lunaPrice)
								);
							}
						}
					}
				}
				globalSection[key][0].floor = localCacheFloor[key];
				if (globalSection[key][0].floorChannel) {
					let editChannel = await globalClient.channels.fetch(
						globalSection[key][0].floorChannel
					);
					if (editChannel) {
						editChannel.setName(
							`${
								globalSection[key][0].floorChannelName
							} ${globalSection[key][0].floor.toFixed(2)}$LUNA`
						);
					}
				}
				cosLicz = cosLicz + 1;
				// Test script
				if (firstTime2 === true && cosLicz === collectionLength) {
					firstTime2 = false;
					//afterSubscribe(nftListingJson);
				}
			});
	}
}

async function cacheCollectionTraitsFloor(collectionAddress) {
	if (!globalSection[collectionAddress][0].firstCacheTraits) {
		globalSection[collectionAddress][0].firstCacheTraits = true;
		dbCon.query(
			`SELECT * FROM nftSniper_${globalSection[collectionAddress][0].dbName}_Traits`,
			async function (error, result, fields) {
				if (error) {
					console.log(error);
				} else {
					for (let i = 0; i < result.length; i++) {
						if (
							!globalSection[collectionAddress][0].traitsFloor[
								result[i].traitType
							]
						) {
							globalSection[collectionAddress][0].traitsFloor[
								result[i].traitType
							] = new Array();
						}
						globalSection[collectionAddress][0].traitsFloor[
							result[i].traitType
						][result[i].traitName] = 0;
						if (i === result.length - 1) {
							cacheCollectionTraitsFloorFunc2(collectionAddress);
						}
					}
				}
			}
		);
	} else {
		cacheCollectionTraitsFloorFunc2(collectionAddress);
	}
}

async function cacheCollectionTraitsFloorFunc2(collectionAddress) {
	let listedNfts = new Array();
	let maxListed = 0;
	let countListed = 0;
	listedNfts[collectionAddress] = new Array();
	snekfetch
		.get(
			`https://luart-marketplace-prices-indexer.2ue2d8tpif5rs.eu-central-1.cs.amazonlightsail.com/nft-collection-prices/${collectionAddress}`
		)
		.then((response) => {
			for (const [key, value] of Object.entries(response.body.prices)) {
				maxListed = maxListed + 1;
			}
			for (const [key, value] of Object.entries(response.body.prices)) {
				if (value.sellPriceCurrency === 'LUNA') {
					listedNfts[collectionAddress][value.tokenId] = Number(
						value.sellPriceAmount
					);
				} else {
					listedNfts[collectionAddress][value.tokenId] = Number(
						(value.sellPriceAmount / lunaPrice).toFixed(2)
					);
				}
				dbCon.query(
					`SELECT * FROM nftSniper_${globalSection[collectionAddress][0].dbName} WHERE tokenId="${value.tokenId}"`,
					async function (error, result, fields) {
						if (error) {
							console.log(error);
						} else {
							if (result.length > 0) {
								countListed = countListed + 1;
								let maxTraits = 0;
								for (const [key2, value2] of Object.entries(
									result[0]
								)) {
									if (!key2.search('trait_')) {
										maxTraits = maxTraits + 1;
									}
								}
								let countTraits = 0;
								for (const [key2, value2] of Object.entries(
									result[0]
								)) {
									if (!key2.search('trait_')) {
										countTraits = countTraits + 1;
										if (
											globalSection[collectionAddress][0]
												.traitsFloor[key2]
										) {
											if (
												globalSection[
													collectionAddress
												][0].traitsFloor[key2][
													value2
												] === 0
											) {
												globalSection[
													collectionAddress
												][0].traitsFloor[key2][value2] =
													listedNfts[
														collectionAddress
													][value.tokenId];
											} else {
												if (
													globalSection[
														collectionAddress
													][0].traitsFloor[key2][
														value2
													] >
													listedNfts[
														collectionAddress
													][value.tokenId]
												) {
													globalSection[
														collectionAddress
													][0].traitsFloor[key2][
														value2
													] =
														listedNfts[
															collectionAddress
														][value.tokenId];
												}
											}
										}

										if (
											countListed === maxListed &&
											countTraits === maxTraits
										) {
											for (const [
												key3,
												value3,
											] of Object.entries(
												globalSection[
													collectionAddress
												][0].traitsFloor
											)) {
												for (const [
													key4,
													value4,
												] of Object.entries(value3)) {
													dbCon.query(
														`UPDATE nftSniper_${globalSection[collectionAddress][0].dbName}_Traits SET traitFloor="${value4}" WHERE traitType="${key3}" AND traitName="${key4}";`,
														async function (
															cerror,
															cresult,
															cfields
														) {
															if (cerror) {
																console.log(
																	cerror
																);
															} else {
																console.log(
																	`${globalSection[collectionAddress][0].name}: ${key4} set to ${value4}`
																);
															}
														}
													);
												}
											}
										}
									}
								}
							}
						}
					}
				);
			}
		});
}

module.exports = { mainFunction };
