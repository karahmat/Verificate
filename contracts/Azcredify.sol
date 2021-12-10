// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.10;

contract Azcredify {
            
    struct Certificate {
        string documentHash;                
        string studentName;
        string issuerID;
    } 
    
    mapping(string => Certificate) certificates; //linking studentId and Certificate    
    string[] public listOfStudentIDs; //array of studentIDs

    event CertificateInfo(
        string documentHash,
        string studentName,
        string issuerID
    );

    function setCertificate(string memory _studentId, string memory _documentHash, string memory _studentName, string memory _issuerID) external {        
        certificates[_studentId] = Certificate({
            documentHash: _documentHash,            
            studentName: _studentName, 
            issuerID: _issuerID
        });

        emit CertificateInfo(_documentHash, _studentName, _issuerID);
        
        listOfStudentIDs.push(_studentId);      
    }

    function getStudentIDs() view public returns(string[] memory) {
        return listOfStudentIDs;
    }
    
    function getCertificateInfo(string memory _studentId) public view returns (string memory, string memory, string memory) {
        
        return (
            certificates[_studentId].documentHash,
            certificates[_studentId].studentName,
            certificates[_studentId].issuerID
        );
    }    
}