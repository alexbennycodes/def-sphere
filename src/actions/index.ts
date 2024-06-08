"use server";

import { CoinType } from "@/types/coin";
import { error } from "console";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": process.env.NEXT_PUBLIC_COINGECKO_API_KEY!,
  },
};

export const getCoinsList = async () => {
  try {
    const res = await fetch(
      `${API_URL}/coins/markets?vs_currency=usd`,
      options
    );
    if (!res.ok) {
      throw new Error(`Error fetching coins data: ${res.statusText}`);
    }

    const data: CoinType[] = await res.json();

    return { data, error: null, success: true };
  } catch (e: unknown) {
    if (e instanceof Error) {
      return { data: null, error: e.message, success: false };
    }
    return { data: null, error: "Something went wrong", success: false };
  }
};
