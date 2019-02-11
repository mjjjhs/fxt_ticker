<template>
	<div class="ui basic segment padding0">
		<!-- <h3 class="ui header">{{now}}</h3> -->
		<!-- <div class="ui indicating progress" id='timerExchanges'> -->
		<div class="ui indicating tiny progress pos" id='timerExchanges'>
			<div class="bar">{{timer}}</div>
		</div>

		<div class="ui negative message">
			<div class="header">NOTICE</div>
			<p>각 거래소 FXT 토큰 총합은, 거래소 지갑이 한개 이상일 경우 아래 물량 이외에 더 있을 수 있습니다.</p>
		</div>

		<h3 class="ui right floated small header grey">{{holders | digit(0)}} holders</h3>
		<h3 class="ui left floated small header grey">{{ethusd | digit(2)}} USD/ETH</h3>

		<div class='clear pos'></div>

		<div class="ui three stackable cards">
			<div class="card" v-for='ticker in prices' :key='ticker.exchange'>
				<div class="content">
					<!-- https://github.com/vuejs-templates/webpack/issues/450 -->
					<img class="right floated mini ui image" :src="require(`@/assets/${ticker.exchange.toLowerCase()}.png`)" width="35" height="auto">
					<div class="header">{{ticker.exchange}} <span class="ui basic label"> {{ticker.balance | digit(0)}} FXT</span></div>
					<div class="meta">FXT/ETH</div>
					<div class="description">
						<div class="ui grid">
							<div class="ten wide column">
								<div class="ui mini statistic">
									<div class="value ui black label">{{ticker.price | digit(7)}}</div>
								</div>
							</div>
							
							<div class="six wide column">
								<p class="red">{{ticker.minAsk | digit(7)}}</p>
								<p class="green">{{ticker.maxBid | digit(7)}}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class='ui divider'></div>
		<div class="ui label"><i class="users icon"></i> {{client}}</div>
	</div>

</template>

<script>
	// import $ from 'jquery'

	export default {
		props: ['holders', '_ref', 'prices', 'client', 'start'],

		computed: {
			ethusd: function() {
				return (this._ref && this._ref.ethusd) ?
					this._ref.ethusd :
					null;
			},

			timer: function() {
				$('#timerExchanges').progress({
					percent: ((this.start / 60) * 100) % 100
				});
				return null;
			}
		},
	}	
</script>

<style scoped>
	.padding0 {
		padding: 0 !important;
	}

	.ui.indicating.progress .bar {
		background-color: #ccc !important;
	}

	.ui.three.stackable.cards {
		margin-top: 10px !important;
	}

	.notice {
		margin-top: -20px !important;
	}

	.pos {
		margin-bottom: 5px !important;
	}

	.clear {
		clear: both;
	}

	.grey {
		color: grey !important;
	}

	.red {
		color: red;
	}

	.green {
		color: green;
	}
</style>
