const [_, axios] = [
	require('lodash'),
	require('axios'),
];

const URL = {
	USD: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=FXT&convert=USD',
	KRW: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=FXT&convert=KRW',
}

async function job(FIAT) {
	console.log(URL[FIAT]);
	
	const res = await axios.get(URL[FIAT], {
		headers: {
			'X-CMC_PRO_API_KEY': '6fe2e033-a129-4fc3-977c-379aa567c0bf'
		}
	}).catch(e => e);

	console.log(res.data);
	return res.data.data.FXT;
}

// job();

module.exports = job;
