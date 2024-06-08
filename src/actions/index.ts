"use server";

import { CoinType } from "@/types/coin";
import { error } from "console";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": process.env.NEXT_PUBLIC_COINGECKO_API_KEY,
  },
};

export const getCoinsList = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_COIN_GECKO_API_URL}/coins/markets?vs_currency=usd`,
      options
    );
    if (!res.ok) {
      throw new Error(`Error fetching coins data: ${response.statusText}`);
    }

    const data: CoinType[] = await res.json();

    return { data, error: null, success: true };
  } catch (e) {
    return { data: null, error: e.message, success: false };
  }
};
