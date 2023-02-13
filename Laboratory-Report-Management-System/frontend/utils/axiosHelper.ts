import axios from "axios";
import config from "./config";

const axiosInstance = axios.create({
	baseURL: config.BASE_URL,
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
	},
});

export default class AxiosService {
	public static get(url: string, config = {}) {
		return axiosInstance.get(url, config);
	}

	public static post(url: string, data = {}, config = {}) {
		return axiosInstance.post(url, data, config);
	}
}
