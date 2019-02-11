const [path, moment, compression] = [
	require('path'),
	require('moment-timezone'),
	require('compression'),
];

const [express, favicon] = [
	require('express'),
	require('serve-favicon'),
];

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const jobs = require('./apis/exchanges.js');
const cmc = require('./apis/cmc.js');

const FXT = require('./apis/holders.js');

const PORT = 30200;

const API_ENABLED = {
	EXCHANGES: true,
	CMC: true
}

let clientCount = 0;
let ticker = null;
let tickerCMC = null;

app.use(compression());
// app.use(favicon(path.join(__dirname, 'client', 'favicon.ico')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'client/dist')));

// app.get('/', (req, res) => {
// 	res.sendFile(__dirname + '/client/index.html');
// });

app.get('/api/__holders', async (req, res) => {
	const holders = await FXT.getHolders();

	res.json(holders);
});

app.get('/api/enabled/:target', (req, res) => {
	const idx = req.params.target.toUpperCase();
	if (API_ENABLED[idx] != undefined) {
		API_ENABLED[idx] = req.query.flag == 'true';

		io.emit(`api${idx}`, {
			enabled: API_ENABLED[idx]
		});
	}

	res.json(API_ENABLED);
});

io.on('connection', socket => {
	console.log(`client connected: ${++clientCount}`);

	socket.on('disconnect', () => {
		console.log(`client disconnected: ${--clientCount}`);
	});

	socket.emit('ticker', ticker);
	socket.emit('cmc', tickerCMC);

	socket.emit('apiExchanges', {enabled: API_ENABLED.EXCHANGES});
	socket.emit('apiCmc', {enabled: API_ENABLED.CMC});
});

setInterval(async () => {
	if (API_ENABLED.EXCHANGES) {
		const exchanges = await jobs();

		ticker = {
			now: moment().tz('Asia/Seoul').format('YYYY-MM-DD hh:mm A'),
			nowSec: new Date().getTime(),
			// now: new Date().toLocaleString('ko-KR'),
			prices: exchanges.prices,
			ref: exchanges.ref,
			beAccounts: exchanges.coinbeneAccounts,

			holders: exchanges.holders,
			
			client: clientCount
		}
	}

	console.log(ticker);

	io.emit('ticker', ticker);
}, 60 * 1000);

setInterval(async() => {
	if (API_ENABLED.CMC) {
		const {cmc_rank, quote: {USD: {price, volume_24h, market_cap, last_updated}}} = await cmc('USD');
		const {quote: {KRW: {price: priceKRW, volume_24h: volume_24hKRW, market_cap: market_capKRW, last_updated: last_updatedKRW}}} = await cmc('KRW');

		tickerCMC = {
			// now: moment().tz('Asia/Seoul').format('YYYY-MM-DD hh:mm A'),
			now: new Date().getTime(),
			rank: cmc_rank,

			USD: {
				price,
				volume: volume_24h,
				marketCap: market_cap,
				lastUpdated: moment(last_updated).tz('Asia/Seoul').format('YYYY-MM-DD hh:mm A')
			},

			KRW: {
				price: priceKRW,
				volume: volume_24hKRW,
				marketCap: market_capKRW,
				lastUpdated: moment(last_updatedKRW).tz('Asia/Seoul').format('YYYY-MM-DD hh:mm A')
			}
		}
	}

	console.log(tickerCMC);

	io.emit('cmc', tickerCMC);
}, 60 * 15 * 1000);

http.listen(PORT, () => {
	console.log(`listening on *:${PORT})`);
});
