import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import {
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useCallback } from "react";
import { ABI } from "~/abi";
import { formatEther } from "viem";

import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>PWA Test</h1>
      <WalletOptions />
    </div>
  );
}

function WalletOptions() {
  const { address, isConnected, isConnecting } = useAccount();
  const { deposit, withdraw } = useContractCalls();
  const { data } = useBalance({
    address,
    query: {
      refetchInterval: 1000,
    },
  });

  return (
    <div>
      <ConnectButton />
      <p>Connected: {String(isConnected)}</p>
      <p>Is Connecting: {String(isConnecting)}</p>
      {isConnected && <p>Address: {address}</p>}
      <h2>Calls</h2>
      <p>Balance: {data ? formatEther(data.value) : 0}</p>
      <h3>Deposit</h3>
      <p>
        Status:{" "}
        {deposit.status === "success" && deposit.tx.status === "pending"
          ? "Ongoing"
          : deposit.tx.status}
      </p>
      <button
        onClick={() => {
          console.log("Depositing");
          deposit.submit();
        }}
      >
        Wrap .01 ETH
      </button>
      <h3>Withdraw</h3>
      <p>
        Status:{" "}
        {withdraw.status === "success" && withdraw.tx.status === "pending"
          ? "ongoing"
          : withdraw.tx.status}
      </p>
      <button
        onClick={() => {
          console.log("Withdrawing");
          withdraw.submit();
        }}
      >
        Unwrap .01 WETH
      </button>
    </div>
  );
}

function useContractCalls() {
  const deposit = useWriteContract();
  const withdraw = useWriteContract();
  const WETH_ADDR = "0xB7603602860a4816154F2A3bA4d6aBDDd8937b84";
  const AMOUNT = BigInt(0.01 * 10 ** 18);

  const depositTransaction = useWaitForTransactionReceipt({
    hash: deposit.data,
    query: {
      enabled: deposit.isSuccess,
    },
  });

  const withdrawTransaction = useWaitForTransactionReceipt({
    hash: withdraw.data,
    query: {
      enabled: withdraw.isSuccess,
    },
  });

  const submitDeposit = useCallback(() => {
    deposit.writeContract({
      functionName: "deposit",
      abi: ABI.WETH,
      address: WETH_ADDR,
      value: AMOUNT,
    });
  }, [AMOUNT, deposit]);

  const submitWithdraw = useCallback(() => {
    withdraw.writeContract({
      functionName: "withdraw",
      abi: ABI.WETH,
      address: WETH_ADDR,
      args: [AMOUNT],
    });
  }, [AMOUNT, withdraw]);

  return {
    deposit: {
      submit: submitDeposit,
      tx: depositTransaction,
      status: deposit.status,
    },
    withdraw: {
      submit: submitWithdraw,
      tx: withdrawTransaction,
      status: withdraw.status,
    },
  };
}
