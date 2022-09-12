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
modulesChannels['ustMistakes'] = '963771898037145610';
modulesChannels['rareTraitFloor'] = '963771917427433512';
modulesChannels['belowFloor'] = '963771945252421632';
modulesChannels['rareListing'] = '963771966769217566';
modulesChannels['listing'] = '963771984364331048';
modulesChannels['postBid'] = '963772003742023680';
modulesChannels['bigSell'] = '963772027662106634';
modulesChannels['sell'] = '963772052689547314';
modulesChannels['veryBelowFloor'] = '964990563214581852';

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
