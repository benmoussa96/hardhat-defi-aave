import { BigNumber } from "ethers";
import { ethers, network, getNamedAccounts } from "hardhat";
// import { getWeth } from "./getWeth";
import { networkConfig } from "../helper-hardhat-config";

const AMOUNT_DECIMAL = "0.02";
const AMOUNT = ethers.utils.parseEther(AMOUNT_DECIMAL);

const aaveBorrow = async () => {
  const chainId: number = network.config.chainId!;
  const { deployer } = await getNamedAccounts();

  const wrappedEtherAddress = networkConfig[chainId]["wrappedEtherAddress"] || "";
  await getWeth(wrappedEtherAddress, deployer);

  const poolProviderAddress = networkConfig[chainId]["poolProviderAddress"] || "";
  const lendingPool = await getLendingPool(poolProviderAddress, deployer);

  await approveErc20(wrappedEtherAddress, lendingPool.address, AMOUNT, deployer);

  console.log("Depositing funds...");
  await lendingPool.deposit(wrappedEtherAddress, AMOUNT, deployer, 0);
  console.log(`${AMOUNT} WETH deposited into Lending Pool on behalf of ${deployer}`);
};

const getWeth = async (wrappedEtherAddress: string, deployer: string) => {
  const wEth = await ethers.getContractAt("IWeth", wrappedEtherAddress, deployer);

  const depositTxn = await wEth.deposit({ value: AMOUNT });
  await depositTxn.wait(1);
  const wethBalance = await wEth.balanceOf(deployer);

  console.log(`Deposited ${wethBalance} WETH to account ${deployer}`);
};

const getLendingPool = async (poolProviderAddress: string, account: string) => {
  const lendingPoolAddressesProvider = await ethers.getContractAt(
    "ILendingPoolAddressesProvider",
    poolProviderAddress,
    account
  );

  const lendingPoolAddress = await lendingPoolAddressesProvider.getLendingPool();
  const lendingPool = await ethers.getContractAt(
    "ILendingPool",
    lendingPoolAddress,
    account
  );

  console.log(`Lending Pool Address: ${lendingPool.address}`);

  return lendingPool;
};

const approveErc20 = async (
  erc20Address: string,
  spenderAddress: string,
  amountToSpend: BigNumber,
  account: string
) => {
  const erc20 = await ethers.getContractAt("IERC20", erc20Address, account);
  const approveTxn = await erc20.approve(spenderAddress, amountToSpend);
  await approveTxn.wait(1);

  console.log(
    `Lending Pool approved to spend ${amountToSpend} WETH by account ${account}`
  );
};

aaveBorrow()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
