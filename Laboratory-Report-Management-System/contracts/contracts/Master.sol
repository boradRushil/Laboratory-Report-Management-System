// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;
import "./imageReport.sol";
import "./DoctorOp.sol";

contract Master {
    
    mapping(address => address[]) public userReports;
    address owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    function createImageReport(address _user, address _doctor, string memory _reportType, string memory _originalImage, string memory _maskedImage) public onlyOwner returns (address) {
        userReports[_user].push(address(new ImageReport(_user, _doctor, _reportType, _originalImage, _maskedImage)));
        return (userReports[_user][userReports[_user].length - 1]);
    }

    function addReportofNewDoctor(address _user,address _doctor,string memory newAnalysis,string memory newDiagnosis,string memory signature)public onlyOwner returns (address){
        address temp =  address(new DoctorOpinoin(_user,_doctor,newDiagnosis,newAnalysis,signature));
        ImageReport((userReports[_user][userReports[_user].length - 1])).linkToNextReport(temp);
        return temp;
    }


}