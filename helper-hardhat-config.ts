export interface networkConfigItem {
  name?: string;
  blockConfirmations?: number;
  lockName?: string;
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
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
};

// export const developmentChains = [31337];

export const developmentChains = ["hardhat", "localhost"];
