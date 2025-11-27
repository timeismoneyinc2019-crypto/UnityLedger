// UPX Token deployment configuration
// This file is auto-updated when running deploy_upx_and_connect.cjs

export const CONTRACT_CONFIG = {
  UPX_TOKEN_ADDRESS: "", // Set after deployment
  NETWORK: "localhost",
  CHAIN_ID: 31337,
  DEPLOYED_AT: "",
};

export const SUPPORTED_NETWORKS = {
  ethereum: {
    chainId: 1,
    name: "Ethereum Mainnet",
    rpcUrl: "https://eth.llamarpc.com",
    symbol: "ETH",
    explorer: "https://etherscan.io",
  },
  polygon: {
    chainId: 137,
    name: "Polygon Mainnet",
    rpcUrl: "https://polygon.llamarpc.com",
    symbol: "MATIC",
    explorer: "https://polygonscan.com",
  },
  goerli: {
    chainId: 5,
    name: "Goerli Testnet",
    rpcUrl: "https://rpc.ankr.com/eth_goerli",
    symbol: "ETH",
    explorer: "https://goerli.etherscan.io",
  },
  sepolia: {
    chainId: 11155111,
    name: "Sepolia Testnet",
    rpcUrl: "https://rpc.sepolia.org",
    symbol: "ETH",
    explorer: "https://sepolia.etherscan.io",
  },
  localhost: {
    chainId: 31337,
    name: "Hardhat Local",
    rpcUrl: "http://127.0.0.1:8545",
    symbol: "ETH",
    explorer: "",
  },
};

export const UPX_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
];
