import { ethers } from "ethers";

export const CONTRACT_ADDRESS = "0x83239eC0c4E20E67Bb0B9B92dcd58eF3810e8516"; // To be updated post-deployment

// Nero Testnet Config
export const NERO_TESTNET_CONFIG = {
  chainId: "0x2B1", // 689 in Hex
  chainName: "Nero Testnet",
  nativeCurrency: {
    name: "Nero",
    symbol: "NERO",
    decimals: 18,
  },
  rpcUrls: ["https://rpc-testnet.nerochain.io"],
  blockExplorerUrls: ["https://testnet.neroscan.io"],
};

export const CONTRACT_ABI = [
  "function logAction(string memory id, string memory actionType, string memory target, string memory description, uint32 severity, uint64 timestamp) public",
  "function logAccess(string memory id, string memory resource, string memory accessType, uint64 timestamp) public",
  "function flagEntry(string memory id, string memory reason) public",
  "function getEntry(string memory id) public view returns (tuple(address actor, string actionType, string target, string description, uint32 severity, bool isFlagged, string flagReason, string accessType, uint64 loggedAt))",
  "function listEntries() public view returns (string[] memory)",
  "function getEntryCount() public view returns (uint32)",
  "function getFlaggedCount() public view returns (uint32)"
];

export async function checkConnection() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        return { isConnected: true, activeAddress: accounts[0] };
      }
    } catch (e) {
      console.error(e);
    }
  }
  return { isConnected: false, activeAddress: "" };
}

export async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask to use this application.");
    return;
  }
  
  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    await ensureNeroNetwork();
    return accounts[0];
  } catch (error) {
    console.error("User denied account access", error);
    throw error;
  }
}

export async function ensureNeroNetwork() {
  if (!window.ethereum) return;
  
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: NERO_TESTNET_CONFIG.chainId }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [NERO_TESTNET_CONFIG],
        });
      } catch (addError) {
        console.error("Failed to add network", addError);
      }
    } else {
      console.error("Failed to switch network", switchError);
    }
  }
}

export async function getContract(signerOrProvider) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
}

export async function logAction(id, actionType, target, description, severity, timestamp) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = await getContract(signer);
  
  const tx = await contract.logAction(id, actionType, target, description, severity, timestamp);
  await tx.wait();
  return tx.hash;
}

export async function logAccess(id, resource, accessType, timestamp) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = await getContract(signer);
  
  const tx = await contract.logAccess(id, resource, accessType, timestamp);
  await tx.wait();
  return tx.hash;
}

export async function flagEntry(id, reason) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = await getContract(signer);
  
  const tx = await contract.flagEntry(id, reason);
  await tx.wait();
  return tx.hash;
}

export async function getEntry(id) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = await getContract(provider);
  return await contract.getEntry(id);
}

export async function listEntries() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = await getContract(provider);
  return await contract.listEntries();
}

export async function getEntryCount() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = await getContract(provider);
  return await contract.getEntryCount();
}

export async function getFlaggedCount() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = await getContract(provider);
  return await contract.getFlaggedCount();
}
