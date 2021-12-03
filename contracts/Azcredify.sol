// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.10;

contract Azcredify {
            
    struct Certificate {
        string documentHash;                
        string studentName;
        string issuerName;
    } 
    
    mapping(string => Certificate) certificates; //linking studentId and Certificate    
    string[] public listOfStudentIDs; //array of studentIDs

    event CertificateInfo(
        string documentHash,
        string studentName,
        string issuerName
    );

    function setCertificate(string memory _studentId, string memory _documentHash, string memory _studentName, string memory _issuerName) external {        
        certificates[_studentId] = Certificate({
            documentHash: _documentHash,            
            studentName: _studentName, 
            issuerName: _issuerName
        });

        emit CertificateInfo(_documentHash, _studentName, _issuerName);
        
        listOfStudentIDs.push(_studentId);      
    }

    function getStudentIDs() view public returns(string[] memory) {
        return listOfStudentIDs;
    }
    
    function getCertificateInfo(string memory _studentId) public view returns (string memory, string memory, string memory) {
        
        return (
            certificates[_studentId].documentHash,
            certificates[_studentId].studentName,
            certificates[_studentId].issuerName
        );
    }    
}