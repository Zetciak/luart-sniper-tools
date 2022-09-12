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
modulesChannels['ustMistakes'] = '963570257124003860';
modulesChannels['rareTraitFloor'] = '963770910169518100';
modulesChannels['belowFloor'] = '963570279194451998';
modulesChannels['rareListing'] = '963570310190366720';
modulesChannels['listing'] = '963570332508229722';
modulesChannels['postBid'] = '963770953400188978';
modulesChannels['bigSell'] = '963770972110987294';
modulesChannels['sell'] = '963770991778099250';
modulesChannels['veryBelowFloor'] = '964990786712240138';

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
