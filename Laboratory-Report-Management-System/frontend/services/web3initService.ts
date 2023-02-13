declare let window: any;
import Web3 from "web3";

let web3: Web3;

export default class Web3InitService {

	public static async init(): Promise<Web3> {
		if (typeof window.ethereum !== "undefined") {
			let provider = window.ethereum;
			try {
				await provider.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: "0x13881" }],
				});
			} catch (switchError: any) {
				if (switchError.code === 4902) {
					try {
						await provider.request({
							method: "wallet_addEthereumChain",
							params: [
								{
									chainId: "0x13881",
									chainName: "Polygon",
									rpcUrls: [
										"https://matic-mumbai.chainstacklabs.com",
									],
								},
							],
						});
						await provider.request({
							method: "wallet_switchEthereumChain",
							params: [{ chainId: "0x13881" }],
						});
					} catch (addError) {
						console.log(addError);
					}
				}
			}

			await provider.request({
				method: "eth_requestAccounts",
			});

			web3 = new Web3(provider);
		} else {
			alert("You must download Metamask to use this application");
		}
		console.log(web3);
		window.web3 = web3;
		return web3;
	}

	public static checkLogin() {
		return web3 ? web3 : false;
	}
}
