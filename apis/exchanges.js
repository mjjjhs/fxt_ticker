const [_, axios, cheerio, Web3] = [
	require('lodash'),
	require('axios'),
	require('cheerio'),
	require('web3'),
];

const [getBalance, coinbene, APIs] = [
	require('./FXTBalances.js'),
	require('./coinbene.js'),
	require('./exchangesAPI.js'),
];

const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io'));

// using coinmarketcap, rate limited
// const ETH = {
// 	URL: 'https://api.coinmarketcap.com/v2/ticker/1027/',
// 	PRICE: res => res.data.data.quotes.USD.price
// }

const USD = [
	{
		CURRENCY: 'ETH',
		URL: 'https://api.etherscan.io/api?module=stats&action=ethprice', // using etherscan
		PRICE: res => res.data.result.ethusd
	},
	{
		CURRENCY: 'KRW',
		URL: 'http://free.currencyconverterapi.com/api/v6/convert?q=USD_KRW',
		PRICE: res => res.data.results.USD_KRW.val
	}
];

async function job() {
	const tokenPage = await axios.get('https://etherscan.io/token/0x1829aa045e21e0d59580024a951db48096e01782');
	const $ = cheerio.load(tokenPage.data);

	const holders = $('#ContentPlaceHolder1_tr_tokenHolders > td:nth-child(2)').text().split(' ')[0].trim();

	const pendingCurrency = USD.map(currency => axios.get(currency.URL).catch(e => e));
	const [ethusd, krwusd] = (await Promise.all(pendingCurrency)).map((result, idx) => Number(USD[idx].PRICE(result)));
	console.log(`${ethusd} USD/ETH, ${krwusd} KRW/USD`);

	const balances = await Promise.all(APIs.map(async exchange => getBalance(exchange.ADDRESS)));
	const coinbeneAccounts = await coinbene.getAccounts();

	// price
	const pendingResponses = APIs.map(exchange => axios({
		method: 'GET',
		url: exchange.URL
	}).catch(e => e));
	const responses = await Promise.all(pendingResponses);

	// depth
	const pendingResponsesDepth = APIs.filter(exchange => exchange.DEPTH)
	.map(exchange => {
		return {
			exchange: exchange.ID,
			result: axios(exchange.DEPTH).catch(e => e)
		}
	});

	const _responsesDepth = (await Promise.all(pendingResponsesDepth.map(exchange => exchange.result)))
	.map((response, idx) => {
		return {
			exchange: pendingResponsesDepth[idx].exchange,
			response: response
		}
	});
	const responsesDepth = _.mapValues(_.keyBy(_responsesDepth, 'exchange'), 'response');

	const prices = responses.map((response, idx) => {
		try {
			return {
				exchange: APIs[idx].ID,
				price: Number(APIs[idx].PRICE(response)) || 'N/A',

				minAsk: APIs[idx].DEPTH ?
					(Number(APIs[idx].MIN_ASK(responsesDepth[APIs[idx].ID])) || 'N/A') :
					(Number(APIs[idx].MIN_ASK(response)) || 'N/A'),

				maxBid: APIs[idx].DEPTH ?
					(Number(APIs[idx].MAX_BID(responsesDepth[APIs[idx].ID])) || 'N/A') :
					(Number(APIs[idx].MAX_BID(response)) || 'N/A'),

				balance: Number(web3.utils.fromWei(web3.utils.toBN(balances[idx]).toString(), 'ether')) || 'N/A'
			}
		} catch (e) {
			return {
				exchange: APIs[idx].ID,
				price: 'N/A, maybe MAINTENANCE'
			}
		}
	});

	return {
		prices,
		ref: {ethusd, krwusd},
		coinbeneAccounts,
		holders: Number(holders)
	}
}

module.exports = job;
