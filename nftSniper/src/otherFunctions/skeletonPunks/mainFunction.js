// >> Modules
require('dotenv').config();

// >> Functions
let enabledModules = new Array();
enabledModules['ustMistakes'] = require('./ustMistakes.js');
enabledModules['belowFloor'] = require('./belowFloor.js');
enabledModules['rareTraitFloor'] = require('./rareTraitFloor.js');
enabledModules['rareListing'] = require('./rareListing.js');
enabledModules['listing'] = require('./listing.js');
enabledModules['postBid'] = require('./postBid.js');
enabledModules['sell'] = require('./sell.js');
enabledModules['bigSell'] = require('./bigSell.js');
enabledModules['veryBelowFloor'] = require('./veryBelowFloor.js');

let modulesChannels = new Array();
modulesChannels['ustMistakes'] = '951922562701615164';
modulesChannels['belowFloor'] = '951917887105404958';
modulesChannels['rareTraitFloor'] = '951935103599255642';
modulesChannels['rareListing'] = '951917768725373009';
modulesChannels['listing'] = '951916809764876309';
modulesChannels['postBid'] = '962689547915894844';
modulesChannels['sell'] = '951916885975396415';
modulesChannels['bigSell'] = '951916855050784888';
modulesChannels['veryBelowFloor'] = '964990847680667738';

// >> Main function
function sendInfo(data, dataType, lunaPrice, globalClient, collectionInfo) {
	let collectionDBName = collectionInfo[0].dbName;
	let collectionName = collectionInfo[0].name;
	let collectionLogo = collectionInfo[0].logo;
	let collectionAddress = collectionInfo[0].address;
	let collectionFloor = collectionInfo[0].floor;

	// UST/LUNA Mistakes poster
	if (
		dataType === 'post_sell_order (post sell)' &&
		enabledModules['ustMistakes']
	) {
		enabledModules['ustMistakes'].send(
			data,
			lunaPrice,
			collectionDBName,
			collectionName,
			collectionLogo,
			collectionAddress,
			modulesChannels['ustMistakes'],
			globalClient,
			collectionFloor
		);
	}

	// Below floor poster
	if (
		dataType === 'post_sell_order (post sell)' &&
		enabledModules['belowFloor']
	) {
		enabledModules['belowFloor'].send(
			data,
			lunaPrice,
			collectionDBName,
			collectionName,
			collectionLogo,
			collectionAddress,
			modulesChannels['belowFloor'],
			globalClient,
			collectionFloor
		);
	}

	// Very below floor
	if (
		dataType === 'post_sell_order (post sell)' &&
		enabledModules['veryBelowFloor']
	) {
		enabledModules['veryBelowFloor'].send(
			data,
			lunaPrice,
			collectionDBName,
			collectionName,
			collectionLogo,
			collectionAddress,
			modulesChannels['veryBelowFloor'],
			globalClient,
			collectionFloor
		);
	}

	// Rare trait floor poster
	if (
		dataType === 'post_sell_order (post sell)' &&
		enabledModules['rareTraitFloor']
	) {
		enabledModules['rareTraitFloor'].send(
			data,
			lunaPrice,
			collectionDBName,
			collectionName,
			collectionLogo,
			collectionAddress,
			modulesChannels['rareTraitFloor'],
			globalClient,
			collectionFloor
		);
	}

	// Rare nft poster
	if (
		dataType === 'post_sell_order (post sell)' &&
		enabledModules['rareListing']
	) {
		enabledModules['rareListing'].send(
			data,
			lunaPrice,
			collectionDBName,
			collectionName,
			collectionLogo,
			collectionAddress,
			modulesChannels['rareListing'],
			globalClient,
			collectionFloor
		);
	}

	// Listener
	if (
		dataType === 'post_sell_order (post sell)' &&
		enabledModules['listing']
	) {
		enabledModules['listing'].send(
			data,
			lunaPrice,
			collectionDBName,
			collectionName,
			collectionLogo,
			collectionAddress,
			modulesChannels['listing'],
			globalClient,
			collectionFloor
		);
	}

	// Post bid
	if (dataType === 'post_buy_order (post bid)' && enabledModules['postBid']) {
		enabledModules['postBid'].send(
			data,
			lunaPrice,
			collectionDBName,
			collectionName,
			collectionLogo,
			collectionAddress,
			modulesChannels['postBid'],
			globalClient,
			collectionFloor
		);
	}

	// Post sell
	if (dataType === 'execute_order (sell)' && enabledModules['sell']) {
		enabledModules['sell'].send(
			data,
			lunaPrice,
			collectionDBName,
			collectionName,
			collectionLogo,
			collectionAddress,
			modulesChannels['sell'],
			globalClient,
			collectionFloor
		);
	}

	// Post big sell
	if (dataType === 'execute_order (sell)' && enabledModules['bigSell']) {
		enabledModules['bigSell'].send(
			data,
			lunaPrice,
			collectionDBName,
			collectionName,
			collectionLogo,
			collectionAddress,
			modulesChannels['bigSell'],
			globalClient,
			collectionFloor
		);
	}
}

module.exports = { sendInfo };
