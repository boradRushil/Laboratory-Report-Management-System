import Web3 from "web3";
import AxiosService from "../utils/axiosHelper";
import Web3InitService from "./web3initService";

export default class AuthService {
	public static async getStatus() {
		let provider: any = Web3InitService.checkLogin();
		if (provider === false) {
			return false;
		} else {
			return true;
		}
	}

	public static async login() {
		return Web3InitService.init();
	}

	public static async userData() {
		let provider: any = await this.getProvider();
		if(provider === false) return null;
		return AxiosService.get(
			"/getUser/" + (await provider.eth.getAccounts())[0]
		)
			.then((res) => {
				return res.data;
			})
			.catch((err) => {
				console.log(err);
				return null;
			});
	}

	public static async getProvider() {
		let provider: any = Web3InitService.checkLogin();
		if (provider === false) {
			return false;
		} else {
			return provider;
		}
	}
}
