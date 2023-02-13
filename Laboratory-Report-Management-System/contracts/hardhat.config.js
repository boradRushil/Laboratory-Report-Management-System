require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
const fs = require("fs");
const privateKey = fs.readFileSync(".secret").toString().trim();
module.exports = {
	defaultNetwork: "matic",
	networks: {
		hardhat: {},
		matic: {
			url: "https://polygon-mumbai.g.alchemy.com/v2/3jrF-VXU4qKbm9HDArrqZpJ_IOwooXyN",
			accounts: [`95080ada8448d164fe5cc164782bba5114daba0ee74a8b7df04f53efd9222ae6`],
		},
	},
	etherscan: {
		apiKey: "T7EJKK22HARAGKTIQKGNVDJ3YSV6SET5C8",
	},
	solidity: {
		version: "0.8.13",
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
};
