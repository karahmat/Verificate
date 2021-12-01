// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.10;

contract Azcredify {
            
    struct Certificate {
        string documentHash;        
        string studentId;
        string studentName;
    }
    
    mapping(address => Certificate) certificates; //linking studentAddress and Certificates
    address[] public certificateAddress; //array of student account addresses

    function setCertificate(address _address, string memory _documentHash, string memory _studentId, string memory _studentName) external {        
        certificates[_address] = Certificate({
            documentHash: _documentHash,
            studentId: _studentId,
            studentName: _studentName
        });

        certificateAddress.push(_address);
        
    }

    function getCertificateInfo(address _studentAddress) public view returns (string memory, string memory, string memory) {
        
        return (
            certificates[_studentAddress].documentHash,
            certificates[_studentAddress].studentId,
            certificates[_studentAddress].studentName
        );
    }
    
}