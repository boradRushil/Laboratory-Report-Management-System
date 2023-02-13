import Web3 from "web3";
const mastereContract = require("./Master.json");
const report = require("./ImageReport.json");
import * as ed from "@noble/ed25519";

export default class ReportService {
	public static async createReport(provider: Web3, report: any) {
		let reportContract = new provider.eth.Contract(
			mastereContract.abi,
			"0x81De74DE492DD2dDF7BeC1F363A31C381eD59553"
		);
		let address = await provider.eth.getAccounts();
		console.log(address, report);
		return reportContract.methods
			.createImageReport(
				report.patientAddress,
				report.hospitalAddress,
				report.reportType,
				report.originalImage,
				report.maskedImage
			)
			.send({ from: `${address[0]}` })
			.then((res: any) => {
				return reportContract.methods
					.latestOfUser(report.patientAddress)
					.call()
					.then((res: any) => {
						console.log(res);
						return res;
					});
			})
			.catch((err: any) => {
				console.log(err);
				return null;
			});
	}

	public static async signReport(
		provider: Web3,
		reportAddress: string,
		signature: string,
		analysis: string,
		diagnosis: string,
		originalImage: string,
		maskedImage: string
	) {
		console.log(reportAddress);
		
		let reportContract = new provider.eth.Contract(
			report.abi,
			reportAddress
		);

		signature = "";
		let address = (await provider.eth.getAccounts())[0];

		return reportContract.methods
			.setData(analysis, diagnosis, signature)
			.send({
				from: address,
			});
	}

	public static async getReportData(provider: Web3, reportAddress: string) {
		console.log(reportAddress);
		let reportContract = new provider.eth.Contract(
			report.abi,
			reportAddress
		);

		return reportContract.methods
			.getAnalysis()
			.call()
			.then((analysis: any) => {
				return reportContract.methods
					.getDiagnosis()
					.call()
					.then((diagnosis: any) => {
						return reportContract.methods
							.getSignature()
							.call()
							.then((signature: any) => {
								return reportContract.methods
									.getOriginalImage()
									.call()
									.then((originalImage: any) => {
										return reportContract.methods
											.getMaskedImage()
											.call()
											.then((maskedImage: any) => {
												return {
													analysis: analysis,
													diagnosis: diagnosis,
													signature: signature,
													originalImage:
														originalImage,
													maskedImage: maskedImage,
												};
											});
									});
							});
					});
			});
	}
}
