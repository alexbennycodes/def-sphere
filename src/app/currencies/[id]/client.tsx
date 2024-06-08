"use client";

import CoinPriceChart from "@/components/coin-price-chart";
import { Button } from "@/components/ui/button";
import { CoinIdType } from "@/types/coin";
import { useState } from "react";

type Props = {
  id: string;
  data: CoinIdType;
};

const Client = ({ id, data }: Props) => {
  const [days, setDays] = useState(1);

  return (
    <>
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-4xl font-medium">{data.name}</h2>
        <div className="flex space-x-0.5 rounded border border-border p-1 w-fit">
          <Button
            variant={days === 1 ? "default" : "ghost"}
            onClick={() => setDays(1)}
          >
            1D
          </Button>
          <Button
            variant={days === 7 ? "default" : "ghost"}
            onClick={() => setDays(7)}
          >
            1W
          </Button>
          <Button
            variant={days === 30 ? "default" : "ghost"}
            onClick={() => setDays(30)}
          >
            1M
          </Button>
          <Button
            variant={days === 365 ? "default" : "ghost"}
            onClick={() => setDays(365)}
          >
            1Y
          </Button>
        </div>
      </div>

      <CoinPriceChart id={id} days={days} />
    </>
  );
};

export default Client;
