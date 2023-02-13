// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

contract DoctorOpinoin{ 
    mapping (address=>bool) public isDoctor;
    mapping (address => bool ) public isOwner;
    string diagnosis;
    string analysis;
	string signature;
    bool lock;
    address nextReprt;


    constructor(address owner,address _doctor,string  memory _diagnosis,string memory  _analysis,string  memory _signature ){
        isOwner[owner] = true;
        isDoctor[_doctor] = true;
        diagnosis = _diagnosis;
        analysis = _analysis;
        signature = _signature;
        lock = false;
    }

    
 
    modifier onlyDoctor{
        require(isDoctor[msg.sender],"Only Consult Doctor can view the report" );
        _;
    }

    function addDoctor(address _doc) public {
        isDoctor[_doc] = true;
    }


    function addDiagnosis(string  memory _diagnosis,string memory  _analysis,string  memory _signature) public onlyDoctor{
        require(lock,"Report is Locked By Doctor and you can't edit");
        diagnosis = _diagnosis;
        analysis = _analysis;
        signature = _signature;
    }

    function getDiagnosis() public view returns(string memory) {
        return diagnosis;
    }
    function getAnalysis() public view returns(string memory) {
        return analysis;
    }

    function linkToNext(address contractAddress) public  returns(address) {
        nextReprt = contractAddress;
        return contractAddress;
    }

}