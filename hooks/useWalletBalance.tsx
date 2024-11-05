import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const useWalletBalance = (deps: any[] = []) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (publicKey) {
      (async function getBalance() {
        const newBalance = await connection.getBalance(publicKey, "confirmed");
        setBalance(newBalance / LAMPORTS_PER_SOL);
      })();
    }
  }, [connection, publicKey, ...deps]);

  return balance;
};
