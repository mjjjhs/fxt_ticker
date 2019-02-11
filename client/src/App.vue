<template>
	<div id='app'>
		<top-menu :api='api' v-bind:menu.sync='menu'></top-menu>

		<exchange v-show='menu === "EXCHANGES"' :client='client' :holders='holders' :_ref='ref' :prices='prices' :start='start'></exchange>
		<coinbene v-show='menu === "CB"' :prices='prices' :beAccounts='beAccounts' :cbOrder.sync='cbOrder' :start='start'></coinbene>
		<cmc v-show='menu === "CMC"' :cmc='cmc' :startCMC='startCMC'></cmc>
	</div>
</template>

<script>
	// import $ from 'jquery'	
	import Vue from 'vue'
	// import axios from 'axios'
	import moment from 'moment'
	import io from 'socket.io-client'

	import topMenu from './components/menu.vue'
	import exchange from './components/exchange.vue'
	import coinbene from './components/coinbene.vue'
	import cmc from './components/cmc.vue'

	export default {
		name: 'app',

		components: {
			topMenu,
			exchange,
			coinbene,
			cmc
		},

		data: function () {
			return {
				menu: 'EXCHANGES',

				holders: 0,

				socket: io(),
				now: null,
				prices: null,
				ref: null,

				start: 0,
				startCMC: 0,

				intervalId: null,
				intervalIdCMC: null,

				// avgETH: 0,

				cmc: {
					rank: null,
					USD: {},
					KRW: {}
				},

				api: {
					exchanges: true,
					cmc: true
				},

				beAccounts: null,
				maxBalance: 0,

				client: 0,

				cbOrder: 'default'
			}
		},

		created: function () {
			this.socket.on('apiEXCHANGES', flag => {
				this.api.exchanges = flag.enabled;
			});

			this.socket.on('apiCMC', flag => {
				this.api.cmc = flag.enabled;
			});

			this.socket.on('ticker', ticker => {
				this.holders = ticker && ticker.holders;
				
				this.beAccounts = ticker && ticker.beAccounts;

				if (this.beAccounts && this.cbOrder == 'date') {
					this.beAccounts.sort((x, y) => moment(y.timestamp, 'YYYY-MM-DD HH:mm A').diff(moment(x.timestamp, 'YYYY-MM-DD HH:mm A')));
				}

				this.client = (ticker && ticker.client) || 0;
				this.now = (ticker && ticker.now) || 'waiting for max 1 min';
				this.prices = ticker && ticker.prices;
				this.ref = ticker && ticker.ref;

				if (this.prices != null) {
					this.maxBalance = Math.max(...this.prices.map(ticker => ticker.balance));

					// const prices = this.prices.filter(ticker => {
					// 	return typeof ticker.price === 'number' && ticker.price > 0;
					// }).map(ticker => ticker.price);

					// this.avgETH = prices.reduce((x, y) => x + y) / prices.length;
				}

				clearInterval(this.intervalId);

				if (ticker != null) {
					this.start = Math.ceil((new Date().getTime() - ticker.nowSec) / 1000);
				} else {
					this.start = 0;
				}

				this.intervalId = setInterval(() => {
					++this.start;
				}, 1000);
			});

			this.socket.on('cmc', ticker => {
				if (ticker != null) {
					this.cmc = ticker;
					this.startCMC = Math.ceil((new Date().getTime() - ticker.now) / 1000);
				} else {
					this.startCMC = 0;
				}

				clearInterval(this.intervalIdCMC);

				this.intervalIdCMC = setInterval(() => {
					++this.startCMC;
				}, 1000);
			});

		},
	}

	Vue.filter('digit', function(value, digit) {
		return (typeof value === 'number') ?
			value.toLocaleString(undefined, {
				minimumFractionDigits: (digit === 0) ? 0 : (digit || 4),
				maximumFractionDigits: (digit === 0) ? 0 : (digit || 4)
			}) :
			value;
	});

	Vue.filter('address', function(value) {
		return `0x...${value.slice(-7)}`;
	});

	Vue.filter('loading', function(value) {
		return (value == null) ?
			' waiting for max 15 min' :
			value;
	});
</script>

<style scoped>
	#app {
		margin: 20px;
	}
</style>
