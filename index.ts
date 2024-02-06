import {
  LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { LocalAccountSigner, type Hex } from "@alchemy/aa-core";
import { sepolia, polygonMumbai } from "viem/chains";
import dotenv from 'dotenv';
dotenv.config();

const PRIVATE_KEY = ("0x" + process.env.PRIVATE_KEY) as Hex;
// console.log(PRIVATE_KEY);


// const chain = sepolia;
const chain = polygonMumbai;

// The private key of your EOA that will be the owner of Light Account
// Our recommendation is to store the private key in an environment variable
// const PRIVATE_KEY = "0xYourEOAPrivateKey" as Hex;
const owner = LocalAccountSigner.privateKeyToAccountSigner(PRIVATE_KEY);
// console.log(await owner.getAddress());
console.log('getDefaultLightAccountFactoryAddress(chain)', getDefaultLightAccountFactoryAddress(chain));

// Create a provider to send user operations from your smart account
const provider = new AlchemyProvider({
  // get your Alchemy API key at https://dashboard.alchemy.com
  apiKey: process.env.NEXT_PUBLIC_MUMBAI_ALCHEMY_API_KEY,
  chain,
}).connect(
  (rpcClient) =>
    new LightSmartContractAccount({
      rpcClient,
      owner,
      chain,
      factoryAddress: getDefaultLightAccountFactoryAddress(chain),
    })
);

(async () => {
  // Fund your account address with ETH to send for the user operations
  // (e.g. Get Sepolia ETH at https://sepoliafaucet.com)
  console.log("Smart Account Address: ", await provider.getAddress()); // Log the smart account address
//   console.log("Smart Account Balance: ", await provider.()); // Log the smart account address
  const myAddress =
    "0x5aD972eF7f34F609187B2377f93a500161430f18" as Address;
  // Send a user operation from your smart account to Vitalik that does nothing
  const { hash: uoHash } = await provider.sendUserOperation({
    target: myAddress, // The desired target contract address
    data: "0x", // The desired call data
    value: 0n, // (Optional) value to send the target contract address
  });

  console.log("UserOperation Hash: ", uoHash); // Log the user operation hash

  // Wait for the user operation to be mined
  const txHash = await provider.waitForUserOperationTransaction(uoHash);

  console.log("Transaction Hash: ", txHash); // Log the transaction hash
})();