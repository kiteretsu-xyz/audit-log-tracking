import hre from "hardhat";

async function main() {
  console.log("Deploying AuditLogTracking to Nero Testnet...");

  const AuditLogTracking = await hre.ethers.getContractFactory("AuditLogTracking");
  const auditContract = await AuditLogTracking.deploy();

  await auditContract.waitForDeployment();

  console.log(
    `AuditLogTracking deployed to: ${await auditContract.getAddress()}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
