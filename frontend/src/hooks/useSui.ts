// src/hooks/useSui.ts
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useCallback, useState } from "react";
import { WEWORK_PACKAGE_ID } from "../config";
import { Job } from "../components/JobCard";

const MODULE_NAME = "job_market";

export function useSui() {
  const suiClient = useSuiClient();
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const [isFetching, setIsFetching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const getJobs = useCallback(async (): Promise<Job[]> => {
    if (!account) return [];
    setIsFetching(true);
    try {
      const { data } = await suiClient.getOwnedObjects({
        owner: account.address,
        filter: {
          StructType: `${WEWORK_PACKAGE_ID}::${MODULE_NAME}::JobObject`,
        },
        options: {
          showContent: true,
        },
      });

      const jobs: Job[] = data
        .map((obj) => {
          const fields = (obj.data?.content as any)?.fields;
          if (!fields) return null;
          return {
            id: fields.id.id,
            employer: fields.employer,
            freelancer: fields.freelancer,
            description_url: fields.description_url,
            price: BigInt(fields.price),
            status: fields.status,
            deadline: BigInt(fields.deadline),
            // Dummy data for fields not on-chain
            company: "Sui Dynamos", // Replace with real data if available
            title: "On-chain Job", // Replace with real data if available
          };
        })
        .filter((j): j is Job => j !== null);
      
      return jobs;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return [];
    } finally {
      setIsFetching(false);
    }
  }, [suiClient, account]);

  const createJob = useCallback(
    async (
      freelancer: string,
      description_url: string,
      price: string,
      duration_days: string
    ) => {
      if (!account) throw new Error("Wallet not connected");
      setIsCreating(true);

      try {
        const tx = new Transaction();
        const priceInMIST = BigInt(parseFloat(price) * 1_000_000_000);
        const durationInMs = BigInt(parseInt(duration_days, 10) * 24 * 60 * 60 * 1000);

        const [paymentCoin] = tx.splitCoins(tx.gas, [priceInMIST]);

        tx.moveCall({
          target: `${WEWORK_PACKAGE_ID}::${MODULE_NAME}::create_job`,
          arguments: [
            tx.pure.address(freelancer),
            tx.pure.string(description_url),
            tx.pure.u64(priceInMIST),
            tx.pure.u64(durationInMs),
            paymentCoin,
            tx.object("0x6"), // Sui Clock
          ],
        });

        const result = await signAndExecute({ transaction: tx });
        console.log("Create job digest:", result.digest);
        return result;
      } catch (error) {
        console.error("Error creating job:", error);
        throw error;
      } finally {
        setIsCreating(false);
      }
    },
    [account, signAndExecute]
  );

  return {
    getJobs,
    createJob,
    isFetching,
    isCreating,
    connectedAddress: account?.address,
  };
}
