export interface NetworkConfigItem {
  name?: string;
  blockConfirmations?: number;
  lockName?: string;
  wrappedEtherAddress?: string;
  poolProviderAddress?: string;
}

export interface NetworkConfigInfo {
  [key: string]: NetworkConfigItem;
}

export const networkConfig: NetworkConfigInfo = {
  1: {
    name: "mainnet",
    blockConfirmations: 6,
  },
  5: {
    name: "goerli",
    blockConfirmations: 6,
    lockName: "Lock on Goerli",
  },
  137: {
    name: "polygon",
    blockConfirmations: 6,
  },
  31337: {
    name: "hardhat",
    wrappedEtherAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    poolProviderAddress: "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
  },
};

// export const developmentChains = [31337];

export const developmentChains = ["hardhat", "localhost"];
