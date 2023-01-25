import { ethers } from "hardhat";

const aaveBorrow = async () => {};

aaveBorrow()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
