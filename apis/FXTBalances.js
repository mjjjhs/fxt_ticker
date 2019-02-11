// https://github.com/ThatOtherZach/Web3-by-Example/blob/master/scripts/getTokenBal.js

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io'));

// function format(value) {
// 	return Number(value).toLocaleString(undefined, {
// 		minimumFractionDigits: 0,
// 		maximumFractionDigits: 0
// 	});
// }

const getBalance = function(addr) {
	// '0x70a08231' is the contract 'balanceOf()' ERC20 token function in hex. A zero buffer is required and then we add the previously defined address with tokens
	// const contractData = `0x70a08231000000000000000000000000${addr.replace('0x', '')}`;

	const result = web3.eth.call({
		to: '0x1829aA045E21E0D59580024A951DB48096e01782', // Contract address, used call the token balance of the address in question
		data:  `0x70a08231000000000000000000000000${addr.replace('0x', '')}` // Combination of contractData and tknAddress, required to call the balance of an address 
	});

	return result;
	// return format(web3.utils.fromWei(web3.utils.toBN(result).toString(), 'ether'));
};


module.exports = getBalance;
