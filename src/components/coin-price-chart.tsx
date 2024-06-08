"use client";

import { getCoinHistoricalDataById } from "@/actions";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AreaChart } from "@tremor/react";
import { format } from "date-fns";

import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  days: number;
  id: string;
  className?: string;
};

const getDate = (date: string) => {
  return new Date(date).toLocaleString();
};

const updateChartData = (data: CoinHistoricalData) => {
  const chartData = data.prices.map(([date, price]) => ({
    date: getDate(date),
    price: (Math.round(price * 100) / 100).toFixed(2),
  }));

  return chartData;
};

const dataFormatter = (number) =>
  `$${Intl.NumberFormat("us").format(number).toString()}`;

const CoinPriceChart = ({ days, id, className }: Props) => {
  const queryClient = useQueryClient();

  const { data, error, isFetching, isPreviousData } = useQuery({
    queryKey: ["coinHistory", days],
    queryFn: () => getCoinHistoricalDataById(id, days),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isPreviousData) {
      queryClient.prefetchQuery({
        queryKey: ["coinHistory", days],
        queryFn: () => getCoinHistoricalDataById(id, days),
      });
    }
  }, [days, isPreviousData, queryClient, id]);

  if (isFetching) return <Skeleton className="h-[320px]" />;

  if (error) return <div>Error: {error.message}</div>;
  if (!data?.success) return <div>Error: {data?.error}</div>;

  const chartData = updateChartData(data?.data);

  const customTooltip = (props) => {
    const { payload, active } = props;
    if (!active || !payload) return null;
    return (
      <div className="w-56 rounded-tremor-default border border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown">
        {payload.map((category, idx) => (
          <div key={idx} className="flex flex-1 space-x-2.5">
            <div
              className={`flex w-1 flex-col bg-${category.color}-500 rounded`}
            />
            <div className="space-y-1">
              <p className="font-medium text-tremor-content-emphasis">
                ${category.value.toLocaleString()}
              </p>
              <p className="text-tremor-content">
                {format(category.payload.date, "dd MMM yyyy hh:mm a")}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AreaChart
      autoMinValue
      categories={["price"]}
      className={cn("mt-4 h-80", className)}
      colors={["rose"]}
      customTooltip={customTooltip}
      data={chartData}
      index="date"
      noDataText="No data."
      showAnimation
      showGridLines={false}
      showLegend={false}
      showXAxis={false}
      showYAxis={false}
      valueFormatter={dataFormatter}
      yAxisWidth={60}
    />
  );
};

export default CoinPriceChart;
