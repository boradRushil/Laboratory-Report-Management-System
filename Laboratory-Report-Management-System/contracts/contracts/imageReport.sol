// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

contract ImageReport {
    
    mapping(address => bool) public isOwner;
    mapping(address => bool) public isDoctor;
    address nextReport;
    bool isEditable = true;
    string originalImage;
    string maskedImage;
    string analysis;
    string diagnosis;
    string reportType;
	string signature;

    constructor(address _user, address _doctor, string memory _reportType, string memory _originalImage, string memory _maskedImage) {
        isOwner[_user] = true;
        isOwner[_doctor] = true;
        isDoctor[_doctor] = true;
        originalImage = _originalImage;
        maskedImage = _maskedImage;
        reportType = _reportType;
    }

    modifier onlyOwner {
        require(isOwner[msg.sender], "Only the owner can perform this action");
        _;
    }

    modifier onlyDoctor {
        require(isDoctor[msg.sender], "Only the doctor can perform this action");
        _;
    }

    function addOwner(address _owner) public onlyOwner {
        isOwner[_owner] = true;
    }

    function addDoctor(address _doctor) public onlyOwner {
        isOwner[_doctor] = true;
        isDoctor[_doctor] = true;
    }

    function setData(string memory _analysis, string memory _diagnosis, string memory _signature) public onlyOwner onlyDoctor {
        require(isEditable, "The report is no longer editable");
        analysis = _analysis;
        diagnosis = _diagnosis;
		signature = _signature;
        isEditable = false;
    }

    function getAnalysis() public view onlyOwner returns (string memory) {
        return analysis;
    }

    function getDiagnosis() public view onlyOwner returns (string memory) {
        return diagnosis;
    }

    function getOriginalImage() public view onlyOwner returns (string memory) {
        return originalImage;
    }

    function getMaskedImage() public view onlyOwner returns (string memory) {
        return maskedImage;
    }

	function getReportType() public view onlyOwner returns (string memory) {
		return reportType;
	}

	function getSignature() public view onlyOwner returns (string memory) {
		return signature;
	}

    function linkToNextReport(address newReport) public onlyOwner returns (bool){
        nextReport = newReport;
        return true;
    }

}