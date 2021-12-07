# AzCredify 
*a blockchain-based app to issue and verify education certificates*

## Tech Stack
I developed this app using NodeJS at the backend, and ReactJS at the frontend. I used Solidity to develop the Smart Contract to interact with the blockchain. Other libraries used in the app:

- Web3: a JS library to deploy and interact with the Smart Contract
- ethereum-wallet: a JS library to create wallet addresses and private keys for the users. This is important as the app assumes that the users do not have wallet apps like Metamask installed. 
- IPFS: To store the certificate in the Interplanetary File System (IPFS) and get a unique hash for every new file uploaded. 
- Material UI (MUI): CSS framework for React. I chose MUI to expand my knowledge of CSS frameworks. I already have experience with Bootstrap and Tailwind CSS and thus, wanted to try something new.

## What does this app seek to solve?
At present, most education institutes issue certificates directly to the students in the form of a hard copy or a scanned copy, if a digital copy is needed. However, there is no digitalized way to verify the certificate. Therefore, fake graduation degree certificates can be easily created.

Before hiring an applicant, an employer needs to verify the educational details of the applicant. For this verification process, the employer’s HR team or a third party engaged by the employer will have to contact the education institute who issued the certificates. The relevant personnel in the university or college who receive the verification calls will take some time to verify the certificates. It can even be difficult to distinguish the fake and original degrees, if the master register has already been tampered. 

Some institutes store certificates in digital form but they are stored in a centralized network where there is a chance of certificate tampering. These may increase the cases of fraud since there is no means of security and integrity of the data both in manual and in digital form. 

## Solution
AzCredify provides a platform for education institutes to store and verify the student credentials using blockchain technology. 

Whenever a certificate is added into a block, it will return a unique transaction ID and a hash of the document stored. The certificate file, transaction ID and document hash are then sent to the student.

The company can verify whether the certificate provided by the student is authorized or has been tampered with or not through Azcredify.

### Advantages
With Azcredify,

- No one can tamper the certificate or create fake degrees. 

- Employer verification becomes easy and seamless. It cuts down the time needed for the university to issue the certificate.

- It counters the threat of corruption. During the credential verification phase in the existing system, there is always a chance of influencing the relevant university personnel to manage the verification process.

## Digital Signing of Certificate
The diagramm below illustrates the workflow when an education institute issues a certificate to the student:
![Workflow Signature](https://imgur.com/a/GQhMpux)

1. Institute issues and signs a document

2. Document is stored on a decentralised repository - InterPlanetary File System (IPFS). A document hash is generated. The IPFS will return the same hash if the same file is uploaded and if the file has not been tampered with.

3. Student details and document hash are stored on the Ethereum blockchain. The reason why we do this is to give the employers or anyone verifying the certificate later the assurance that the document hash has not been tampered with.

4. The address of the transaction (i.e, the transaction ID) is generated and represents the authenticity token. The certificate and transaction ID will be sent to the student. A QR code and a link are also given to the student, so that he/she can forward to his/her future employer that needs to verify the student's credentials.  

## Digital Verification of Certificate
The diagramm below illustrates the workflow when an employer wants to verify that the certificate is authentic and has not been tampered with. 
![Certificate Verification](https://imgur.com/SApqNcA)
1. Student share the authenticity token and certificate with the employer. 

2. Employer retrieve certificate and hash values.

3. Document is verified by comparing the hash values stored on the blockchain and the newly created one. 

4. Match hash values prove existence and authenticity.
