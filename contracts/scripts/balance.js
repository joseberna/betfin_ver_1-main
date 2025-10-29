const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  const addr = await signer.getAddress();
  const bal = await ethers.provider.getBalance(addr);
  console.log("Deployer:", addr);
  console.log("Balance (ETH):", ethers.formatEther(bal));
}
main().catch(console.error);
