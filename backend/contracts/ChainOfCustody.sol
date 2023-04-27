//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ChainOfCustody {
    struct Evidence {
        string caseNumber;
        string evidenceItem;
        string evidenceDescription;
        string longitude;
        string latitude;
        string submittingOfficer;
        string datetimeSeized;
        string locationOfSeizure;
        uint256[] chain;
    }

    struct Chain {
        string releaserId;
        string receiverId;
        string submitterRole;
        string datetimeReleased;
        bool transferSignature;
        string transferComment;
    }

    mapping(uint256 => Evidence) private evidences;
    uint256 private evidenceCount = 1000;
    mapping(uint256 => Chain) private chains;
    uint256 private chainCount = 0;



    function createEvidence(
        string memory _caseNumber,
        string memory _evidenceItem,
        string memory _evidenceDescription,
        string memory _longitude,
        string memory _latitude,
        string memory _submittingOfficer,
        string memory _datetimeSeized,
        string memory _locationOfSeizure
    ) public returns (uint256) {
        Evidence storage evidence = evidences[evidenceCount];

        evidence.caseNumber = _caseNumber;
        evidence.evidenceItem = _evidenceItem;
        evidence.evidenceDescription = _evidenceDescription;
        evidence.longitude = _longitude; // Notes: Solidity does not accept floats! Multiply longtitude with 10^8 or convert to string.
        evidence.latitude = _latitude; // Notes: Solidity does not accept floats! Multiply latitude with 10^8 or convert to string. 
        evidence.submittingOfficer = _submittingOfficer;
        evidence.datetimeSeized = _datetimeSeized;
        evidence.locationOfSeizure = _locationOfSeizure;

        evidenceCount++;
        return evidenceCount - 1;
    }


    

    function signChain(
        uint256 _evidenceId, 
        uint256 _chainId
    ) public {
        require(_evidenceId < evidenceCount && _evidenceId >= 1000, "Evidence does not exist"); // Check if evidence exist
        Evidence storage evidence = evidences[_evidenceId];
        require(_chainId < evidence.chain.length,"Chain does not exist for this evidence"); // Check if chain for a specific evidence exist
        Chain storage chain = chains[evidence.chain[_chainId]];
        chain.transferSignature = true;
    }

    function addChain(
        uint256 _id,
        string memory _releaserId,
        string memory _receiverId,
        string memory _submitterRole,
        string memory _datetimeReleased,
        string memory _transferComment
    ) public {
        require(_id < evidenceCount && _id >= 1000, "Evidence does not exist"); // Check if evidence exists
        Evidence storage evidence = evidences[_id];
        uint256 newTransferNum = chainCount + 1; // Generate a new ID
        Chain memory newChain = Chain({
            releaserId: _releaserId,
            receiverId: _receiverId,
            submitterRole: _submitterRole,
            datetimeReleased: _datetimeReleased,
            transferSignature: false, // Default value for signature is false
            transferComment: _transferComment
        });

        evidence.chain.push(newTransferNum);
        chains[newTransferNum] = newChain;
        chainCount++;
    }



    function getEvidence(
        uint256 _evidenceId
    ) public view returns (Evidence memory) {
        return evidences[_evidenceId];
    }

    function getChain(
        uint256 _evidenceId
    ) public view returns (Chain[] memory) {
        Evidence memory evidence = evidences[_evidenceId];
        Chain[] memory chain = new Chain[](evidence.chain.length);
        for (uint256 i = 0; i < evidence.chain.length; i++) {
            chain[i] = chains[evidence.chain[i]];
        }
        return chain;
    }

    function getLastEvidenceId() public view returns (uint256) {
        require(evidenceCount > 0, "No evidences exist");
        return evidenceCount - 1;
    }

}
