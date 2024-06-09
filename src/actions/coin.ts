"use server";

import { CoinIdType, CoinType } from "@/types/coin";

const API_URL = process.env.NEXT_COIN_GECKO_API_URL!;

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

export const getCoinById = async (coinId: string) => {
  try {
    const res = await fetch(`${API_URL}/coins/${coinId}`, options);
    if (!res.ok) {
      throw new Error(`Error fetching coins data: ${res.statusText}`);
    }

    const data: CoinIdType | null = await res.json();

    return { data, error: null, success: true };
  } catch (e: unknown) {
    if (e instanceof Error) {
      return { data: null, error: e.message, success: false };
    }
    return { data: null, error: "Something went wrong", success: false };
  }
};

export const getCoinHistoricalDataById = async (
  coinId: string,
  days: number
) => {
  try {
    const res = await fetch(
      `${API_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
      options
    );
    if (!res.ok) {
      throw new Error(`Error fetching coins data: ${res.statusText}`);
    }

    const data = await res.json();

    return { data, error: null, success: true };
  } catch (e: unknown) {
    if (e instanceof Error) {
      return { data: null, error: e.message, success: false };
    }
    return { data: null, error: "Something went wrong", success: false };
  }
};
