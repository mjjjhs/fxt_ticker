const _ = require('lodash');
const axios = require('axios');
const cheerio = require('cheerio');

// const HOLDERS_URL = 'https://etherscan.io/token/0x1829aa045e21e0d59580024a951db48096e01782#balances';
const HOLDERS_URL = 'https://etherscan.io/token/tokenholderchart/0x1829aa045e21e0d59580024a951db48096e01782?range=300';

const referenceAddress = require('./referenceAddress.js');

async function getHolders() {
	const holders = [];

	const res = await axios.get(HOLDERS_URL);
	const $ = cheerio.load(res.data);

	$('#ContentPlaceHolder1_resultrows > div > div > table > tbody > tr').each((idx, elm) => {
		const tds = $(elm).children();

		const temp = {
			rank: Number(tds.eq(0).text()),
			address: tds.eq(1).text().replace(/[\(\)]/g, '').split(' '),
			quantity: Number(tds.eq(2).text()),
			percentage: Number(tds.eq(3).text().replace('%', ''))
		}

		const alias = _.find(referenceAddress, o => o.address.toLowerCase() === temp.address[0].toLowerCase());

		if (alias) {
			temp.address.push(alias.ref);
		}

		holders.push(temp);
	});

	console.log(`${holders.length} holders retreived`);
	return holders;
}

module.exports = {getHolders}
