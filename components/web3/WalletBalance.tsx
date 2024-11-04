import React, { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const WalletBalance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  console.log("publicKey", publicKey?.toBase58());

  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
  if (publicKey) {
    (async function getBalanceEvery10Seconds() {
      const newBalance = await connection.getBalance(publicKey, 'confirmed');
      console.log("newBalance", newBalance);
      setBalance(newBalance / LAMPORTS_PER_SOL);
        setTimeout(getBalanceEvery10Seconds, 10000);
      })();
    }
  }, [connection, publicKey, balance]);

  return <div>Balance: {balance?.toFixed(4)} SOL</div>;
};
