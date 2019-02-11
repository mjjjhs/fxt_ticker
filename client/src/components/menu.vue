<template>
	<div class="ui secondary menu">
		<a class="item" :class="{'active': menu === 'EXCHANGES'}" @click='setMenu("EXCHANGES")'><!-- <i class='tags icon'></i>  --> Exchanges <span class="ui empty circular label" :class="{'teal': api.exchanges === true, 'red': api.exchanges === false}"></span></a>
		<a class="item" :class="{'active': menu === 'CB'}" @click='setMenu("CB")'><!-- <i class='behance icon'></i>--> CB <span class="ui empty circular label" :class="{'teal': api.exchanges === true, 'red': api.exchanges === false}"></span></a>
		<a class="item" :class="{'active': menu === 'CMC'}" @click='setMenu("CMC")'><!-- <i class='search icon'></i>--> CMC <span class="ui empty circular label" :class="{'teal': api.cmc === true, 'red': api.cmc === false}"></span></a>
	</div>
</template>

<script>
	export default {
		props: ['menu', 'api'],

		methods: {
			setMenu: function(menu) {
				this.$emit('update:menu', menu);
			},
		}		
	}
</script>

<style scoped>
	.active {
		font-weight: bolder !important;
	}
</style>
