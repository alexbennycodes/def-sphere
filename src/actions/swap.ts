"use server";

import { erc20abi } from "@/lib/erc20abi";
import { CoinListType } from "@/types/coin";
import BigNumber from "bignumber.js";
import { stringify } from "querystring";
import { Web3 } from "web3";

const API_URL = process.env.NEXT_PUBLIC_0X_SWAP_API_URL!;

const options = {
  headers: { "0x-api-key": process.env.NEXT_PUBLIC_0X_API_KEY! },
};

export const getSwapCoinList = async () => {
  try {
    const response = await fetch(
      "https://tokens.coingecko.com/uniswap/all.json"
    );
    if (!response.ok) {
      throw new Error(`Error fetching swap coin list: ${response.statusText}`);
    }
    const tokenListJSON: { tokens: CoinListType[] } = await response.json();
    return { data: tokenListJSON.tokens || [], error: null, success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error: error.message, success: false };
    } else {
      return { data: null, error: "Something went wrong", success: false };
    }
  }
};

export const getSwapPrice = async ({
  fromAddress,
  toAddress,
  amount,
}: {
  fromAddress: string;
  toAddress: string;
  amount: string;
}) => {
  const params = {
    sellToken: fromAddress,
    buyToken: toAddress,
    sellAmount: amount,
  };

  try {
    const response = await fetch(
      `${API_URL}/price?${stringify(params)}`,
      options
    );

    if (!response.ok) {
      throw new Error(`Error fetching swap price: ${response.statusText}`);
    }

    const swapPriceData = await response.json();

    return { data: swapPriceData, error: null, success: true };
  } catch (e: unknown) {
    if (e instanceof Error) {
      return { data: null, error: e.message, success: false };
    }
    return { data: null, error: "Something went wrong", success: false };
  }
};

export async function getQuote({
  fromAddress,
  toAddress,
  amount,
  takerAddress,
}: {
  fromAddress: string;
  toAddress: string;
  amount: number;
  takerAddress: string;
}) {
  const params = {
    sellToken: fromAddress,
    buyToken: toAddress,
    sellAmount: amount,
    takerAddress,
  };
  try {
    const response = await fetch(
      `${API_URL}/quote?${stringify(params)}`,
      options
    );
    if (!response.ok) {
      throw new Error(`Error fetching swap quote: ${response.statusText}`);
    }
    const swapQuoteJSON = await response.json();

    return { data: swapQuoteJSON, error: null, success: true };
  } catch (e: unknown) {
    if (e instanceof Error) {
      return { data: null, error: e.message, success: false };
    }
    return { data: null, error: "Something went wrong", success: false };
  }
}

export const swapToken = async ({
  fromAddress,
  toAddress,
  amount,
  takerAddress,
}: {
  fromAddress: string;
  toAddress: string;
  amount: number;
  takerAddress: string;
}) => {
  const web3 = new Web3(Web3.givenProvider);
  try {
    const {
      success,
      data: swapQuoteData,
      error,
    } = await getQuote({
      fromAddress,
      toAddress,
      amount,
      takerAddress,
    });
    const maxApproval = new BigNumber(2).pow(256).minus(1);
    const ERC20TokenContract = new web3.eth.Contract(erc20abi, fromAddress);
    const tx = await ERC20TokenContract.methods
      .approve(swapQuoteData.allowanceTarget, maxApproval)
      .send({ from: takerAddress })
      .then((tx) => {
        console.log("tx: ", tx);
      });
    const receipt = await web3.eth.sendTransaction(swapQuoteData);
    return { data: receipt, error: null, success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error: error.message, success: false };
    } else {
      return { data: null, error: "Something went wrong", success: false };
    }
  }
};
