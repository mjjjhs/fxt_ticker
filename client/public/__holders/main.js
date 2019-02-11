const app = new Vue({
	el: '#app',
	data: {
		holders: []
	},

	created: function () {
		axios.get('/api/__holders').then(res => {
			this.holders = res.data;
		});
	},

	computed: {
	
	},

	methods: {

	},

	filters: {
		digit: function(value, digit) {
			return (typeof value === 'number') ?
				value.toLocaleString(undefined, {
					minimumFractionDigits: (digit === 0) ? 0 : (digit || 4),
					maximumFractionDigits: (digit === 0) ? 0 : (digit || 4)
				}) :
				value;
		},

		foo: function(value) {
			if (value.startsWith('[추정]')) {
				return value.split('[추정] ')[1];
			} else {
				return value;
			}
		},
	}
});
