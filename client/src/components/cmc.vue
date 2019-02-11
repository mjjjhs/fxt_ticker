<template>
	<div class='ui basic segment padding0'>
		<div class="ui indicating tiny progress" id='timerCMC'>
			<div class="bar">{{timer}}</div>
		</div>

		<div class="ui fluid teal card top-element">
			<div class="content">
				<div class="header">RANK {{cmc.rank | loading}}</div>
			</div>

			<div class="content">
				<div class="meta right floated">{{cmc.USD.lastUpdated}}</div>
				<div class="header">USD</div>
				<div class="description">
					<div class="ui grid">
						<div class="eight wide column">
							<div class="ui mini statistic">
								<div class="value ui black label"><i class='ui dollar icon'></i> {{cmc.USD.price | digit(3)}}</div>
							</div>
						</div>

						<div class="eight wide column">
							<div class="ui list">
								<div class="item">
									<div class="header">Market Cap</div>
									{{cmc.USD.marketCap | digit(2)}}
								</div>
								<div class="item">
									<div class="header">Volume (24h)</div>
									{{cmc.USD.volume | digit(2)}}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="content">
				<div class="meta right floated">{{cmc.KRW.lastUpdated}}</div>
				<div class="header">KRW</div>
				<div class="description">
					<div class="ui grid">
						<div class="eight wide column">
							<div class="ui mini statistic">
								<div class="value ui black label"><i class='ui won icon'></i> {{cmc.KRW.price | digit(2)}}</div>
							</div>
						</div>

						<div class="eight wide column">
							<div class="ui list">
								<div class="item">
									<div class="header">Market Cap</div>
									{{cmc.KRW.marketCap | digit(2)}}
								</div>
								<div class="item">
									<div class="header">Volume (24h)</div>
									{{cmc.KRW.volume | digit(2)}}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<img class='ui fluid image' src="https://s2.coinmarketcap.com/generated/sparklines/web/7d/usd/2723.png" alt="FXT 7d chart">
	</div>
</template>

<script>
	// import $ from 'jquery'

	export default {
		props: ['cmc', 'startCMC'],

		computed: {
			timer: function() {
				$('#timerCMC').progress({
					percent: ((this.start / 60) * 100) % 100
				});
				return null;
			},
		}
	}
</script>

<style scoped>
	.top-element {
		margin-bottom: 30px !important;
		margin-top: -20px !important;
	}

	.padding0 {
		padding: 0 !important;
	}
</style>
