const { ethers } = require("hardhat");

async function main() {
  const Factory = await ethers.getContractFactory("BetfinCollectible");
  const contract = await Factory.deploy();

  await contract.waitForDeployment();

  const addr = await contract.getAddress();
  console.log("BetfinCollectible deployed to:", addr);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
