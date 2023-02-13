// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "./jsonparse.sol";

contract Insurance {

  struct InsuranceCover {
    uint insuranceID;
    address proposer;
    uint numberOfProviders;
    uint totalCoverAmount;
    uint currentFundedCover;
    uint premiumAmount;
    int  reportID;
    bool filled;
    bool deleted;
    address[] contributors;
    uint[] contributions;
  }

  address public master;
  uint insuranceCoverCount;
  uint[] insuranceIDs;
  mapping(uint => InsuranceCover) public allInsuranceCovers;

  

  event InsuranceCoverChange(uint insuranceID);
  event Status(int status);
  event StatusStr(string status);
  
 constructor() {
    master = msg.sender;
    insuranceCoverCount = 0;
  }

  ///                         Allows a user to propose an insurance contract
  ///   _hex_proof          The hexidecimal proof passing through the flight ID
  ///  _totalCoverAmount   The total cover required by the user

  function proposeInsuranceCover(bytes memory _hex_proof, uint _totalCoverAmount) public payable {
    require(msg.value > 0);
    require(verifyProof(_hex_proof));
    require(_totalCoverAmount > 0);
    // Parse the response body of the TLS-N proof
    string memory body ; // add some function to get contract value

    //StatusStr(body);
    JsmnSolLib.Token[] memory tokens;
    
    uint returnValue;
    uint actualNum;
    
    (returnValue, tokens, actualNum) = JsmnSolLib.parse(body, 300);

    require(getStatus(body, tokens) == 1);

    int  reportID = getreportID(body, tokens);

    uint insuranceID = (insuranceCoverCount++)+1000;
    insuranceIDs.push(insuranceID);
    InsuranceCover memory newContract;

    newContract.insuranceID = insuranceID;
    newContract.proposer = msg.sender;
    newContract.numberOfProviders = 0;
    newContract.totalCoverAmount = _totalCoverAmount;
    newContract.currentFundedCover = 0;
    newContract.premiumAmount = msg.value;
    newContract. reportID =  reportID;
    newContract.filled = false;
    newContract.deleted = false;

    allInsuranceCovers[insuranceID] = newContract;
    InsuranceCoverChange(insuranceID);
  }

  ///             Allows a user to provide Amaount to the contract
  ///   _insuranceID  The insurance ID that the user is accepting
  function acceptContract(uint _insuranceID) public payable {
    require(msg.value > 0);
    require(!allInsuranceCovers[_insuranceID].filled);
    require((allInsuranceCovers[_insuranceID].currentFundedCover + msg.value) <= allInsuranceCovers[_insuranceID].totalCoverAmount);

    allInsuranceCovers[_insuranceID].currentFundedCover = allInsuranceCovers[_insuranceID].currentFundedCover + msg.value;


    if (allInsuranceCovers[_insuranceID].currentFundedCover == allInsuranceCovers[_insuranceID].totalCoverAmount) {
      allInsuranceCovers[_insuranceID].filled = true;
    }

    allInsuranceCovers[_insuranceID].contributors.push(msg.sender);
    allInsuranceCovers[_insuranceID].contributions.push(msg.value);
    allInsuranceCovers[_insuranceID].numberOfProviders++;
    InsuranceCoverChange(_insuranceID);
  }

  ///                      Calculates the outcome of an insurance contract
  ///    _insuranceID    The insurance ID that is being used
  ///    _hex_proof      The proof with the details of the flight
  function resolveContract(uint _insuranceID, bytes memory _hex_proof) public payable {
    // Verify the TLS-N Proof
    require(allInsuranceCovers[_insuranceID].filled);
    require(verifyProof(_hex_proof));
    require(!allInsuranceCovers[_insuranceID].deleted);
    // Parse the response body of the TLS-N proof
    // string memory body = string(tlsnutils.getHTTPBody(_hex_proof));
    JsmnSolLib.Token[] memory tokens;
    uint returnValue;
    uint actualNum;
    (returnValue, tokens, actualNum) = JsmnSolLib.parse(body, 500);

    // First check that the flight IDs are the same
    int temp = getreportID(body, tokens);
    // Add this back in once testing is finished
    require(temp == allInsuranceCovers[_insuranceID]. reportID);

    // Check the status
    temp = getStatus(body, tokens);
    Status(temp);
    require(temp != 1);
    // If the flight was cancelled pay out the funds to the proposer
    // Also pay the premium to the contributors
    // Flight status has to be 'C' for 'cancelled'

    uint sum = 0;
    uint premiumPayout;

    uint i;
    if (temp == 2) {
      // cancelled
      allInsuranceCovers[_insuranceID].proposer.transfer(allInsuranceCovers[_insuranceID].totalCoverAmount);
      for (i=0; i< allInsuranceCovers[_insuranceID].numberOfProviders - 1; i++) {
        premiumPayout = (allInsuranceCovers[_insuranceID].contributions[i] * allInsuranceCovers[_insuranceID].premiumAmount) / allInsuranceCovers[_insuranceID].totalCoverAmount;
        allInsuranceCovers[_insuranceID].contributors[i].transfer(premiumPayout);
        sum += premiumPayout;
      }
      allInsuranceCovers[_insuranceID].contributors[i].transfer(allInsuranceCovers[_insuranceID].premiumAmount-sum);
    }
    else {
      // not cancelled
      for (i=0; i< allInsuranceCovers[_insuranceID].numberOfProviders - 1; i++) {
        premiumPayout = (allInsuranceCovers[_insuranceID].contributions[i] * allInsuranceCovers[_insuranceID].premiumAmount) / allInsuranceCovers[_insuranceID].totalCoverAmount;
        allInsuranceCovers[_insuranceID].contributors[i].transfer(premiumPayout + allInsuranceCovers[_insuranceID].contributions[i]);
        sum += premiumPayout;
      }
      allInsuranceCovers[_insuranceID].contributors[i].transfer(allInsuranceCovers[_insuranceID].premiumAmount-sum + allInsuranceCovers[_insuranceID].contributions[i]);
    }
    allInsuranceCovers[_insuranceID].deleted = true;
    InsuranceCoverChange(_insuranceID);
  }

  ///                      Returns the status for the cancelling contract function
  ///    body            The body of the TLS-N proof
  ///    tokens          Tokens from the JsmnSolLib
  ///                   An integer corresponding to the status
  function getStatus(string body, JsmnSolLib.Token[] memory tokens) private returns(int) {
    // Flight status has to be 'C' for 'cancelled'
    string memory status;
    status = JsmnSolLib.getBytes(body, tokens[24].start, tokens[24].end);
    StatusStr(status);
    if (compareStrings(status,'S')) return 1;
    if (compareStrings(status,'C')) return 2;
    else return 3;
  }


  ///                      Returns the  reportID for the cancelling contract function
  ///    body            The body of the TLS-N proof
  ///    tokens          Tokens from the JsmnSolLib
  ///                   An integer corresponding to the flight ID
  function getreportID(string body, JsmnSolLib.Token[] memory tokens) private returns(int) {
    string memory  reportIDString = JsmnSolLib.getBytes(body, tokens[2].start, tokens[2].end);
    int  reportID = JsmnSolLib.parseInt( reportIDString);
    return  reportID;
  }

  //                     allows user to cancel a proposed insurance contract, insuranceID is deleted and
  //                        contract funds transfered to the proposer and
  //   _insuranceID    The insurance ID that is being canceled
  function cancelInsuranceContract(uint _insuranceID) public payable {
      require(allInsuranceCovers[_insuranceID].proposer == msg.sender);
      require(allInsuranceCovers[_insuranceID].filled == false);
      require(allInsuranceCovers[_insuranceID].deleted == false);
      allInsuranceCovers[_insuranceID].deleted = true;
      InsuranceCoverChange(_insuranceID);
      allInsuranceCovers[_insuranceID].proposer.transfer(allInsuranceCovers[_insuranceID].premiumAmount);
      for (uint i=0; i< allInsuranceCovers[_insuranceID].numberOfProviders; i++) {
        allInsuranceCovers[_insuranceID].contributors[i].transfer(allInsuranceCovers[_insuranceID].contributions[i]);
      }
  }

  ///                      Returns details of a specific insurance contract
  ///    _insuranceID    The insurance ID that you are requesting
  ///                   1. proposer address, 2. total cover amount, 3. current funded cover,
  ///                         4. premium amount, 5. the flight ID
  function getInsuranceContract(uint _insuranceID) public  returns (address, uint, uint, uint, int) {
    return  (allInsuranceCovers[_insuranceID].proposer,
             allInsuranceCovers[_insuranceID].totalCoverAmount,
             allInsuranceCovers[_insuranceID].currentFundedCover,
             allInsuranceCovers[_insuranceID].premiumAmount,
             allInsuranceCovers[_insuranceID]. reportID);
  }

  ///                      Returns an array of all insurance IDs
  ///                   All insurance IDs that have ever been created
  function getInsuranceContracts() public   returns (uint[]) {
    return insuranceIDs;
  }

  ///                      Allows the requestor to see how many contracts have been created
  ///                   Returns an integer of the number of contracts
  function getNumberOfInsuranceContracts() public   returns (uint) {
    return insuranceIDs.length;
  }

  /******** PRIVATE FUNCTIONS ********/
  ///         Compares two strings
  ///    a  The first string to be compared
  ///    b  The second string to be compared
  ///      Returns true if two strings are the same, false otherwise
  function compareStrings (string a, string b) private returns (bool){
    return keccak256(a) == keccak256(b);
   }

  function getInsuranceContributors(uint _insuranceID) public   returns(address[]) {
    return allInsuranceCovers[_insuranceID].contributors;
  }

  function getInsuranceContributions(uint _insuranceID) public   returns(uint[]) {
    return allInsuranceCovers[_insuranceID].contributions;
  }

  function verifyProof(bytes memory proof) private returns (bool){
    uint256 qx = 0xe0a5793d275a533d50421b201c2c9a909abb58b1a9c0f9eb9b7963e5c8bc2295;
    uint256 qy = 0xf34d47cb92b6474562675127677d4e446418498884c101aeb38f3afb0cab997e;

    if(tlsnutils.verifyProof(proof, qx, qy)) {
      return true;
    }
    return false;
  }
}