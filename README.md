# HealthcareSystem Smart Contract

## Overview
The `HealthcareSystem` smart contract provides a decentralized solution for managing patient and provider interactions in a healthcare system. It allows patients to securely register themselves, authorize healthcare providers to access their data, and revoke provider access when necessary.

---

## Features
- **Patient Registration:** Patients can register themselves on the blockchain with their name and unique address.
- **Provider Authorization:** Patients can authorize specific healthcare providers to access their data.
- **Revoke Provider Access:** Patients can revoke a provider’s access at any time.
- **Access Control:** Only authorized providers can view patient details.
- **Event Logs:** Key activities emit events for traceability.

---

## Smart Contract Workflow
1. **Patient Registration:**
   - A patient registers by providing their name.
   - The contract stores the name and sets the patient as registered.
   
2. **Provider Authorization:**
   - A patient authorizes a healthcare provider by specifying the provider's address.
   - Authorized providers gain permission to access the patient’s details.

3. **Revoke Authorization:**
   - A patient can revoke a previously authorized provider’s access.
   - The provider loses access to the patient’s data.

---

## Technologies Used
- **Solidity**
- **Ethereum Blockchain**
- **Hardhat**
- **MetaMask**
- **Chai & Mocha**

---

## Deployment
### Prerequisites
- Node.js installed
- Hardhat installed
- MetaMask configured with a test Ethereum network

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd HealthcareSystem

