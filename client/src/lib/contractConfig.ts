// Contract configuration for frontend
// Auto-synced from deployment

export const CONTRACT_CONFIG = {
  UPX_TOKEN_ADDRESS: import.meta.env.VITE_UPX_TOKEN_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  NETWORK: import.meta.env.VITE_NETWORK || "hardhat",
  CHAIN_ID: parseInt(import.meta.env.VITE_CHAIN_ID || "31337"),
};

export const SUPPORTED_NETWORKS = {
  hardhat: {
    chainId: 31337,
    name: "Hardhat Local",
    rpcUrl: "http://127.0.0.1:8545",
  },
  ethereum: {
    chainId: 1,
    name: "Ethereum Mainnet",
    rpcUrl: "https://eth.llamarpc.com",
  },
  polygon: {
    chainId: 137,
    name: "Polygon Mainnet",
    rpcUrl: "https://polygon.llamarpc.com",
  },
  sepolia: {
    chainId: 11155111,
    name: "Sepolia Testnet",
    rpcUrl: "https://sepolia.infura.io/v3/",
  },
};
