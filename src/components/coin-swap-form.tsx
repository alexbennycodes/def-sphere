"use client";

import { getSwapPrice, swapToken } from "@/actions/swap";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { ethers } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { VirtualizedCombobox } from "./virtualized-select";
import { CoinListType } from "@/types/coin";

const FormSchema = z.object({
  transferAmount: z.string().min(2),
  transferCoinType: z.string().min(2),
  recieveAmount: z.string(),
  recieveCoinType: z.string(),
});

type Props = {
  tokenList: CoinListType[] | [];
};

const CoinSwapForm = ({ tokenList = [] }: Props) => {
  const { isConnected, address } = useWeb3ModalAccount();

  const [gasPrice, setGasPrice] = useState<number | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      transferAmount: "",
      transferCoinType: "",
      recieveAmount: "",
      recieveCoinType: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (address) {
      const { success, error } = await swapToken({
        fromAddress: JSON.parse(data.recieveCoinType).address,
        toAddress: JSON.parse(data.transferCoinType).address,
        amount: Number(
          Number(data.transferAmount) *
            10 ** JSON.parse(data.transferCoinType).decimals
        ),
        takerAddress: address,
      });
      if (success) {
        form.reset();
        toast({
          title: "Success",
          description: "Tokens swapped successfully",
        });
      } else {
        toast({
          title: "Error",
          description: error,
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Please connect your wallet",
      });
    }
  }

  useEffect(() => {
    async function getPrice() {
      if (
        form.getValues("transferCoinType") &&
        form.getValues("recieveCoinType") &&
        form.getValues("transferAmount")
      ) {
        const { success, data, error } = await getSwapPrice({
          fromAddress: JSON.parse(form.getValues("transferCoinType")).address,
          toAddress: JSON.parse(form.getValues("recieveCoinType")).address,
          amount: form.getValues("transferAmount"),
        });
        if (success) {
          const buyTokenDecimals = JSON.parse(
            form.getValues("recieveCoinType")
          ).decimals;
          form.setValue(
            "recieveAmount",
            ethers.formatUnits(data.buyAmount, buyTokenDecimals)
          );
          setGasPrice(data.estimatedGas);
        } else {
          toast({
            title: "Error",
            description: error,
          });
        }
      } else if (
        form.getValues("transferCoinType") &&
        form.getValues("recieveCoinType") &&
        form.getValues("recieveAmount")
      ) {
        const { success, data, error } = await getSwapPrice({
          fromAddress: JSON.parse(form.getValues("recieveCoinType")).address,
          toAddress: JSON.parse(form.getValues("transferCoinType")).address,
          amount: form.getValues("recieveAmount"),
        });
        if (success) {
          const buyTokenDecimals = JSON.parse(
            form.getValues("transferCoinType")
          ).decimals;
          form.setValue(
            "transferAmount",
            ethers.formatUnits(data.buyAmount, buyTokenDecimals)
          );
        } else {
          toast({
            title: "Error",
            description: error,
          });
        }
        setGasPrice(data.estimatedGas);
      }
    }
    getPrice();
  }, [
    form,
    form.watch("transferAmount"),
    form.watch("transferCoinType"),
    form.watch("recieveAmount"),
    form.watch("recieveCoinType"),
  ]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-6 gap-4">
          <FormField
            control={form.control}
            name="transferAmount"
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormControl>
                  <Input placeholder="Enter amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="transferCoinType"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormControl>
                  <VirtualizedCombobox
                    options={tokenList.map((token) => ({
                      value: JSON.stringify(token),
                      label: (
                        <div className="flex items-center gap-1">
                          <Image
                            src={token.logoURI}
                            width={20}
                            height={20}
                            alt={token.name}
                            className="rounded-full"
                          />
                          {token.symbol}
                        </div>
                      ),
                      key: token.address,
                    }))}
                    onSelect={(val) => field.onChange(val)}
                    width="100%"
                    searchPlaceholder="Select token"
                    value={field.value}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-6 gap-4">
          <FormField
            control={form.control}
            name="recieveAmount"
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormControl>
                  <Input placeholder="Enter amount" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="recieveCoinType"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormControl>
                  <VirtualizedCombobox
                    options={tokenList.map((token) => ({
                      value: JSON.stringify(token),
                      label: (
                        <div className="flex items-center gap-1">
                          <Image
                            src={token.logoURI}
                            width={20}
                            height={20}
                            alt={token.name}
                            className="rounded-full"
                          />
                          {token.symbol}
                        </div>
                      ),
                      key: token.address,
                    }))}
                    onSelect={(val) => field.onChange(val)}
                    width="100%"
                    searchPlaceholder="Select token"
                    value={field.value}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {gasPrice && <div>Gas price: {gasPrice}</div>}
        <Button
          type="submit"
          className="w-full"
          disabled={!gasPrice || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Swapping..." : "Swap"}
        </Button>
      </form>
    </Form>
  );
};

export default CoinSwapForm;
