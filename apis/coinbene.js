const moment = require('moment-timezone');

const axios = require('axios');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io'));

const query = {
	module: 'logs',
	action: 'getLogs',
	fromBlock: '4902251',
	toBlock: '9999999999',
	address: '0x1829aA045E21E0D59580024A951DB48096e01782', // FXT
	topic0: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // TRANSFER
	topic1: '0x0000000000000000000000009539e0b14021a43cde41d9d45dc34969be9c7cb0', // COINBENE
	topic2: '0x0000000000000000000000009539e0b14021a43cde41d9d45dc34969be9c7cb0', // COINBENE
	topic1_2_opr: 'or'
}

const queryString = Object.keys(query).map(pair => {
	return `${pair}=${query[pair]}`
}).join('&');

function formatAmount(value) {
	return Number(web3.utils.fromWei(web3.utils.toBN(value).toString(), 'ether'));
}

const api = `https://api.etherscan.io/api?${queryString}`;

const THRESHOLD = 500000;

const getAccounts = async function() {
	const res = await axios.get(api);

	const result = res.data.result;
	const COINBENE_IN = result.filter(tx => {
		const amount = formatAmount(tx.data);

		return (tx.topics[2] === query.topic1 && amount >= 500000);
	}).map(tx => {
		const amount = formatAmount(tx.data);

		return {
			timestamp: moment(parseInt(tx.timeStamp, 16) * 1000).tz("Asia/Seoul").format('YYYY-MM-DD hh:mm A'),
			address: tx.topics[1],
			amount
		}
	}).sort((x, y) => {
		return y.amount - x.amount;
	});

	return COINBENE_IN;
}

module.exports = {
	getAccounts
};
