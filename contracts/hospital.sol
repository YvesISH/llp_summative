// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthcareSystem {
    struct Patient {
        string name;
        address[] authorizedProviders;
        mapping(address => bool) isProviderAuthorized;
    }

    mapping(address => Patient) private patients;

    // Event for debugging or tracking
    event PatientRegistered(address patientAddress, string name);
    event ProviderAuthorized(address patientAddress, address providerAddress);
    event ProviderRevoked(address patientAddress, address providerAddress);

    // Register a new patient
    function registerPatient(string memory _name) public {
        require(bytes(patients[msg.sender].name).length == 0, "Patient already registered");
        patients[msg.sender].name = _name;
        emit PatientRegistered(msg.sender, _name);
    }

    // Authorize a healthcare provider
    function authorizeProvider(address _provider) public {
        require(bytes(patients[msg.sender].name).length > 0, "Patient not registered");
        require(!patients[msg.sender].isProviderAuthorized[_provider], "Provider already authorized");

        patients[msg.sender].authorizedProviders.push(_provider);
        patients[msg.sender].isProviderAuthorized[_provider] = true;

        emit ProviderAuthorized(msg.sender, _provider);
    }

    // Revoke a healthcare provider's access
    function revokeProvider(address _provider) public {
        require(patients[msg.sender].isProviderAuthorized[_provider], "Provider not authorized");

        // Remove provider from the authorized list
        for (uint256 i = 0; i < patients[msg.sender].authorizedProviders.length; i++) {
            if (patients[msg.sender].authorizedProviders[i] == _provider) {
                patients[msg.sender].authorizedProviders[i] = patients[msg.sender].authorizedProviders[
                    patients[msg.sender].authorizedProviders.length - 1
                ];
                patients[msg.sender].authorizedProviders.pop();
                break;
            }
        }

        patients[msg.sender].isProviderAuthorized[_provider] = false;

        emit ProviderRevoked(msg.sender, _provider);
    }

    // Get patient details (name and authorized providers)
    function getPatientDetails(address _patient)
        public
        view
        returns (string memory name, address[] memory authorizedProviders)
    {
        require(
            msg.sender == _patient || patients[_patient].isProviderAuthorized[msg.sender],
            "Unauthorized access"
        );
        Patient storage patient = patients[_patient];
        return (patient.name, patient.authorizedProviders);
    }

    // Check if a provider is authorized for a specific patient
    function isProviderAuthorized(address _patient, address _provider) public view returns (bool) {
        return patients[_patient].isProviderAuthorized[_provider];
    }
}
