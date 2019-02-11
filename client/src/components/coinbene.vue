<template>
	<div class="ui basic segment padding0">
		<!-- <div class="ui indicating tiny progress" id='timerCB'> -->
		<div class="ui indicating tiny progress" id='timerCB'>
			<div class="bar">{{timer}}</div>
		</div>

		<h3 class="ui header cbTitle">{{getCBTitle}} | {{getCBTotal | digit(0)}}
			<div class="sub header">{{getCBRatio | digit(1)}} % of {{prices && prices[1].balance | digit(0)}}</div>
		</h3>

		<div class="two ui buttons">
			<button class="ui button" :class="{'teal': cbOrder === 'date'}" @click='sort("date")'>sort by date</button>
			<button class="ui button" :class="{'teal': cbOrder === 'default'}" @click='sort("default")'>sort by quantity</button>
		</div>

		<div class="ui three stackable cards">
			<div class="card" v-for='(account, index) in beAccounts' :key='account.timestamp'>
				<div class="content">
					<div class='ui huge header right floated'>{{index + 1}}</div>
					<div class="header" :class="{'fontBlur': cbOrder === 'date'}">{{account.amount | digit(0)}}</div>
					<div class="meta" :class="{'black': cbOrder === 'date'}">{{account.timestamp}}</div>
					<div class="description">{{account.address | address}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	// import $ from 'jquery'
	
	import moment from 'moment'

	export default {
		props: ['prices', 'cbOrder', 'beAccounts', 'start'],

		computed: {
			getCBTitle: function() {
				const count = this.beAccounts ? this.beAccounts.length : 'N/A';

				return `${count} accounts > 500,000 IN`;
			},

			getCBTotal: function() {
				if (this.beAccounts) {
					const sum = this.beAccounts.reduce((sum, cur) => sum + cur.amount, 0);
					return sum;
				}
			},

			getCBRatio: function() {
				if (this.beAccounts) {
					const sum = this.beAccounts.reduce((sum, cur) => sum + cur.amount, 0);

					return (sum / this.prices[1].balance) * 100;
				}
			},

			timer: function() {
				$('#timerCB').progress({
					percent: ((this.start / 60) * 100) % 100
				});
				return null;
			},
		},

		methods: {
			sort: function(kind) {
				this.$emit('update:cbOrder', kind);

				if (this.beAccounts && kind == 'date') {
					this.beAccounts.sort((x, y) => moment(y.timestamp, 'YYYY-MM-DD HH:mm A').diff(moment(x.timestamp, 'YYYY-MM-DD HH:mm A')));  
				} else if (this.beAccounts && kind == 'default') {
					this.beAccounts.sort((x, y) => y.amount - x.amount);
				}
			}
		},		
	}
</script>

<style scoped>
	.padding0 {
		padding: 0 !important;
	}

	.cbTitle {
		margin: -20px 0 10px 0 !important;
	}

	.ui.indicating.progress .bar {
		background-color: #ccc !important;
	}

	.ui.three.stackable.cards {
		margin-top: 10px !important;
	}

	.fontBlur {
		color: rgba(0,0,0,.4) !important;
		font-weight: normal !important;
	}

	.black {
		color: black !important;
		font-weight: bold !important;
	}
</style>
