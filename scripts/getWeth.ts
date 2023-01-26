import { ethers } from "hardhat";

const AMOUNT = ethers.utils.parseEther("0.02");

const getWeth = async (wrappedEtherAddress: string, deployer: string) => {
  const wEth = await ethers.getContractAt("IWeth", wrappedEtherAddress, deployer);

  const depositTxn = await wEth.deposit({ value: AMOUNT });
  await depositTxn.wait(1);
  const wethBalance = await wEth.balanceOf(deployer);

  console.log(`Deposited ${wethBalance} WETH to ${deployer}`);
};

export { getWeth };
