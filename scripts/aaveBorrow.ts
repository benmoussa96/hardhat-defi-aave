import { BigNumber, Contract } from "ethers";
import { ethers, network, getNamedAccounts } from "hardhat";
// import { getWeth } from "./getWeth";
import { networkConfig } from "../helper-hardhat-config";

const AMOUNT_DECIMAL = "0.01";
const AMOUNT = ethers.utils.parseEther(AMOUNT_DECIMAL);

const aaveBorrow = async () => {
  const chainId: number = network.config.chainId!;
  const { deployer } = await getNamedAccounts();

  // Getting Wrraped Ether
  const wrappedEtherAddress = networkConfig[chainId]["wrappedEtherAddress"] || "";
  await getWeth(wrappedEtherAddress, AMOUNT, deployer);

  // Getting the address of the Lending Pool
  const poolProviderAddress = networkConfig[chainId]["poolProviderAddress"] || "";
  const lendingPool = await getLendingPool(poolProviderAddress, deployer);

  // Approving the Lending Pool to spend the WETH
  await approveErc20(wrappedEtherAddress, lendingPool.address, AMOUNT, deployer);

  // Depositing funds into the Lengin Pool
  console.log("...Depositing funds...");
  await lendingPool.deposit(wrappedEtherAddress, AMOUNT, deployer, 0);
  console.log(`==> ${AMOUNT} WETH deposited into Lending Pool`);
  console.log(`==> ${AMOUNT} aWETH minted and transfered to ${deployer}`);

  // Calculating DAI amount available to borrow
  const daiEthPriceFeedAddress = networkConfig[chainId]["daiEthPriceFeedAddress"] || "";
  const daiAmountToBorrowInWei = await getAvailableDaiToBorrow(
    lendingPool,
    daiEthPriceFeedAddress,
    deployer
  );
};

/**
 * @dev Deposits the specified amount of WETH to the specified account
 * @param wrappedEtherAddress The address of the WETH contract on the Ethereum Mainnet
 * @param account Address of the User Account
 */
const getWeth = async (
  wrappedEtherAddress: string,
  amount: BigNumber,
  account: string
) => {
  const wEth = await ethers.getContractAt("IWeth", wrappedEtherAddress, account);

  const depositTxn = await wEth.deposit({ value: amount });
  await depositTxn.wait(1);
  const wethBalance = await wEth.balanceOf(account);

  console.log(`==> Deposited ${wethBalance} WETH to account ${account}`);
};

/**
 * @dev Uses the LendingPoolAddressesProvider to get The Lending Pool smart contract
 * @param poolProviderAddress Address of the provider
 * @param account Address of the User Account
 * @returns The Lending Pool smart contract
 */
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

  console.log(`[Lending Pool Address: ${lendingPool.address}]`);

  return lendingPool;
};

/**
 * @dev Approves the spender (Lending Pool) to spend the amount specified in WETH by the account specified
 * @param erc20Address Token address
 * @param spenderAddress The spender that is going to be approved
 * @param amountToSpend The amount we want the spender to be approved to spend
 * @param account The original owner of the funds
 */
const approveErc20 = async (
  erc20Address: string,
  spenderAddress: string,
  amountToSpend: BigNumber,
  account: string
) => {
  const erc20 = await ethers.getContractAt("IERC20", erc20Address, account);
  const approveTxn = await erc20.approve(spenderAddress, amountToSpend);
  await approveTxn.wait(1);

  console.log(`==> Lending Pool approved to spend ${amountToSpend} WETH`);
};

/**
 * @dev Calculates in wei the amount of DAI available to be borrowed by the account specified
 * @param lendingPool Contract of the Lending Pool
 * @param daiEthPriceFeedAddress Address of the DAI/ETH Price Feed
 * @param account Address of the User Account
 * @returns The DAI amount available to borrow (in wei)
 */
const getAvailableDaiToBorrow = async (
  lendingPool: Contract,
  daiEthPriceFeedAddress: string,
  account: string
) => {
  // Getting the user account data across all the reserves
  const { availableBorrowsETH } = await getBorrowUsedData(lendingPool, account);

  const daiEthPrice = await getDaiPrice(daiEthPriceFeedAddress, account);
  const daiAmountToBorrow =
    availableBorrowsETH.toString() * 0.95 * (1 / daiEthPrice.toString());
  const daiAmountToBorrowInWei = ethers.utils.parseEther(daiAmountToBorrow.toString());

  // 8250000000000000 <- 0.008250000000000000 ETH available
  //  619412182360188 <- 0,000619412182360188 DAI/ETH price
  console.log(`[DAI available to borrow: ${daiAmountToBorrow}]`);

  return daiAmountToBorrowInWei;
};

/**
 * @dev Gets the User Account Data of the account specified
 * @param lendingPool Contract of the Lending Pool
 * @param account Address of the User Account
 * @returns The total collateral deposited (in ETH), the total debt
 * accumulated (in ETH) and the available amount to borrow (in ETH)
 */
const getBorrowUsedData = async (lendingPool: Contract, account: string) => {
  const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
    await lendingPool.getUserAccountData(account);

  console.log(`* You have ${totalCollateralETH} worth of ETH as collateral`);
  console.log(`* You have ${totalDebtETH} worth of ETH as debt`);
  console.log(`* You have ${availableBorrowsETH} worth of ETH available to borrow`);

  return { totalCollateralETH, totalDebtETH, availableBorrowsETH };
};

/**
 * @dev Gets the DAI/ETH price using the Chainlink feed
 * @param daiEthPriceFeedAddress Address of the DAI/ETH Chainlink Price Feed
 * @param account Address of the User Account
 * @returns DAI/ETH price
 */
const getDaiPrice = async (daiEthPriceFeedAddress: string, account: string) => {
  const daiEthPriceFeed = await ethers.getContractAt(
    "AggregatorV3Interface",
    daiEthPriceFeedAddress,
    account
  );
  const price = (await daiEthPriceFeed.latestRoundData())[1];

  console.log(`[DAI/ETH Price: ${price}]`);

  return price;
};

aaveBorrow()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
