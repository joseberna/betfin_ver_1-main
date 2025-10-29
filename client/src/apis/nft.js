import { ethers } from "ethers";
import abi from "../abi/BetfinCollectible.json";

const CONTRACT_ADDRESS = process.env.REACT_APP_NFT_ADDRESS;

// Provider de solo lectura (opcional) si no hay wallet conectada
function getReadProvider() {
  const url = process.env.REACT_APP_RPC_SEPOLIA;
  return url ? new ethers.providers.JsonRpcProvider(url) : null;
}

export function getContract(providerOrSigner) {
  return new ethers.Contract(CONTRACT_ADDRESS, abi.abi || abi, providerOrSigner);
}

export async function mint(provider, { name, description, rarity, tokenURI = "" }) {
  const signer = provider.getSigner();
  const contract = getContract(signer);
  const tx = await contract.safeMint(name, description, rarity, tokenURI);
  return tx.wait();
}

export async function loadMyNFTs(providerOrNull, owner) {
  const p = providerOrNull || getReadProvider();
  if (!p) return [];
  const contract = getContract(p);
  const ids = await contract.tokensOfOwner(owner); // BigNumber[]
  const result = [];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i].toString();
    const meta = await contract.getMetadata(id);
    const uri = await contract.tokenURI(id);
    result.push({
      tokenId: id,
      name: meta.name,
      description: meta.description,
      rarity: Number(meta.rarity),
      tokenURI: uri
    });
  }
  return result;
}
