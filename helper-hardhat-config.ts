export interface NetworkConfigItem {
  name?: string;
  blockConfirmations?: number;
  wrappedEtherAddress?: string;
  daiAddress?: string;
  poolProviderAddress?: string;
  daiEthPriceFeedAddress?: string;
  swapRouter02Address?: string;
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
  },
  137: {
    name: "polygon",
    blockConfirmations: 6,
  },
  31337: {
    name: "hardhat",
    wrappedEtherAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    daiAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    poolProviderAddress: "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
    daiEthPriceFeedAddress: "0x773616E4d11A78F511299002da57A0a94577F1f4",
    swapRouter02Address: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
  },
};

// export const developmentChains = [31337];

export const developmentChains = ["hardhat", "localhost"];
