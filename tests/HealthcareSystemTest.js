const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HealthcareSystem Smart Contract", function () {
  let HealthcareSystem, healthcareSystem, owner, patient, provider1, provider2;

  beforeEach(async function () {
    [owner, patient, provider1, provider2] = await ethers.getSigners();
    HealthcareSystem = await ethers.getContractFactory("HealthcareSystem");
    healthcareSystem = await HealthcareSystem.deploy();
    await healthcareSystem.deployed();
  });

  it("should register a new patient", async function () {
    await healthcareSystem.connect(patient).registerPatient("John Doe");

    const patientDetails = await healthcareSystem.getPatientDetails(patient.address);
    expect(patientDetails.name).to.equal("John Doe");
    expect(patientDetails.isRegistered).to.be.true;
  });

  it("should authorize a provider for a patient", async function () {
    await healthcareSystem.connect(patient).registerPatient("John Doe");

    await healthcareSystem.connect(patient).authorizeProvider(provider1.address);

    const isAuthorized = await healthcareSystem.isProviderAuthorized(
      patient.address,
      provider1.address
    );
    expect(isAuthorized).to.be.true;
  });

  it("should revoke a provider's access", async function () {
    await healthcareSystem.connect(patient).registerPatient("John Doe");
    await healthcareSystem.connect(patient).authorizeProvider(provider1.address);

    await healthcareSystem.connect(patient).revokeProvider(provider1.address);

    const isAuthorized = await healthcareSystem.isProviderAuthorized(
      patient.address,
      provider1.address
    );
    expect(isAuthorized).to.be.false;
  });

  it("should prevent unauthorized provider access", async function () {
    await healthcareSystem.connect(patient).registerPatient("John Doe");

    await expect(
      healthcareSystem.connect(provider1).getPatientDetails(patient.address)
    ).to.be.revertedWith("You are not authorized to access this patient's data");
  });

  it("should allow authorized provider access", async function () {
    await healthcareSystem.connect(patient).registerPatient("John Doe");
    await healthcareSystem.connect(patient).authorizeProvider(provider1.address);

    const patientDetails = await healthcareSystem.connect(provider1).getPatientDetails(patient.address);
    expect(patientDetails.name).to.equal("John Doe");
  });

  it("should handle multiple provider authorizations", async function () {
    await healthcareSystem.connect(patient).registerPatient("John Doe");
    await healthcareSystem.connect(patient).authorizeProvider(provider1.address);
    await healthcareSystem.connect(patient).authorizeProvider(provider2.address);

    const isAuthorized1 = await healthcareSystem.isProviderAuthorized(
      patient.address,
      provider1.address
    );
    const isAuthorized2 = await healthcareSystem.isProviderAuthorized(
      patient.address,
      provider2.address
    );

    expect(isAuthorized1).to.be.true;
    expect(isAuthorized2).to.be.true;
  });

  it("should handle revoking a non-authorized provider gracefully", async function () {
    await healthcareSystem.connect(patient).registerPatient("John Doe");

    await expect(
      healthcareSystem.connect(patient).revokeProvider(provider1.address)
    ).to.not.be.reverted;
  });

  it("should emit events correctly", async function () {
    await expect(healthcareSystem.connect(patient).registerPatient("John Doe"))
      .to.emit(healthcareSystem, "PatientRegistered")
      .withArgs(patient.address, "John Doe");

    await healthcareSystem.connect(patient).registerPatient("John Doe");
    await expect(healthcareSystem.connect(patient).authorizeProvider(provider1.address))
      .to.emit(healthcareSystem, "ProviderAuthorized")
      .withArgs(patient.address, provider1.address);

    await expect(healthcareSystem.connect(patient).revokeProvider(provider1.address))
      .to.emit(healthcareSystem, "ProviderRevoked")
      .withArgs(patient.address, provider1.address);
  });

  it("should prevent duplicate patient registrations", async function () {
    await healthcareSystem.connect(patient).registerPatient("John Doe");

    await expect(
      healthcareSystem.connect(patient).registerPatient("John Doe")
    ).to.be.revertedWith("Patient already registered");
  });

  it("should reject invalid input for provider authorization", async function () {
    await healthcareSystem.connect(patient).registerPatient("John Doe");

    await expect(
      healthcareSystem.connect(patient).authorizeProvider(ethers.constants.AddressZero)
    ).to.be.revertedWith("Invalid provider address");
  });
});
