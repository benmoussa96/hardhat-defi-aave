# AAVE Protocol V2 - How to Supply, Borrow and Repay Funds Using Hardhat & Ethers.js

## Description

This script uses the Aave Protocol to to deposit a set amount of WETH Tokens into the Lending Pool and then uses it as collateral to borrow a centrain percentage of that amount in DAI Tokens.

- The main script can be found at `./scripts/aaveBorrow.ts`
- The addresses of the smart contracts used, as well as other config, can be found at `./helper-hardhat-config.ts`

### Built with

- TypeScript
- Solidity
- Yarn
- Node.js (14.0.0)
- Hardhat
- Ethers
- Aave Protocol
- Chainlink Price Feed

## Getting Started

### Dependencies

- [Alchemy](https://alchemy.com) account and API key.

### Installing

1. Clone the repo

   ```
   git clone https://github.com/benmoussa96/hardhat-defi-aave.git
   ```

2. Change into repo root directory

   ```
   cd hardhat-defi-aave
   ```

3. Install dependencies

   ```
   yarn
   ```

### Compiling and deploying new contract (optional)

4.  Create a `.env` file at the root of the project:

    ```
    MAINNET_RPC_URL=...
    GOERLI_RPC_URL=...
    PIVATE_KEY=...
    ```

5.  Run the script:

    ```
    yarn hardhat run scripts/aaveBorrow.ts
    ** OR **
    yarn borrow
    ```
