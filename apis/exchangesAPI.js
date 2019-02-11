const _ = require('lodash');

const APIs = [
	{
		ID: 'ALLBIT',
		ADDRESS: '0xFf6b1cdfD2d3e37977d7938AA06b6d89D6675e27',
		URL: 'https://allbit.com/open/coin-list/',
		PRICE: res => _.find(res.data.info, data => data.name === 'FXT').price,

		DEPTH: {
			method: 'POST',
			url: 'https://api.allbit.com/open/order-list/',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: 'coin=19'
		},
		MIN_ASK: res => res.data.info.seller[0].price,
		MAX_BID: res => res.data.info.buyer[0].price,
	},

	{
		ID: 'COINBENE',
		ADDRESS: '0x9539e0b14021a43cDE41d9d45Dc34969bE9c7cb0',
		URL: 'http://api.coinbene.com/v1/market/ticker?symbol=fxteth',
		PRICE: res => res.data.ticker[0].last,
		MIN_ASK: res => res.data.ticker[0].ask,
		MAX_BID: res => res.data.ticker[0].bid,
	},

	{
		ID: 'COBINHOOD',
		ADDRESS: '0x8958618332dF62AF93053cb9c535e26462c959B0',
		URL: 'https://api.cobinhood.com/v1/market/tickers/FXT-ETH',
		PRICE: res => res.data.result.ticker.last_trade_price,
		MIN_ASK: res => res.data.result.ticker.lowest_ask,
		MAX_BID: res => res.data.result.ticker.highest_bid,
	},

	{
		ID: 'HitBTC',
		ADDRESS: '0x59a5208B32e627891C389EbafC644145224006E8', //HitBTC_2
		URL: 'https://api.hitbtc.com/api/2/public/ticker/FXTETH',
		PRICE: res => res.data.last,
		MIN_ASK: res => res.data.ask,
		MAX_BID: res => res.data.bid,
	},

	{
		ID: 'COSS', // https://github.com/impmja/coss.io-api
		ADDRESS: '0x0D6B5A54F940BF3D52E438CaB785981aAeFDf40C',
		URL: 'https://exchange.coss.io/api/integrated-market/pair-data/fxt-eth',
		PRICE: res => res.data.currency.price,
		// URL: 'https://exchange.coss.io/api/integrated-market/pairs',
		// PRICE: res => _.find(res.data, data => data.pair === 'FXT/ETH').price,

		DEPTH: {
			method: 'GET',
			url: 'https://exchange.coss.io/api/integrated-market/depth/fxt-eth'
		},
		MIN_ASK: res => res.data[1][0][0],
		MAX_BID: res => res.data[0][0][0],
	},

	{
		ID: 'LIVECOIN',
		ADDRESS: '0x7620c71961ced02430d54041ebDD449AE601eB36',
		URL: 'https://api.livecoin.net/exchange/ticker?currencyPair=FXT/ETH',
		PRICE: res => res.data.last,
		MIN_ASK: res => res.data.best_ask,
		MAX_BID: res => res.data.best_bid,
	},
];

module.exports = APIs;
